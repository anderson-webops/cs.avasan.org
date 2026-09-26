import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { describe, expect, it } from "vitest";
import { codeArgumentDiagnostics } from "../src/modules/codeArgumentDiagnostics";

function diagnostics(code: string, language: "python" | "java" = "python") {
	return codeArgumentDiagnostics(
		EditorState.create({
			doc: code,
			extensions: [language === "python" ? python() : java()]
		}),
		language
	);
}

describe("required arguments before execution", () => {
	it("reports the missing parameter at an instance method call", () => {
		const code =
			"class OrbitSim:\n    def move(self, distance):\n        pass\norb = OrbitSim()\norb.move()";
		const result = diagnostics(code);
		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({
			severity: "warning",
			source: "Arguments",
			message: "orb.move() is missing required argument: 'distance'."
		});
		expect(code.slice(result[0].from, result[0].to)).toBe("orb.move()");
		expect(diagnostics(code.replace("orb.move()", "orb.move(10)"))).toEqual(
			[]
		);
	});
	it("distinguishes bound, unbound, static and class methods", () => {
		expect(
			diagnostics(`class A:
    def move(self, amount): pass
    @staticmethod
    def make(size): pass
    @classmethod
    def build(cls, size): pass
    def run(self):
        self.move()
a = A()
a.move()
A.move(a, 1)
A.make()
a.make(2)
A.build()
a.build(2)
`).map(item => item.message)
		).toEqual([
			"self.move() is missing required argument: 'amount'.",
			"a.move() is missing required argument: 'amount'.",
			"A.make() is missing required argument: 'size'.",
			"A.build() is missing required argument: 'size'."
		]);
	});
	it("checks constructors without asking students to pass self", () => {
		expect(
			diagnostics(
				"class A:\n    def __init__(self, width): pass\na = A()"
			)[0]?.message
		).toBe("A() is missing required argument: 'width'.");
	});
	it("understands defaults, annotations, nested commas, keywords and variadic parameters", () => {
		expect(
			diagnostics(`def draw(size: int, color=(1, 2, 3), *points, speed, **options): pass
draw(5, speed=2)
draw(size=5, speed=2)
draw(5)
draw(*(5,), **options)
`).map(item => item.message)
		).toEqual(["draw() is missing required argument: 'speed'."]);
	});
	it("preserves positional-only and keyword-only requirements", () => {
		expect(
			diagnostics(`def move(x, /, y=2, *, speed): pass
move(x=1, speed=3)
move(1, speed=3)
move(1)
`).map(item => item.message)
		).toEqual([
			"move() is missing required argument: 'x'.",
			"move() is missing required argument: 'speed'."
		]);
	});
	it("handles a trailing positional-only marker and a variadic bound receiver", () => {
		expect(
			diagnostics(`def move(x, /): pass
move(x=1)
class A:
    def draw(*args, color): pass
a = A()
a.draw()
`).map(item => item.message)
		).toEqual([
			"move() is missing required argument: 'x'.",
			"a.draw() is missing required argument: 'color'."
		]);
	});
	it("counts nested expressions and multiline calls as single arguments", () => {
		expect(
			diagnostics(`def draw(position, colors): pass
draw(
    (1, 2), # position
    {"color": (4, 5, 6)},
)
draw("comma, inside", [1, 2])
`)
		).toEqual([]);
	});
	it("resolves nested lexical definitions and respects parameter shadowing", () => {
		expect(
			diagnostics(`def draw(x): pass
def outer(draw):
    draw()
def other():
    def draw(): pass
    draw()
draw()
`).map(item => item.message)
		).toEqual(["draw() is missing required argument: 'x'."]);
	});
	it.each([
		"def draw(x): pass\ndraw = lambda: 1\ndraw()",
		"def draw(x): pass\nfrom other import draw\ndraw()",
		"@decorator\ndef draw(x): pass\ndraw()",
		"def draw(x): pass\ndef draw(): pass\ndraw()",
		"def draw(x): pass\ndraw(*args)",
		"def draw(x): pass\ndraw(**kwargs)",
		"def draw(x): pass\nfor draw in callbacks:\n    draw()",
		"class A:\n    def move(self, size): pass\na = A()\na.move = callback\na.move()",
		"class A:\n    def move(self, size): pass\n    move = callback\na = A()\na.move()",
		"from turtle import Turtle\nt = Turtle()\nt.forward()",
		"def draw(x): pass\n# draw()\ns = 'draw()'",
		"def draw(x): pass\ndraw(",
		"def draw(x): pass\n[draw() for draw in callbacks]",
		"def draw(x): pass\nf = draw = callback\ndraw()",
		"def draw(x): pass\nwith context() as draw:\n    draw()",
		"def draw(x): pass\n(draw := other)\ndraw()",
		"def draw(x): pass\ntry: pass\nexcept ValueError as draw:\n    draw()"
	])(
		"avoids guesses for ambiguous, dynamic or incomplete calls: %s",
		code => {
			expect(diagnostics(code)).toEqual([]);
		}
	);
	it("checks Java method and constructor argument counts", () => {
		const result = diagnostics(
			`class Main {
    Main(int size) {}
    void move(int distance) {}
    void run() {
        Main item = new Main();
        item.move();
        this.move();
        move(1);
    }
}`,
			"java"
		);
		expect(result.map(item => item.message)).toEqual([
			"Main() requires at least 1 argument; 0 provided.",
			"move() requires at least 1 argument; 0 provided.",
			"move() requires at least 1 argument; 0 provided."
		]);
	});
	it("respects Java overloads, varargs, nested arguments and unrelated receivers", () => {
		expect(
			diagnostics(
				`class Main {
    static void move(int distance) {}
    static void move() {}
    static void log(String label, int... values) {}
    static void run() {
        Main.move();
        log("x");
        log("x", 1, 2);
        log();
        other.move();
    }
}`,
				"java"
			).map(item => item.message)
		).toEqual(["log() requires at least 1 argument; 0 provided."]);
	});
	it("does not guess at Java inherited overloads", () => {
		expect(
			diagnostics(
				"class Main extends SuperKarel { void move(int steps) {} void run() { move(); } }",
				"java"
			)
		).toEqual([]);
	});
	it("bounds work for oversized documents", () => {
		expect(
			diagnostics(
				`${"# filler\n".repeat(25000)}def draw(x): pass\ndraw()`
			)
		).toEqual([]);
	});
});
