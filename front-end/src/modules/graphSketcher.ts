export type GraphAxisScale = "linear" | "logarithmic";
export type GraphLineStyle = "none" | "solid" | "dashed" | "dotted" | "dashDot";
export type GraphLineMode = "none" | "straight" | "step" | "smooth";
export type GraphMarkerShape =
	"none" | "circle" | "square" | "triangle" | "diamond" | "cross" | "plus";
export type GraphLegendPosition =
	"topRight" | "topLeft" | "bottomRight" | "bottomLeft";
export type GraphAnnotationKind =
	"text" | "line" | "arrow" | "rectangle" | "ellipse";
export type GraphAnnotationCoordinateSpace = "data" | "canvas";
export type GraphSeriesSourceKind =
	"data" | "function" | "freehand" | "bestFit";

export interface GraphCanvasSettings {
	width: number;
	height: number;
	paddingLeft: number;
	paddingTop: number;
	paddingRight: number;
	paddingBottom: number;
	backgroundColor: string;
	showLegend: boolean;
	legendPosition: GraphLegendPosition;
}

export interface GraphAxisSettings {
	title: string;
	scale: GraphAxisScale;
	minimum: number;
	maximum: number;
	isReversed: boolean;
	showGridLines: boolean;
	showAxisLine: boolean;
	showTickLabels: boolean;
	desiredTickCount: number;
	numberFormat: string;
	logarithmBase: number;
	tickSpacing: number | null;
}

export interface GraphDataPoint {
	x: number;
	y: number;
	label?: string;
	xError?: number;
	yError?: number;
	breakBefore?: boolean;
}

export interface GraphSeries {
	id: string;
	name: string;
	isVisible: boolean;
	lineStyle: GraphLineStyle;
	lineMode: GraphLineMode;
	markerShape: GraphMarkerShape;
	color: string;
	strokeWidth: number;
	markerSize: number;
	fillArea: boolean;
	points: GraphDataPoint[];
	sourceKind?: GraphSeriesSourceKind;
	sourceExpression?: string;
	sourceSeriesId?: string;
}

export interface GraphAnnotation {
	id: string;
	kind: GraphAnnotationKind;
	coordinateSpace: GraphAnnotationCoordinateSpace;
	x: number;
	y: number;
	x2?: number;
	y2?: number;
	text: string;
	color: string;
	fillColor: string;
	strokeWidth: number;
	fontSize: number;
}

export interface GraphDocument {
	schemaVersion: 1;
	title: string;
	description?: string;
	canvas: GraphCanvasSettings;
	xAxis: GraphAxisSettings;
	yAxis: GraphAxisSettings;
	series: GraphSeries[];
	annotations: GraphAnnotation[];
}

export interface GraphPlotBounds {
	left: number;
	top: number;
	right: number;
	bottom: number;
	width: number;
	height: number;
}

export interface GraphAxisTick {
	value: number;
	label: string;
	position: number;
}

export interface GraphRegression {
	slope: number;
	intercept: number;
	rSquared: number;
}

export const GRAPH_DOCUMENT_EXTENSION = ".graphsketch";
export const MAX_GRAPH_DOCUMENT_BYTES = 8 * 1024 * 1024;
export const MAX_GRAPH_SERIES = 128;
export const MAX_GRAPH_POINTS = 100_000;
export const MAX_GRAPH_ANNOTATIONS = 2_000;
export const MAX_GRAPH_EXPRESSION_LENGTH = 512;
export const MAX_GRAPH_EXPRESSION_TOKENS = 256;
export const MAX_GRAPH_EXPRESSION_DEPTH = 32;

const DEFAULT_SERIES_COLORS = [
	"#2563eb",
	"#dc2626",
	"#059669",
	"#9333ea",
	"#ea580c",
	"#0891b2",
	"#4f46e5",
	"#be123c"
];
const HEX_COLOR_RE = /^#[\da-f]{6}(?:[\da-f]{2})?$/i;
const GRAPH_ID_RE = /[^\w-]+/g;

const defaultCanvas: GraphCanvasSettings = {
	width: 960,
	height: 640,
	paddingLeft: 78,
	paddingTop: 54,
	paddingRight: 34,
	paddingBottom: 74,
	backgroundColor: "#ffffff",
	showLegend: true,
	legendPosition: "topRight"
};

const defaultXAxis: GraphAxisSettings = {
	title: "x",
	scale: "linear",
	minimum: -10,
	maximum: 10,
	isReversed: false,
	showGridLines: true,
	showAxisLine: true,
	showTickLabels: true,
	desiredTickCount: 9,
	numberFormat: "G4",
	logarithmBase: 10,
	tickSpacing: null
};

const defaultYAxis: GraphAxisSettings = {
	...defaultXAxis,
	title: "y",
	minimum: -10,
	maximum: 10,
	desiredTickCount: 9
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function finiteNumber(value: unknown, fallback: number) {
	const parsed =
		typeof value === "number"
			? value
			: typeof value === "string" && value.trim()
				? Number(value)
				: Number.NaN;
	return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalFiniteNumber(value: unknown) {
	if (value === undefined || value === null || value === "") return undefined;
	const parsed = finiteNumber(value, Number.NaN);
	return Number.isFinite(parsed) ? parsed : undefined;
}

function boundedNumber(
	value: unknown,
	fallback: number,
	minimum: number,
	maximum: number
) {
	return Math.min(maximum, Math.max(minimum, finiteNumber(value, fallback)));
}

function booleanValue(value: unknown, fallback: boolean) {
	return typeof value === "boolean" ? value : fallback;
}

function stringValue(value: unknown, fallback: string, maximumLength: number) {
	if (typeof value !== "string") return fallback;
	const normalized = value.trim();
	return normalized ? normalized.slice(0, maximumLength) : fallback;
}

function optionalString(value: unknown, maximumLength: number) {
	if (typeof value !== "string") return undefined;
	const normalized = value.trim();
	return normalized ? normalized.slice(0, maximumLength) : undefined;
}

function enumValue<T extends string>(
	value: unknown,
	allowed: readonly T[],
	fallback: T
) {
	return typeof value === "string" && allowed.includes(value as T)
		? (value as T)
		: fallback;
}

function colorValue(value: unknown, fallback: string) {
	if (typeof value !== "string") return fallback;
	const normalized = value.trim();
	return HEX_COLOR_RE.test(normalized) ? normalized.toLowerCase() : fallback;
}

function uniqueId(
	value: unknown,
	prefix: string,
	usedIds: Set<string>,
	index: number
) {
	const requested =
		typeof value === "string"
			? value
					.trim()
					.slice(0, 128)
					.replace(GRAPH_ID_RE, "-")
					.replace(/^-+|-+$/g, "")
			: "";
	const base = requested || `${prefix}-${index + 1}`;
	let candidate = base;
	let suffix = 2;

	while (usedIds.has(candidate)) {
		candidate = `${base}-${suffix}`;
		suffix += 1;
	}
	usedIds.add(candidate);
	return candidate;
}

function normalizeAxis(
	value: unknown,
	defaults: GraphAxisSettings
): GraphAxisSettings {
	const source = isRecord(value) ? value : {};
	const scale = enumValue(
		source.scale,
		["linear", "logarithmic"] as const,
		defaults.scale
	);
	let minimum = finiteNumber(source.minimum, defaults.minimum);
	let maximum = finiteNumber(source.maximum, defaults.maximum);

	if (minimum >= maximum) {
		minimum = defaults.minimum;
		maximum = defaults.maximum;
	}
	if (scale === "logarithmic" && minimum <= 0) {
		minimum = Math.max(
			Number.MIN_VALUE,
			defaults.minimum > 0 ? defaults.minimum : 0.1
		);
		maximum = Math.max(maximum, minimum * 10);
	}

	const rawTickSpacing = optionalFiniteNumber(source.tickSpacing);
	return {
		title:
			typeof source.title === "string"
				? source.title.trim().slice(0, 512)
				: defaults.title,
		scale,
		minimum,
		maximum,
		isReversed: booleanValue(source.isReversed, defaults.isReversed),
		showGridLines: booleanValue(
			source.showGridLines,
			defaults.showGridLines
		),
		showAxisLine: booleanValue(source.showAxisLine, defaults.showAxisLine),
		showTickLabels: booleanValue(
			source.showTickLabels,
			defaults.showTickLabels
		),
		desiredTickCount: Math.round(
			boundedNumber(
				source.desiredTickCount,
				defaults.desiredTickCount,
				2,
				30
			)
		),
		numberFormat: stringValue(
			source.numberFormat,
			defaults.numberFormat,
			32
		),
		logarithmBase: boundedNumber(
			source.logarithmBase,
			defaults.logarithmBase,
			2,
			16
		),
		tickSpacing:
			rawTickSpacing !== undefined && rawTickSpacing > 0
				? rawTickSpacing
				: null
	};
}

function normalizePoint(value: unknown): GraphDataPoint | null {
	if (!isRecord(value)) return null;
	const x = optionalFiniteNumber(value.x);
	const y = optionalFiniteNumber(value.y);
	if (x === undefined || y === undefined) return null;

	const point: GraphDataPoint = { x, y };
	const label = optionalString(value.label, 2_048);
	const xError = optionalFiniteNumber(value.xError);
	const yError = optionalFiniteNumber(value.yError);
	if (label) point.label = label;
	if (xError !== undefined && xError >= 0) point.xError = xError;
	if (yError !== undefined && yError >= 0) point.yError = yError;
	if (value.breakBefore === true) point.breakBefore = true;
	return point;
}

function normalizeSeries(
	value: unknown,
	index: number,
	usedIds: Set<string>,
	remainingPointCount: number
) {
	const source = isRecord(value) ? value : {};
	const rawPoints = Array.isArray(source.points) ? source.points : [];
	const points = rawPoints
		.slice(0, remainingPointCount)
		.map(normalizePoint)
		.filter((point): point is GraphDataPoint => Boolean(point));
	const sourceKind = enumValue(
		source.sourceKind,
		["data", "function", "freehand", "bestFit"] as const,
		"data"
	);
	const series: GraphSeries = {
		id: uniqueId(source.id, "series", usedIds, index),
		name: stringValue(source.name, `Series ${index + 1}`, 512),
		isVisible: booleanValue(source.isVisible, true),
		lineStyle: enumValue(
			source.lineStyle,
			["none", "solid", "dashed", "dotted", "dashDot"] as const,
			"solid"
		),
		lineMode: enumValue(
			source.lineMode,
			["none", "straight", "step", "smooth"] as const,
			"straight"
		),
		markerShape: enumValue(
			source.markerShape,
			[
				"none",
				"circle",
				"square",
				"triangle",
				"diamond",
				"cross",
				"plus"
			] as const,
			"circle"
		),
		color: colorValue(
			source.color,
			DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length]
		),
		strokeWidth: boundedNumber(source.strokeWidth, 2, 0, 20),
		markerSize: boundedNumber(source.markerSize, 7, 0, 40),
		fillArea: booleanValue(source.fillArea, false),
		points
	};

	if (sourceKind !== "data") series.sourceKind = sourceKind;
	const sourceExpression = optionalString(source.sourceExpression, 512);
	const sourceSeriesId = optionalString(source.sourceSeriesId, 128);
	if (sourceExpression) series.sourceExpression = sourceExpression;
	if (sourceSeriesId) series.sourceSeriesId = sourceSeriesId;
	return series;
}

function normalizeAnnotation(
	value: unknown,
	index: number,
	usedIds: Set<string>
): GraphAnnotation | null {
	if (!isRecord(value)) return null;
	const x = optionalFiniteNumber(value.x);
	const y = optionalFiniteNumber(value.y);
	if (x === undefined || y === undefined) return null;
	const kind = enumValue(
		value.kind,
		["text", "line", "arrow", "rectangle", "ellipse"] as const,
		"text"
	);
	const annotation: GraphAnnotation = {
		id: uniqueId(value.id, "annotation", usedIds, index),
		kind,
		coordinateSpace: enumValue(
			value.coordinateSpace,
			["data", "canvas"] as const,
			"data"
		),
		x,
		y,
		text:
			typeof value.text === "string"
				? value.text.slice(0, 8_192)
				: kind === "text"
					? "Label"
					: "",
		color: colorValue(value.color, "#111827"),
		fillColor: colorValue(value.fillColor, "#00000000"),
		strokeWidth: boundedNumber(value.strokeWidth, 1.5, 0, 20),
		fontSize: boundedNumber(value.fontSize, 14, 6, 120)
	};
	const x2 = optionalFiniteNumber(value.x2);
	const y2 = optionalFiniteNumber(value.y2);
	if (x2 !== undefined) annotation.x2 = x2;
	if (y2 !== undefined) annotation.y2 = y2;
	if (kind !== "text" && (x2 === undefined || y2 === undefined)) return null;
	return annotation;
}

export function createGraphId(prefix: string) {
	const safePrefix =
		prefix
			.toLowerCase()
			.replace(GRAPH_ID_RE, "-")
			.replace(/^-+|-+$/g, "") || "item";
	const randomPart =
		typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
			? crypto.randomUUID().replace(/-/g, "")
			: `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
	return `${safePrefix}-${randomPart.slice(0, 16)}`;
}

export function createGraphSeries(
	name = "Series 1",
	color = DEFAULT_SERIES_COLORS[0]
): GraphSeries {
	return {
		id: createGraphId("series"),
		name,
		isVisible: true,
		lineStyle: "solid",
		lineMode: "straight",
		markerShape: "circle",
		color,
		strokeWidth: 2,
		markerSize: 7,
		fillArea: false,
		points: []
	};
}

export function createBlankGraphDocument(): GraphDocument {
	return {
		schemaVersion: 1,
		title: "Untitled Graph",
		description: "",
		canvas: { ...defaultCanvas },
		xAxis: { ...defaultXAxis },
		yAxis: { ...defaultYAxis },
		series: [createGraphSeries()],
		annotations: []
	};
}

export function createSampleGraphDocument(): GraphDocument {
	return normalizeGraphDocument({
		schemaVersion: 1,
		title: "Cooling Experiment",
		description:
			"A sample graph with editable points, error bars, a smooth reference curve, and a note.",
		canvas: {
			...defaultCanvas,
			showLegend: true
		},
		xAxis: {
			...defaultXAxis,
			title: "Time (minutes)",
			minimum: 0,
			maximum: 12,
			tickSpacing: 2
		},
		yAxis: {
			...defaultYAxis,
			title: "Temperature (°C)",
			minimum: 15,
			maximum: 90,
			tickSpacing: 15
		},
		series: [
			{
				id: "experiment",
				name: "Measured",
				isVisible: true,
				lineStyle: "solid",
				lineMode: "smooth",
				markerShape: "circle",
				color: "#2563eb",
				strokeWidth: 2.5,
				markerSize: 7,
				fillArea: false,
				points: [
					{ x: 0, y: 82, yError: 2, label: "start" },
					{ x: 2, y: 66, yError: 2.5 },
					{ x: 4, y: 53, yError: 2 },
					{ x: 6, y: 43, yError: 1.5 },
					{ x: 8, y: 35, yError: 1.5 },
					{ x: 10, y: 29, yError: 1 }
				]
			},
			{
				id: "reference",
				name: "Reference model",
				isVisible: true,
				lineStyle: "dashed",
				lineMode: "smooth",
				markerShape: "none",
				color: "#dc2626",
				strokeWidth: 2,
				markerSize: 6,
				fillArea: false,
				points: [
					{ x: 0, y: 80 },
					{ x: 2, y: 65 },
					{ x: 4, y: 52 },
					{ x: 6, y: 42 },
					{ x: 8, y: 34 },
					{ x: 10, y: 28 }
				]
			}
		],
		annotations: [
			{
				id: "room-temperature-note",
				kind: "text",
				coordinateSpace: "data",
				x: 7.8,
				y: 21,
				text: "Room temperature",
				color: "#4b5563",
				fillColor: "#00000000",
				strokeWidth: 1.5,
				fontSize: 13
			}
		]
	});
}

export function normalizeGraphDocument(value: unknown): GraphDocument {
	if (!isRecord(value)) {
		throw new Error("The graph project does not contain a valid document.");
	}
	const schemaVersion = finiteNumber(value.schemaVersion, 1);
	if (schemaVersion !== 1) {
		throw new Error(
			`Graph project version ${schemaVersion} is not supported by this editor.`
		);
	}

	const canvasSource = isRecord(value.canvas) ? value.canvas : {};
	const canvas: GraphCanvasSettings = {
		width: boundedNumber(
			canvasSource.width,
			defaultCanvas.width,
			320,
			4_096
		),
		height: boundedNumber(
			canvasSource.height,
			defaultCanvas.height,
			240,
			4_096
		),
		paddingLeft: boundedNumber(
			canvasSource.paddingLeft,
			defaultCanvas.paddingLeft,
			0,
			1_024
		),
		paddingTop: boundedNumber(
			canvasSource.paddingTop,
			defaultCanvas.paddingTop,
			0,
			1_024
		),
		paddingRight: boundedNumber(
			canvasSource.paddingRight,
			defaultCanvas.paddingRight,
			0,
			1_024
		),
		paddingBottom: boundedNumber(
			canvasSource.paddingBottom,
			defaultCanvas.paddingBottom,
			0,
			1_024
		),
		backgroundColor: colorValue(
			canvasSource.backgroundColor,
			defaultCanvas.backgroundColor
		),
		showLegend: booleanValue(
			canvasSource.showLegend,
			defaultCanvas.showLegend
		),
		legendPosition: enumValue(
			canvasSource.legendPosition,
			["topRight", "topLeft", "bottomRight", "bottomLeft"] as const,
			defaultCanvas.legendPosition
		)
	};
	if (
		canvas.paddingLeft + canvas.paddingRight >= canvas.width - 40 ||
		canvas.paddingTop + canvas.paddingBottom >= canvas.height - 40
	) {
		canvas.paddingLeft = defaultCanvas.paddingLeft;
		canvas.paddingRight = defaultCanvas.paddingRight;
		canvas.paddingTop = defaultCanvas.paddingTop;
		canvas.paddingBottom = defaultCanvas.paddingBottom;
	}

	const rawSeries = Array.isArray(value.series) ? value.series : [];
	const seriesIds = new Set<string>();
	const series: GraphSeries[] = [];
	let remainingPointCount = MAX_GRAPH_POINTS;
	for (const [index, raw] of rawSeries.slice(0, MAX_GRAPH_SERIES).entries()) {
		const normalized = normalizeSeries(
			raw,
			index,
			seriesIds,
			remainingPointCount
		);
		remainingPointCount -= normalized.points.length;
		series.push(normalized);
		if (remainingPointCount <= 0) break;
	}
	if (!series.length) series.push(createGraphSeries());

	const annotationIds = new Set<string>();
	const rawAnnotations = Array.isArray(value.annotations)
		? value.annotations
		: [];
	const annotations = rawAnnotations
		.slice(0, MAX_GRAPH_ANNOTATIONS)
		.map((annotation, index) =>
			normalizeAnnotation(annotation, index, annotationIds)
		)
		.filter((annotation): annotation is GraphAnnotation =>
			Boolean(annotation)
		);

	return {
		schemaVersion: 1,
		title: stringValue(value.title, "Untitled Graph", 512),
		description:
			typeof value.description === "string"
				? value.description.slice(0, 16_384)
				: "",
		canvas,
		xAxis: normalizeAxis(value.xAxis, defaultXAxis),
		yAxis: normalizeAxis(value.yAxis, defaultYAxis),
		series,
		annotations
	};
}

export function cloneGraphDocument(document: GraphDocument) {
	return normalizeGraphDocument(JSON.parse(JSON.stringify(document)));
}

export function graphDocumentFromJson(json: string) {
	if (new TextEncoder().encode(json).byteLength > MAX_GRAPH_DOCUMENT_BYTES) {
		throw new Error(
			"The graph project is larger than the 8 MB browser limit."
		);
	}

	try {
		return normalizeGraphDocument(JSON.parse(json));
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error("The graph project contains malformed JSON.");
		}
		throw error;
	}
}

export function graphDocumentToJson(document: GraphDocument) {
	return `${JSON.stringify(normalizeGraphDocument(document), null, 2)}\n`;
}

export function graphProjectFileName(title: string) {
	const normalized =
		title
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 80) || "untitled-graph";
	return `${normalized}${GRAPH_DOCUMENT_EXTENSION}`;
}

export function plotBoundsForCanvas(
	canvas: GraphCanvasSettings
): GraphPlotBounds {
	const left = canvas.paddingLeft;
	const top = canvas.paddingTop;
	const right = canvas.width - canvas.paddingRight;
	const bottom = canvas.height - canvas.paddingBottom;
	return {
		left,
		top,
		right,
		bottom,
		width: Math.max(1, right - left),
		height: Math.max(1, bottom - top)
	};
}

function axisDomainValue(axis: GraphAxisSettings, value: number) {
	if (axis.scale === "logarithmic") {
		return Math.log(value) / Math.log(axis.logarithmBase);
	}
	return value;
}

function axisValueFromDomain(axis: GraphAxisSettings, value: number) {
	if (axis.scale === "logarithmic") {
		return axis.logarithmBase ** value;
	}
	return value;
}

export function axisFraction(axis: GraphAxisSettings, value: number) {
	if (
		!Number.isFinite(value) ||
		(axis.scale === "logarithmic" && value <= 0)
	) {
		return Number.NaN;
	}
	const minimum = axisDomainValue(axis, axis.minimum);
	const maximum = axisDomainValue(axis, axis.maximum);
	const rawFraction =
		(axisDomainValue(axis, value) - minimum) / (maximum - minimum);
	return axis.isReversed ? 1 - rawFraction : rawFraction;
}

export function axisValueAtFraction(axis: GraphAxisSettings, fraction: number) {
	const normalized = axis.isReversed ? 1 - fraction : fraction;
	const minimum = axisDomainValue(axis, axis.minimum);
	const maximum = axisDomainValue(axis, axis.maximum);
	return axisValueFromDomain(
		axis,
		minimum + normalized * (maximum - minimum)
	);
}

export function graphPointToCanvas(
	document: GraphDocument,
	point: Pick<GraphDataPoint, "x" | "y">
) {
	const bounds = plotBoundsForCanvas(document.canvas);
	const xFraction = axisFraction(document.xAxis, point.x);
	const yFraction = axisFraction(document.yAxis, point.y);
	return {
		x: bounds.left + xFraction * bounds.width,
		y: bounds.bottom - yFraction * bounds.height,
		isValid: Number.isFinite(xFraction) && Number.isFinite(yFraction)
	};
}

export function canvasPointToGraph(
	document: GraphDocument,
	x: number,
	y: number
) {
	const bounds = plotBoundsForCanvas(document.canvas);
	return {
		x: axisValueAtFraction(
			document.xAxis,
			Math.min(1, Math.max(0, (x - bounds.left) / bounds.width))
		),
		y: axisValueAtFraction(
			document.yAxis,
			Math.min(1, Math.max(0, (bounds.bottom - y) / bounds.height))
		)
	};
}

function niceStep(range: number, desiredTickCount: number) {
	const roughStep = Math.abs(range) / Math.max(2, desiredTickCount);
	const magnitude = 10 ** Math.floor(Math.log10(roughStep || 1));
	const normalized = roughStep / magnitude;
	const niceMultiplier =
		normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
	return niceMultiplier * magnitude;
}

export function formatGraphNumber(value: number) {
	if (!Number.isFinite(value)) return "";
	const absolute = Math.abs(value);
	if ((absolute > 0 && absolute < 0.0001) || absolute >= 1_000_000) {
		return value.toExponential(3).replace(/\.?0+e/, "e");
	}
	const rounded = Number(value.toPrecision(6));
	return Object.is(rounded, -0) ? "0" : String(rounded);
}

export function graphAxisTicks(axis: GraphAxisSettings): GraphAxisTick[] {
	if (axis.scale === "logarithmic") {
		const minimumPower = Math.ceil(
			Math.log(axis.minimum) / Math.log(axis.logarithmBase)
		);
		const maximumPower = Math.floor(
			Math.log(axis.maximum) / Math.log(axis.logarithmBase)
		);
		const exponentStep = Math.max(1, Math.round(axis.tickSpacing || 1));
		const ticks: GraphAxisTick[] = [];
		for (
			let exponent = minimumPower;
			exponent <= maximumPower && ticks.length < 100;
			exponent += exponentStep
		) {
			const value = axis.logarithmBase ** exponent;
			ticks.push({
				value,
				label: formatGraphNumber(value),
				position: axisFraction(axis, value)
			});
		}
		return ticks;
	}

	const step =
		axis.tickSpacing && axis.tickSpacing > 0
			? axis.tickSpacing
			: niceStep(axis.maximum - axis.minimum, axis.desiredTickCount);
	const first = Math.ceil(axis.minimum / step - 1e-10) * step;
	const ticks: GraphAxisTick[] = [];
	for (
		let value = first;
		value <= axis.maximum + step * 1e-8 && ticks.length < 100;
		value += step
	) {
		const normalized = Math.abs(value) < step * 1e-10 ? 0 : value;
		ticks.push({
			value: normalized,
			label: formatGraphNumber(normalized),
			position: axisFraction(axis, normalized)
		});
	}
	return ticks;
}

function pathForSegment(
	points: Array<{ x: number; y: number }>,
	mode: GraphLineMode
) {
	if (!points.length) return "";
	if (points.length === 1 || mode === "none") {
		return `M ${points[0].x} ${points[0].y}`;
	}
	if (mode === "step") {
		return points
			.slice(1)
			.reduce(
				(path, point) => `${path} H ${point.x} V ${point.y}`,
				`M ${points[0].x} ${points[0].y}`
			);
	}
	if (mode !== "smooth" || points.length < 3) {
		return points
			.slice(1)
			.reduce(
				(path, point) => `${path} L ${point.x} ${point.y}`,
				`M ${points[0].x} ${points[0].y}`
			);
	}

	let path = `M ${points[0].x} ${points[0].y}`;
	for (let index = 0; index < points.length - 1; index += 1) {
		const previous = points[Math.max(0, index - 1)];
		const current = points[index];
		const next = points[index + 1];
		const after = points[Math.min(points.length - 1, index + 2)];
		const control1 = {
			x: current.x + (next.x - previous.x) / 6,
			y: current.y + (next.y - previous.y) / 6
		};
		const control2 = {
			x: next.x - (after.x - current.x) / 6,
			y: next.y - (after.y - current.y) / 6
		};
		path += ` C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${next.x} ${next.y}`;
	}
	return path;
}

export function graphSeriesPath(document: GraphDocument, series: GraphSeries) {
	const segments: Array<Array<{ x: number; y: number }>> = [];
	let currentSegment: Array<{ x: number; y: number }> = [];

	for (const point of series.points) {
		const canvasPoint = graphPointToCanvas(document, point);
		if (!canvasPoint.isValid || point.breakBefore) {
			if (currentSegment.length) segments.push(currentSegment);
			currentSegment = [];
		}
		if (canvasPoint.isValid) {
			currentSegment.push({ x: canvasPoint.x, y: canvasPoint.y });
		}
	}
	if (currentSegment.length) segments.push(currentSegment);
	return segments
		.map(segment => pathForSegment(segment, series.lineMode))
		.filter(Boolean)
		.join(" ");
}

export function graphSeriesAreaPath(
	document: GraphDocument,
	series: GraphSeries
) {
	if (!series.fillArea || series.points.length < 2) return "";
	const visiblePoints = series.points
		.map(point => graphPointToCanvas(document, point))
		.filter(point => point.isValid);
	if (visiblePoints.length < 2) return "";
	const bounds = plotBoundsForCanvas(document.canvas);
	const zeroY = graphPointToCanvas(document, {
		x: document.xAxis.minimum,
		y:
			document.yAxis.minimum <= 0 && document.yAxis.maximum >= 0
				? 0
				: document.yAxis.minimum
	}).y;
	const baseline = Math.min(bounds.bottom, Math.max(bounds.top, zeroY));
	const linePath = pathForSegment(visiblePoints, series.lineMode);
	const first = visiblePoints[0];
	const last = visiblePoints[visiblePoints.length - 1];
	return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

export function graphLineDashArray(style: GraphLineStyle) {
	if (style === "dashed") return "10 7";
	if (style === "dotted") return "2 6";
	if (style === "dashDot") return "10 5 2 5";
	return undefined;
}

export function linearRegression(
	points: GraphDataPoint[]
): GraphRegression | null {
	const finitePoints = points.filter(
		point => Number.isFinite(point.x) && Number.isFinite(point.y)
	);
	if (finitePoints.length < 2) return null;
	const count = finitePoints.length;
	const meanX = finitePoints.reduce((sum, point) => sum + point.x, 0) / count;
	const meanY = finitePoints.reduce((sum, point) => sum + point.y, 0) / count;
	const denominator = finitePoints.reduce(
		(sum, point) => sum + (point.x - meanX) ** 2,
		0
	);
	if (Math.abs(denominator) < Number.EPSILON) return null;
	const slope =
		finitePoints.reduce(
			(sum, point) => sum + (point.x - meanX) * (point.y - meanY),
			0
		) / denominator;
	const intercept = meanY - slope * meanX;
	const totalVariation = finitePoints.reduce(
		(sum, point) => sum + (point.y - meanY) ** 2,
		0
	);
	const residualVariation = finitePoints.reduce((sum, point) => {
		const predicted = slope * point.x + intercept;
		return sum + (point.y - predicted) ** 2;
	}, 0);
	return {
		slope,
		intercept,
		rSquared:
			totalVariation < Number.EPSILON
				? 1
				: Math.max(0, 1 - residualVariation / totalVariation)
	};
}

export function createBestFitSeries(
	source: GraphSeries,
	color = source.color
): GraphSeries | null {
	const regression = linearRegression(source.points);
	if (!regression) return null;
	const xValues = source.points.map(point => point.x);
	const minimumX = Math.min(...xValues);
	const maximumX = Math.max(...xValues);
	if (!Number.isFinite(minimumX) || minimumX === maximumX) return null;
	return {
		id: createGraphId("best-fit"),
		name: `${source.name} best fit (R² ${regression.rSquared.toFixed(3)})`,
		isVisible: true,
		lineStyle: "dashed",
		lineMode: "straight",
		markerShape: "none",
		color,
		strokeWidth: 2,
		markerSize: 0,
		fillArea: false,
		sourceKind: "bestFit",
		sourceSeriesId: source.id,
		points: [
			{
				x: minimumX,
				y: regression.slope * minimumX + regression.intercept
			},
			{
				x: maximumX,
				y: regression.slope * maximumX + regression.intercept
			}
		]
	};
}

export class GraphExpressionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GraphExpressionError";
	}
}

type ExpressionEvaluator = (x: number) => number;
type ExpressionTokenKind =
	"number" | "identifier" | "operator" | "open" | "close" | "comma" | "end";

interface ExpressionToken {
	kind: ExpressionTokenKind;
	text: string;
	value?: number;
	position: number;
}

interface GraphFunctionDefinition {
	minimumArguments: number;
	maximumArguments: number;
	evaluate: (...values: number[]) => number;
}

const GRAPH_EXPRESSION_CONSTANTS: Record<string, number> = {
	e: Math.E,
	pi: Math.PI,
	tau: Math.PI * 2
};

const GRAPH_EXPRESSION_FUNCTIONS: Record<string, GraphFunctionDefinition> = {
	abs: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.abs },
	acos: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.acos },
	arccos: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.acos },
	arcsin: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.asin },
	arctan: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.atan },
	asin: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.asin },
	atan: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.atan },
	atan2: { minimumArguments: 2, maximumArguments: 2, evaluate: Math.atan2 },
	ceil: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.ceil },
	cos: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.cos },
	cosh: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.cosh },
	exp: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.exp },
	floor: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.floor },
	ln: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.log },
	log: {
		minimumArguments: 1,
		maximumArguments: 2,
		evaluate: (value, base = 10) => Math.log(value) / Math.log(base)
	},
	log10: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.log10 },
	max: { minimumArguments: 2, maximumArguments: 16, evaluate: Math.max },
	min: { minimumArguments: 2, maximumArguments: 16, evaluate: Math.min },
	pow: { minimumArguments: 2, maximumArguments: 2, evaluate: Math.pow },
	round: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.round },
	sign: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.sign },
	sin: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.sin },
	sinh: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.sinh },
	sqrt: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.sqrt },
	tan: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.tan },
	tanh: { minimumArguments: 1, maximumArguments: 1, evaluate: Math.tanh }
};

function rawExpressionTokens(expression: string) {
	const tokens: ExpressionToken[] = [];
	let index = 0;
	while (index < expression.length) {
		const character = expression[index];
		if (/\s/.test(character)) {
			index += 1;
			continue;
		}
		const rest = expression.slice(index);
		const numberMatch = rest.match(
			/^(?:\d+\.\d*|\.\d+|\d+)(?:e[+-]?\d+)?/i
		);
		if (numberMatch) {
			tokens.push({
				kind: "number",
				text: numberMatch[0],
				value: Number(numberMatch[0]),
				position: index
			});
			index += numberMatch[0].length;
			continue;
		}
		const identifierMatch = rest.match(/^[a-z_]\w*/i);
		if (identifierMatch) {
			tokens.push({
				kind: "identifier",
				text: identifierMatch[0].toLowerCase(),
				position: index
			});
			index += identifierMatch[0].length;
			continue;
		}
		if (character === "*" && expression[index + 1] === "*") {
			tokens.push({
				kind: "operator",
				text: "^",
				position: index
			});
			index += 2;
			continue;
		}
		if ("+-*/%^".includes(character)) {
			tokens.push({
				kind: "operator",
				text: character,
				position: index
			});
			index += 1;
			continue;
		}
		if (character === "(") {
			tokens.push({ kind: "open", text: character, position: index });
			index += 1;
			continue;
		}
		if (character === ")") {
			tokens.push({ kind: "close", text: character, position: index });
			index += 1;
			continue;
		}
		if (character === ",") {
			tokens.push({ kind: "comma", text: character, position: index });
			index += 1;
			continue;
		}
		throw new GraphExpressionError(
			`Unexpected "${character}" at character ${index + 1}.`
		);
	}
	return tokens;
}

function tokenizeGraphExpression(expression: string) {
	const rawTokens = rawExpressionTokens(expression);
	const tokens: ExpressionToken[] = [];
	const canEndValue = (token: ExpressionToken) =>
		token.kind === "number" ||
		token.kind === "identifier" ||
		token.kind === "close";
	const canStartValue = (token: ExpressionToken) =>
		token.kind === "number" ||
		token.kind === "identifier" ||
		token.kind === "open";

	for (const token of rawTokens) {
		const previous = tokens[tokens.length - 1];
		const isFunctionCall =
			previous?.kind === "identifier" &&
			token.kind === "open" &&
			Object.hasOwn(GRAPH_EXPRESSION_FUNCTIONS, previous.text);
		if (
			previous &&
			canEndValue(previous) &&
			canStartValue(token) &&
			!isFunctionCall
		) {
			tokens.push({
				kind: "operator",
				text: "*",
				position: token.position
			});
		}
		tokens.push(token);
	}
	if (tokens.length > MAX_GRAPH_EXPRESSION_TOKENS) {
		throw new GraphExpressionError(
			`Expressions may contain at most ${MAX_GRAPH_EXPRESSION_TOKENS} tokens.`
		);
	}
	tokens.push({
		kind: "end",
		text: "",
		position: expression.length
	});
	return tokens;
}

class GraphExpressionParser {
	private index = 0;

	constructor(private readonly tokens: ExpressionToken[]) {}

	parse() {
		const evaluator = this.parseAdditive(0);
		if (this.current().kind !== "end") {
			throw this.error(`Unexpected "${this.current().text}".`);
		}
		return evaluator;
	}

	private current() {
		return this.tokens[this.index];
	}

	private advance() {
		const token = this.current();
		this.index += 1;
		return token;
	}

	private error(message: string) {
		return new GraphExpressionError(
			`${message} Character ${this.current().position + 1}.`
		);
	}

	private assertDepth(depth: number) {
		if (depth > MAX_GRAPH_EXPRESSION_DEPTH) {
			throw new GraphExpressionError(
				`Expression nesting may not exceed ${MAX_GRAPH_EXPRESSION_DEPTH} levels.`
			);
		}
	}

	private parseAdditive(depth: number): ExpressionEvaluator {
		this.assertDepth(depth);
		let left = this.parseMultiplicative(depth);
		while (
			this.current().kind === "operator" &&
			["+", "-"].includes(this.current().text)
		) {
			const operator = this.advance().text;
			const right = this.parseMultiplicative(depth);
			const previous = left;
			left =
				operator === "+"
					? x => previous(x) + right(x)
					: x => previous(x) - right(x);
		}
		return left;
	}

	private parseMultiplicative(depth: number): ExpressionEvaluator {
		let left = this.parseUnary(depth);
		while (
			this.current().kind === "operator" &&
			["*", "/", "%"].includes(this.current().text)
		) {
			const operator = this.advance().text;
			const right = this.parseUnary(depth);
			const previous = left;
			if (operator === "*") left = x => previous(x) * right(x);
			else if (operator === "/") left = x => previous(x) / right(x);
			else left = x => previous(x) % right(x);
		}
		return left;
	}

	private parseUnary(depth: number): ExpressionEvaluator {
		this.assertDepth(depth);
		if (
			this.current().kind === "operator" &&
			["+", "-"].includes(this.current().text)
		) {
			const operator = this.advance().text;
			const value = this.parseUnary(depth + 1);
			return operator === "-" ? x => -value(x) : value;
		}
		return this.parsePower(depth);
	}

	private parsePower(depth: number): ExpressionEvaluator {
		this.assertDepth(depth);
		const left = this.parsePrimary(depth);
		if (this.current().kind === "operator" && this.current().text === "^") {
			this.advance();
			const right = this.parseUnary(depth + 1);
			return x => left(x) ** right(x);
		}
		return left;
	}

	private parsePrimary(depth: number): ExpressionEvaluator {
		const token = this.current();
		if (token.kind === "number") {
			this.advance();
			const value = token.value ?? Number.NaN;
			return () => value;
		}
		if (token.kind === "open") {
			this.advance();
			const expression = this.parseAdditive(depth + 1);
			if (this.current().kind !== "close") {
				throw this.error('Expected ")".');
			}
			this.advance();
			return expression;
		}
		if (token.kind !== "identifier") {
			throw this.error("Expected a number, x, constant, or function.");
		}

		this.advance();
		if (token.text === "x") return x => x;
		if (Object.hasOwn(GRAPH_EXPRESSION_CONSTANTS, token.text)) {
			const value = GRAPH_EXPRESSION_CONSTANTS[token.text];
			return () => value;
		}
		const definition = Object.hasOwn(GRAPH_EXPRESSION_FUNCTIONS, token.text)
			? GRAPH_EXPRESSION_FUNCTIONS[token.text]
			: undefined;
		if (!definition) {
			throw new GraphExpressionError(
				`Unknown name "${token.text}" at character ${token.position + 1}.`
			);
		}
		if (this.current().kind !== "open") {
			throw this.error(`Expected "(" after ${token.text}.`);
		}
		this.advance();
		const arguments_: ExpressionEvaluator[] = [];
		if (this.current().kind !== "close") {
			while (true) {
				arguments_.push(this.parseAdditive(depth + 1));
				if (this.current().kind !== "comma") break;
				this.advance();
			}
		}
		if (this.current().kind !== "close") {
			throw this.error('Expected ")" after function arguments.');
		}
		this.advance();
		if (
			arguments_.length < definition.minimumArguments ||
			arguments_.length > definition.maximumArguments
		) {
			throw new GraphExpressionError(
				`${token.text} expects ${
					definition.minimumArguments === definition.maximumArguments
						? definition.minimumArguments
						: `${definition.minimumArguments}–${definition.maximumArguments}`
				} argument(s).`
			);
		}
		return x =>
			definition.evaluate(...arguments_.map(argument => argument(x)));
	}
}

export function compileGraphExpression(
	expression: string
): ExpressionEvaluator {
	if (expression.length > MAX_GRAPH_EXPRESSION_LENGTH) {
		throw new GraphExpressionError(
			`Expressions may contain at most ${MAX_GRAPH_EXPRESSION_LENGTH} characters.`
		);
	}
	const normalized = expression.trim();
	if (!normalized) {
		throw new GraphExpressionError("Enter an expression after y =.");
	}
	return new GraphExpressionParser(
		tokenizeGraphExpression(normalized)
	).parse();
}

export function sampleGraphExpression(
	expression: string,
	xAxis: GraphAxisSettings,
	yAxis: GraphAxisSettings,
	sampleCount = 640
) {
	const evaluate = compileGraphExpression(expression);
	const count = Math.min(1_200, Math.max(80, Math.round(sampleCount)));
	const points: GraphDataPoint[] = [];
	let previousY: number | undefined;
	const visibleYSpan = Math.abs(yAxis.maximum - yAxis.minimum);

	for (let index = 0; index <= count; index += 1) {
		const x = axisValueAtFraction(xAxis, index / count);
		const y = evaluate(x);
		if (!Number.isFinite(y) || (yAxis.scale === "logarithmic" && y <= 0)) {
			previousY = undefined;
			continue;
		}
		const point: GraphDataPoint = { x, y };
		if (
			previousY === undefined ||
			(visibleYSpan > 0 && Math.abs(y - previousY) > visibleYSpan * 4)
		) {
			point.breakBefore = points.length > 0;
		}
		points.push(point);
		previousY = y;
	}
	if (!points.length) {
		throw new GraphExpressionError(
			"The expression has no real, finite values in the visible x range."
		);
	}
	return points;
}

export function refreshDerivedGraphSeries(document: GraphDocument) {
	const sourceById = new Map(
		document.series
			.filter(series => series.sourceKind !== "bestFit")
			.map(series => [series.id, series])
	);
	for (const series of document.series) {
		if (series.sourceKind === "function" && series.sourceExpression) {
			try {
				series.points = sampleGraphExpression(
					series.sourceExpression,
					document.xAxis,
					document.yAxis
				);
			} catch {
				series.points = [];
			}
		}
		if (series.sourceKind === "bestFit" && series.sourceSeriesId) {
			const source = sourceById.get(series.sourceSeriesId);
			const regression = source ? linearRegression(source.points) : null;
			if (!source || !regression || source.points.length < 2) {
				series.points = [];
				continue;
			}
			const xValues = source.points.map(point => point.x);
			const minimumX = Math.min(...xValues);
			const maximumX = Math.max(...xValues);
			series.name = `${source.name} best fit (R² ${regression.rSquared.toFixed(3)})`;
			series.points = [
				{
					x: minimumX,
					y: regression.slope * minimumX + regression.intercept
				},
				{
					x: maximumX,
					y: regression.slope * maximumX + regression.intercept
				}
			];
		}
	}
}

function paddedRange(minimum: number, maximum: number, logarithmic: boolean) {
	if (logarithmic) {
		const safeMinimum = Math.max(Number.MIN_VALUE, minimum);
		if (safeMinimum === maximum) {
			return [safeMinimum / 2, maximum * 2] as const;
		}
		const logMinimum = Math.log10(safeMinimum);
		const logMaximum = Math.log10(maximum);
		const padding = Math.max(0.08, (logMaximum - logMinimum) * 0.08);
		return [
			10 ** (logMinimum - padding),
			10 ** (logMaximum + padding)
		] as const;
	}
	if (minimum === maximum) {
		const padding = Math.max(1, Math.abs(minimum) * 0.1);
		return [minimum - padding, maximum + padding] as const;
	}
	const padding = (maximum - minimum) * 0.08;
	return [minimum - padding, maximum + padding] as const;
}

export function fitGraphAxesToData(document: GraphDocument) {
	const points = document.series
		.filter(series => series.isVisible)
		.flatMap(series => series.points)
		.filter(
			point =>
				Number.isFinite(point.x) &&
				Number.isFinite(point.y) &&
				(document.xAxis.scale !== "logarithmic" || point.x > 0) &&
				(document.yAxis.scale !== "logarithmic" || point.y > 0)
		);
	if (!points.length) return false;
	const xRange = paddedRange(
		Math.min(...points.map(point => point.x)),
		Math.max(...points.map(point => point.x)),
		document.xAxis.scale === "logarithmic"
	);
	const yRange = paddedRange(
		Math.min(...points.map(point => point.y)),
		Math.max(...points.map(point => point.y)),
		document.yAxis.scale === "logarithmic"
	);
	[document.xAxis.minimum, document.xAxis.maximum] = xRange;
	[document.yAxis.minimum, document.yAxis.maximum] = yRange;
	document.xAxis.tickSpacing = null;
	document.yAxis.tickSpacing = null;
	refreshDerivedGraphSeries(document);
	return true;
}

export function zoomGraphAxis(
	axis: GraphAxisSettings,
	anchorValue: number,
	factor: number
) {
	const minimum = axisDomainValue(axis, axis.minimum);
	const maximum = axisDomainValue(axis, axis.maximum);
	const anchor = axisDomainValue(
		axis,
		axis.scale === "logarithmic" && anchorValue <= 0
			? axis.minimum
			: anchorValue
	);
	const safeFactor = Math.min(10, Math.max(0.1, factor));
	axis.minimum = axisValueFromDomain(
		axis,
		anchor + (minimum - anchor) * safeFactor
	);
	axis.maximum = axisValueFromDomain(
		axis,
		anchor + (maximum - anchor) * safeFactor
	);
	axis.tickSpacing = null;
}

export function panGraphAxis(axis: GraphAxisSettings, fractionDelta: number) {
	const minimum = axisDomainValue(axis, axis.minimum);
	const maximum = axisDomainValue(axis, axis.maximum);
	const delta = (maximum - minimum) * fractionDelta;
	axis.minimum = axisValueFromDomain(axis, minimum + delta);
	axis.maximum = axisValueFromDomain(axis, maximum + delta);
}
