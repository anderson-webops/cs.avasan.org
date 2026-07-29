import { describe, expect, it } from "vitest";
import {
	axisFraction,
	axisValueAtFraction,
	canvasPointToGraph,
	compileGraphExpression,
	createBestFitSeries,
	createBlankGraphDocument,
	createSampleGraphDocument,
	fitGraphAxesToData,
	GraphExpressionError,
	graphDocumentFromJson,
	graphDocumentToJson,
	graphPointToCanvas,
	graphProjectFileName,
	linearRegression,
	MAX_GRAPH_EXPRESSION_DEPTH,
	MAX_GRAPH_EXPRESSION_LENGTH,
	MAX_GRAPH_EXPRESSION_TOKENS,
	normalizeGraphDocument,
	sampleGraphExpression,
	zoomGraphAxis
} from "@/modules/graphSketcher";

describe("Graph Sketcher document model", () => {
	it("round-trips portable .graphsketch projects", () => {
		const sample = createSampleGraphDocument();
		const restored = graphDocumentFromJson(graphDocumentToJson(sample));

		expect(restored).toEqual(sample);
		expect(restored.schemaVersion).toBe(1);
		expect(restored.series).toHaveLength(2);
		expect(graphProjectFileName("Cooling Experiment!")).toBe(
			"cooling-experiment.graphsketch"
		);
	});

	it("normalizes unsafe or out-of-range document values", () => {
		const normalized = normalizeGraphDocument({
			schemaVersion: 1,
			title: "Bounded graph",
			canvas: {
				width: 99_999,
				height: -2,
				paddingLeft: 4_000,
				paddingRight: 4_000,
				backgroundColor: "not-css"
			},
			xAxis: { minimum: 5, maximum: 5 },
			yAxis: { scale: "logarithmic", minimum: -1, maximum: 100 },
			series: [],
			annotations: []
		});

		expect(normalized.canvas.width).toBe(4_096);
		expect(normalized.canvas.height).toBe(240);
		expect(normalized.canvas.backgroundColor).toBe("#ffffff");
		expect(normalized.canvas.paddingLeft).toBeLessThan(
			normalized.canvas.width
		);
		expect(normalized.xAxis.minimum).toBeLessThan(normalized.xAxis.maximum);
		expect(normalized.yAxis.minimum).toBeGreaterThan(0);
		expect(normalized.series).toHaveLength(1);
	});

	it("maps graph and canvas coordinates in both directions", () => {
		const document = createBlankGraphDocument();
		document.xAxis.minimum = -5;
		document.xAxis.maximum = 15;
		document.yAxis.minimum = -20;
		document.yAxis.maximum = 20;

		const canvas = graphPointToCanvas(document, { x: 5, y: 10 });
		const graph = canvasPointToGraph(document, canvas.x, canvas.y);

		expect(canvas.isValid).toBe(true);
		expect(graph.x).toBeCloseTo(5);
		expect(graph.y).toBeCloseTo(10);
		expect(
			axisValueAtFraction(document.xAxis, axisFraction(document.xAxis, 3))
		).toBeCloseTo(3);
	});

	it("evaluates bounded math expressions without JavaScript execution", () => {
		const evaluate = compileGraphExpression(
			"2 * sin(pi * x) + sqrt(4) + max(1, x)"
		);

		expect(evaluate(0.5)).toBeCloseTo(5);
		expect(() => compileGraphExpression("window.alert(1)")).toThrow(
			/unknown|unexpected/i
		);
		expect(() => compileGraphExpression("x = 7")).toThrow(/unexpected/i);
		for (const inheritedName of [
			"constructor",
			"constructor(1)",
			"__proto__",
			"__proto__(1)"
		]) {
			expect(() => compileGraphExpression(inheritedName)).toThrow(
				GraphExpressionError
			);
		}

		const points = sampleGraphExpression(
			"sin(x)",
			{
				...createBlankGraphDocument().xAxis,
				minimum: -Math.PI,
				maximum: Math.PI
			},
			createBlankGraphDocument().yAxis,
			101
		);
		expect(points.length).toBeGreaterThan(90);
		expect(points.every(point => Number.isFinite(point.y))).toBe(true);
	});

	it("rejects oversized or excessively complex expressions", () => {
		expect(() =>
			compileGraphExpression("x".repeat(MAX_GRAPH_EXPRESSION_LENGTH + 1))
		).toThrow(GraphExpressionError);

		const tooManyTokens = Array.from(
			{ length: MAX_GRAPH_EXPRESSION_TOKENS / 2 + 1 },
			() => "x"
		).join(" ");
		expect(() => compileGraphExpression(tooManyTokens)).toThrow(
			GraphExpressionError
		);
	});

	it("bounds recursive expression nesting without overflowing the stack", () => {
		const allowedParentheses =
			"(".repeat(MAX_GRAPH_EXPRESSION_DEPTH) +
			"x" +
			")".repeat(MAX_GRAPH_EXPRESSION_DEPTH);
		expect(compileGraphExpression(allowedParentheses)(3)).toBe(3);

		const excessiveParentheses =
			"(".repeat(MAX_GRAPH_EXPRESSION_DEPTH + 1) +
			"x" +
			")".repeat(MAX_GRAPH_EXPRESSION_DEPTH + 1);
		const excessiveFunctions =
			"sin(".repeat(MAX_GRAPH_EXPRESSION_DEPTH + 1) +
			"x" +
			")".repeat(MAX_GRAPH_EXPRESSION_DEPTH + 1);
		const excessiveUnary = "-".repeat(MAX_GRAPH_EXPRESSION_DEPTH + 1) + "x";
		const excessivePower = Array.from(
			{ length: MAX_GRAPH_EXPRESSION_DEPTH + 2 },
			() => "x"
		).join("^");

		for (const expression of [
			excessiveParentheses,
			excessiveFunctions,
			excessiveUnary,
			excessivePower
		]) {
			expect(() => compileGraphExpression(expression)).toThrow(
				GraphExpressionError
			);
		}
	});

	it("creates and refreshes statistically useful graph ranges", () => {
		const source = {
			...createBlankGraphDocument().series[0],
			id: "measurements",
			name: "Measurements",
			points: [
				{ x: 0, y: 1 },
				{ x: 1, y: 3 },
				{ x: 2, y: 5 },
				{ x: 3, y: 7 }
			]
		};
		const regression = linearRegression(source.points);
		const bestFit = createBestFitSeries(source);

		expect(regression).toMatchObject({
			slope: 2,
			intercept: 1,
			rSquared: 1
		});
		expect(bestFit?.sourceSeriesId).toBe("measurements");
		expect(bestFit?.points).toEqual([
			{ x: 0, y: 1 },
			{ x: 3, y: 7 }
		]);

		const document = createBlankGraphDocument();
		document.series = [source];
		fitGraphAxesToData(document);
		expect(document.xAxis.minimum).toBeLessThan(0);
		expect(document.xAxis.maximum).toBeGreaterThan(3);
		expect(document.yAxis.minimum).toBeLessThan(1);
		expect(document.yAxis.maximum).toBeGreaterThan(7);

		const previousRange = document.xAxis.maximum - document.xAxis.minimum;
		zoomGraphAxis(document.xAxis, 1.5, 0.5);
		expect(document.xAxis.maximum - document.xAxis.minimum).toBeCloseTo(
			previousRange * 0.5
		);
	});
});
