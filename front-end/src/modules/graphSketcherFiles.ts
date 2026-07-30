import type {
	GraphAnnotation,
	GraphAxisSettings,
	GraphDataPoint,
	GraphDocument,
	GraphLineMode,
	GraphLineStyle,
	GraphMarkerShape,
	GraphSeries
} from "@/modules/graphSketcher";
import type {
	GraphSketcherArchiveWorkerRequest,
	GraphSketcherArchiveWorkerResponse
} from "@/modules/graphSketcherArchive";
import {
	canvasPointToGraph,
	createGraphSeries,
	formatGraphNumber,
	graphAxisTicks,
	graphLineDashArray,
	graphPointToCanvas,
	graphSeriesAreaPath,
	graphSeriesPath,
	MAX_GRAPH_ANNOTATIONS,
	MAX_GRAPH_DOCUMENT_BYTES,
	MAX_GRAPH_POINTS,
	MAX_GRAPH_SERIES,
	normalizeGraphDocument,
	plotBoundsForCanvas
} from "@/modules/graphSketcher";
import GraphSketcherArchiveWorker from "@/workers/graphSketcherArchive.worker?worker";

export interface GraphDelimitedImportResult {
	series: GraphSeries[];
	rowsRead: number;
	issues: string[];
}

export interface LegacyGraphImportResult {
	document: GraphDocument;
	warnings: string[];
}

const LEGACY_GRAPH_NAMESPACE =
	"http://www.omnigroup.com/namespace/OmniGraphSketcher/v1";
const MAX_LEGACY_XML_BYTES = 16 * 1024 * 1024;
const MAX_LEGACY_ARCHIVE_DECODE_MS = 10_000;
const MAX_LEGACY_ELEMENTS = 50_000;
const MAX_LEGACY_VERTICES = 20_000;
const MAX_LEGACY_LABELS = 10_000;
const MAX_IMPORT_MESSAGES = 12;
const MAX_DELIMITED_COLUMNS = MAX_GRAPH_SERIES + 1;
const DELIMITERS = [",", "\t", ";", "|"] as const;
const SERIES_COLORS = [
	"#2563eb",
	"#dc2626",
	"#059669",
	"#9333ea",
	"#ea580c",
	"#0891b2",
	"#4f46e5",
	"#be123c"
];

function addBoundedMessage(
	messages: string[],
	message: string,
	kind: "issues" | "warnings"
) {
	if (messages.length < MAX_IMPORT_MESSAGES) {
		messages.push(message);
	} else if (messages.length === MAX_IMPORT_MESSAGES) {
		messages.push(`Additional import ${kind} were omitted.`);
	}
}

function parseDelimitedRows(
	text: string,
	delimiter: string,
	maxColumns = Number.POSITIVE_INFINITY,
	maxRows = Number.POSITIVE_INFINITY
) {
	const rows: string[][] = [];
	let row: string[] = [];
	let cell = "";
	let inQuotes = false;

	const finishRow = () => {
		if (row.length >= maxColumns) {
			throw new Error(
				`Data imports are limited to ${MAX_GRAPH_SERIES} series columns.`
			);
		}
		row.push(cell.trim());
		if (row.some(value => value.length > 0)) {
			if (rows.length >= maxRows) {
				throw new Error(
					`Data imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} rows.`
				);
			}
			rows.push(row);
		}
		row = [];
		cell = "";
	};

	for (let index = 0; index < text.length; index += 1) {
		const character = text[index];
		if (inQuotes) {
			if (character === '"' && text[index + 1] === '"') {
				cell += '"';
				index += 1;
			} else if (character === '"') {
				inQuotes = false;
			} else {
				cell += character;
			}
			continue;
		}
		if (character === '"' && cell.length === 0) {
			inQuotes = true;
		} else if (character === delimiter) {
			if (row.length + 1 >= maxColumns) {
				throw new Error(
					`Data imports are limited to ${MAX_GRAPH_SERIES} series columns.`
				);
			}
			row.push(cell.trim());
			cell = "";
		} else if (character === "\n" || character === "\r") {
			if (character === "\r" && text[index + 1] === "\n") index += 1;
			finishRow();
		} else {
			cell += character;
		}
	}
	if (inQuotes)
		throw new Error("The pasted data has an unfinished quoted value.");
	finishRow();
	return rows;
}

function detectedDelimiter(text: string) {
	let bestDelimiter: (typeof DELIMITERS)[number] = ",";
	let bestWidth = 1;
	for (const delimiter of DELIMITERS) {
		const width = parseDelimitedRows(
			text.slice(0, 8_192),
			delimiter
		).reduce((maximum, row) => Math.max(maximum, row.length), 0);
		if (width > bestWidth) {
			bestDelimiter = delimiter;
			bestWidth = width;
		}
	}
	return bestDelimiter;
}

function parsedNumber(value: string | undefined) {
	if (value === undefined || !value.trim()) return undefined;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizedHeader(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

function safeSeriesName(value: string | undefined, fallback: string) {
	const name = value?.trim();
	return name ? name.slice(0, 512) : fallback;
}

function importLongFormRows(
	rows: string[][],
	headers: string[],
	issues: string[]
) {
	const seriesIndex = headers.findIndex(header => header === "series");
	const xIndex = headers.findIndex(header => header === "x");
	const yIndex = headers.findIndex(header => header === "y");
	if (seriesIndex < 0 || xIndex < 0 || yIndex < 0) return null;
	const xErrorIndex = headers.findIndex(header =>
		["x_error", "xerror"].includes(header)
	);
	const yErrorIndex = headers.findIndex(header =>
		["y_error", "yerror"].includes(header)
	);
	const labelIndex = headers.findIndex(header => header === "label");
	const byName = new Map<string, GraphSeries>();
	let pointCount = 0;

	for (const [rowIndex, row] of rows.slice(1).entries()) {
		const x = parsedNumber(row[xIndex]);
		const y = parsedNumber(row[yIndex]);
		if (x === undefined || y === undefined) {
			addBoundedMessage(
				issues,
				`Skipped row ${rowIndex + 2}: x and y must be numbers.`,
				"issues"
			);
			continue;
		}
		const name = safeSeriesName(row[seriesIndex], "Imported series");
		let series = byName.get(name);
		if (!series) {
			if (byName.size >= MAX_GRAPH_SERIES) {
				throw new Error(
					`Data imports are limited to ${MAX_GRAPH_SERIES} series.`
				);
			}
			series = createGraphSeries(
				name,
				SERIES_COLORS[byName.size % SERIES_COLORS.length]
			);
			byName.set(name, series);
		}
		const point: GraphDataPoint = { x, y };
		const xError = parsedNumber(row[xErrorIndex]);
		const yError = parsedNumber(row[yErrorIndex]);
		const label = row[labelIndex]?.trim();
		if (xError !== undefined && xError >= 0) point.xError = xError;
		if (yError !== undefined && yError >= 0) point.yError = yError;
		if (label) point.label = label.slice(0, 2_048);
		if (pointCount >= MAX_GRAPH_POINTS) {
			throw new Error(
				`Data imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} total points.`
			);
		}
		series.points.push(point);
		pointCount += 1;
	}
	return [...byName.values()];
}

export function importDelimitedGraphData(
	text: string
): GraphDelimitedImportResult {
	if (!text.trim())
		throw new Error("Paste or load at least one row of data.");
	if (new TextEncoder().encode(text).byteLength > MAX_GRAPH_DOCUMENT_BYTES) {
		throw new Error("The data file is larger than the 8 MB browser limit.");
	}
	const rows = parseDelimitedRows(
		text,
		detectedDelimiter(text),
		MAX_DELIMITED_COLUMNS,
		MAX_GRAPH_POINTS + 1
	);
	if (!rows.length) throw new Error("No data rows were found.");
	if (rows.length > MAX_GRAPH_POINTS + 1) {
		throw new Error(
			`Data imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} rows.`
		);
	}

	const issues: string[] = [];
	const firstRow = rows[0];
	const hasHeader = firstRow.some(value => parsedNumber(value) === undefined);
	const headers = hasHeader
		? firstRow.map(normalizedHeader)
		: firstRow.map((_, index) => (index === 0 ? "x" : `series_${index}`));
	if (hasHeader) {
		const longFormSeries = importLongFormRows(rows, headers, issues);
		if (longFormSeries) {
			if (!longFormSeries.length) {
				throw new Error("No rows contained numeric x and y values.");
			}
			return {
				series: longFormSeries,
				rowsRead: rows.length - 1,
				issues
			};
		}
	}

	const dataRows = hasHeader ? rows.slice(1) : rows;
	const width = rows.reduce(
		(maximum, row) => Math.max(maximum, row.length),
		0
	);
	if (width === 1) {
		const series = createGraphSeries(
			hasHeader
				? safeSeriesName(firstRow[0], "Imported values")
				: "Imported values",
			SERIES_COLORS[0]
		);
		for (const [rowIndex, row] of dataRows.entries()) {
			const y = parsedNumber(row[0]);
			if (y === undefined) {
				addBoundedMessage(
					issues,
					`Skipped row ${rowIndex + (hasHeader ? 2 : 1)}: expected a number.`,
					"issues"
				);
				continue;
			}
			if (series.points.length >= MAX_GRAPH_POINTS) {
				throw new Error(
					`Data imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} total points.`
				);
			}
			series.points.push({ x: rowIndex, y });
		}
		if (!series.points.length)
			throw new Error("No numeric values were found.");
		return { series: [series], rowsRead: dataRows.length, issues };
	}

	if (width - 1 > MAX_GRAPH_SERIES) {
		throw new Error(
			`Data imports are limited to ${MAX_GRAPH_SERIES} series columns.`
		);
	}
	const series = Array.from({ length: width - 1 }).map((_, index) =>
		createGraphSeries(
			hasHeader
				? safeSeriesName(firstRow[index + 1], `Series ${index + 1}`)
				: `Series ${index + 1}`,
			SERIES_COLORS[index % SERIES_COLORS.length]
		)
	);
	let pointCount = 0;
	for (const [rowIndex, row] of dataRows.entries()) {
		const x = parsedNumber(row[0]);
		if (x === undefined) {
			addBoundedMessage(
				issues,
				`Skipped row ${rowIndex + (hasHeader ? 2 : 1)}: the first column must be numeric.`,
				"issues"
			);
			continue;
		}
		for (
			let seriesIndex = 0;
			seriesIndex < series.length;
			seriesIndex += 1
		) {
			const y = parsedNumber(row[seriesIndex + 1]);
			if (y !== undefined) {
				if (pointCount >= MAX_GRAPH_POINTS) {
					throw new Error(
						`Data imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} total points.`
					);
				}
				series[seriesIndex].points.push({ x, y });
				pointCount += 1;
			} else if (row[seriesIndex + 1]?.trim()) {
				addBoundedMessage(
					issues,
					`Skipped the nonnumeric value in row ${rowIndex + (hasHeader ? 2 : 1)}, column ${
						seriesIndex + 2
					}.`,
					"issues"
				);
			}
		}
	}
	const populatedSeries = series.filter(item => item.points.length > 0);
	if (!populatedSeries.length) {
		throw new Error("No numeric x/y pairs were found.");
	}
	return {
		series: populatedSeries,
		rowsRead: dataRows.length,
		issues
	};
}

function csvValue(value: string) {
	return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function spreadsheetSafeText(value: string) {
	for (const character of value) {
		const codePoint = character.codePointAt(0) ?? 0;
		const isControl =
			codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f);
		if (isControl || character.trim() === "") continue;
		return "=+-@".includes(character) ? `'${value}` : value;
	}
	return value;
}

export function graphDocumentToCsv(document: GraphDocument) {
	const rows = ["series,x,y,x_error,y_error,label"];
	for (const series of document.series) {
		if (series.sourceKind === "function") continue;
		for (const point of series.points) {
			rows.push(
				[
					csvValue(spreadsheetSafeText(series.name)),
					point.x.toString(),
					point.y.toString(),
					point.xError?.toString() ?? "",
					point.yError?.toString() ?? "",
					csvValue(spreadsheetSafeText(point.label ?? ""))
				].join(",")
			);
		}
	}
	return `${rows.join("\n")}\n`;
}

function legacyChildren(element: Element, localName: string) {
	return Array.from(element.children).filter(
		child =>
			child.namespaceURI === LEGACY_GRAPH_NAMESPACE &&
			child.localName === localName
	);
}

function legacyChild(element: Element, localName: string) {
	return legacyChildren(element, localName)[0];
}

function legacyNumber(
	element: Element | undefined,
	attribute: string,
	fallback: number
) {
	if (!element) return fallback;
	const rawValue = element.getAttribute(attribute);
	if (rawValue === null || rawValue.trim() === "") return fallback;
	const value = Number(rawValue);
	return Number.isFinite(value) ? value : fallback;
}

function legacyBoolean(
	element: Element | undefined,
	attribute: string,
	fallback: boolean
) {
	const value = element?.getAttribute(attribute)?.trim().toLowerCase();
	if (value === "true" || value === "yes" || value === "1") return true;
	if (value === "false" || value === "no" || value === "0") return false;
	return fallback;
}

function colorChannel(value: number) {
	return Math.round(Math.min(1, Math.max(0, value)) * 255)
		.toString(16)
		.padStart(2, "0");
}

function legacyColor(element: Element | undefined, fallback: string) {
	const color = element ? legacyChild(element, "color") : undefined;
	if (!color) return fallback;
	const alpha = legacyNumber(color, "a", 1);
	const suffix = alpha < 0.999 ? colorChannel(alpha) : "";
	if (color.hasAttribute("w")) {
		const white = colorChannel(legacyNumber(color, "w", 0));
		return `#${white}${white}${white}${suffix}`;
	}
	if (
		color.hasAttribute("r") &&
		color.hasAttribute("g") &&
		color.hasAttribute("b")
	) {
		return `#${colorChannel(legacyNumber(color, "r", 0))}${colorChannel(
			legacyNumber(color, "g", 0)
		)}${colorChannel(legacyNumber(color, "b", 0))}${suffix}`;
	}
	return fallback;
}

function legacyLineStyle(value: string | null): GraphLineStyle {
	const normalized = value?.toLowerCase();
	if (normalized === "dots") return "dotted";
	if (
		[
			"dashes",
			"dashes-spaced",
			"dashes-long",
			"arrows",
			"reverse-arrows",
			"railroad"
		].includes(normalized ?? "")
	) {
		return "dashed";
	}
	if (normalized === "dashes-dots") return "dashDot";
	return "solid";
}

function legacyLineMode(value: string | null): GraphLineMode {
	return value?.toLowerCase() === "curved" ? "smooth" : "straight";
}

function legacyMarker(value: string | null): GraphMarkerShape {
	const normalized = value?.toLowerCase();
	if (
		["none", "circle", "square", "triangle", "diamond", "cross"].includes(
			normalized ?? ""
		)
	) {
		return normalized as GraphMarkerShape;
	}
	if (normalized === "hollow") return "circle";
	if (normalized === "treasure") return "diamond";
	if (normalized === "tickmark") return "plus";
	return "circle";
}

interface LegacyLabel {
	id: string;
	ownerId?: string;
	text: string;
	x?: number;
	y?: number;
	color: string;
	fontSize: number;
}

interface LegacyVertex {
	id: string;
	point: GraphDataPoint;
	color: string;
	markerShape: GraphMarkerShape;
	markerSize: number;
}

function parseLegacyLabels(elements: Element[], warnings: string[]) {
	const labels = new Map<string, LegacyLabel>();
	for (const [index, element] of elements.entries()) {
		const id = element.getAttribute("id")?.trim() || `label-${index + 1}`;
		const paragraphs = legacyChildren(
			legacyChild(element, "text") ?? element,
			"p"
		);
		const textParts = (paragraphs.length ? paragraphs : [element]).map(
			paragraph =>
				Array.from(
					paragraph.getElementsByTagNameNS(
						LEGACY_GRAPH_NAMESPACE,
						"lit"
					)
				)
					.map(literal => literal.textContent ?? "")
					.join("")
		);
		const hasRichStyle =
			element.getElementsByTagNameNS(LEGACY_GRAPH_NAMESPACE, "style")
				.length > 0;
		if (hasRichStyle) {
			addBoundedMessage(
				warnings,
				`Rich text in label "${id}" was imported as plain text.`,
				"warnings"
			);
		}
		labels.set(id, {
			id,
			ownerId: element.getAttribute("owner")?.trim() || undefined,
			text: textParts.join("\n").trim(),
			x: element.hasAttribute("x")
				? legacyNumber(element, "x", 0)
				: undefined,
			y: element.hasAttribute("y")
				? legacyNumber(element, "y", 0)
				: undefined,
			color: legacyColor(element, "#111827"),
			fontSize: Math.max(6, legacyNumber(element, "font-size", 14))
		});
	}
	return labels;
}

function legacyVertexIds(
	element: Element,
	maxIds: number,
	fallback: Array<string | null> = []
) {
	const rawIds = legacyChild(element, "vertices")
		?.getAttribute("ids")
		?.trim();
	if (!rawIds) {
		const ids = fallback.filter((id): id is string => Boolean(id));
		if (ids.length > maxIds) {
			throw new Error(
				`Legacy graph imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} total points.`
			);
		}
		return ids;
	}
	const ids: string[] = [];
	for (const match of rawIds.matchAll(/\S+/g)) {
		if (ids.length >= maxIds) {
			throw new Error(
				`Legacy graph imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} total points.`
			);
		}
		ids.push(match[0]);
	}
	return ids;
}

function parseLegacyAxis(
	graph: Element,
	dimension: "x" | "y",
	labels: Map<string, LegacyLabel>,
	axisLabelIds: Set<string>
): GraphAxisSettings {
	const element = legacyChildren(graph, "axis").find(
		axis => axis.getAttribute("dimension")?.toLowerCase() === dimension
	);
	const defaults =
		dimension === "x"
			? {
					title: "x",
					minimum: -10,
					maximum: 10
				}
			: {
					title: "y",
					minimum: -10,
					maximum: 10
				};
	const ticks = element ? legacyChild(element, "ticks") : undefined;
	const grid = element ? legacyChild(element, "grid") : undefined;
	const tickLabels = element
		? legacyChild(element, "tick-labels")
		: undefined;
	const titleElement = element ? legacyChild(element, "title") : undefined;
	const titleId = titleElement?.getAttribute("label")?.trim();
	if (titleId) axisLabelIds.add(titleId);
	const title = titleId
		? labels.get(titleId)?.text || defaults.title
		: defaults.title;
	const scaleName = element?.getAttribute("scale")?.toLowerCase();
	const scale =
		scaleName === "log" || scaleName === "logarithmic"
			? "logarithmic"
			: "linear";
	let minimum = legacyNumber(element, "min", defaults.minimum);
	let maximum = legacyNumber(element, "max", defaults.maximum);
	if (minimum >= maximum) {
		minimum = defaults.minimum;
		maximum = defaults.maximum;
	}
	if (scale === "logarithmic" && minimum <= 0) minimum = 0.1;
	return {
		title,
		scale,
		minimum,
		maximum,
		isReversed: legacyBoolean(element, "reversed", false),
		showGridLines: Boolean(grid) && legacyBoolean(grid, "visible", true),
		showAxisLine:
			legacyBoolean(element, "visible", true) &&
			element?.getAttribute("placement")?.toLowerCase() !== "none",
		showTickLabels: legacyBoolean(tickLabels, "visible", true),
		desiredTickCount: 7,
		numberFormat: "G4",
		logarithmBase: Math.max(2, legacyNumber(element, "log-base", 10)),
		tickSpacing:
			legacyNumber(ticks, "spacing", 0) > 0
				? legacyNumber(ticks, "spacing", 0)
				: null
	};
}

function graphImportCanceledError() {
	const error = new Error("Graph import canceled.");
	error.name = "AbortError";
	return error;
}

function throwIfGraphImportCanceled(signal?: AbortSignal) {
	if (signal?.aborted) throw graphImportCanceledError();
}

function decodeLegacyGraphArchive(data: Uint8Array, signal?: AbortSignal) {
	throwIfGraphImportCanceled(signal);
	return new Promise<string>((resolve, reject) => {
		let worker: Worker;
		try {
			worker = new GraphSketcherArchiveWorker();
		} catch {
			reject(
				new Error(
					"This browser could not safely open the archived .ograph file."
				)
			);
			return;
		}

		let completed = false;
		let timeout: ReturnType<typeof setTimeout> | undefined;
		let handleAbort: (() => void) | undefined;
		const finish = (callback: () => void) => {
			if (completed) return;
			completed = true;
			if (timeout) clearTimeout(timeout);
			if (handleAbort) {
				signal?.removeEventListener("abort", handleAbort);
			}
			worker.terminate();
			callback();
		};
		handleAbort = () => {
			finish(() => reject(graphImportCanceledError()));
		};
		timeout = setTimeout(() => {
			finish(() =>
				reject(new Error("The .ograph archive took too long to open."))
			);
		}, MAX_LEGACY_ARCHIVE_DECODE_MS);

		worker.addEventListener(
			"message",
			(event: MessageEvent<GraphSketcherArchiveWorkerResponse>) => {
				const response = event.data;
				if (response.ok) {
					const xml = response.xml;
					finish(() => resolve(xml));
				} else {
					const message = response.message;
					finish(() => reject(new Error(message)));
				}
			},
			{ once: true }
		);
		worker.addEventListener(
			"error",
			() => {
				finish(() =>
					reject(
						new Error("The .ograph archive could not be opened.")
					)
				);
			},
			{ once: true }
		);
		signal?.addEventListener("abort", handleAbort, { once: true });

		const archiveCopy = new Uint8Array(data.byteLength);
		archiveCopy.set(data);
		const request: GraphSketcherArchiveWorkerRequest = {
			archive: archiveCopy.buffer,
			maxArchiveBytes: MAX_GRAPH_DOCUMENT_BYTES,
			maxXmlBytes: MAX_LEGACY_XML_BYTES
		};
		try {
			worker.postMessage(request, [archiveCopy.buffer]);
		} catch {
			finish(() =>
				reject(new Error("The .ograph archive could not be opened."))
			);
		}
	});
}

async function decodeLegacyGraphSource(
	data: string | Uint8Array,
	signal?: AbortSignal
) {
	throwIfGraphImportCanceled(signal);
	if (typeof data === "string") {
		if (new TextEncoder().encode(data).byteLength > MAX_LEGACY_XML_BYTES) {
			throw new Error(
				"The legacy graph XML is larger than the 16 MB import limit."
			);
		}
		return data;
	}
	if (data.byteLength > MAX_GRAPH_DOCUMENT_BYTES) {
		throw new Error(
			"The legacy graph archive is larger than the 8 MB import limit."
		);
	}
	const isZip = data[0] === 0x50 && data[1] === 0x4b;
	if (!isZip) return new TextDecoder().decode(data);
	return decodeLegacyGraphArchive(data, signal);
}

function parseLegacyGraphXml(xml: string) {
	if (/<!\s*(?:DOCTYPE|ENTITY)\b/i.test(xml)) {
		throw new Error(
			"Legacy graph imports cannot contain DOCTYPE or ENTITY declarations."
		);
	}

	/*
	 * Security boundary: this parses untrusted input as a detached XML document,
	 * never as HTML and never into the page DOM. Only elements in the original
	 * GraphSketcher namespace are accepted, and the importer copies selected
	 * primitive values into a normalized GraphDocument. Exporters escape those
	 * values before producing SVG.
	 */
	const parsed = new DOMParser().parseFromString(xml, "application/xml");
	if (parsed.querySelector("parsererror")) {
		throw new Error("The .ograph document contains malformed XML.");
	}

	const elementCount = parsed.getElementsByTagName("*").length;
	if (elementCount > MAX_LEGACY_ELEMENTS) {
		throw new Error(
			`Legacy graph imports are limited to ${MAX_LEGACY_ELEMENTS.toLocaleString()} XML elements.`
		);
	}

	const root = parsed.documentElement;
	if (root.namespaceURI !== LEGACY_GRAPH_NAMESPACE) {
		throw new Error(
			"The file is not an original GraphSketcher .ograph document."
		);
	}
	const legacyElementCount = parsed.getElementsByTagNameNS(
		LEGACY_GRAPH_NAMESPACE,
		"*"
	).length;
	if (legacyElementCount !== elementCount) {
		throw new Error(
			"The .ograph document contains elements outside the original GraphSketcher namespace."
		);
	}

	return root;
}

export async function importLegacyGraphSketcherDocument(
	data: string | Uint8Array,
	title = "Imported Graph",
	signal?: AbortSignal
): Promise<LegacyGraphImportResult> {
	const xml = await decodeLegacyGraphSource(data, signal);
	throwIfGraphImportCanceled(signal);
	const root = parseLegacyGraphXml(xml);
	const graph = legacyChildren(root, "graph")[0];
	if (!graph)
		throw new Error("The .ograph document does not contain a graph.");
	const labelElements = legacyChildren(graph, "label");
	const vertexElements = legacyChildren(graph, "vertex");
	const lineElements = legacyChildren(graph, "line");
	const fillElements = legacyChildren(graph, "fill");
	if (labelElements.length > MAX_LEGACY_LABELS) {
		throw new Error(
			`Legacy graph imports are limited to ${MAX_LEGACY_LABELS.toLocaleString()} labels.`
		);
	}
	if (vertexElements.length > MAX_LEGACY_VERTICES) {
		throw new Error(
			`Legacy graph imports are limited to ${MAX_LEGACY_VERTICES.toLocaleString()} vertices.`
		);
	}
	if (lineElements.length + fillElements.length > MAX_GRAPH_SERIES) {
		throw new Error(
			`Legacy graph imports are limited to ${MAX_GRAPH_SERIES} line and fill series.`
		);
	}

	const warnings: string[] = [];
	const labels = parseLegacyLabels(labelElements, warnings);
	const axisLabelIds = new Set<string>();
	const xAxis = parseLegacyAxis(graph, "x", labels, axisLabelIds);
	const yAxis = parseLegacyAxis(graph, "y", labels, axisLabelIds);
	const canvasElement = legacyChild(graph, "canvas");
	const whitespace = canvasElement
		? legacyChild(canvasElement, "whitespace")
		: undefined;
	const vertices = new Map<string, LegacyVertex>();
	const ownerLabels = new Map(
		[...labels.values()]
			.filter(label => label.ownerId)
			.map(label => [label.ownerId as string, label])
	);
	for (const [index, element] of vertexElements.entries()) {
		const id = element.getAttribute("id")?.trim() || `vertex-${index + 1}`;
		const point: GraphDataPoint = {
			x: legacyNumber(element, "x", 0),
			y: legacyNumber(element, "y", 0)
		};
		const pointLabel = ownerLabels.get(id)?.text;
		if (pointLabel) point.label = pointLabel;
		if (legacyChild(element, "snapped-to")) {
			addBoundedMessage(
				warnings,
				`Snapping for point "${id}" was flattened.`,
				"warnings"
			);
		}
		vertices.set(id, {
			id,
			point,
			color: legacyColor(element, "#2563eb"),
			markerShape: legacyMarker(element.getAttribute("shape")),
			markerSize: Math.max(0, legacyNumber(element, "width", 6))
		});
	}

	const consumedVertices = new Set<string>();
	const series: GraphSeries[] = [];
	let importedPointCount = 0;
	for (const [index, element] of lineElements.entries()) {
		const ids = legacyVertexIds(
			element,
			MAX_GRAPH_POINTS - importedPointCount,
			[element.getAttribute("v1"), element.getAttribute("v2")]
		);
		const lineVertices = ids
			.map(id => vertices.get(id))
			.filter((vertex): vertex is LegacyVertex => Boolean(vertex));
		if (lineVertices.length < 2) {
			addBoundedMessage(
				warnings,
				`Line ${index + 1} referenced fewer than two available points.`,
				"warnings"
			);
			continue;
		}
		importedPointCount += lineVertices.length;
		ids.forEach(id => consumedVertices.add(id));
		const first = lineVertices[0];
		const lineId =
			element.getAttribute("id")?.trim() || `line-${index + 1}`;
		const ownedName = ownerLabels.get(lineId)?.text;
		series.push({
			id: lineId,
			name:
				ownedName ||
				(element.getAttribute("class")?.toLowerCase() === "fit"
					? `Fit line ${index + 1}`
					: `Series ${index + 1}`),
			isVisible: legacyBoolean(element, "visible", true),
			lineStyle: legacyLineStyle(element.getAttribute("dash")),
			lineMode: legacyLineMode(element.getAttribute("method")),
			markerShape: first.markerShape,
			color: legacyColor(element, first.color),
			strokeWidth: Math.max(0, legacyNumber(element, "width", 2)),
			markerSize: first.markerSize,
			fillArea: false,
			points: lineVertices.map(vertex => vertex.point)
		});
	}

	for (const [index, element] of fillElements.entries()) {
		const ids = legacyVertexIds(
			element,
			MAX_GRAPH_POINTS - importedPointCount
		);
		const fillVertices = ids
			.map(id => vertices.get(id))
			.filter((vertex): vertex is LegacyVertex => Boolean(vertex));
		if (fillVertices.length < 3) continue;
		importedPointCount += fillVertices.length;
		ids.forEach(id => consumedVertices.add(id));
		series.push({
			id: element.getAttribute("id")?.trim() || `fill-${index + 1}`,
			name: `Imported fill ${index + 1}`,
			isVisible: true,
			lineStyle: "solid",
			lineMode: "straight",
			markerShape: "none",
			color: legacyColor(element, "#2563eb66"),
			strokeWidth: 1.5,
			markerSize: 0,
			fillArea: true,
			points: fillVertices.map(vertex => vertex.point)
		});
		addBoundedMessage(
			warnings,
			`Fill ${index + 1} was simplified to an editable area boundary.`,
			"warnings"
		);
	}

	const freeGroups = new Map<string, LegacyVertex[]>();
	for (const vertex of vertices.values()) {
		if (consumedVertices.has(vertex.id)) continue;
		const key = `${vertex.color}|${vertex.markerShape}|${vertex.markerSize}`;
		const group = freeGroups.get(key) ?? [];
		if (
			!freeGroups.has(key) &&
			series.length + freeGroups.size >= MAX_GRAPH_SERIES
		) {
			throw new Error(
				`Legacy graph imports are limited to ${MAX_GRAPH_SERIES} series.`
			);
		}
		group.push(vertex);
		freeGroups.set(key, group);
	}
	for (const [index, group] of [...freeGroups.values()].entries()) {
		if (importedPointCount + group.length > MAX_GRAPH_POINTS) {
			throw new Error(
				`Legacy graph imports are limited to ${MAX_GRAPH_POINTS.toLocaleString()} total points.`
			);
		}
		importedPointCount += group.length;
		const first = group[0];
		series.push({
			id: `free-points-${index + 1}`,
			name: `Imported points ${index + 1}`,
			isVisible: true,
			lineStyle: "none",
			lineMode: "none",
			markerShape: first.markerShape,
			color: first.color,
			strokeWidth: 0,
			markerSize: first.markerSize,
			fillArea: false,
			points: group.map(vertex => vertex.point)
		});
	}

	const annotations: GraphAnnotation[] = [];
	for (const label of labels.values()) {
		if (
			label.ownerId ||
			axisLabelIds.has(label.id) ||
			!label.text ||
			label.x === undefined ||
			label.y === undefined
		) {
			continue;
		}
		if (annotations.length >= MAX_GRAPH_ANNOTATIONS) {
			throw new Error(
				`Legacy graph imports are limited to ${MAX_GRAPH_ANNOTATIONS.toLocaleString()} standalone annotations.`
			);
		}
		annotations.push({
			id: label.id,
			kind: "text",
			coordinateSpace: "data",
			x: label.x,
			y: label.y,
			text: label.text,
			color: label.color,
			fillColor: "#00000000",
			strokeWidth: 1.5,
			fontSize: label.fontSize
		});
	}
	if (legacyChildren(graph, "group").length) {
		addBoundedMessage(
			warnings,
			"Legacy groups were flattened into independently editable objects.",
			"warnings"
		);
	}

	return {
		document: normalizeGraphDocument({
			schemaVersion: 1,
			title,
			description:
				"Imported from an original GraphSketcher .ograph document.",
			canvas: {
				width: legacyNumber(canvasElement, "w", 960),
				height: legacyNumber(canvasElement, "h", 640),
				paddingLeft: legacyNumber(whitespace, "left", 78),
				paddingTop: legacyNumber(whitespace, "top", 54),
				paddingRight: legacyNumber(whitespace, "right", 34),
				paddingBottom: legacyNumber(whitespace, "bottom", 74),
				backgroundColor: legacyColor(canvasElement, "#ffffff"),
				showLegend: true,
				legendPosition: "topRight"
			},
			xAxis,
			yAxis,
			series,
			annotations
		}),
		warnings
	};
}

function escapeXml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function markerSvg(
	shape: GraphMarkerShape,
	x: number,
	y: number,
	size: number,
	color: string
) {
	const radius = Math.max(1, size / 2);
	const common = `fill="${escapeXml(color)}" stroke="${escapeXml(color)}"`;
	if (shape === "none") return "";
	if (shape === "circle") {
		return `<circle cx="${x}" cy="${y}" r="${radius}" ${common}/>`;
	}
	if (shape === "square") {
		return `<rect x="${x - radius}" y="${y - radius}" width="${size}" height="${size}" ${common}/>`;
	}
	if (shape === "triangle") {
		return `<path d="M ${x} ${y - radius} L ${x + radius} ${y + radius} L ${
			x - radius
		} ${y + radius} Z" ${common}/>`;
	}
	if (shape === "diamond") {
		return `<path d="M ${x} ${y - radius} L ${x + radius} ${y} L ${x} ${
			y + radius
		} L ${x - radius} ${y} Z" ${common}/>`;
	}
	const diagonal =
		shape === "cross"
			? `M ${x - radius} ${y - radius} L ${x + radius} ${
					y + radius
				} M ${x + radius} ${y - radius} L ${x - radius} ${y + radius}`
			: `M ${x - radius} ${y} L ${x + radius} ${y} M ${x} ${
					y - radius
				} L ${x} ${y + radius}`;
	return `<path d="${diagonal}" fill="none" stroke="${escapeXml(
		color
	)}" stroke-width="2"/>`;
}

function annotationSvg(document: GraphDocument, annotation: GraphAnnotation) {
	const first =
		annotation.coordinateSpace === "data"
			? graphPointToCanvas(document, annotation)
			: { x: annotation.x, y: annotation.y, isValid: true };
	if (!first.isValid) return "";
	if (annotation.kind === "text") {
		return `<text x="${first.x}" y="${first.y}" fill="${escapeXml(
			annotation.color
		)}" font-size="${annotation.fontSize}" dominant-baseline="middle">${escapeXml(
			annotation.text
		)}</text>`;
	}
	const second =
		annotation.coordinateSpace === "data"
			? graphPointToCanvas(document, {
					x: annotation.x2 ?? annotation.x,
					y: annotation.y2 ?? annotation.y
				})
			: {
					x: annotation.x2 ?? annotation.x,
					y: annotation.y2 ?? annotation.y,
					isValid: true
				};
	if (!second.isValid) return "";
	const style = `stroke="${escapeXml(annotation.color)}" stroke-width="${
		annotation.strokeWidth
	}" fill="${escapeXml(annotation.fillColor)}"`;
	if (annotation.kind === "rectangle") {
		return `<rect x="${Math.min(first.x, second.x)}" y="${Math.min(
			first.y,
			second.y
		)}" width="${Math.abs(second.x - first.x)}" height="${Math.abs(
			second.y - first.y
		)}" ${style}/>`;
	}
	if (annotation.kind === "ellipse") {
		return `<ellipse cx="${(first.x + second.x) / 2}" cy="${
			(first.y + second.y) / 2
		}" rx="${Math.abs(second.x - first.x) / 2}" ry="${
			Math.abs(second.y - first.y) / 2
		}" ${style}/>`;
	}
	const marker =
		annotation.kind === "arrow" ? ' marker-end="url(#graph-arrow)"' : "";
	return `<line x1="${first.x}" y1="${first.y}" x2="${second.x}" y2="${
		second.y
	}" ${style}${marker}/>`;
}

function legendCoordinates(
	document: GraphDocument,
	width: number,
	height: number
) {
	const padding = 14;
	const position = document.canvas.legendPosition;
	return {
		x: position.endsWith("Right")
			? document.canvas.width - document.canvas.paddingRight - width
			: document.canvas.paddingLeft,
		y: position.startsWith("bottom")
			? document.canvas.height - document.canvas.paddingBottom - height
			: document.canvas.paddingTop,
		padding
	};
}

export function graphDocumentToSvg(input: GraphDocument) {
	const document = normalizeGraphDocument(input);
	const { canvas } = document;
	const bounds = plotBoundsForCanvas(canvas);
	const xTicks = graphAxisTicks(document.xAxis);
	const yTicks = graphAxisTicks(document.yAxis);
	const xAxisY =
		document.yAxis.scale === "linear" &&
		document.yAxis.minimum <= 0 &&
		document.yAxis.maximum >= 0
			? graphPointToCanvas(document, { x: document.xAxis.minimum, y: 0 })
					.y
			: bounds.bottom;
	const yAxisX =
		document.xAxis.scale === "linear" &&
		document.xAxis.minimum <= 0 &&
		document.xAxis.maximum >= 0
			? graphPointToCanvas(document, { x: 0, y: document.yAxis.minimum })
					.x
			: bounds.left;
	const grid = [
		...xTicks
			.filter(() => document.xAxis.showGridLines)
			.map(tick => {
				const x = bounds.left + tick.position * bounds.width;
				return `<line x1="${x}" y1="${bounds.top}" x2="${x}" y2="${bounds.bottom}"/>`;
			}),
		...yTicks
			.filter(() => document.yAxis.showGridLines)
			.map(tick => {
				const y = bounds.bottom - tick.position * bounds.height;
				return `<line x1="${bounds.left}" y1="${y}" x2="${bounds.right}" y2="${y}"/>`;
			})
	].join("");
	const axes = [
		document.xAxis.showAxisLine
			? `<line x1="${bounds.left}" y1="${xAxisY}" x2="${bounds.right}" y2="${xAxisY}"/>`
			: "",
		document.yAxis.showAxisLine
			? `<line x1="${yAxisX}" y1="${bounds.top}" x2="${yAxisX}" y2="${bounds.bottom}"/>`
			: ""
	].join("");
	const tickLabels = [
		...xTicks
			.filter(() => document.xAxis.showTickLabels)
			.map(tick => {
				const x = bounds.left + tick.position * bounds.width;
				return `<text x="${x}" y="${bounds.bottom + 22}" text-anchor="middle">${escapeXml(
					tick.label
				)}</text>`;
			}),
		...yTicks
			.filter(() => document.yAxis.showTickLabels)
			.map(tick => {
				const y = bounds.bottom - tick.position * bounds.height;
				return `<text x="${bounds.left - 10}" y="${y}" text-anchor="end" dominant-baseline="middle">${escapeXml(
					tick.label
				)}</text>`;
			})
	].join("");

	const seriesSvg = document.series
		.filter(series => series.isVisible)
		.map(series => {
			const path = graphSeriesPath(document, series);
			const areaPath = graphSeriesAreaPath(document, series);
			const dashArray = graphLineDashArray(series.lineStyle);
			const stroke =
				series.lineStyle !== "none" && path
					? `<path d="${path}" fill="none" stroke="${escapeXml(
							series.color
						)}" stroke-width="${series.strokeWidth}"${
							dashArray ? ` stroke-dasharray="${dashArray}"` : ""
						} stroke-linecap="round" stroke-linejoin="round"/>`
					: "";
			const area = areaPath
				? `<path d="${areaPath}" fill="${escapeXml(
						series.color
					)}" fill-opacity="0.18" stroke="none"/>`
				: "";
			const points = series.points
				.map(point => {
					const canvasPoint = graphPointToCanvas(document, point);
					if (!canvasPoint.isValid) return "";
					const errorParts: string[] = [];
					if (point.xError) {
						const left = graphPointToCanvas(document, {
							x: point.x - point.xError,
							y: point.y
						});
						const right = graphPointToCanvas(document, {
							x: point.x + point.xError,
							y: point.y
						});
						if (left.isValid && right.isValid) {
							errorParts.push(
								`<path d="M ${left.x} ${canvasPoint.y} H ${right.x} M ${left.x} ${
									canvasPoint.y - 5
								} V ${canvasPoint.y + 5} M ${right.x} ${
									canvasPoint.y - 5
								} V ${canvasPoint.y + 5}"/>`
							);
						}
					}
					if (point.yError) {
						const top = graphPointToCanvas(document, {
							x: point.x,
							y: point.y + point.yError
						});
						const bottom = graphPointToCanvas(document, {
							x: point.x,
							y: point.y - point.yError
						});
						if (top.isValid && bottom.isValid) {
							errorParts.push(
								`<path d="M ${canvasPoint.x} ${top.y} V ${bottom.y} M ${
									canvasPoint.x - 5
								} ${top.y} H ${canvasPoint.x + 5} M ${
									canvasPoint.x - 5
								} ${bottom.y} H ${canvasPoint.x + 5}"/>`
							);
						}
					}
					const label = point.label
						? `<text x="${canvasPoint.x + series.markerSize}" y="${
								canvasPoint.y - series.markerSize
							}" font-size="12">${escapeXml(point.label)}</text>`
						: "";
					return `<g class="error-bars" fill="none" stroke="${escapeXml(
						series.color
					)}" stroke-width="1.25">${errorParts.join("")}</g>${markerSvg(
						series.markerShape,
						canvasPoint.x,
						canvasPoint.y,
						series.markerSize,
						series.color
					)}${label}`;
				})
				.join("");
			return `${area}${stroke}${points}`;
		})
		.join("");
	const annotationMarkup = document.annotations
		.map(annotation => annotationSvg(document, annotation))
		.join("");

	const legendSeries = document.series.filter(series => series.isVisible);
	const legendWidth = Math.min(
		260,
		Math.max(
			130,
			...legendSeries.map(series => series.name.length * 7 + 54)
		)
	);
	const legendHeight = legendSeries.length * 24 + 18;
	const legendLocation = legendCoordinates(
		document,
		legendWidth,
		legendHeight
	);
	const legend =
		canvas.showLegend && legendSeries.length
			? `<g class="legend"><rect x="${legendLocation.x}" y="${
					legendLocation.y
				}" width="${legendWidth}" height="${legendHeight}" rx="8"/>${legendSeries
					.map((series, index) => {
						const y = legendLocation.y + 20 + index * 24;
						return `<line x1="${legendLocation.x + 12}" y1="${y}" x2="${
							legendLocation.x + 38
						}" y2="${y}" stroke="${escapeXml(
							series.color
						)}" stroke-width="2"/><text x="${
							legendLocation.x + 46
						}" y="${y}" dominant-baseline="middle">${escapeXml(
							series.name
						)}</text>`;
					})
					.join("")}</g>`
			: "";

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${
		canvas.height
	}" viewBox="0 0 ${canvas.width} ${canvas.height}" role="img" aria-labelledby="graph-title graph-description">
  <title id="graph-title">${escapeXml(document.title)}</title>
  <desc id="graph-description">${escapeXml(document.description || "Graph created with Graph Sketcher")}</desc>
  <defs>
    <clipPath id="graph-plot-clip"><rect x="${bounds.left}" y="${
		bounds.top
	}" width="${bounds.width}" height="${bounds.height}"/></clipPath>
    <marker id="graph-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="context-stroke"/></marker>
  </defs>
  <style>
    text { font-family: "Avenir Next", "Segoe UI", Arial, sans-serif; fill: #1f2937; font-size: 12px; }
    .grid { stroke: #d7dde5; stroke-width: 1; }
    .axes { stroke: #334155; stroke-width: 1.5; }
    .legend rect { fill: #ffffff; fill-opacity: .92; stroke: #cbd5e1; }
  </style>
  <rect width="${canvas.width}" height="${canvas.height}" fill="${escapeXml(
		canvas.backgroundColor
  )}"/>
  <text x="${canvas.width / 2}" y="30" text-anchor="middle" font-size="20" font-weight="600">${escapeXml(
		document.title
  )}</text>
  <g class="grid">${grid}</g>
  <g class="axes">${axes}</g>
  <g class="tick-labels">${tickLabels}</g>
  <g clip-path="url(#graph-plot-clip)">${seriesSvg}${annotationMarkup}</g>
  <text x="${(bounds.left + bounds.right) / 2}" y="${
		canvas.height - 18
  }" text-anchor="middle" font-size="14">${escapeXml(
		document.xAxis.title
  )}</text>
  <text x="20" y="${(bounds.top + bounds.bottom) / 2}" text-anchor="middle" font-size="14" transform="rotate(-90 20 ${
		(bounds.top + bounds.bottom) / 2
  })">${escapeXml(document.yAxis.title)}</text>
  ${legend}
</svg>
`;
}

export function graphCoordinatesFromCanvas(
	document: GraphDocument,
	x: number,
	y: number
) {
	const point = canvasPointToGraph(document, x, y);
	return {
		...point,
		label: `x ${formatGraphNumber(point.x)}, y ${formatGraphNumber(point.y)}`
	};
}
