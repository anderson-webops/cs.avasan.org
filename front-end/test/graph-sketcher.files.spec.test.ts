import { zipSync } from "fflate";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createSampleGraphDocument } from "@/modules/graphSketcher";
import {
	extractLegacyGraphXmlFromArchive,
	safeGraphArchiveErrorMessage
} from "@/modules/graphSketcherArchive";
import type {
	GraphSketcherArchiveWorkerRequest,
	GraphSketcherArchiveWorkerResponse
} from "@/modules/graphSketcherArchive";
import {
	graphDocumentToCsv,
	graphDocumentToSvg,
	importDelimitedGraphData,
	importLegacyGraphSketcherDocument
} from "@/modules/graphSketcherFiles";

const originalWorker = globalThis.Worker;

class GraphSketcherArchiveWorkerStub {
	private isTerminated = false;
	private readonly messageListeners: Array<
		(event: MessageEvent<GraphSketcherArchiveWorkerResponse>) => void
	> = [];

	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject
	) {
		if (type === "message" && typeof listener === "function") {
			this.messageListeners.push(
				listener as (
					event: MessageEvent<GraphSketcherArchiveWorkerResponse>
				) => void
			);
		}
	}

	postMessage(message: GraphSketcherArchiveWorkerRequest) {
		queueMicrotask(() => {
			if (this.isTerminated) return;
			let response: GraphSketcherArchiveWorkerResponse;
			try {
				response = {
					ok: true,
					xml: extractLegacyGraphXmlFromArchive(
						new Uint8Array(message.archive),
						message.maxArchiveBytes,
						message.maxXmlBytes
					)
				};
			} catch (error) {
				response = {
					ok: false,
					message: safeGraphArchiveErrorMessage(error)
				};
			}
			const event = new MessageEvent("message", { data: response });
			for (const listener of this.messageListeners) listener(event);
		});
	}

	terminate() {
		this.isTerminated = true;
	}
}

beforeAll(() => {
	Object.defineProperty(globalThis, "Worker", {
		configurable: true,
		value: GraphSketcherArchiveWorkerStub
	});
});

afterAll(() => {
	if (originalWorker) {
		Object.defineProperty(globalThis, "Worker", {
			configurable: true,
			value: originalWorker
		});
	} else {
		Reflect.deleteProperty(globalThis, "Worker");
	}
});

const legacyDocument = `<?xml version="1.0" encoding="UTF-8"?>
<document xmlns="http://www.omnigroup.com/namespace/OmniGraphSketcher/v1">
	<graph>
		<canvas w="800" h="500">
			<whitespace left="70" top="40" right="30" bottom="60"/>
		</canvas>
		<axis dimension="x" min="-2" max="8">
			<grid visible="true"/>
			<ticks spacing="2"/>
		</axis>
		<axis dimension="y" min="0" max="20">
			<grid visible="true"/>
		</axis>
		<label id="series-label" owner="line-1">
			<text><p><lit>Imported data</lit></p></text>
		</label>
		<vertex id="v1" x="0" y="2" shape="circle" width="7">
			<color r="0.1" g="0.2" b="0.9"/>
		</vertex>
		<vertex id="v2" x="4" y="10" shape="circle" width="7">
			<color r="0.1" g="0.2" b="0.9"/>
		</vertex>
		<line id="line-1" method="curved" dash="dashes">
			<vertices ids="v1 v2"/>
		</line>
	</graph>
</document>`;

function legacyGraphWith(children: string) {
	return `<document xmlns="http://www.omnigroup.com/namespace/OmniGraphSketcher/v1"><graph>${children}</graph></document>`;
}

describe("Graph Sketcher file compatibility", () => {
	it("imports wide and long CSV or spreadsheet data", () => {
		const wide = importDelimitedGraphData(
			"x,Measured,Reference\n0,82,80\n2,66,65\n4,not-a-number,52"
		);
		expect(wide.series.map(series => series.name)).toEqual([
			"Measured",
			"Reference"
		]);
		expect(wide.series[0].points).toEqual([
			{ x: 0, y: 82 },
			{ x: 2, y: 66 }
		]);
		expect(wide.issues).toHaveLength(1);

		const long = importDelimitedGraphData(
			"series\tx\ty\ty_error\tlabel\nTrial A\t0\t3\t0.2\tstart\nTrial A\t1\t5\t0.3\tend\nTrial B\t0\t4\t\t"
		);
		expect(long.series).toHaveLength(2);
		expect(long.series[0].points[0]).toEqual({
			x: 0,
			y: 3,
			yError: 0.2,
			label: "start"
		});
	});

	it("bounds delimited series, points, columns, and issue messages", () => {
		const tooWide = [
			"x",
			...Array.from({ length: 129 }, (_, index) => `Series ${index + 1}`)
		].join(",");
		expect(() =>
			importDelimitedGraphData(`${tooWide}\n0,${"1,".repeat(128)}1`)
		).toThrow(/128 series columns/i);

		const tooManyLongSeries = [
			"series,x,y",
			...Array.from(
				{ length: 129 },
				(_, index) => `Series ${index + 1},${index},${index}`
			)
		].join("\n");
		expect(() => importDelimitedGraphData(tooManyLongSeries)).toThrow(
			/128 series/i
		);

		const fullWidthHeader = [
			"x",
			...Array.from({ length: 128 }, (_, index) => `Series ${index + 1}`)
		].join(",");
		const overPointLimit = [
			fullWidthHeader,
			...Array.from(
				{ length: 782 },
				(_, rowIndex) => `${rowIndex},${Array(128).fill("1").join(",")}`
			)
		].join("\n");
		expect(() => importDelimitedGraphData(overPointLimit)).toThrow(
			/100,000 total points/i
		);

		const manyInvalidRows = [
			"x,y",
			...Array.from({ length: 20 }, (_, index) => `bad-${index},1`),
			"0,2"
		].join("\n");
		const boundedIssues = importDelimitedGraphData(manyInvalidRows).issues;
		expect(boundedIssues).toHaveLength(13);
		expect(boundedIssues.at(-1)).toMatch(/additional import issues/i);
	});

	it("exports portable data and escaped standalone SVG", () => {
		const document = createSampleGraphDocument();
		document.title = `Cooling <script>alert("no")</script>`;
		document.series[0].points[0].label = "quoted, value";

		const csv = graphDocumentToCsv(document);
		const svg = graphDocumentToSvg(document);

		expect(csv).toContain('"quoted, value"');
		expect(svg).toContain("<svg");
		expect(svg).toContain("Cooling &lt;script&gt;");
		expect(svg).not.toContain("<script>");
		expect(svg).toContain(">Measured</text>");
	});

	it("neutralizes spreadsheet formulas in exported names and labels", () => {
		const document = createSampleGraphDocument();
		document.series[0].name = "=2+2";
		document.series[0].points[0] = {
			x: -3,
			y: 4,
			label: " \t@SUM(A1:A2)"
		};
		document.series[1].name = "+RUN";
		document.series[1].points[0].label = "\u0007-DANGER";

		const csv = graphDocumentToCsv(document);

		expect(csv).toContain("'=2+2,-3,4");
		expect(csv).toContain("' \t@SUM(A1:A2)");
		expect(csv).toContain("'+RUN");
		expect(csv).toContain("'\u0007-DANGER");
		expect(csv).not.toContain(",'-3,");
	});

	it("imports original plain and ZIP-wrapped .ograph documents", async () => {
		const plain = await importLegacyGraphSketcherDocument(
			legacyDocument,
			"Original Graph"
		);
		expect(plain.document.title).toBe("Original Graph");
		expect(plain.document.canvas).toMatchObject({
			width: 800,
			height: 500,
			paddingLeft: 70
		});
		expect(plain.document.xAxis.tickSpacing).toBe(2);
		expect(plain.document.series[0]).toMatchObject({
			name: "Imported data",
			lineMode: "smooth",
			lineStyle: "dashed"
		});
		expect(plain.document.series[0].points).toEqual([
			{ x: 0, y: 2 },
			{ x: 4, y: 10 }
		]);

		const archive = zipSync({
			"Project/contents.xml": new TextEncoder().encode(legacyDocument)
		});
		const zipped = await importLegacyGraphSketcherDocument(
			archive,
			"Archived Graph"
		);
		expect(zipped.document.title).toBe("Archived Graph");
		expect(zipped.document.series[0].points).toHaveLength(2);

		const duplicateArchive = zipSync({
			"First/contents.xml": new TextEncoder().encode(legacyDocument),
			"Second/contents.xml": new TextEncoder().encode(legacyDocument)
		});
		await expect(
			importLegacyGraphSketcherDocument(duplicateArchive)
		).rejects.toThrow(/exactly one contents\.xml/i);
	});

	it.each([
		["omitted", "", "", "", ""],
		["blank", ' a="  "', ' width="  "', ' font-size="  "', ' log-base="  "']
	])(
		"uses declared numeric defaults when legacy attributes are %s",
		async (_, alphaAttribute, widthAttribute, fontSizeAttribute, logBaseAttribute) => {
			const result = await importLegacyGraphSketcherDocument(
				legacyGraphWith(
					`<axis dimension="x" scale="logarithmic" min="1" max="100"${logBaseAttribute}/>` +
						`<label id="note" x="2" y="3"${fontSizeAttribute}><text><p><lit>Default label</lit></p></text></label>` +
						`<vertex id="v1" x="1" y="2"><color r="0.1" g="0.2" b="0.9"${alphaAttribute}/></vertex>` +
						`<vertex id="v2" x="2" y="4"><color r="0.1" g="0.2" b="0.9"${alphaAttribute}/></vertex>` +
						`<line id="line-1"${widthAttribute}><vertices ids="v1 v2"/></line>`
				)
			);

			expect(result.document.series[0]).toMatchObject({
				color: "#1a33e6",
				strokeWidth: 2
			});
			expect(result.document.annotations[0]?.fontSize).toBe(14);
			expect(result.document.xAxis.logarithmBase).toBe(10);
		}
	);

	it("cancels archived imports without applying worker output", async () => {
		const archive = zipSync({
			"Project/contents.xml": new TextEncoder().encode(legacyDocument)
		});
		const controller = new AbortController();
		const importPromise = importLegacyGraphSketcherDocument(
			archive,
			"Canceled Graph",
			controller.signal
		);
		controller.abort();

		await expect(importPromise).rejects.toMatchObject({
			name: "AbortError"
		});
	});

	it("rejects legacy XML declarations that can expand external content", async () => {
		const internalEntity = `<!DOCTYPE document [<!ENTITY classroom "expanded">]>${legacyGraphWith(
			"<label><text><p><lit>&classroom;</lit></p></text></label>"
		)}`;
		const externalEntity = `<!DOCTYPE document [<!ENTITY classroom SYSTEM "https://example.test/student">]>${legacyGraphWith(
			"<label><text><p><lit>&classroom;</lit></p></text></label>"
		)}`;

		await expect(
			importLegacyGraphSketcherDocument(internalEntity)
		).rejects.toThrow(/DOCTYPE or ENTITY/i);
		await expect(
			importLegacyGraphSketcherDocument(externalEntity)
		).rejects.toThrow(/DOCTYPE or ENTITY/i);
	});

	it("rejects foreign HTML or SVG elements in legacy XML", async () => {
		const foreignSvg = legacyGraphWith(
			'<svg xmlns="http://www.w3.org/2000/svg"><script>alert("no")</script></svg>'
		);
		const foreignHtml = legacyGraphWith(
			'<label><text><p><div xmlns="http://www.w3.org/1999/xhtml">Unsafe</div></p></text></label>'
		);

		await expect(
			importLegacyGraphSketcherDocument(foreignSvg)
		).rejects.toThrow(/outside the original GraphSketcher namespace/i);
		await expect(
			importLegacyGraphSketcherDocument(foreignHtml)
		).rejects.toThrow(/outside the original GraphSketcher namespace/i);
	});

	it("copies legacy label markup as inert text and escapes SVG output", async () => {
		const result = await importLegacyGraphSketcherDocument(
			legacyGraphWith(
				'<label id="note" x="1" y="2"><text><p><lit>&lt;img src=x onerror=alert(1)&gt;</lit></p></text></label>'
			)
		);
		const svg = graphDocumentToSvg(result.document);

		expect(result.document.annotations[0]?.text).toBe(
			"<img src=x onerror=alert(1)>"
		);
		expect(svg).toContain("&lt;img src=x onerror=alert(1)&gt;");
		expect(svg).not.toContain("<img");
	});

	it("bounds legacy elements, vertices, labels, and line series", async () => {
		await expect(
			importLegacyGraphSketcherDocument(
				legacyGraphWith(`<group>${"<item/>".repeat(50_000)}</group>`)
			)
		).rejects.toThrow(/50,000 XML elements/i);

		await expect(
			importLegacyGraphSketcherDocument(
				legacyGraphWith(
					`<?budget note="'?><group>${"<item/>".repeat(50_000)}</group>`
				)
			)
		).rejects.toThrow(/50,000 XML elements/i);

		await expect(
			importLegacyGraphSketcherDocument(
				legacyGraphWith("<vertex/>".repeat(20_001))
			)
		).rejects.toThrow(/20,000 vertices/i);

		await expect(
			importLegacyGraphSketcherDocument(
				legacyGraphWith("<label/>".repeat(10_001))
			)
		).rejects.toThrow(/10,000 labels/i);

		await expect(
			importLegacyGraphSketcherDocument(
				legacyGraphWith(
					`<vertex id="v1"/><vertex id="v2"/>${'<line v1="v1" v2="v2"/>'.repeat(
						129
					)}`
				)
			)
		).rejects.toThrow(/128 line and fill series/i);
	});

	it("walks large accepted legacy sibling sets without stalling", async () => {
		const result = await importLegacyGraphSketcherDocument(
			legacyGraphWith(
				"<metadata/>".repeat(10_000) +
					'<vertex id="v1" x="0" y="1"/><vertex id="v2" x="1" y="2"/><line v1="v1" v2="v2"/>'
			)
		);

		expect(result.document.series).toHaveLength(1);
		expect(result.document.series[0].points).toHaveLength(2);
	});

	it("does not count tag-like text toward legacy XML budgets", async () => {
		const ignoredElements = "<item/>".repeat(50_001);
		const ignoredSeries = "<line/><fill/>".repeat(129);
		const result = await importLegacyGraphSketcherDocument(
			legacyGraphWith(
				`<!--${ignoredSeries}--><metadata><![CDATA[${ignoredElements}]]></metadata>` +
					'<vertex id="v1" x="0" y="1"/><vertex id="v2" x="1" y="2"/><line v1="v1" v2="v2"/>'
			)
		);

		expect(result.document.series).toHaveLength(1);
		expect(result.document.series[0].points).toHaveLength(2);
	});

	it("applies object limits only to direct graph children", async () => {
		const nestedTickLabels = "<label/>".repeat(10_001);
		const result = await importLegacyGraphSketcherDocument(
			legacyGraphWith(
				`<axis dimension="x"><tick-labels><user-labels>${nestedTickLabels}</user-labels></tick-labels></axis>` +
					'<vertex id="v1" x="0" y="1"/><vertex id="v2" x="1" y="2"/><line v1="v1" v2="v2"/>'
			)
		);

		expect(result.document.series).toHaveLength(1);
		expect(result.document.series[0].points).toHaveLength(2);
	});

	it("caps legacy import warnings with an omission notice", async () => {
		const vertices = Array.from(
			{ length: 20 },
			(_, index) =>
				`<vertex id="v${index}" x="${index}" y="${index}"><snapped-to/></vertex>`
		).join("");
		const result = await importLegacyGraphSketcherDocument(
			legacyGraphWith(vertices)
		);

		expect(result.warnings).toHaveLength(13);
		expect(result.warnings.at(-1)).toMatch(/additional import warnings/i);
	});

	it("rejects malformed or unrelated legacy documents", async () => {
		await expect(
			importLegacyGraphSketcherDocument("<not-xml")
		).rejects.toThrow(/malformed/i);
		await expect(
			importLegacyGraphSketcherDocument(
				'<document xmlns="https://example.test"><graph/></document>'
			)
		).rejects.toThrow(/not an original/i);
	});
});
