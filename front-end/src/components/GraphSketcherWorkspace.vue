<script lang="ts" setup>
import type {
	GraphAnnotation,
	GraphAxisScale,
	GraphDocument,
	GraphLineMode,
	GraphLineStyle,
	GraphMarkerShape,
	GraphSeries
} from "@/modules/graphSketcher";
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch
} from "vue";
import {
	axisFraction,
	axisValueAtFraction,
	canvasPointToGraph,
	cloneGraphDocument,
	compileGraphExpression,
	createBestFitSeries,
	createBlankGraphDocument,
	createGraphId,
	createGraphSeries,
	createSampleGraphDocument,
	fitGraphAxesToData,
	formatGraphNumber,
	graphAxisTicks,
	graphDocumentFromJson,
	graphDocumentToJson,
	graphLineDashArray,
	graphPointToCanvas,
	graphProjectFileName,
	graphSeriesAreaPath,
	graphSeriesPath,
	MAX_GRAPH_ANNOTATIONS,
	MAX_GRAPH_DOCUMENT_BYTES,
	MAX_GRAPH_EXPRESSION_LENGTH,
	MAX_GRAPH_POINTS,
	MAX_GRAPH_SERIES,
	normalizeGraphDocument,
	panGraphAxis,
	plotBoundsForCanvas,
	refreshDerivedGraphSeries,
	sampleGraphExpression,
	zoomGraphAxis
} from "@/modules/graphSketcher";
import {
	graphDocumentToCsv,
	graphDocumentToSvg,
	importDelimitedGraphData,
	importLegacyGraphSketcherDocument
} from "@/modules/graphSketcherFiles";
import {
	evenlySampleSeriesIndexes,
	GRAPH_SKETCHER_SESSION_STORAGE_KEY,
	graphPngDimensions,
	MAX_INTERACTIVE_GRAPH_POINTS,
	pushBoundedGraphHistorySnapshot
} from "@/modules/graphSketcherSafety";

type GraphTool = "select" | "point" | "draw" | "text" | "pan";
type InspectorTab = "data" | "style" | "axes" | "graph";

const INSPECTOR_TABS: ReadonlyArray<{
	id: InspectorTab;
	label: string;
}> = [
	{ id: "data", label: "Data" },
	{ id: "style", label: "Style" },
	{ id: "axes", label: "Axes" },
	{ id: "graph", label: "Graph" }
];

interface SelectedPoint {
	seriesId: string;
	index: number;
}

interface PointerGesture {
	kind: "point" | "annotation" | "pan" | "draw";
	pointerId: number;
	before: string;
	startX: number;
	startY: number;
	seriesId?: string;
	pointIndex?: number;
	annotationId?: string;
	originalXAxis?: GraphDocument["xAxis"];
	originalYAxis?: GraphDocument["yAxis"];
	lastDrawX?: number;
	lastDrawY?: number;
}

const graphDocument = ref<GraphDocument>(createSampleGraphDocument());
const activeSeriesId = ref(graphDocument.value.series[0].id);
const activeTool = ref<GraphTool>("select");
const inspectorTab = ref<InspectorTab>("data");
const selectedPoint = ref<SelectedPoint | null>(null);
const selectedAnnotationId = ref<string | null>(null);
const pointerGesture = ref<PointerGesture | null>(null);
const isNewGraphConfirmationPending = ref(false);
const isEndSessionConfirmationPending = ref(false);
const expressionDraft = ref("sin(x)");
const pastedData = ref("");
const textDraft = ref("Label");
const coordinatesText = ref("Move over the graph to inspect coordinates.");
const statusMessage = ref(
	"Sample graph loaded. Work is saved in this tab's browser storage."
);
const saveState = ref<"saving" | "saved" | "empty" | "unavailable">("saving");
const importWarnings = ref<string[]>([]);
const svgElement = ref<SVGSVGElement>();
const fileInput = ref<HTMLInputElement>();
const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
const isClientReady = ref(false);
const MAX_TABLE_ROWS = 300;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let wheelTimer: ReturnType<typeof setTimeout> | undefined;
let newGraphConfirmationTimer: ReturnType<typeof setTimeout> | undefined;
let endSessionConfirmationTimer: ReturnType<typeof setTimeout> | undefined;
let wheelBeforeSnapshot: string | undefined;
let suppressSessionSave = false;
let fileImportGeneration = 0;
let fileImportController: AbortController | undefined;

function handleInspectorTabKeydown(
	event: KeyboardEvent,
	currentTab: InspectorTab
) {
	const currentIndex = INSPECTOR_TABS.findIndex(tab => tab.id === currentTab);
	let targetIndex: number | undefined;

	switch (event.key) {
		case "ArrowLeft":
			targetIndex =
				(currentIndex - 1 + INSPECTOR_TABS.length) %
				INSPECTOR_TABS.length;
			break;
		case "ArrowRight":
			targetIndex = (currentIndex + 1) % INSPECTOR_TABS.length;
			break;
		case "Home":
			targetIndex = 0;
			break;
		case "End":
			targetIndex = INSPECTOR_TABS.length - 1;
			break;
		default:
			return;
	}

	event.preventDefault();
	const targetTab = INSPECTOR_TABS[targetIndex];
	inspectorTab.value = targetTab.id;
	const tabList = (event.currentTarget as HTMLElement).closest(
		"[role='tablist']"
	);
	void nextTick(() => {
		tabList
			?.querySelector<HTMLElement>(`#graph-inspector-tab-${targetTab.id}`)
			?.focus();
	});
}

const activeSeries = computed(() => {
	const selected = graphDocument.value.series.find(
		series => series.id === activeSeriesId.value
	);
	return selected ?? graphDocument.value.series[0];
});

const selectedAnnotation = computed(() =>
	graphDocument.value.annotations.find(
		annotation => annotation.id === selectedAnnotationId.value
	)
);

const plotBounds = computed(() =>
	plotBoundsForCanvas(graphDocument.value.canvas)
);
const xTicks = computed(() =>
	graphAxisTicks(graphDocument.value.xAxis).map(tick => ({
		...tick,
		x: plotBounds.value.left + tick.position * plotBounds.value.width
	}))
);
const yTicks = computed(() =>
	graphAxisTicks(graphDocument.value.yAxis).map(tick => ({
		...tick,
		y: plotBounds.value.bottom - tick.position * plotBounds.value.height
	}))
);
const xAxisY = computed(() => {
	const axis = graphDocument.value.yAxis;
	if (axis.scale === "linear" && axis.minimum <= 0 && axis.maximum >= 0) {
		return graphPointToCanvas(graphDocument.value, {
			x: graphDocument.value.xAxis.minimum,
			y: 0
		}).y;
	}
	return plotBounds.value.bottom;
});
const yAxisX = computed(() => {
	const axis = graphDocument.value.xAxis;
	if (axis.scale === "linear" && axis.minimum <= 0 && axis.maximum >= 0) {
		return graphPointToCanvas(graphDocument.value, {
			x: 0,
			y: graphDocument.value.yAxis.minimum
		}).x;
	}
	return plotBounds.value.left;
});

const visibleSeries = computed(() =>
	graphDocument.value.series.filter(series => series.isVisible)
);
const visiblePointCount = computed(() =>
	visibleSeries.value.reduce(
		(total, series) => total + series.points.length,
		0
	)
);
const arePointHandlesSampled = computed(
	() => visiblePointCount.value > MAX_INTERACTIVE_GRAPH_POINTS
);

const renderedSeries = computed(() => {
	const series = visibleSeries.value;
	const sampledIndexes = evenlySampleSeriesIndexes(
		series.map(item => item.points.length)
	);
	return series.map((item, seriesIndex) => ({
		areaPath: graphSeriesAreaPath(graphDocument.value, item),
		dashArray: graphLineDashArray(item.lineStyle),
		path: graphSeriesPath(graphDocument.value, item),
		points: sampledIndexes[seriesIndex]
			.map(index => {
				const point = item.points[index];
				const canvasPoint = graphPointToCanvas(
					graphDocument.value,
					point
				);
				const xErrorStart = point.xError
					? graphPointToCanvas(graphDocument.value, {
							x: point.x - point.xError,
							y: point.y
						})
					: undefined;
				const xErrorEnd = point.xError
					? graphPointToCanvas(graphDocument.value, {
							x: point.x + point.xError,
							y: point.y
						})
					: undefined;
				const yErrorStart = point.yError
					? graphPointToCanvas(graphDocument.value, {
							x: point.x,
							y: point.y + point.yError
						})
					: undefined;
				const yErrorEnd = point.yError
					? graphPointToCanvas(graphDocument.value, {
							x: point.x,
							y: point.y - point.yError
						})
					: undefined;
				return {
					canvasPoint,
					index,
					point,
					xErrorStart,
					xErrorEnd,
					yErrorStart,
					yErrorEnd
				};
			})
			.filter(renderedPoint => renderedPoint.canvasPoint.isValid),
		series: item
	}));
});

const renderedAnnotations = computed(() =>
	graphDocument.value.annotations
		.map(annotation => {
			const first =
				annotation.coordinateSpace === "data"
					? graphPointToCanvas(graphDocument.value, annotation)
					: {
							x: annotation.x,
							y: annotation.y,
							isValid: true
						};
			const second =
				annotation.coordinateSpace === "data"
					? graphPointToCanvas(graphDocument.value, {
							x: annotation.x2 ?? annotation.x,
							y: annotation.y2 ?? annotation.y
						})
					: {
							x: annotation.x2 ?? annotation.x,
							y: annotation.y2 ?? annotation.y,
							isValid: true
						};
			return { annotation, first, second };
		})
		.filter(rendered => rendered.first.isValid && rendered.second.isValid)
);

const displayedPoints = computed(() =>
	(activeSeries.value?.points ?? []).slice(0, MAX_TABLE_ROWS)
);
const hiddenPointCount = computed(() =>
	Math.max(0, (activeSeries.value?.points.length ?? 0) - MAX_TABLE_ROWS)
);
const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);
const saveStateText = computed(() =>
	saveState.value === "saving"
		? "Saving for this tab…"
		: saveState.value === "saved"
			? "Saved for this tab"
			: saveState.value === "empty"
				? "No graph saved in this tab"
				: "Tab save unavailable"
);
const isActiveSeriesDerived = computed(() =>
	isDerivedSeries(activeSeries.value)
);
const graphAriaLabel = computed(() => {
	const pointCount = graphDocument.value.series.reduce(
		(total, series) => total + series.points.length,
		0
	);
	return `${graphDocument.value.title}. ${graphDocument.value.series.length} series and ${pointCount} points.`;
});

const legendLayout = computed(() => {
	const series = graphDocument.value.series.filter(item => item.isVisible);
	const width = Math.min(
		260,
		Math.max(130, ...series.map(item => item.name.length * 7 + 54))
	);
	const height = series.length * 24 + 18;
	const position = graphDocument.value.canvas.legendPosition;
	return {
		height,
		series,
		width,
		x: position.endsWith("Right")
			? graphDocument.value.canvas.width -
				graphDocument.value.canvas.paddingRight -
				width
			: graphDocument.value.canvas.paddingLeft,
		y: position.startsWith("bottom")
			? graphDocument.value.canvas.height -
				graphDocument.value.canvas.paddingBottom -
				height
			: graphDocument.value.canvas.paddingTop
	};
});

function graphSnapshot() {
	return JSON.stringify(graphDocument.value);
}

function graphPointCount(document = graphDocument.value) {
	return document.series.reduce(
		(total, series) => total + series.points.length,
		0
	);
}

function hasGraphCapacity(
	additions: {
		annotations?: number;
		points?: number;
		series?: number;
	},
	options: { replaceSeries?: boolean } = {}
) {
	const seriesCount = options.replaceSeries
		? (additions.series ?? 0)
		: graphDocument.value.series.length + (additions.series ?? 0);
	if (seriesCount > MAX_GRAPH_SERIES) {
		statusMessage.value = `A graph can contain at most ${MAX_GRAPH_SERIES} series. Remove a series before adding another.`;
		return false;
	}

	const pointCount = options.replaceSeries
		? (additions.points ?? 0)
		: graphPointCount() + (additions.points ?? 0);
	if (pointCount > MAX_GRAPH_POINTS) {
		statusMessage.value = `A graph can contain at most ${MAX_GRAPH_POINTS.toLocaleString()} points. Remove points before adding more.`;
		return false;
	}

	if (
		graphDocument.value.annotations.length + (additions.annotations ?? 0) >
		MAX_GRAPH_ANNOTATIONS
	) {
		statusMessage.value = `A graph can contain at most ${MAX_GRAPH_ANNOTATIONS.toLocaleString()} labels and annotations.`;
		return false;
	}
	return true;
}

function pushUndoSnapshot(snapshot: string) {
	pushBoundedGraphHistorySnapshot(undoStack.value, redoStack.value, snapshot);
}

function commitMutation(
	label: string,
	mutate: (document: GraphDocument) => void,
	options: { refreshDerived?: boolean } = {}
) {
	const before = graphSnapshot();
	mutate(graphDocument.value);
	if (options.refreshDerived !== false) {
		refreshDerivedGraphSeries(graphDocument.value);
	}
	const after = graphSnapshot();
	if (before === after) return false;
	redoStack.value = [];
	pushUndoSnapshot(before);
	statusMessage.value = label;
	return true;
}

function replaceDocument(next: GraphDocument, label: string) {
	const before = graphSnapshot();
	graphDocument.value = normalizeGraphDocument(next);
	activeSeriesId.value = graphDocument.value.series[0].id;
	selectedPoint.value = null;
	selectedAnnotationId.value = null;
	redoStack.value = [];
	pushUndoSnapshot(before);
	importWarnings.value = [];
	statusMessage.value = label;
}

function restoreSnapshot(snapshot: string) {
	graphDocument.value = graphDocumentFromJson(snapshot);
	if (
		!graphDocument.value.series.some(
			series => series.id === activeSeriesId.value
		)
	) {
		activeSeriesId.value = graphDocument.value.series[0].id;
	}
	selectedPoint.value = null;
	selectedAnnotationId.value = null;
}

function undo() {
	const snapshot = undoStack.value.pop();
	if (!snapshot) return;
	pushBoundedGraphHistorySnapshot(
		redoStack.value,
		undoStack.value,
		graphSnapshot()
	);
	restoreSnapshot(snapshot);
	statusMessage.value = "Undid the last graph change.";
}

function redo() {
	const snapshot = redoStack.value.pop();
	if (!snapshot) return;
	pushUndoSnapshot(graphSnapshot());
	restoreSnapshot(snapshot);
	statusMessage.value = "Redid the graph change.";
}

function saveSessionGraph() {
	if (typeof window === "undefined" || suppressSessionSave) return;
	if (saveTimer) {
		clearTimeout(saveTimer);
		saveTimer = undefined;
	}
	try {
		window.sessionStorage.setItem(
			GRAPH_SKETCHER_SESSION_STORAGE_KEY,
			graphDocumentToJson(graphDocument.value)
		);
		saveState.value = "saved";
	} catch {
		saveState.value = "unavailable";
		statusMessage.value =
			"The graph is open, but this tab could not save it. Download the project to keep a copy.";
	}
}

function scheduleSessionSave() {
	if (typeof window === "undefined" || suppressSessionSave) return;
	if (saveTimer) clearTimeout(saveTimer);
	saveState.value = "saving";
	saveTimer = setTimeout(saveSessionGraph, 250);
}

watch(graphDocument, scheduleSessionSave, { deep: true });

function loadSessionGraph() {
	if (typeof window === "undefined") return;
	let stored: string | null;
	try {
		stored = window.sessionStorage.getItem(
			GRAPH_SKETCHER_SESSION_STORAGE_KEY
		);
	} catch {
		saveState.value = "unavailable";
		statusMessage.value =
			"This tab cannot save the graph. Download the project to keep a copy.";
		return;
	}
	if (!stored) {
		scheduleSessionSave();
		return;
	}
	try {
		suppressSessionSave = true;
		graphDocument.value = graphDocumentFromJson(stored);
		activeSeriesId.value = graphDocument.value.series[0].id;
		saveState.value = "saved";
		statusMessage.value = "Restored the graph saved in this tab.";
		nextTick(() => {
			suppressSessionSave = false;
		});
	} catch {
		suppressSessionSave = false;
		try {
			window.sessionStorage.removeItem(
				GRAPH_SKETCHER_SESSION_STORAGE_KEY
			);
		} catch {
			saveState.value = "unavailable";
		}
		statusMessage.value =
			"The saved graph was invalid, so the sample graph was restored.";
		scheduleSessionSave();
	}
}

function cancelPendingFileImport() {
	fileImportGeneration += 1;
	fileImportController?.abort();
	fileImportController = undefined;
}

function newGraph() {
	if (!isNewGraphConfirmationPending.value) {
		isNewGraphConfirmationPending.value = true;
		statusMessage.value =
			"Select New again to replace this graph, or download the current project first.";
		if (newGraphConfirmationTimer) {
			clearTimeout(newGraphConfirmationTimer);
		}
		newGraphConfirmationTimer = setTimeout(() => {
			isNewGraphConfirmationPending.value = false;
		}, 6_000);
		return;
	}
	if (newGraphConfirmationTimer) clearTimeout(newGraphConfirmationTimer);
	isNewGraphConfirmationPending.value = false;
	cancelPendingFileImport();
	replaceDocument(createBlankGraphDocument(), "Started a blank graph.");
}

function endSharedSession() {
	if (!isEndSessionConfirmationPending.value) {
		isEndSessionConfirmationPending.value = true;
		statusMessage.value =
			"Select Clear for next student again to erase this tab's graph. Download it first if you need a copy.";
		if (endSessionConfirmationTimer) {
			clearTimeout(endSessionConfirmationTimer);
		}
		endSessionConfirmationTimer = setTimeout(() => {
			isEndSessionConfirmationPending.value = false;
		}, 6_000);
		return;
	}

	if (endSessionConfirmationTimer) {
		clearTimeout(endSessionConfirmationTimer);
		endSessionConfirmationTimer = undefined;
	}
	if (saveTimer) {
		clearTimeout(saveTimer);
		saveTimer = undefined;
	}
	if (wheelTimer) {
		clearTimeout(wheelTimer);
		wheelTimer = undefined;
	}
	if (newGraphConfirmationTimer) {
		clearTimeout(newGraphConfirmationTimer);
		newGraphConfirmationTimer = undefined;
	}
	isEndSessionConfirmationPending.value = false;
	isNewGraphConfirmationPending.value = false;
	cancelPendingFileImport();
	suppressSessionSave = true;
	graphDocument.value = createBlankGraphDocument();
	activeSeriesId.value = graphDocument.value.series[0].id;
	activeTool.value = "select";
	inspectorTab.value = "data";
	selectedPoint.value = null;
	selectedAnnotationId.value = null;
	pointerGesture.value = null;
	undoStack.value = [];
	redoStack.value = [];
	importWarnings.value = [];
	expressionDraft.value = "sin(x)";
	pastedData.value = "";
	textDraft.value = "Label";
	coordinatesText.value = "Move over the graph to inspect coordinates.";
	wheelBeforeSnapshot = undefined;
	if (fileInput.value) fileInput.value.value = "";

	try {
		window.sessionStorage.removeItem(GRAPH_SKETCHER_SESSION_STORAGE_KEY);
		saveState.value = "empty";
		statusMessage.value =
			"Cleared this tab's graph. It is ready for the next student.";
	} catch {
		saveState.value = "unavailable";
		statusMessage.value =
			"The graph was cleared, but this tab's storage could not be updated.";
	}

	nextTick(() => {
		suppressSessionSave = false;
	});
}

function loadSample() {
	cancelPendingFileImport();
	replaceDocument(
		createSampleGraphDocument(),
		"Loaded the editable cooling experiment sample."
	);
}

function selectTool(tool: GraphTool) {
	activeTool.value = tool;
	statusMessage.value =
		tool === "select"
			? "Select and drag points or labels."
			: tool === "point"
				? "Click inside the plot to add a point to the active series."
				: tool === "draw"
					? "Drag inside the plot to draw a connected series."
					: tool === "text"
						? "Enter label text, then click inside the plot."
						: "Drag the plot to pan. Use the wheel or zoom buttons to zoom.";
	nextTick(() => svgElement.value?.focus());
}

function inputText(event: Event) {
	return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
}

function inputNumber(event: Event) {
	return Number((event.target as HTMLInputElement).value);
}

function inputChecked(event: Event) {
	return (event.target as HTMLInputElement).checked;
}

function pointerCanvasPosition(event: PointerEvent | WheelEvent) {
	const svg = svgElement.value;
	if (!svg) return null;
	const rect = svg.getBoundingClientRect();
	if (!rect.width || !rect.height) return null;
	return {
		x:
			((event.clientX - rect.left) / rect.width) *
			graphDocument.value.canvas.width,
		y:
			((event.clientY - rect.top) / rect.height) *
			graphDocument.value.canvas.height
	};
}

function isInsidePlot(point: { x: number; y: number }) {
	const bounds = plotBounds.value;
	return (
		point.x >= bounds.left &&
		point.x <= bounds.right &&
		point.y >= bounds.top &&
		point.y <= bounds.bottom
	);
}

function selectSeries(seriesId: string) {
	activeSeriesId.value = seriesId;
	selectedPoint.value = null;
}

function isDerivedSeries(series: GraphSeries | undefined) {
	return (
		series?.sourceKind === "function" || series?.sourceKind === "bestFit"
	);
}

function addEditablePoint(point: { x: number; y: number }) {
	let series = activeSeries.value;
	if (!series) return false;
	const needsEditableSeries = isDerivedSeries(series);
	if (
		!hasGraphCapacity({
			points: 1,
			series: needsEditableSeries ? 1 : 0
		})
	) {
		return false;
	}
	if (needsEditableSeries) {
		series = createGraphSeries(
			`Points ${graphDocument.value.series.length + 1}`,
			"#7c3aed"
		);
		series.lineMode = "none";
	}
	const targetSeries = series;
	const changed = commitMutation(
		`Added a point to ${targetSeries.name}.`,
		document => {
			if (!document.series.some(item => item.id === targetSeries.id)) {
				document.series.push(targetSeries);
			}
			targetSeries.points.push(point);
		}
	);
	if (!changed) return false;
	activeSeriesId.value = targetSeries.id;
	selectedPoint.value = {
		seriesId: targetSeries.id,
		index: targetSeries.points.length - 1
	};
	inspectorTab.value = "data";
	return true;
}

function onCanvasPointerDown(event: PointerEvent) {
	const canvasPoint = pointerCanvasPosition(event);
	if (!canvasPoint || !isInsidePlot(canvasPoint)) return;
	svgElement.value?.focus();
	selectedAnnotationId.value = null;

	if (activeTool.value === "point") {
		const graphPoint = canvasPointToGraph(
			graphDocument.value,
			canvasPoint.x,
			canvasPoint.y
		);
		addEditablePoint(graphPoint);
		return;
	}

	if (activeTool.value === "text") {
		if (!hasGraphCapacity({ annotations: 1 })) return;
		const graphPoint = canvasPointToGraph(
			graphDocument.value,
			canvasPoint.x,
			canvasPoint.y
		);
		const annotation: GraphAnnotation = {
			id: createGraphId("annotation"),
			kind: "text",
			coordinateSpace: "data",
			x: graphPoint.x,
			y: graphPoint.y,
			text: textDraft.value.trim() || "Label",
			color: "#1f2937",
			fillColor: "#00000000",
			strokeWidth: 1.5,
			fontSize: 14
		};
		commitMutation("Added a graph label.", document => {
			document.annotations.push(annotation);
		});
		selectedAnnotationId.value = annotation.id;
		selectedPoint.value = null;
		inspectorTab.value = "graph";
		return;
	}

	if (activeTool.value === "draw") {
		if (!hasGraphCapacity({ points: 1, series: 1 })) return;
		const before = graphSnapshot();
		const graphPoint = canvasPointToGraph(
			graphDocument.value,
			canvasPoint.x,
			canvasPoint.y
		);
		const series = createGraphSeries(
			`Drawing ${graphDocument.value.series.length + 1}`,
			"#7c3aed"
		);
		series.sourceKind = "freehand";
		series.lineMode = "smooth";
		series.markerShape = "none";
		series.points.push(graphPoint);
		graphDocument.value.series.push(series);
		activeSeriesId.value = series.id;
		pointerGesture.value = {
			kind: "draw",
			pointerId: event.pointerId,
			before,
			startX: canvasPoint.x,
			startY: canvasPoint.y,
			seriesId: series.id,
			lastDrawX: canvasPoint.x,
			lastDrawY: canvasPoint.y
		};
		svgElement.value?.setPointerCapture(event.pointerId);
		return;
	}

	if (activeTool.value === "pan") {
		pointerGesture.value = {
			kind: "pan",
			pointerId: event.pointerId,
			before: graphSnapshot(),
			startX: canvasPoint.x,
			startY: canvasPoint.y,
			originalXAxis: { ...graphDocument.value.xAxis },
			originalYAxis: { ...graphDocument.value.yAxis }
		};
		svgElement.value?.setPointerCapture(event.pointerId);
		return;
	}

	selectedPoint.value = null;
}

function onPointPointerDown(
	event: PointerEvent,
	seriesId: string,
	index: number
) {
	event.stopPropagation();
	svgElement.value?.focus();
	const series = graphDocument.value.series.find(
		item => item.id === seriesId
	);
	if (isDerivedSeries(series)) {
		selectedPoint.value = null;
		selectedAnnotationId.value = null;
		statusMessage.value =
			"Generated curve points are read-only. Duplicate the series to edit a snapshot.";
		return;
	}
	activeSeriesId.value = seriesId;
	selectedPoint.value = { seriesId, index };
	selectedAnnotationId.value = null;
	if (activeTool.value !== "select") return;
	const point = pointerCanvasPosition(event);
	if (!point) return;
	pointerGesture.value = {
		kind: "point",
		pointerId: event.pointerId,
		before: graphSnapshot(),
		startX: point.x,
		startY: point.y,
		seriesId,
		pointIndex: index
	};
	svgElement.value?.setPointerCapture(event.pointerId);
}

function onAnnotationPointerDown(event: PointerEvent, annotationId: string) {
	event.stopPropagation();
	svgElement.value?.focus();
	selectedAnnotationId.value = annotationId;
	selectedPoint.value = null;
	inspectorTab.value = "graph";
	if (activeTool.value !== "select") return;
	const point = pointerCanvasPosition(event);
	if (!point) return;
	pointerGesture.value = {
		kind: "annotation",
		pointerId: event.pointerId,
		before: graphSnapshot(),
		startX: point.x,
		startY: point.y,
		annotationId
	};
	svgElement.value?.setPointerCapture(event.pointerId);
}

function onCanvasPointerMove(event: PointerEvent) {
	const canvasPoint = pointerCanvasPosition(event);
	if (!canvasPoint) return;
	const graphPoint = canvasPointToGraph(
		graphDocument.value,
		canvasPoint.x,
		canvasPoint.y
	);
	coordinatesText.value = `x ${formatGraphNumber(graphPoint.x)}, y ${formatGraphNumber(
		graphPoint.y
	)}`;
	const gesture = pointerGesture.value;
	if (!gesture || gesture.pointerId !== event.pointerId) return;

	if (gesture.kind === "point" && gesture.seriesId !== undefined) {
		const series = graphDocument.value.series.find(
			item => item.id === gesture.seriesId
		);
		const point =
			gesture.pointIndex === undefined
				? undefined
				: series?.points[gesture.pointIndex];
		if (point && isInsidePlot(canvasPoint)) {
			point.x = graphPoint.x;
			point.y = graphPoint.y;
			refreshDerivedGraphSeries(graphDocument.value);
		}
		return;
	}

	if (gesture.kind === "annotation" && gesture.annotationId) {
		const annotation = graphDocument.value.annotations.find(
			item => item.id === gesture.annotationId
		);
		if (!annotation || !isInsidePlot(canvasPoint)) return;
		if (annotation.coordinateSpace === "data") {
			annotation.x = graphPoint.x;
			annotation.y = graphPoint.y;
		} else {
			annotation.x = canvasPoint.x;
			annotation.y = canvasPoint.y;
		}
		return;
	}

	if (
		gesture.kind === "pan" &&
		gesture.originalXAxis &&
		gesture.originalYAxis
	) {
		graphDocument.value.xAxis = { ...gesture.originalXAxis };
		graphDocument.value.yAxis = { ...gesture.originalYAxis };
		panGraphAxis(
			graphDocument.value.xAxis,
			-(canvasPoint.x - gesture.startX) / plotBounds.value.width
		);
		panGraphAxis(
			graphDocument.value.yAxis,
			(canvasPoint.y - gesture.startY) / plotBounds.value.height
		);
		refreshDerivedGraphSeries(graphDocument.value);
		return;
	}

	if (
		gesture.kind === "draw" &&
		gesture.seriesId &&
		isInsidePlot(canvasPoint)
	) {
		const distance = Math.hypot(
			canvasPoint.x - (gesture.lastDrawX ?? canvasPoint.x),
			canvasPoint.y - (gesture.lastDrawY ?? canvasPoint.y)
		);
		if (distance < 3.5) return;
		const series = graphDocument.value.series.find(
			item => item.id === gesture.seriesId
		);
		if (
			series &&
			series.points.length < 5_000 &&
			hasGraphCapacity({ points: 1 })
		) {
			series.points.push(graphPoint);
			gesture.lastDrawX = canvasPoint.x;
			gesture.lastDrawY = canvasPoint.y;
		}
	}
}

function finishPointerGesture(event: PointerEvent) {
	const gesture = pointerGesture.value;
	if (!gesture || gesture.pointerId !== event.pointerId) return;
	const after = graphSnapshot();
	if (gesture.before !== after) {
		redoStack.value = [];
		pushUndoSnapshot(gesture.before);
		statusMessage.value =
			gesture.kind === "pan"
				? "Panned the graph."
				: gesture.kind === "draw"
					? "Added a freehand series."
					: "Moved the selected graph object.";
	}
	if (svgElement.value?.hasPointerCapture(event.pointerId)) {
		svgElement.value.releasePointerCapture(event.pointerId);
	}
	pointerGesture.value = null;
}

function onCanvasWheel(event: WheelEvent) {
	const canvasPoint = pointerCanvasPosition(event);
	if (!canvasPoint || !isInsidePlot(canvasPoint)) return;
	svgElement.value?.focus();
	if (!wheelBeforeSnapshot) wheelBeforeSnapshot = graphSnapshot();
	const graphPoint = canvasPointToGraph(
		graphDocument.value,
		canvasPoint.x,
		canvasPoint.y
	);
	const factor = event.deltaY > 0 ? 1.16 : 0.86;
	zoomGraphAxis(graphDocument.value.xAxis, graphPoint.x, factor);
	zoomGraphAxis(graphDocument.value.yAxis, graphPoint.y, factor);
	refreshDerivedGraphSeries(graphDocument.value);
	statusMessage.value = factor < 1 ? "Zoomed in." : "Zoomed out.";
	if (wheelTimer) clearTimeout(wheelTimer);
	wheelTimer = setTimeout(() => {
		if (wheelBeforeSnapshot && wheelBeforeSnapshot !== graphSnapshot()) {
			redoStack.value = [];
			pushUndoSnapshot(wheelBeforeSnapshot);
		}
		wheelBeforeSnapshot = undefined;
	}, 180);
}

function zoomGraph(factor: number) {
	commitMutation(factor < 1 ? "Zoomed in." : "Zoomed out.", document => {
		const xCenter = axisValueAtFraction(document.xAxis, 0.5);
		const yCenter = axisValueAtFraction(document.yAxis, 0.5);
		zoomGraphAxis(document.xAxis, xCenter, factor);
		zoomGraphAxis(document.yAxis, yCenter, factor);
	});
}

function fitAxes() {
	const changed = commitMutation(
		"Scaled the axes to fit visible data.",
		document => {
			fitGraphAxesToData(document);
		},
		{ refreshDerived: false }
	);
	if (!changed)
		statusMessage.value = "Add visible data before fitting the axes.";
}

function nudgeSelected(key: string, multiplier: number) {
	const xAxis = graphDocument.value.xAxis;
	const yAxis = graphDocument.value.yAxis;
	const selected = selectedPoint.value;
	const annotation = selectedAnnotation.value;
	if (!selected && !annotation) return false;
	if (
		selected &&
		isDerivedSeries(
			graphDocument.value.series.find(
				series => series.id === selected.seriesId
			)
		)
	) {
		statusMessage.value =
			"Generated curve points are read-only. Duplicate the series to edit a snapshot.";
		return false;
	}

	return commitMutation("Nudged the selected graph object.", document => {
		const xDelta =
			key === "ArrowLeft"
				? -multiplier
				: key === "ArrowRight"
					? multiplier
					: 0;
		const yDelta =
			key === "ArrowDown"
				? -multiplier
				: key === "ArrowUp"
					? multiplier
					: 0;
		if (selected) {
			const series = document.series.find(
				item => item.id === selected.seriesId
			);
			const point = series?.points[selected.index];
			if (!point) return;
			if (xDelta) {
				point.x = axisValueAtFraction(
					xAxis,
					Math.min(
						1,
						Math.max(0, axisFraction(xAxis, point.x) + xDelta)
					)
				);
			}
			if (yDelta) {
				point.y = axisValueAtFraction(
					yAxis,
					Math.min(
						1,
						Math.max(0, axisFraction(yAxis, point.y) + yDelta)
					)
				);
			}
		} else if (annotation) {
			if (annotation.coordinateSpace === "data") {
				if (xDelta) {
					annotation.x = axisValueAtFraction(
						xAxis,
						Math.min(
							1,
							Math.max(
								0,
								axisFraction(xAxis, annotation.x) + xDelta
							)
						)
					);
				}
				if (yDelta) {
					annotation.y = axisValueAtFraction(
						yAxis,
						Math.min(
							1,
							Math.max(
								0,
								axisFraction(yAxis, annotation.y) + yDelta
							)
						)
					);
				}
			} else {
				annotation.x += xDelta * plotBounds.value.width;
				annotation.y -= yDelta * plotBounds.value.height;
			}
		}
	});
}

function deleteSelection() {
	const selected = selectedPoint.value;
	if (selected) {
		commitMutation("Deleted the selected point.", document => {
			const series = document.series.find(
				item => item.id === selected.seriesId
			);
			series?.points.splice(selected.index, 1);
		});
		selectedPoint.value = null;
		return;
	}
	const annotationId = selectedAnnotationId.value;
	if (annotationId) {
		commitMutation("Deleted the selected annotation.", document => {
			document.annotations = document.annotations.filter(
				annotation => annotation.id !== annotationId
			);
		});
		selectedAnnotationId.value = null;
	}
}

function onCanvasKeyDown(event: KeyboardEvent) {
	const scrollKeys = [
		"ArrowLeft",
		"ArrowRight",
		"ArrowUp",
		"ArrowDown",
		" ",
		"Spacebar",
		"PageUp",
		"PageDown",
		"Home",
		"End"
	];
	if (scrollKeys.includes(event.key)) event.preventDefault();
	if (event.key.startsWith("Arrow")) {
		const multiplier = event.shiftKey ? 0.05 : event.altKey ? 0.002 : 0.01;
		nudgeSelected(event.key, multiplier);
		return;
	}
	if (event.key === "Delete" || event.key === "Backspace") {
		event.preventDefault();
		deleteSelection();
		return;
	}
	if (event.key === "Escape") {
		selectedPoint.value = null;
		selectedAnnotationId.value = null;
		return;
	}
	if (event.key === "+" || event.key === "=") {
		event.preventDefault();
		zoomGraph(0.82);
	} else if (event.key === "-") {
		event.preventDefault();
		zoomGraph(1.2);
	} else if (event.key === "0") {
		event.preventDefault();
		fitAxes();
	}
}

function addSeries() {
	if (!hasGraphCapacity({ series: 1 })) return;
	const series = createGraphSeries(
		`Series ${graphDocument.value.series.length + 1}`,
		["#2563eb", "#dc2626", "#059669", "#9333ea", "#ea580c"][
			graphDocument.value.series.length % 5
		]
	);
	commitMutation(`Added ${series.name}.`, document => {
		document.series.push(series);
	});
	activeSeriesId.value = series.id;
	selectedPoint.value = null;
}

function duplicateActiveSeries() {
	const source = activeSeries.value;
	if (!source) return;
	if (
		!hasGraphCapacity({
			points: source.points.length,
			series: 1
		})
	) {
		return;
	}
	const duplicate = cloneGraphDocument({
		...createBlankGraphDocument(),
		series: [source]
	}).series[0];
	duplicate.id = createGraphId("series");
	duplicate.name = `${source.name} copy`;
	duplicate.sourceSeriesId = undefined;
	if (isDerivedSeries(duplicate)) {
		duplicate.sourceKind = "data";
		duplicate.sourceExpression = undefined;
	}
	commitMutation(`Duplicated ${source.name}.`, document => {
		document.series.push(duplicate);
	});
	activeSeriesId.value = duplicate.id;
}

function removeActiveSeries() {
	const series = activeSeries.value;
	if (!series) return;
	commitMutation(`Removed ${series.name}.`, document => {
		document.series = document.series.filter(item => item.id !== series.id);
		document.series = document.series.filter(
			item => item.sourceSeriesId !== series.id
		);
		if (!document.series.length) document.series.push(createGraphSeries());
	});
	activeSeriesId.value = graphDocument.value.series[0].id;
	selectedPoint.value = null;
}

function updateActiveSeries(
	label: string,
	mutate: (series: GraphSeries) => void
) {
	const series = activeSeries.value;
	if (!series) return;
	commitMutation(label, () => mutate(series));
}

function addPointAtCenter() {
	addEditablePoint({
		x: axisValueAtFraction(graphDocument.value.xAxis, 0.5),
		y: axisValueAtFraction(graphDocument.value.yAxis, 0.5)
	});
}

function updatePoint(
	index: number,
	field: "x" | "y" | "xError" | "yError" | "label",
	value: string
) {
	const series = activeSeries.value;
	const point = series?.points[index];
	if (!series || !point) return;
	if (isDerivedSeries(series)) {
		statusMessage.value =
			"Generated curve points are read-only. Duplicate the series to edit a snapshot.";
		return;
	}
	updateActiveSeries(`Updated point ${index + 1}.`, () => {
		if (field === "label") {
			const label = value.trim();
			if (label) point.label = label.slice(0, 2_048);
			else delete point.label;
			return;
		}
		if (field === "xError" || field === "yError") {
			const number = Number(value);
			if (!value.trim() || !Number.isFinite(number) || number < 0) {
				delete point[field];
			} else {
				point[field] = number;
			}
			return;
		}
		const number = Number(value);
		if (Number.isFinite(number)) point[field] = number;
	});
}

function removePoint(index: number) {
	const series = activeSeries.value;
	if (!series) return;
	if (isDerivedSeries(series)) {
		statusMessage.value =
			"Generated curve points are read-only. Duplicate the series to edit a snapshot.";
		return;
	}
	updateActiveSeries(`Removed point ${index + 1}.`, active => {
		active.points.splice(index, 1);
	});
	if (
		selectedPoint.value?.seriesId === series.id &&
		selectedPoint.value.index === index
	) {
		selectedPoint.value = null;
	}
}

function importPastedData() {
	try {
		const result = importDelimitedGraphData(pastedData.value);
		const shouldReplace =
			graphDocument.value.series.length === 1 &&
			graphDocument.value.series[0].points.length === 0;
		const importedPointCount = result.series.reduce(
			(total, series) => total + series.points.length,
			0
		);
		if (
			!hasGraphCapacity(
				{
					points: importedPointCount,
					series: result.series.length
				},
				{ replaceSeries: shouldReplace }
			)
		) {
			return;
		}
		const next = cloneGraphDocument(graphDocument.value);
		if (shouldReplace) next.series = [];
		next.series.push(...result.series);
		fitGraphAxesToData(next);
		replaceDocument(
			next,
			`Imported ${result.series.length} series from ${result.rowsRead} row(s).`
		);
		activeSeriesId.value = result.series[0].id;
		importWarnings.value = result.issues.slice(0, 13);
		pastedData.value = "";
	} catch (error) {
		statusMessage.value =
			error instanceof Error
				? error.message
				: "Could not import the data.";
	}
}

function plotFunction() {
	const expression = expressionDraft.value.trim();
	try {
		compileGraphExpression(expression);
		const points = sampleGraphExpression(
			expression,
			graphDocument.value.xAxis,
			graphDocument.value.yAxis
		);
		const series = createGraphSeries(
			`y = ${expression}`,
			["#2563eb", "#dc2626", "#059669", "#9333ea", "#ea580c"][
				graphDocument.value.series.length % 5
			]
		);
		series.sourceKind = "function";
		series.sourceExpression = expression;
		series.lineMode = "smooth";
		series.markerShape = "none";
		series.points = points;
		if (!hasGraphCapacity({ points: points.length, series: 1 })) return;
		commitMutation(`Plotted y = ${expression}.`, document => {
			document.series.push(series);
		});
		activeSeriesId.value = series.id;
		inspectorTab.value = "style";
	} catch (error) {
		statusMessage.value =
			error instanceof Error
				? error.message
				: "Could not plot the expression.";
	}
}

function addBestFit() {
	const source = activeSeries.value;
	if (!source || isDerivedSeries(source)) {
		statusMessage.value =
			"Select a data series before adding a best-fit line.";
		return;
	}
	const fit = createBestFitSeries(source);
	if (!fit) {
		statusMessage.value =
			"A best-fit line needs at least two points with different x values.";
		return;
	}
	if (!hasGraphCapacity({ points: fit.points.length, series: 1 })) return;
	commitMutation(`Added a best-fit line for ${source.name}.`, document => {
		document.series.push(fit);
	});
	activeSeriesId.value = fit.id;
}

function updateAxis(
	dimension: "x" | "y",
	field:
		| "title"
		| "minimum"
		| "maximum"
		| "scale"
		| "tickSpacing"
		| "showGridLines"
		| "showTickLabels",
	value: string | number | boolean | null
) {
	const axis =
		dimension === "x"
			? graphDocument.value.xAxis
			: graphDocument.value.yAxis;
	commitMutation(`Updated the ${dimension}-axis.`, () => {
		if (field === "title" && typeof value === "string") {
			axis.title = value;
		} else if (field === "scale" && typeof value === "string") {
			axis.scale = value as GraphAxisScale;
			if (axis.scale === "logarithmic" && axis.minimum <= 0) {
				axis.minimum = 0.1;
				axis.maximum = Math.max(10, axis.maximum);
			}
		} else if (field === "showGridLines" && typeof value === "boolean") {
			axis.showGridLines = value;
		} else if (field === "showTickLabels" && typeof value === "boolean") {
			axis.showTickLabels = value;
		} else if (field === "tickSpacing") {
			axis.tickSpacing =
				typeof value === "number" && value > 0 ? value : null;
		} else if (
			(field === "minimum" || field === "maximum") &&
			typeof value === "number" &&
			Number.isFinite(value)
		) {
			if (field === "minimum" && value < axis.maximum) {
				axis.minimum =
					axis.scale === "logarithmic"
						? Math.max(Number.MIN_VALUE, value)
						: value;
			}
			if (field === "maximum" && value > axis.minimum)
				axis.maximum = value;
		}
	});
}

function updateGraphTitle(value: string) {
	commitMutation("Updated the graph title.", document => {
		document.title = value.trim().slice(0, 512) || "Untitled Graph";
	});
}

function updateGraphDescription(value: string) {
	commitMutation("Updated the graph description.", document => {
		document.description = value.slice(0, 16_384);
	});
}

function updateAnnotation(
	field: "text" | "color" | "fillColor" | "fontSize" | "strokeWidth",
	value: string | number
) {
	const annotation = selectedAnnotation.value;
	if (!annotation) return;
	commitMutation("Updated the selected annotation.", () => {
		if (field === "text" && typeof value === "string") {
			annotation.text = value.slice(0, 8_192);
		} else if (
			(field === "color" || field === "fillColor") &&
			typeof value === "string"
		) {
			annotation[field] = value;
		} else if (
			(field === "fontSize" || field === "strokeWidth") &&
			typeof value === "number" &&
			Number.isFinite(value)
		) {
			annotation[field] = Math.max(0, value);
		}
	});
}

function openFilePicker() {
	fileInput.value?.click();
}

function titleFromFileName(name: string) {
	return (
		name
			.replace(/\.(?:graphsketch|ograph|json|csv|tsv)$/i, "")
			.replace(/[-_]+/g, " ")
			.trim() || "Imported Graph"
	);
}

async function handleFileSelection(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (!file) return;
	cancelPendingFileImport();
	const importController = new AbortController();
	fileImportController = importController;
	const currentImportGeneration = ++fileImportGeneration;
	const isCurrentImport = () =>
		currentImportGeneration === fileImportGeneration &&
		!importController.signal.aborted;
	importWarnings.value = [];
	try {
		if (file.size > MAX_GRAPH_DOCUMENT_BYTES) {
			throw new Error(
				"The graph file is larger than the 8 MB browser limit."
			);
		}
		if (/\.(?:csv|tsv)$/i.test(file.name)) {
			const text = await file.text();
			if (!isCurrentImport()) return;
			pastedData.value = text;
			inspectorTab.value = "data";
			importPastedData();
			return;
		}
		if (/\.ograph$/i.test(file.name)) {
			const fileBytes = new Uint8Array(await file.arrayBuffer());
			if (!isCurrentImport()) return;
			const imported = await importLegacyGraphSketcherDocument(
				fileBytes,
				titleFromFileName(file.name),
				importController.signal
			);
			if (!isCurrentImport()) return;
			replaceDocument(
				imported.document,
				`Imported ${file.name} without modifying the original file.`
			);
			importWarnings.value = imported.warnings.slice(0, 13);
			return;
		}
		const text = await file.text();
		if (!isCurrentImport()) return;
		const next = graphDocumentFromJson(text);
		replaceDocument(next, `Opened ${file.name}.`);
	} catch (error) {
		if (!isCurrentImport()) return;
		statusMessage.value =
			error instanceof Error
				? error.message
				: `Could not open ${file.name}.`;
	} finally {
		if (isCurrentImport()) fileImportController = undefined;
	}
}

function downloadBlob(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob);
	const anchor = window.document.createElement("a");
	anchor.href = url;
	anchor.download = fileName;
	anchor.click();
	setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadProject() {
	downloadBlob(
		new Blob([graphDocumentToJson(graphDocument.value)], {
			type: "application/json;charset=utf-8"
		}),
		graphProjectFileName(graphDocument.value.title)
	);
	statusMessage.value = "Downloaded an editable .graphsketch project.";
}

function exportSvg() {
	downloadBlob(
		new Blob([graphDocumentToSvg(graphDocument.value)], {
			type: "image/svg+xml;charset=utf-8"
		}),
		graphProjectFileName(graphDocument.value.title).replace(
			/\.graphsketch$/,
			".svg"
		)
	);
	statusMessage.value = "Exported a scalable SVG graph.";
}

async function exportPng() {
	const svg = graphDocumentToSvg(graphDocument.value);
	const sourceUrl = URL.createObjectURL(
		new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
	);
	try {
		const image = new Image();
		image.src = sourceUrl;
		await image.decode();
		const dimensions = graphPngDimensions(
			graphDocument.value.canvas.width,
			graphDocument.value.canvas.height
		);
		const canvas = window.document.createElement("canvas");
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;
		const context = canvas.getContext("2d");
		if (!context)
			throw new Error("This browser could not create a PNG canvas.");
		context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
		const blob = await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(
				result =>
					result
						? resolve(result)
						: reject(new Error("PNG export failed.")),
				"image/png"
			);
		});
		downloadBlob(
			blob,
			graphProjectFileName(graphDocument.value.title).replace(
				/\.graphsketch$/,
				".png"
			)
		);
		statusMessage.value = "Exported a PNG graph.";
	} catch (error) {
		statusMessage.value =
			error instanceof Error ? error.message : "Could not export PNG.";
	} finally {
		URL.revokeObjectURL(sourceUrl);
	}
}

function exportCsv() {
	downloadBlob(
		new Blob([graphDocumentToCsv(graphDocument.value)], {
			type: "text/csv;charset=utf-8"
		}),
		graphProjectFileName(graphDocument.value.title).replace(
			/\.graphsketch$/,
			".csv"
		)
	);
	statusMessage.value = "Exported graph data as CSV.";
}

function markerPolygon(
	shape: GraphMarkerShape,
	x: number,
	y: number,
	size: number
) {
	const radius = Math.max(1, size / 2);
	if (shape === "triangle") {
		return `${x},${y - radius} ${x + radius},${y + radius} ${
			x - radius
		},${y + radius}`;
	}
	return `${x},${y - radius} ${x + radius},${y} ${x},${y + radius} ${
		x - radius
	},${y}`;
}

function annotationRectangle(
	rendered: (typeof renderedAnnotations.value)[number]
) {
	return {
		height: Math.abs(rendered.second.y - rendered.first.y),
		width: Math.abs(rendered.second.x - rendered.first.x),
		x: Math.min(rendered.first.x, rendered.second.x),
		y: Math.min(rendered.first.y, rendered.second.y)
	};
}

onMounted(() => {
	loadSessionGraph();
	isClientReady.value = true;
});

onBeforeUnmount(() => {
	cancelPendingFileImport();
	if (saveTimer) saveSessionGraph();
	if (wheelTimer) clearTimeout(wheelTimer);
	if (newGraphConfirmationTimer) clearTimeout(newGraphConfirmationTimer);
	if (endSessionConfirmationTimer) {
		clearTimeout(endSessionConfirmationTimer);
	}
});
</script>

<template>
	<section class="graph-sketcher-page">
		<header class="graph-header site-surface">
			<div class="graph-header__copy">
				<p class="page-eyebrow">Math workspace</p>
				<h1>Graph Sketcher</h1>
				<p>
					Draw, plot, label, analyze, and export graphs in the
					browser. A recovery copy stays in browser tab storage.
					Download a project to keep a separate copy.
				</p>
			</div>

			<div
				class="graph-document-actions"
				role="group"
				aria-label="Graph project actions"
			>
				<button type="button" class="graph-button" @click="newGraph">
					{{ isNewGraphConfirmationPending ? "Confirm new" : "New" }}
				</button>
				<button type="button" class="graph-button" @click="loadSample">
					Sample
				</button>
				<button
					type="button"
					class="graph-button"
					:disabled="!isClientReady"
					@click="openFilePicker"
				>
					Open / import
				</button>
				<button
					type="button"
					class="graph-button"
					@click="downloadProject"
				>
					Download project
				</button>
				<button
					type="button"
					class="graph-button graph-button--danger"
					@click="endSharedSession"
				>
					{{
						isEndSessionConfirmationPending
							? "Confirm clear"
							: "Clear for next student"
					}}
				</button>
				<div class="graph-export-menu">
					<button
						type="button"
						class="graph-button"
						@click="exportSvg"
					>
						SVG
					</button>
					<button
						type="button"
						class="graph-button"
						@click="exportPng"
					>
						PNG
					</button>
					<button
						type="button"
						class="graph-button"
						@click="exportCsv"
					>
						CSV
					</button>
				</div>
				<input
					ref="fileInput"
					class="sr-only"
					type="file"
					:disabled="!isClientReady"
					aria-label="Open or import a graph project"
					accept=".graphsketch,.ograph,.json,.csv,.tsv,application/json,text/csv,text/tab-separated-values"
					@change="handleFileSelection"
				/>
			</div>
		</header>

		<div class="graph-workspace site-surface">
			<aside class="graph-tools" aria-label="Graph drawing tools">
				<div class="graph-tools__history">
					<button
						type="button"
						class="graph-tool graph-tool--compact"
						:disabled="!canUndo"
						@click="undo"
					>
						<span aria-hidden="true">↶</span>
						Undo
					</button>
					<button
						type="button"
						class="graph-tool graph-tool--compact"
						:disabled="!canRedo"
						@click="redo"
					>
						<span aria-hidden="true">↷</span>
						Redo
					</button>
				</div>

				<div
					class="graph-tools__list"
					role="group"
					aria-label="Canvas tool"
				>
					<button
						v-for="tool in [
							{ id: 'select', icon: '↖', label: 'Select' },
							{ id: 'point', icon: '●', label: 'Point' },
							{ id: 'draw', icon: '〰', label: 'Draw' },
							{ id: 'text', icon: 'T', label: 'Text' },
							{ id: 'pan', icon: '✥', label: 'Pan' }
						]"
						:key="tool.id"
						type="button"
						class="graph-tool"
						:class="{ 'is-active': activeTool === tool.id }"
						:aria-pressed="activeTool === tool.id"
						@click="selectTool(tool.id as GraphTool)"
					>
						<span class="graph-tool__icon" aria-hidden="true">{{
							tool.icon
						}}</span>
						{{ tool.label }}
					</button>
				</div>

				<label v-if="activeTool === 'text'" class="graph-tool-draft">
					Label text
					<input v-model="textDraft" type="text" maxlength="200" />
				</label>

				<div
					class="graph-tools__zoom"
					role="group"
					aria-label="Graph view controls"
				>
					<button
						type="button"
						class="graph-tool graph-tool--compact"
						@click="zoomGraph(0.82)"
					>
						<span aria-hidden="true">＋</span>
						Zoom in
					</button>
					<button
						type="button"
						class="graph-tool graph-tool--compact"
						@click="zoomGraph(1.2)"
					>
						<span aria-hidden="true">−</span>
						Zoom out
					</button>
					<button
						type="button"
						class="graph-tool graph-tool--compact"
						@click="fitAxes"
					>
						<span aria-hidden="true">↔</span>
						Fit data
					</button>
				</div>

				<p class="graph-tools__hint">
					Canvas focus captures arrows, space, Page Up, and Page Down
					so the page does not scroll while editing.
				</p>
			</aside>

			<section class="graph-canvas-panel" aria-labelledby="canvas-title">
				<div class="graph-canvas-toolbar">
					<div>
						<p class="graph-panel-kicker">Canvas</p>
						<h2 id="canvas-title">{{ graphDocument.title }}</h2>
					</div>
					<p>{{ coordinatesText }}</p>
				</div>

				<div class="graph-canvas-shell">
					<svg
						ref="svgElement"
						class="graph-canvas"
						:class="`tool-${activeTool}`"
						:viewBox="`0 0 ${graphDocument.canvas.width} ${graphDocument.canvas.height}`"
						:aria-label="graphAriaLabel"
						role="img"
						tabindex="0"
						@keydown="onCanvasKeyDown"
						@pointercancel="finishPointerGesture"
						@pointerdown="onCanvasPointerDown"
						@pointermove="onCanvasPointerMove"
						@pointerup="finishPointerGesture"
						@wheel.prevent="onCanvasWheel"
					>
						<title>{{ graphDocument.title }}</title>
						<desc>
							{{
								graphDocument.description ||
								"Interactive graph canvas"
							}}
						</desc>
						<defs>
							<clipPath id="interactive-graph-clip">
								<rect
									:x="plotBounds.left"
									:y="plotBounds.top"
									:width="plotBounds.width"
									:height="plotBounds.height"
								/>
							</clipPath>
							<marker
								id="interactive-graph-arrow"
								marker-height="8"
								marker-width="8"
								orient="auto"
								ref-x="7"
								ref-y="4"
							>
								<path d="M 0 0 L 8 4 L 0 8 Z" />
							</marker>
						</defs>

						<rect
							class="graph-canvas__background"
							width="100%"
							height="100%"
							:fill="graphDocument.canvas.backgroundColor"
						/>
						<text
							class="graph-canvas__title"
							:x="graphDocument.canvas.width / 2"
							y="30"
							text-anchor="middle"
						>
							{{ graphDocument.title }}
						</text>

						<g class="graph-grid">
							<line
								v-for="tick in xTicks"
								v-show="graphDocument.xAxis.showGridLines"
								:key="`x-grid-${tick.value}`"
								:x1="tick.x"
								:x2="tick.x"
								:y1="plotBounds.top"
								:y2="plotBounds.bottom"
							/>
							<line
								v-for="tick in yTicks"
								v-show="graphDocument.yAxis.showGridLines"
								:key="`y-grid-${tick.value}`"
								:x1="plotBounds.left"
								:x2="plotBounds.right"
								:y1="tick.y"
								:y2="tick.y"
							/>
						</g>

						<g class="graph-axes">
							<line
								v-if="graphDocument.xAxis.showAxisLine"
								:x1="plotBounds.left"
								:x2="plotBounds.right"
								:y1="xAxisY"
								:y2="xAxisY"
							/>
							<line
								v-if="graphDocument.yAxis.showAxisLine"
								:x1="yAxisX"
								:x2="yAxisX"
								:y1="plotBounds.top"
								:y2="plotBounds.bottom"
							/>
						</g>

						<g class="graph-tick-labels">
							<text
								v-for="tick in xTicks"
								v-show="graphDocument.xAxis.showTickLabels"
								:key="`x-label-${tick.value}`"
								:x="tick.x"
								:y="plotBounds.bottom + 22"
								text-anchor="middle"
							>
								{{ tick.label }}
							</text>
							<text
								v-for="tick in yTicks"
								v-show="graphDocument.yAxis.showTickLabels"
								:key="`y-label-${tick.value}`"
								:x="plotBounds.left - 10"
								:y="tick.y"
								dominant-baseline="middle"
								text-anchor="end"
							>
								{{ tick.label }}
							</text>
						</g>

						<g clip-path="url(#interactive-graph-clip)">
							<g
								v-for="rendered in renderedSeries"
								:key="rendered.series.id"
								class="graph-series"
							>
								<path
									v-if="rendered.areaPath"
									class="graph-series__area"
									:d="rendered.areaPath"
									:fill="rendered.series.color"
								/>
								<path
									v-if="
										rendered.path &&
										rendered.series.lineStyle !== 'none'
									"
									class="graph-series__line"
									:d="rendered.path"
									fill="none"
									:stroke="rendered.series.color"
									:stroke-dasharray="rendered.dashArray"
									:stroke-width="rendered.series.strokeWidth"
								/>

								<g
									v-for="point in rendered.points"
									:key="`${rendered.series.id}-${point.index}`"
									class="graph-point"
									:class="{
										'is-selected':
											selectedPoint?.seriesId ===
												rendered.series.id &&
											selectedPoint?.index === point.index
									}"
									@pointerdown="
										onPointPointerDown(
											$event,
											rendered.series.id,
											point.index
										)
									"
								>
									<g
										class="graph-error-bars"
										fill="none"
										:stroke="rendered.series.color"
									>
										<template
											v-if="
												point.xErrorStart?.isValid &&
												point.xErrorEnd?.isValid
											"
										>
											<line
												:x1="point.xErrorStart.x"
												:x2="point.xErrorEnd.x"
												:y1="point.canvasPoint.y"
												:y2="point.canvasPoint.y"
											/>
											<line
												:x1="point.xErrorStart.x"
												:x2="point.xErrorStart.x"
												:y1="point.canvasPoint.y - 5"
												:y2="point.canvasPoint.y + 5"
											/>
											<line
												:x1="point.xErrorEnd.x"
												:x2="point.xErrorEnd.x"
												:y1="point.canvasPoint.y - 5"
												:y2="point.canvasPoint.y + 5"
											/>
										</template>
										<template
											v-if="
												point.yErrorStart?.isValid &&
												point.yErrorEnd?.isValid
											"
										>
											<line
												:x1="point.canvasPoint.x"
												:x2="point.canvasPoint.x"
												:y1="point.yErrorStart.y"
												:y2="point.yErrorEnd.y"
											/>
											<line
												:x1="point.canvasPoint.x - 5"
												:x2="point.canvasPoint.x + 5"
												:y1="point.yErrorStart.y"
												:y2="point.yErrorStart.y"
											/>
											<line
												:x1="point.canvasPoint.x - 5"
												:x2="point.canvasPoint.x + 5"
												:y1="point.yErrorEnd.y"
												:y2="point.yErrorEnd.y"
											/>
										</template>
									</g>

									<circle
										class="graph-point__hit"
										:cx="point.canvasPoint.x"
										:cy="point.canvasPoint.y"
										:r="
											Math.max(
												10,
												rendered.series.markerSize
											)
										"
									/>
									<circle
										v-if="
											rendered.series.markerShape ===
											'circle'
										"
										:cx="point.canvasPoint.x"
										:cy="point.canvasPoint.y"
										:r="
											Math.max(
												1,
												rendered.series.markerSize / 2
											)
										"
										:fill="rendered.series.color"
									/>
									<rect
										v-else-if="
											rendered.series.markerShape ===
											'square'
										"
										:x="
											point.canvasPoint.x -
											rendered.series.markerSize / 2
										"
										:y="
											point.canvasPoint.y -
											rendered.series.markerSize / 2
										"
										:width="rendered.series.markerSize"
										:height="rendered.series.markerSize"
										:fill="rendered.series.color"
									/>
									<polygon
										v-else-if="
											['triangle', 'diamond'].includes(
												rendered.series.markerShape
											)
										"
										:points="
											markerPolygon(
												rendered.series.markerShape,
												point.canvasPoint.x,
												point.canvasPoint.y,
												rendered.series.markerSize
											)
										"
										:fill="rendered.series.color"
									/>
									<path
										v-else-if="
											['cross', 'plus'].includes(
												rendered.series.markerShape
											)
										"
										:d="
											rendered.series.markerShape ===
											'cross'
												? `M ${
														point.canvasPoint.x -
														rendered.series
															.markerSize /
															2
													} ${
														point.canvasPoint.y -
														rendered.series
															.markerSize /
															2
													} L ${
														point.canvasPoint.x +
														rendered.series
															.markerSize /
															2
													} ${
														point.canvasPoint.y +
														rendered.series
															.markerSize /
															2
													} M ${
														point.canvasPoint.x +
														rendered.series
															.markerSize /
															2
													} ${
														point.canvasPoint.y -
														rendered.series
															.markerSize /
															2
													} L ${
														point.canvasPoint.x -
														rendered.series
															.markerSize /
															2
													} ${
														point.canvasPoint.y +
														rendered.series
															.markerSize /
															2
													}`
												: `M ${
														point.canvasPoint.x -
														rendered.series
															.markerSize /
															2
													} ${point.canvasPoint.y} L ${
														point.canvasPoint.x +
														rendered.series
															.markerSize /
															2
													} ${point.canvasPoint.y} M ${
														point.canvasPoint.x
													} ${
														point.canvasPoint.y -
														rendered.series
															.markerSize /
															2
													} L ${point.canvasPoint.x} ${
														point.canvasPoint.y +
														rendered.series
															.markerSize /
															2
													}`
										"
										fill="none"
										:stroke="rendered.series.color"
										stroke-width="2"
									/>
									<text
										v-if="point.point.label"
										class="graph-point__label"
										:x="
											point.canvasPoint.x +
											rendered.series.markerSize
										"
										:y="
											point.canvasPoint.y -
											rendered.series.markerSize
										"
									>
										{{ point.point.label }}
									</text>
								</g>
							</g>

							<g
								v-for="rendered in renderedAnnotations"
								:key="rendered.annotation.id"
								class="graph-annotation"
								:class="{
									'is-selected':
										selectedAnnotationId ===
										rendered.annotation.id
								}"
								@pointerdown="
									onAnnotationPointerDown(
										$event,
										rendered.annotation.id
									)
								"
							>
								<text
									v-if="rendered.annotation.kind === 'text'"
									:x="rendered.first.x"
									:y="rendered.first.y"
									:fill="rendered.annotation.color"
									:font-size="rendered.annotation.fontSize"
									dominant-baseline="middle"
								>
									{{ rendered.annotation.text }}
								</text>
								<line
									v-else-if="
										['line', 'arrow'].includes(
											rendered.annotation.kind
										)
									"
									:x1="rendered.first.x"
									:y1="rendered.first.y"
									:x2="rendered.second.x"
									:y2="rendered.second.y"
									:stroke="rendered.annotation.color"
									:stroke-width="
										rendered.annotation.strokeWidth
									"
									:marker-end="
										rendered.annotation.kind === 'arrow'
											? 'url(#interactive-graph-arrow)'
											: undefined
									"
								/>
								<rect
									v-else-if="
										rendered.annotation.kind === 'rectangle'
									"
									v-bind="annotationRectangle(rendered)"
									:fill="rendered.annotation.fillColor"
									:stroke="rendered.annotation.color"
									:stroke-width="
										rendered.annotation.strokeWidth
									"
								/>
								<ellipse
									v-else
									:cx="
										(rendered.first.x + rendered.second.x) /
										2
									"
									:cy="
										(rendered.first.y + rendered.second.y) /
										2
									"
									:rx="
										Math.abs(
											rendered.second.x - rendered.first.x
										) / 2
									"
									:ry="
										Math.abs(
											rendered.second.y - rendered.first.y
										) / 2
									"
									:fill="rendered.annotation.fillColor"
									:stroke="rendered.annotation.color"
									:stroke-width="
										rendered.annotation.strokeWidth
									"
								/>
							</g>
						</g>

						<text
							class="graph-axis-title"
							:x="(plotBounds.left + plotBounds.right) / 2"
							:y="graphDocument.canvas.height - 18"
							text-anchor="middle"
						>
							{{ graphDocument.xAxis.title }}
						</text>
						<text
							class="graph-axis-title"
							x="20"
							:y="(plotBounds.top + plotBounds.bottom) / 2"
							text-anchor="middle"
							:transform="`rotate(-90 20 ${
								(plotBounds.top + plotBounds.bottom) / 2
							})`"
						>
							{{ graphDocument.yAxis.title }}
						</text>

						<g
							v-if="
								graphDocument.canvas.showLegend &&
								legendLayout.series.length
							"
							class="graph-legend"
						>
							<rect
								:x="legendLayout.x"
								:y="legendLayout.y"
								:width="legendLayout.width"
								:height="legendLayout.height"
								rx="8"
							/>
							<g
								v-for="(series, index) in legendLayout.series"
								:key="`legend-${series.id}`"
								@click="selectSeries(series.id)"
							>
								<line
									:x1="legendLayout.x + 12"
									:x2="legendLayout.x + 38"
									:y1="legendLayout.y + 20 + index * 24"
									:y2="legendLayout.y + 20 + index * 24"
									:stroke="series.color"
									stroke-width="2"
								/>
								<text
									:x="legendLayout.x + 46"
									:y="legendLayout.y + 20 + index * 24"
									dominant-baseline="middle"
								>
									{{ series.name }}
								</text>
							</g>
						</g>
					</svg>
				</div>

				<p v-if="arePointHandlesSampled" class="graph-sampling-notice">
					Point handles are evenly sampled to keep editing responsive.
					All
					{{ visiblePointCount.toLocaleString() }} points remain in
					the graph paths, saved data, and exports.
				</p>

				<div class="graph-status" role="status" aria-live="polite">
					<span>{{ statusMessage }}</span>
					<span>{{ saveStateText }}</span>
				</div>
			</section>

			<aside class="graph-inspector" aria-label="Graph inspector">
				<div
					class="graph-inspector__tabs"
					role="tablist"
					aria-label="Graph inspector sections"
				>
					<button
						v-for="tab in INSPECTOR_TABS"
						:id="`graph-inspector-tab-${tab.id}`"
						:key="tab.id"
						type="button"
						role="tab"
						:aria-selected="inspectorTab === tab.id"
						:aria-controls="`graph-inspector-panel-${tab.id}`"
						:tabindex="inspectorTab === tab.id ? 0 : -1"
						:class="{ 'is-active': inspectorTab === tab.id }"
						@click="inspectorTab = tab.id"
						@keydown="handleInspectorTabKeydown($event, tab.id)"
					>
						{{ tab.label }}
					</button>
				</div>

				<div
					v-show="inspectorTab === 'data'"
					id="graph-inspector-panel-data"
					class="graph-inspector__body"
					role="tabpanel"
					tabindex="0"
					aria-labelledby="graph-inspector-tab-data"
				>
					<section class="inspector-section">
						<div class="inspector-heading">
							<div>
								<p class="graph-panel-kicker">Active series</p>
								<h2>Points and tables</h2>
							</div>
							<button
								type="button"
								class="mini-button"
								@click="addSeries"
							>
								Add
							</button>
						</div>

						<label class="graph-field">
							Series
							<select
								:value="activeSeriesId"
								@change="selectSeries(inputText($event))"
							>
								<option
									v-for="series in graphDocument.series"
									:key="series.id"
									:value="series.id"
								>
									{{ series.name }}
								</option>
							</select>
						</label>

						<div class="mini-button-row">
							<button
								type="button"
								class="mini-button"
								@click="duplicateActiveSeries"
							>
								Duplicate
							</button>
							<button
								type="button"
								class="mini-button mini-button--danger"
								@click="removeActiveSeries"
							>
								Remove
							</button>
						</div>

						<p
							v-if="activeSeries?.sourceExpression"
							class="formula-card"
						>
							Function:
							<code>y = {{ activeSeries.sourceExpression }}</code>
							Generated points are read-only. Duplicate this
							series to edit a snapshot.
						</p>

						<p
							v-else-if="activeSeries?.sourceKind === 'bestFit'"
							class="formula-card"
						>
							This best-fit line updates from its source data.
							Duplicate this series to edit a snapshot.
						</p>

						<div v-else class="graph-data-table-shell">
							<table class="graph-data-table">
								<caption class="sr-only">
									Editable points for
									{{
										activeSeries?.name
									}}
								</caption>
								<thead>
									<tr>
										<th scope="col">x</th>
										<th scope="col">y</th>
										<th scope="col">±y</th>
										<th scope="col">Label</th>
										<th scope="col">
											<span class="sr-only">Actions</span>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(
											point, index
										) in displayedPoints"
										:key="`${activeSeries?.id}-${index}`"
									>
										<td>
											<input
												:aria-label="`Point ${index + 1} x`"
												type="number"
												step="any"
												:value="point.x"
												@change="
													updatePoint(
														index,
														'x',
														inputText($event)
													)
												"
											/>
										</td>
										<td>
											<input
												:aria-label="`Point ${index + 1} y`"
												type="number"
												step="any"
												:value="point.y"
												@change="
													updatePoint(
														index,
														'y',
														inputText($event)
													)
												"
											/>
										</td>
										<td>
											<input
												:aria-label="`Point ${index + 1} y error`"
												min="0"
												type="number"
												step="any"
												:value="point.yError ?? ''"
												@change="
													updatePoint(
														index,
														'yError',
														inputText($event)
													)
												"
											/>
										</td>
										<td>
											<input
												:aria-label="`Point ${index + 1} label`"
												type="text"
												:value="point.label ?? ''"
												@change="
													updatePoint(
														index,
														'label',
														inputText($event)
													)
												"
											/>
										</td>
										<td>
											<button
												type="button"
												class="table-delete"
												:aria-label="`Remove point ${index + 1}`"
												@click="removePoint(index)"
											>
												×
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<p
							v-if="!isActiveSeriesDerived && hiddenPointCount"
							class="inspector-help"
						>
							{{ hiddenPointCount.toLocaleString() }} additional
							points remain in the graph and exports. The table
							shows the first {{ MAX_TABLE_ROWS }} to keep editing
							responsive.
						</p>
						<button
							type="button"
							class="wide-button"
							@click="addPointAtCenter"
						>
							Add point
						</button>
					</section>

					<section class="inspector-section">
						<div class="inspector-heading">
							<div>
								<p class="graph-panel-kicker">Paste data</p>
								<h2>CSV or spreadsheet</h2>
							</div>
						</div>
						<label class="graph-field">
							Rows
							<textarea
								v-model="pastedData"
								rows="6"
								placeholder="Time,Measured,Reference&#10;0,82,80&#10;2,66,65"
							/>
						</label>
						<button
							type="button"
							class="wide-button"
							@click="importPastedData"
						>
							Import rows
						</button>
						<ul
							v-if="importWarnings.length"
							class="import-warnings"
						>
							<li
								v-for="warning in importWarnings"
								:key="warning"
							>
								{{ warning }}
							</li>
						</ul>
					</section>

					<section class="inspector-section">
						<p class="graph-panel-kicker">Equation</p>
						<h2>Plot a function</h2>
						<label class="graph-field graph-field--equation">
							<span>y =</span>
							<input
								v-model="expressionDraft"
								type="text"
								:maxlength="MAX_GRAPH_EXPRESSION_LENGTH"
								placeholder="sin(x) + 0.5x"
								@keydown.enter="plotFunction"
							/>
						</label>
						<button
							type="button"
							class="wide-button"
							@click="plotFunction"
						>
							Plot function
						</button>
						<p class="inspector-help">
							Supports +, −, ×, ÷, powers, implicit
							multiplication, pi, e, sin, cos, tan, sqrt, abs,
							log, ln, min, and max.
						</p>
					</section>
				</div>

				<div
					v-show="inspectorTab === 'style'"
					id="graph-inspector-panel-style"
					class="graph-inspector__body"
					role="tabpanel"
					tabindex="0"
					aria-labelledby="graph-inspector-tab-style"
				>
					<section v-if="activeSeries" class="inspector-section">
						<p class="graph-panel-kicker">Series inspector</p>
						<h2>{{ activeSeries.name }}</h2>

						<label class="graph-field">
							Name
							<input
								type="text"
								:value="activeSeries.name"
								@change="
									updateActiveSeries(
										'Renamed the active series.',
										series =>
											(series.name =
												inputText($event).trim() ||
												'Series')
									)
								"
							/>
						</label>
						<div class="graph-field-row">
							<label class="graph-field">
								Color
								<input
									type="color"
									:value="activeSeries.color.slice(0, 7)"
									@change="
										updateActiveSeries(
											'Changed the series color.',
											series =>
												(series.color =
													inputText($event))
										)
									"
								/>
							</label>
							<label class="graph-field">
								Visible
								<input
									type="checkbox"
									:checked="activeSeries.isVisible"
									@change="
										updateActiveSeries(
											'Toggled series visibility.',
											series =>
												(series.isVisible =
													inputChecked($event))
										)
									"
								/>
							</label>
						</div>
						<label class="graph-field">
							Connection
							<select
								:value="activeSeries.lineMode"
								@change="
									updateActiveSeries(
										'Changed the series connection.',
										series =>
											(series.lineMode = inputText(
												$event
											) as GraphLineMode)
									)
								"
							>
								<option value="none">No line</option>
								<option value="straight">Straight</option>
								<option value="step">Step</option>
								<option value="smooth">Smooth</option>
							</select>
						</label>
						<label class="graph-field">
							Line pattern
							<select
								:value="activeSeries.lineStyle"
								@change="
									updateActiveSeries(
										'Changed the line pattern.',
										series =>
											(series.lineStyle = inputText(
												$event
											) as GraphLineStyle)
									)
								"
							>
								<option value="none">None</option>
								<option value="solid">Solid</option>
								<option value="dashed">Dashed</option>
								<option value="dotted">Dotted</option>
								<option value="dashDot">Dash-dot</option>
							</select>
						</label>
						<label class="graph-field">
							Marker
							<select
								:value="activeSeries.markerShape"
								@change="
									updateActiveSeries(
										'Changed the point marker.',
										series =>
											(series.markerShape = inputText(
												$event
											) as GraphMarkerShape)
									)
								"
							>
								<option value="none">None</option>
								<option value="circle">Circle</option>
								<option value="square">Square</option>
								<option value="triangle">Triangle</option>
								<option value="diamond">Diamond</option>
								<option value="cross">Cross</option>
								<option value="plus">Plus</option>
							</select>
						</label>
						<div class="graph-field-row">
							<label class="graph-field">
								Line width
								<input
									type="number"
									min="0"
									max="20"
									step="0.5"
									:value="activeSeries.strokeWidth"
									@change="
										updateActiveSeries(
											'Changed the line width.',
											series =>
												(series.strokeWidth = Math.max(
													0,
													inputNumber($event)
												))
										)
									"
								/>
							</label>
							<label class="graph-field">
								Marker size
								<input
									type="number"
									min="0"
									max="40"
									step="1"
									:value="activeSeries.markerSize"
									@change="
										updateActiveSeries(
											'Changed the marker size.',
											series =>
												(series.markerSize = Math.max(
													0,
													inputNumber($event)
												))
										)
									"
								/>
							</label>
						</div>
						<label class="graph-field graph-field--check">
							<input
								type="checkbox"
								:checked="activeSeries.fillArea"
								@change="
									updateActiveSeries(
										'Toggled the area fill.',
										series =>
											(series.fillArea =
												inputChecked($event))
									)
								"
							/>
							Fill area to the axis
						</label>
						<button
							type="button"
							class="wide-button"
							@click="addBestFit"
						>
							Add linear best fit
						</button>
					</section>
				</div>

				<div
					v-show="inspectorTab === 'axes'"
					id="graph-inspector-panel-axes"
					class="graph-inspector__body"
					role="tabpanel"
					tabindex="0"
					aria-labelledby="graph-inspector-tab-axes"
				>
					<section
						v-for="dimension in ['x', 'y'] as const"
						:key="dimension"
						class="inspector-section"
					>
						<p class="graph-panel-kicker">{{ dimension }}-axis</p>
						<h2>
							{{
								dimension === "x"
									? graphDocument.xAxis.title
									: graphDocument.yAxis.title
							}}
						</h2>
						<label class="graph-field">
							Title
							<input
								type="text"
								:value="
									dimension === 'x'
										? graphDocument.xAxis.title
										: graphDocument.yAxis.title
								"
								@change="
									updateAxis(
										dimension,
										'title',
										inputText($event)
									)
								"
							/>
						</label>
						<div class="graph-field-row">
							<label class="graph-field">
								Minimum
								<input
									type="number"
									step="any"
									:value="
										dimension === 'x'
											? graphDocument.xAxis.minimum
											: graphDocument.yAxis.minimum
									"
									@change="
										updateAxis(
											dimension,
											'minimum',
											inputNumber($event)
										)
									"
								/>
							</label>
							<label class="graph-field">
								Maximum
								<input
									type="number"
									step="any"
									:value="
										dimension === 'x'
											? graphDocument.xAxis.maximum
											: graphDocument.yAxis.maximum
									"
									@change="
										updateAxis(
											dimension,
											'maximum',
											inputNumber($event)
										)
									"
								/>
							</label>
						</div>
						<label class="graph-field">
							Scale
							<select
								:value="
									dimension === 'x'
										? graphDocument.xAxis.scale
										: graphDocument.yAxis.scale
								"
								@change="
									updateAxis(
										dimension,
										'scale',
										inputText($event)
									)
								"
							>
								<option value="linear">Linear</option>
								<option value="logarithmic">Logarithmic</option>
							</select>
						</label>
						<label class="graph-field">
							Tick spacing (blank for automatic)
							<input
								type="number"
								min="0"
								step="any"
								:value="
									(dimension === 'x'
										? graphDocument.xAxis.tickSpacing
										: graphDocument.yAxis.tickSpacing) ?? ''
								"
								@change="
									updateAxis(
										dimension,
										'tickSpacing',
										inputText($event).trim()
											? inputNumber($event)
											: null
									)
								"
							/>
						</label>
						<label class="graph-field graph-field--check">
							<input
								type="checkbox"
								:checked="
									dimension === 'x'
										? graphDocument.xAxis.showGridLines
										: graphDocument.yAxis.showGridLines
								"
								@change="
									updateAxis(
										dimension,
										'showGridLines',
										inputChecked($event)
									)
								"
							/>
							Show grid lines
						</label>
						<label class="graph-field graph-field--check">
							<input
								type="checkbox"
								:checked="
									dimension === 'x'
										? graphDocument.xAxis.showTickLabels
										: graphDocument.yAxis.showTickLabels
								"
								@change="
									updateAxis(
										dimension,
										'showTickLabels',
										inputChecked($event)
									)
								"
							/>
							Show tick labels
						</label>
					</section>
					<button type="button" class="wide-button" @click="fitAxes">
						Fit both axes to data
					</button>
				</div>

				<div
					v-show="inspectorTab === 'graph'"
					id="graph-inspector-panel-graph"
					class="graph-inspector__body"
					role="tabpanel"
					tabindex="0"
					aria-labelledby="graph-inspector-tab-graph"
				>
					<section class="inspector-section">
						<p class="graph-panel-kicker">Document</p>
						<h2>Graph details</h2>
						<label class="graph-field">
							Title
							<input
								type="text"
								:value="graphDocument.title"
								@change="updateGraphTitle(inputText($event))"
							/>
						</label>
						<label class="graph-field">
							Description
							<textarea
								rows="3"
								:value="graphDocument.description"
								@change="
									updateGraphDescription(inputText($event))
								"
							/>
						</label>
						<div class="graph-field-row">
							<label class="graph-field">
								Background
								<input
									type="color"
									:value="
										graphDocument.canvas.backgroundColor.slice(
											0,
											7
										)
									"
									@change="
										commitMutation(
											'Changed the canvas background.',
											document =>
												(document.canvas.backgroundColor =
													inputText($event))
										)
									"
								/>
							</label>
							<label class="graph-field graph-field--check">
								<input
									type="checkbox"
									:checked="graphDocument.canvas.showLegend"
									@change="
										commitMutation(
											'Toggled the graph legend.',
											document =>
												(document.canvas.showLegend =
													inputChecked($event))
										)
									"
								/>
								Show legend
							</label>
						</div>
						<label class="graph-field">
							Legend position
							<select
								:value="graphDocument.canvas.legendPosition"
								@change="
									commitMutation(
										'Moved the graph legend.',
										document =>
											(document.canvas.legendPosition =
												inputText(
													$event
												) as GraphDocument['canvas']['legendPosition'])
									)
								"
							>
								<option value="topRight">Top right</option>
								<option value="topLeft">Top left</option>
								<option value="bottomRight">
									Bottom right
								</option>
								<option value="bottomLeft">Bottom left</option>
							</select>
						</label>
					</section>

					<section
						v-if="selectedAnnotation"
						class="inspector-section"
					>
						<div class="inspector-heading">
							<div>
								<p class="graph-panel-kicker">
									Selected annotation
								</p>
								<h2>{{ selectedAnnotation.kind }}</h2>
							</div>
							<button
								type="button"
								class="mini-button mini-button--danger"
								@click="deleteSelection"
							>
								Delete
							</button>
						</div>
						<label
							v-if="selectedAnnotation.kind === 'text'"
							class="graph-field"
						>
							Text
							<textarea
								rows="3"
								:value="selectedAnnotation.text"
								@change="
									updateAnnotation('text', inputText($event))
								"
							/>
						</label>
						<div class="graph-field-row">
							<label class="graph-field">
								Color
								<input
									type="color"
									:value="
										selectedAnnotation.color.slice(0, 7)
									"
									@change="
										updateAnnotation(
											'color',
											inputText($event)
										)
									"
								/>
							</label>
							<label
								v-if="selectedAnnotation.kind === 'text'"
								class="graph-field"
							>
								Font size
								<input
									type="number"
									min="6"
									max="120"
									:value="selectedAnnotation.fontSize"
									@change="
										updateAnnotation(
											'fontSize',
											inputNumber($event)
										)
									"
								/>
							</label>
						</div>
					</section>

					<section class="inspector-section source-note">
						<p class="graph-panel-kicker">Open-source lineage</p>
						<h2>Independent browser adaptation</h2>
						<p>
							Based on GraphSketcher’s open interaction model and
							the portable document format used by the maintained
							Avalonia desktop port. All rendering, imports, and
							exports run in this browser.
						</p>
						<div class="source-links">
							<a
								href="https://github.com/graphsketcher/GraphSketcher"
								target="_blank"
								rel="noopener noreferrer"
							>
								Original source
							</a>
							<a
								href="https://github.com/Jacoba1100254352/GraphSketcher.Linux"
								target="_blank"
								rel="noopener noreferrer"
							>
								Linux desktop port
							</a>
							<a
								href="/licenses/graphsketcher-omni-source-license.txt"
								target="_blank"
								rel="noopener noreferrer"
							>
								Omni Source License
							</a>
						</div>
					</section>
				</div>
			</aside>
		</div>
	</section>
</template>

<style scoped>
.graph-sketcher-page {
	--graph-border: rgba(15, 23, 42, 0.14);
	--graph-border-strong: rgba(31, 92, 145, 0.3);
	--graph-panel: rgba(255, 255, 255, 0.92);
	--graph-panel-soft: rgba(248, 250, 252, 0.84);
	--graph-inset: #eef3f8;
	--graph-text: #102235;
	--graph-text-soft: #52677d;
	--graph-accent: #1f5c91;
	--graph-accent-soft: rgba(31, 92, 145, 0.1);
	width: min(1800px, calc(100% - 1.5rem));
	margin-inline: auto;
	padding: clamp(1rem, 2vw, 1.8rem) 0 clamp(2.5rem, 4vw, 4rem);
	display: grid;
	gap: 1rem;
	color: var(--graph-text);
}

.graph-header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1.25rem 2rem;
	padding: clamp(1.25rem, 2vw, 1.8rem);
}

.graph-header__copy {
	display: grid;
	gap: 0.55rem;
	max-width: 48rem;
}

.graph-header__copy h1 {
	font-size: clamp(2rem, 4vw, 3.3rem);
}

.graph-header__copy > p:last-child {
	color: var(--graph-text-soft);
	line-height: 1.65;
}

.graph-document-actions,
.graph-export-menu {
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem;
}

.graph-document-actions {
	justify-content: flex-end;
}

.graph-export-menu {
	padding-left: 0.55rem;
	border-left: 1px solid var(--graph-border);
}

.graph-button,
.mini-button,
.wide-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 1px solid var(--graph-border);
	border-radius: 10px;
	background: var(--graph-panel);
	color: var(--graph-text);
	font-weight: 700;
	line-height: 1.2;
	transition:
		border-color 0.16s ease,
		background-color 0.16s ease,
		transform 0.16s ease;
}

.graph-button {
	min-height: 2.75rem;
	padding: 0.65rem 0.85rem;
}

.graph-button--danger {
	border-color: #fecaca;
	color: #b91c1c;
}

.graph-button:hover,
.mini-button:hover,
.wide-button:hover {
	border-color: var(--graph-border-strong);
	background: var(--graph-accent-soft);
	transform: translateY(-1px);
}

.graph-workspace {
	min-height: min(76vh, 920px);
	overflow: hidden;
	display: grid;
	grid-template-columns: minmax(10.5rem, 0.55fr) minmax(34rem, 3.4fr) minmax(
			20rem,
			1.15fr
		);
	background: var(--graph-panel);
}

.graph-tools,
.graph-inspector {
	background: var(--graph-panel-soft);
}

.graph-tools {
	padding: 1rem;
	border-right: 1px solid var(--graph-border);
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.graph-tools__history,
.graph-tools__zoom {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.5rem;
}

.graph-tools__zoom {
	grid-template-columns: 1fr;
}

.graph-tools__list {
	display: grid;
	gap: 0.45rem;
}

.graph-tool {
	min-height: 3rem;
	padding: 0.55rem 0.75rem;
	border: 1px solid transparent;
	border-radius: 11px;
	display: flex;
	align-items: center;
	gap: 0.7rem;
	background: transparent;
	color: var(--graph-text);
	font-weight: 700;
	text-align: left;
}

.graph-tool:hover {
	background: var(--graph-accent-soft);
}

.graph-tool.is-active {
	border-color: var(--graph-border-strong);
	background: var(--graph-accent-soft);
	color: var(--graph-accent);
}

.graph-tool:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}

.graph-tool__icon {
	width: 1.45rem;
	display: inline-grid;
	place-items: center;
	font-size: 1.15rem;
}

.graph-tool--compact {
	min-height: 2.6rem;
	padding: 0.5rem 0.6rem;
	gap: 0.45rem;
	font-size: 0.88rem;
}

.graph-tool-draft,
.graph-field {
	display: grid;
	gap: 0.38rem;
	color: var(--graph-text-soft);
	font-size: 0.82rem;
	font-weight: 700;
}

.graph-tool-draft input,
.graph-field input:not([type="checkbox"]),
.graph-field select,
.graph-field textarea {
	width: 100%;
	min-height: 2.55rem;
	padding: 0.58rem 0.68rem;
	border: 1px solid var(--graph-border);
	border-radius: 9px;
	background: var(--graph-panel);
	color: var(--graph-text);
	font-weight: 500;
}

.graph-field textarea {
	resize: vertical;
	line-height: 1.45;
}

.graph-tools__hint,
.inspector-help {
	color: var(--graph-text-soft);
	font-size: 0.78rem;
	line-height: 1.55;
}

.graph-tools__hint {
	margin-top: auto;
}

.graph-canvas-panel {
	min-width: 0;
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	background: var(--graph-inset);
}

.graph-canvas-toolbar {
	min-height: 4.4rem;
	padding: 0.85rem 1rem;
	border-bottom: 1px solid var(--graph-border);
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	background: var(--graph-panel);
}

.graph-canvas-toolbar > div {
	display: grid;
	gap: 0.2rem;
}

.graph-canvas-toolbar h2,
.inspector-section h2 {
	font-family: var(--font-sans);
	font-size: 1.05rem;
	font-weight: 750;
	letter-spacing: -0.01em;
}

.graph-canvas-toolbar > p {
	color: var(--graph-text-soft);
	font-size: 0.82rem;
	font-variant-numeric: tabular-nums;
}

.graph-panel-kicker {
	color: var(--graph-accent);
	font-size: 0.7rem;
	font-weight: 800;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.graph-canvas-shell {
	min-height: 0;
	padding: clamp(0.75rem, 1.4vw, 1.25rem);
	display: grid;
	place-items: center;
	overflow: auto;
}

.graph-canvas {
	width: 100%;
	max-height: 100%;
	aspect-ratio: 3 / 2;
	border: 1px solid rgba(15, 23, 42, 0.16);
	border-radius: 8px;
	box-shadow: 0 20px 42px -34px rgba(15, 23, 42, 0.44);
	background: #fff;
	touch-action: none;
	user-select: none;
}

.graph-canvas.tool-point,
.graph-canvas.tool-text {
	cursor: crosshair;
}

.graph-canvas.tool-draw {
	cursor: cell;
}

.graph-canvas.tool-pan {
	cursor: grab;
}

.graph-canvas.tool-pan:active {
	cursor: grabbing;
}

.graph-canvas text {
	font-family: "Avenir Next", "Segoe UI", Arial, sans-serif;
	fill: #1f2937;
	font-size: 12px;
	pointer-events: none;
}

.graph-canvas__title {
	font-size: 20px !important;
	font-weight: 650;
}

.graph-grid line {
	stroke: #d7dde5;
	stroke-width: 1;
}

.graph-axes line {
	stroke: #334155;
	stroke-width: 1.5;
}

.graph-axis-title {
	font-size: 14px !important;
	font-weight: 600;
}

.graph-series__area {
	fill-opacity: 0.18;
	pointer-events: none;
}

.graph-series__line {
	stroke-linecap: round;
	stroke-linejoin: round;
	pointer-events: none;
}

.graph-point {
	cursor: pointer;
}

.graph-point__hit {
	fill: transparent;
	stroke: transparent;
}

.graph-point.is-selected .graph-point__hit {
	stroke: #0f766e;
	stroke-width: 2;
	stroke-dasharray: 3 3;
}

.graph-point__label {
	font-size: 12px !important;
}

.graph-error-bars {
	stroke-width: 1.25;
	pointer-events: none;
}

.graph-annotation {
	cursor: move;
}

.graph-annotation.is-selected > :first-child {
	filter: drop-shadow(0 0 2px #0f766e);
	stroke-dasharray: 3 2;
}

#interactive-graph-arrow path {
	fill: context-stroke;
}

.graph-legend {
	cursor: pointer;
}

.graph-legend rect {
	fill: #fff;
	fill-opacity: 0.92;
	stroke: #cbd5e1;
}

.graph-sampling-notice {
	margin: 0;
	padding: 0.55rem 1rem;
	border-top: 1px solid var(--graph-border);
	background: #fffbeb;
	color: #92400e;
	font-size: 0.78rem;
	line-height: 1.5;
}

.graph-status {
	min-height: 2.8rem;
	padding: 0.62rem 1rem;
	border-top: 1px solid var(--graph-border);
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	background: var(--graph-panel);
	color: var(--graph-text-soft);
	font-size: 0.78rem;
}

.graph-status span:last-child {
	flex: 0 0 auto;
	color: #047857;
	font-weight: 700;
}

.graph-inspector {
	min-width: 0;
	border-left: 1px solid var(--graph-border);
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
}

.graph-inspector__tabs {
	padding: 0.65rem;
	border-bottom: 1px solid var(--graph-border);
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 0.3rem;
}

.graph-inspector__tabs button {
	min-height: 2.4rem;
	padding: 0.45rem 0.3rem;
	border-radius: 8px;
	color: var(--graph-text-soft);
	font-size: 0.8rem;
	font-weight: 750;
}

.graph-inspector__tabs button:hover,
.graph-inspector__tabs button.is-active {
	background: var(--graph-accent-soft);
	color: var(--graph-accent);
}

.graph-inspector__body {
	min-height: 0;
	overflow-y: auto;
	padding: 1rem;
	display: grid;
	align-content: start;
	gap: 1rem;
}

.inspector-section {
	padding: 0.95rem;
	border: 1px solid var(--graph-border);
	border-radius: 13px;
	display: grid;
	gap: 0.8rem;
	background: var(--graph-panel);
}

.inspector-heading {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 0.7rem;
}

.inspector-heading > div {
	display: grid;
	gap: 0.22rem;
}

.mini-button {
	min-height: 2.2rem;
	padding: 0.42rem 0.62rem;
	font-size: 0.76rem;
}

.mini-button--danger,
.table-delete {
	color: #b42318;
}

.mini-button-row {
	display: flex;
	gap: 0.45rem;
}

.wide-button {
	width: 100%;
	min-height: 2.6rem;
	padding: 0.58rem 0.75rem;
}

.graph-field-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.65rem;
}

.graph-field--check {
	display: flex;
	align-items: center;
	gap: 0.55rem;
	color: var(--graph-text);
}

.graph-field--check input {
	width: 1.05rem;
	height: 1.05rem;
	accent-color: var(--graph-accent);
}

.graph-field input[type="color"] {
	padding: 0.2rem;
}

.graph-field--equation {
	grid-template-columns: auto minmax(0, 1fr);
	align-items: center;
}

.graph-field--equation span {
	font-size: 1rem;
}

.graph-data-table-shell {
	max-height: 19rem;
	overflow: auto;
	border: 1px solid var(--graph-border);
	border-radius: 9px;
	background: var(--graph-panel);
}

.graph-data-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.72rem;
	font-variant-numeric: tabular-nums;
}

.graph-data-table th {
	position: sticky;
	top: 0;
	z-index: 1;
	padding: 0.42rem;
	background: #e9eff5;
	color: var(--graph-text-soft);
	text-align: left;
}

.graph-data-table td {
	padding: 0.25rem;
	border-top: 1px solid var(--graph-border);
}

.graph-data-table input {
	width: 100%;
	min-width: 3.6rem;
	padding: 0.35rem;
	border: 1px solid transparent;
	border-radius: 5px;
	background: transparent;
	color: var(--graph-text);
}

.graph-data-table input:focus {
	border-color: var(--graph-border-strong);
	background: var(--graph-panel);
}

.table-delete {
	width: 1.8rem;
	height: 1.8rem;
	border-radius: 6px;
	font-size: 1.1rem;
}

.table-delete:hover {
	background: rgba(180, 35, 24, 0.09);
}

.formula-card {
	padding: 0.7rem;
	border-radius: 9px;
	background: var(--graph-accent-soft);
	color: var(--graph-text-soft);
	line-height: 1.5;
}

.formula-card code {
	color: var(--graph-accent);
}

.import-warnings {
	margin: 0;
	padding-left: 1.1rem;
	display: grid;
	gap: 0.35rem;
	color: #9a3412;
	font-size: 0.75rem;
	line-height: 1.45;
}

.source-note p:not(.graph-panel-kicker) {
	color: var(--graph-text-soft);
	font-size: 0.82rem;
	line-height: 1.55;
}

.source-links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem 0.75rem;
}

.source-links a {
	color: var(--graph-accent);
	font-size: 0.78rem;
	font-weight: 700;
	text-decoration: none;
}

.source-links a:hover {
	text-decoration: underline;
}

:global(html.dark .graph-sketcher-page) {
	--graph-border: rgba(148, 163, 184, 0.25);
	--graph-border-strong: rgba(125, 211, 252, 0.44);
	--graph-panel: #0f192a;
	--graph-panel-soft: #111d30;
	--graph-inset: #08111f;
	--graph-text: #f4f8ff;
	--graph-text-soft: #b9c9da;
	--graph-accent: #7dd3fc;
	--graph-accent-soft: rgba(125, 211, 252, 0.13);
}

:global(html.dark .graph-sketcher-page .graph-data-table th) {
	background: #17263c;
}

:global(html.dark .graph-sketcher-page .graph-status span:last-child) {
	color: #6ee7b7;
}

:global(html.dark .graph-sketcher-page .graph-sampling-notice) {
	background: #29210c;
	color: #fde68a;
}

:global(html.dark .graph-sketcher-page .graph-button--danger) {
	border-color: rgba(252, 165, 165, 0.5);
	color: #fca5a5;
}

:global(html.dark .graph-sketcher-page .import-warnings) {
	color: #fdba74;
}

:global(html.dark .graph-sketcher-page .mini-button--danger),
:global(html.dark .graph-sketcher-page .table-delete) {
	color: #fca5a5;
}

@media (max-width: 1280px) {
	.graph-workspace {
		grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.48fr);
	}

	.graph-tools {
		grid-column: 1 / -1;
		padding: 0.7rem;
		border-right: 0;
		border-bottom: 1px solid var(--graph-border);
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
	}

	.graph-tools__history,
	.graph-tools__zoom {
		display: flex;
	}

	.graph-tools__list {
		display: flex;
		justify-content: center;
	}

	.graph-tool {
		min-height: 2.6rem;
	}

	.graph-tools__hint,
	.graph-tool-draft {
		display: none;
	}
}

@media (max-width: 900px) {
	.graph-header {
		align-items: stretch;
		flex-direction: column;
	}

	.graph-document-actions {
		justify-content: flex-start;
	}

	.graph-workspace {
		display: flex;
		flex-direction: column;
	}

	.graph-tools {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
	}

	.graph-tools__list,
	.graph-tools__history,
	.graph-tools__zoom {
		display: flex;
		flex: 0 0 auto;
	}

	.graph-canvas-panel {
		min-height: 34rem;
	}

	.graph-inspector {
		border-top: 1px solid var(--graph-border);
		border-left: 0;
	}

	.graph-inspector__body {
		max-height: none;
		overflow: visible;
	}
}

@media (max-width: 600px) {
	.graph-sketcher-page {
		width: min(100% - 0.75rem, 1800px);
	}

	.graph-header {
		border-radius: 16px;
	}

	.graph-export-menu {
		padding-top: 0.55rem;
		padding-left: 0;
		border-top: 1px solid var(--graph-border);
		border-left: 0;
	}

	.graph-canvas-panel {
		min-height: 25rem;
	}

	.graph-canvas-toolbar {
		align-items: flex-start;
		flex-direction: column;
	}

	.graph-status {
		align-items: flex-start;
		flex-direction: column;
		gap: 0.25rem;
	}

	.graph-field-row {
		grid-template-columns: 1fr;
	}
}

@media (prefers-reduced-motion: reduce) {
	.graph-button,
	.mini-button,
	.wide-button {
		transition: none;
	}
}

@media print {
	.graph-header,
	.graph-tools,
	.graph-inspector,
	.graph-canvas-toolbar,
	.graph-status {
		display: none !important;
	}

	.graph-sketcher-page,
	.graph-workspace,
	.graph-canvas-panel,
	.graph-canvas-shell {
		width: 100%;
		min-height: 0;
		padding: 0;
		border: 0;
		box-shadow: none;
		background: transparent;
	}
}
</style>
