import type { Completion } from "@codemirror/autocomplete";
import type { Diagnostic } from "@codemirror/lint";
import type { Extension } from "@codemirror/state";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";
import type { PythonIdeMode } from "@/modules/pythonIde";
import {
	autocompletion,
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap,
	snippetCompletion
} from "@codemirror/autocomplete";
import {
	insertNewlineAndIndent as codeMirrorInsertNewlineAndIndent,
	defaultKeymap,
	history,
	historyKeymap,
	indentWithTab
} from "@codemirror/commands";
import { python, pythonLanguage } from "@codemirror/lang-python";
import {
	bracketMatching,
	defaultHighlightStyle,
	foldGutter,
	foldKeymap,
	HighlightStyle,
	indentOnInput,
	indentUnit,
	syntaxHighlighting,
	syntaxTree
} from "@codemirror/language";
import { linter, lintGutter, lintKeymap } from "@codemirror/lint";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import {
	EditorSelection,
	EditorState,
	Prec,
	RangeSetBuilder,
	StateEffect,
	StateField
} from "@codemirror/state";
import {
	crosshairCursor,
	Decoration,
	drawSelection,
	dropCursor,
	EditorView,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection,
	scrollPastEnd,
	ViewPlugin
} from "@codemirror/view";
import { tags } from "@lezer/highlight";

interface PythonCodeMirrorOptions {
	onChange: (content: string) => void;
	onCursorCountChange: (count: number) => void;
	assetCompletions?: PythonCodeMirrorAssetCompletionProvider;
	mode?: PythonIdeMode;
	onRun?: () => void;
	onSave?: () => void;
}

interface PythonIdeCompletionContext {
	explicit: boolean;
	pos: number;
	state: EditorState;
	matchBefore: (expression: RegExp) => {
		from: number;
		text: string;
		to: number;
	} | null;
}

type PythonIdeCompletionOption = Completion;

type PythonIdeAssetCompletionFolder = "images" | "music" | "sounds";

export type PythonCodeMirrorAssetCompletionNames = Partial<
	Record<PythonIdeAssetCompletionFolder, string[]>
>;
type PythonCodeMirrorAssetCompletionProvider = () =>
	| PythonCodeMirrorAssetCompletionNames
	| Promise<PythonCodeMirrorAssetCompletionNames>;

interface PythonIdeAssetStringCompletionContext {
	folder: PythonIdeAssetCompletionFolder;
	from: number;
}

interface PythonIdeStringCompletionContext {
	from: number;
	options: PythonIdeCompletionOption[];
	validFor: RegExp;
}

type PythonIdeCompletionResult = PythonIdeStringCompletionContext | null;
type PythonIdeCompletionAsyncResult =
	| PythonIdeCompletionResult
	| Promise<PythonIdeCompletionResult>;

const openingBracketToClosingBracket: Record<string, string> = {
	"(": ")",
	"[": "]",
	"{": "}"
};
const intelligentClosingTokens = [")", "]", "}", "'", '"', "`"];
const pythonIndentText = "    ";
const snippetEnd = snippetField("");
const lineLeadingWhitespaceRegex = /^[\t ]*/;
const pythonCompletionTokenRegex = /(?:[A-Z_]\w*\.){0,2}[A-Z_]\w*$/i;
const pythonCompletionGlobalValidForRegex = /^[A-Z_]\w*$/i;
const pythonCompletionMemberValidForRegex = /^\w*$/;
const pythonAssetStringCompletionValidForRegex = /^[\w.-]*$/;
const pythonTurtleShapeStringCompletionValidForRegex = /^[A-Z_]*$/i;
const pythonIdentifierRegex = /^[A-Z_]\w*$/i;
const closingBrackets = new Set(Object.values(openingBracketToClosingBracket));
const pythonCompletionBlockedNodeNames = new Set([
	"Comment",
	"FormatString",
	"String"
]);
const pythonBracketPairIgnoredNodeNames = new Set(
	pythonCompletionBlockedNodeNames
);
const pgzeroAssetStringCompletionPatterns: Array<{
	folder: PythonIdeAssetCompletionFolder;
	pattern: RegExp;
}> = [
	{ folder: "images", pattern: /\bActor\s*\(\s*["']([^"'\n]*)$/ },
	{ folder: "images", pattern: /\bscreen\.blit\s*\(\s*["']([^"'\n]*)$/ },
	{ folder: "images", pattern: /\bimages\[\s*["']([^"'\n]*)$/ },
	{
		folder: "music",
		pattern: /\bmusic\.(?:play|play_once|queue)\s*\(\s*["']([^"'\n]*)$/
	},
	{ folder: "sounds", pattern: /\bsounds\[\s*["']([^"'\n]*)$/ }
];
const turtleShapeStringCompletionPattern =
	/\b(?:shape|[A-Z_]\w*\.shape)\s*\(\s*["']([^"'\n]*)$/i;
const turtleShapeCompletions = [
	"classic",
	"arrow",
	"turtle",
	"blank",
	"circle",
	"square",
	"triangle",
	"fancy"
].map(shape => completion(shape, "constant", "Turtle shape", 80));
const bracketPairDecorations = [
	bracketDecorationForIndex(0),
	bracketDecorationForIndex(1),
	bracketDecorationForIndex(2),
	bracketDecorationForIndex(3),
	bracketDecorationForIndex(4),
	bracketDecorationForIndex(5)
];
const bracketPairContextScanLimit = 60000;
const unmatchedBracketDecoration = Decoration.mark({
	class: "cm-bracket-pair cm-bracket-unmatched"
});
interface BracketStackEntry {
	expectedClose: string;
	pairIndex: number;
	position: number;
}

export interface PythonBracketPairColorRange {
	from: number;
	pairIndex: number;
	to: number;
	unmatched: boolean;
}

export interface PythonBracketPairIgnoredRange {
	from: number;
	to: number;
}

function bracketDecorationForIndex(index: number) {
	return Decoration.mark({
		class: `cm-bracket-pair cm-bracket-pair-${index + 1}`
	});
}

const pythonHighlightStyle = HighlightStyle.define([
	{ tag: tags.keyword, color: "var(--syntax-keyword)" },
	{ tag: tags.atom, color: "var(--syntax-builtin)" },
	{ tag: tags.bool, color: "var(--syntax-builtin)" },
	{ tag: tags.standard(tags.name), color: "var(--syntax-builtin)" },
	{
		tag: tags.definition(tags.function(tags.name)),
		color: "var(--syntax-function)"
	},
	{ tag: tags.function(tags.name), color: "var(--syntax-function)" },
	{ tag: tags.propertyName, color: "var(--syntax-property)" },
	{ tag: tags.string, color: "var(--syntax-string)" },
	{ tag: tags.comment, color: "var(--syntax-comment)", fontStyle: "italic" },
	{ tag: tags.number, color: "var(--syntax-number)" },
	{ tag: tags.operator, color: "var(--syntax-operator)" },
	{ tag: tags.punctuation, color: "var(--syntax-bracket)" },
	{ tag: tags.bracket, color: "var(--syntax-bracket)", fontWeight: "800" },
	{
		tag: tags.angleBracket,
		color: "var(--syntax-bracket)",
		fontWeight: "800"
	}
]);

const sharedRuntimeCompletions = [
	completion("random", "namespace", "standard library module"),
	completion("math", "namespace", "standard library module"),
	completion("json", "namespace", "standard library module"),
	completion("csv", "namespace", "standard library module"),
	completion("pathlib", "namespace", "standard library module")
];

const turtleRuntimeCompletions = [
	completion("turtle", "namespace", "Turtle graphics module", 40),
	completion("Turtle", "class", "create a drawable turtle", 40),
	completion("Screen", "class", "create or access the canvas screen", 40)
];

const pgzeroRuntimeCompletions = [
	completion("pgzrun", "namespace", "run a PyGame Zero project", 60),
	completion("Actor", "class", "sprite with image, position, and collision"),
	completion("Animation", "class", "running animation handle"),
	completion("Rect", "class", "rectangle for collision and layout"),
	completion("WIDTH", "constant", "canvas width"),
	completion("HEIGHT", "constant", "canvas height"),
	completion("animate", "function", "animate actor or object properties", 40),
	completion("screen", "variable", "PyGame Zero drawing surface"),
	completion("keyboard", "variable", "keyboard state"),
	completion("keys", "variable", "keyboard constants"),
	completion("keymods", "variable", "modifier-key constants"),
	completion("mouse", "variable", "mouse constants"),
	completion("clock", "variable", "schedule timed callbacks"),
	completion("images", "namespace", "loaded image assets"),
	completion("sounds", "namespace", "loaded sound effects"),
	completion("music", "namespace", "background music controller"),
	completion("tone", "namespace", "built-in tone generator"),
	pythonSnippet(
		"draw",
		"PyGame Zero draw callback",
		snippetLines(
			"def draw():",
			`    screen.clear()`,
			`    ${snippetField("body")}`,
			snippetEnd
		),
		70
	),
	pythonSnippet(
		"update",
		"PyGame Zero frame callback",
		snippetLines(
			"def update(dt):",
			`    ${snippetField("body")}`,
			snippetEnd
		),
		70
	),
	pythonSnippet(
		"on_key_down",
		"keyboard event callback",
		snippetLines(
			"def on_key_down(key):",
			`    ${snippetField("body")}`,
			snippetEnd
		),
		60
	),
	pythonSnippet(
		"on_key_up",
		"keyboard release callback",
		snippetLines(
			"def on_key_up(key):",
			`    ${snippetField("body")}`,
			snippetEnd
		),
		60
	),
	pythonSnippet(
		"on_mouse_down",
		"mouse press callback",
		snippetLines(
			"def on_mouse_down(pos, button):",
			`    ${snippetField("body")}`,
			snippetEnd
		),
		60
	),
	pythonSnippet(
		"on_mouse_move",
		"mouse move callback",
		snippetLines(
			"def on_mouse_move(pos):",
			`    ${snippetField("body")}`,
			snippetEnd
		),
		60
	),
	pythonSnippet(
		"on_mouse_up",
		"mouse release callback",
		snippetLines(
			"def on_mouse_up(pos, button):",
			`    ${snippetField("body")}`,
			snippetEnd
		),
		60
	),
	pythonSnippet(
		"on_music_end",
		"music finished callback",
		snippetLines(
			"def on_music_end():",
			`    ${snippetField("body")}`,
			snippetEnd
		),
		60
	),
	pythonSnippet(
		"actor",
		"create an Actor sprite",
		snippetLines(
			`player = Actor("${snippetField("image")}", (${snippetField("x")}, ${snippetField("y")}))`,
			snippetEnd
		),
		65
	)
];

const dataRuntimeCompletions = [
	completion("pd", "namespace", "pandas alias"),
	completion("np", "namespace", "NumPy alias"),
	completion("plt", "namespace", "matplotlib pyplot alias"),
	completion("sns", "namespace", "Seaborn alias"),
	completion("alt", "namespace", "Altair alias"),
	completion("st", "namespace", "Streamlit-style shim"),
	completion("DataFrame", "class", "tabular data object"),
	completion("read_csv", "function", "load CSV data"),
	completion("train_test_split", "function", "split model data"),
	completion("DecisionTreeClassifier", "class", "decision tree model"),
	completion("LinearRegression", "class", "linear regression model")
];

const imageSurfaceMemberCompletions = [
	completion("get_width", "method", "image width"),
	completion("get_height", "method", "image height"),
	completion("get_size", "method", "image size tuple"),
	completion("get_rect", "method", "image bounds rectangle")
];
const soundMemberCompletions = [
	completion("play", "method", "play the sound effect"),
	completion("stop", "method", "stop the sound effect"),
	completion("get_length", "method", "sound length in seconds")
];

const sharedMemberCompletions: Record<string, PythonIdeCompletionOption[]> = {
	Actor: [
		completion("image", "property", "asset name"),
		completion("anchor", "property", "drawing anchor point"),
		completion("pos", "property", "actor position"),
		completion("center", "property", "actor center"),
		completion("topleft", "property", "top-left position"),
		completion("topright", "property", "top-right position"),
		completion("bottomleft", "property", "bottom-left position"),
		completion("bottomright", "property", "bottom-right position"),
		completion("midtop", "property", "middle-top position"),
		completion("midbottom", "property", "middle-bottom position"),
		completion("midleft", "property", "middle-left position"),
		completion("midright", "property", "middle-right position"),
		completion("x", "property", "horizontal position"),
		completion("y", "property", "vertical position"),
		completion("draw", "method", "draw the actor"),
		completion("colliderect", "method", "test rectangle collision"),
		completion("collidepoint", "method", "test point collision"),
		completion("collidelist", "method", "first collision in a list"),
		completion(
			"collidelistall",
			"method",
			"all collision indexes in a list"
		),
		completion("collidedict", "method", "first collision in a dictionary"),
		completion(
			"collidedictall",
			"method",
			"all collisions in a dictionary"
		),
		completion("collideobjects", "method", "first colliding object"),
		completion("collideobjectsall", "method", "all colliding objects"),
		completion("clipline", "method", "clip a line to the actor rectangle"),
		completion(
			"distance_to",
			"method",
			"distance to another actor or point"
		),
		completion("angle_to", "method", "angle to another actor or point")
	],
	Rect: rectMemberCompletions()
};

const turtleMemberCompletions: Record<string, PythonIdeCompletionOption[]> = {
	turtle: [
		completion("Turtle", "class", "create a drawable turtle"),
		completion("Screen", "class", "create or access the canvas screen"),
		completion("colormode", "function", "set RGB color mode"),
		completion("hideturtle", "function", "hide the Turtle cursor"),
		completion("shape", "function", "choose a Turtle cursor shape"),
		completion("showturtle", "function", "show the Turtle cursor")
	],
	pen: turtlePenCompletions(),
	t: turtlePenCompletions(),
	turtlePen: turtlePenCompletions(),
	screen: [
		completion("bgcolor", "method", "set canvas background"),
		completion("title", "method", "set canvas title"),
		completion("listen", "method", "listen for keyboard input"),
		completion("onkey", "method", "bind a key press"),
		completion("onclick", "method", "bind a mouse click"),
		completion("ontimer", "method", "schedule a callback"),
		completion("tracer", "method", "control animation updates"),
		completion("update", "method", "flush pending drawing"),
		completion("mainloop", "method", "keep interactive canvas alive")
	]
};

const pgzeroMemberCompletions: Record<string, PythonIdeCompletionOption[]> = {
	actor: actorMemberCompletions(),
	bounds: rectMemberCompletions(),
	enemy: actorMemberCompletions(),
	hitbox: rectMemberCompletions(),
	player: actorMemberCompletions(),
	rect: rectMemberCompletions(),
	clock: [
		completion("schedule", "method", "run once after a delay"),
		completion("schedule_unique", "method", "replace a scheduled callback"),
		completion("schedule_interval", "method", "repeat on an interval"),
		completion("unschedule", "method", "remove a scheduled callback")
	],
	keyboard: [
		completion("left", "property", "left arrow key"),
		completion("right", "property", "right arrow key"),
		completion("up", "property", "up arrow key"),
		completion("down", "property", "down arrow key"),
		completion("space", "property", "spacebar")
	],
	keys: [
		completion("A", "constant", "A key"),
		completion("B", "constant", "B key"),
		completion("C", "constant", "C key"),
		completion("D", "constant", "D key"),
		completion("DOWN", "constant", "down arrow"),
		completion("E", "constant", "E key"),
		completion("ESCAPE", "constant", "escape key"),
		completion("F", "constant", "F key"),
		completion("F1", "constant", "function key F1"),
		completion("F2", "constant", "function key F2"),
		completion("F3", "constant", "function key F3"),
		completion("F4", "constant", "function key F4"),
		completion("F5", "constant", "function key F5"),
		completion("F6", "constant", "function key F6"),
		completion("F7", "constant", "function key F7"),
		completion("F8", "constant", "function key F8"),
		completion("F9", "constant", "function key F9"),
		completion("F10", "constant", "function key F10"),
		completion("F11", "constant", "function key F11"),
		completion("F12", "constant", "function key F12"),
		completion("G", "constant", "G key"),
		completion("H", "constant", "H key"),
		completion("I", "constant", "I key"),
		completion("J", "constant", "J key"),
		completion("K", "constant", "K key"),
		completion("K_0", "constant", "number key 0"),
		completion("K_1", "constant", "number key 1"),
		completion("K_2", "constant", "number key 2"),
		completion("K_3", "constant", "number key 3"),
		completion("K_4", "constant", "number key 4"),
		completion("K_5", "constant", "number key 5"),
		completion("K_6", "constant", "number key 6"),
		completion("K_7", "constant", "number key 7"),
		completion("K_8", "constant", "number key 8"),
		completion("K_9", "constant", "number key 9"),
		completion("L", "constant", "L key"),
		completion("LEFT", "constant", "left arrow"),
		completion("M", "constant", "M key"),
		completion("N", "constant", "N key"),
		completion("O", "constant", "O key"),
		completion("P", "constant", "P key"),
		completion("Q", "constant", "Q key"),
		completion("R", "constant", "R key"),
		completion("RETURN", "constant", "return key"),
		completion("RIGHT", "constant", "right arrow"),
		completion("S", "constant", "S key"),
		completion("SPACE", "constant", "spacebar"),
		completion("T", "constant", "T key"),
		completion("U", "constant", "U key"),
		completion("UP", "constant", "up arrow"),
		completion("V", "constant", "V key"),
		completion("W", "constant", "W key"),
		completion("X", "constant", "X key"),
		completion("Y", "constant", "Y key"),
		completion("Z", "constant", "Z key"),
		completion("BACKSPACE", "constant", "backspace key"),
		completion("DELETE", "constant", "delete key"),
		completion("END", "constant", "end key"),
		completion("HOME", "constant", "home key"),
		completion("INSERT", "constant", "insert key"),
		completion("PAGEDOWN", "constant", "page down key"),
		completion("PAGEUP", "constant", "page up key"),
		completion("LALT", "constant", "left alt key"),
		completion("LCTRL", "constant", "left control key"),
		completion("LMETA", "constant", "left meta key"),
		completion("LSHIFT", "constant", "left shift key"),
		completion("RALT", "constant", "right alt key"),
		completion("RCTRL", "constant", "right control key"),
		completion("RMETA", "constant", "right meta key"),
		completion("RSHIFT", "constant", "right shift key"),
		completion("KP0", "constant", "keypad 0"),
		completion("KP1", "constant", "keypad 1"),
		completion("KP2", "constant", "keypad 2"),
		completion("KP3", "constant", "keypad 3"),
		completion("KP4", "constant", "keypad 4"),
		completion("KP5", "constant", "keypad 5"),
		completion("KP6", "constant", "keypad 6"),
		completion("KP7", "constant", "keypad 7"),
		completion("KP8", "constant", "keypad 8"),
		completion("KP9", "constant", "keypad 9"),
		completion("KP_ENTER", "constant", "keypad enter")
	],
	keymods: [
		completion("ALT", "constant", "either alt key"),
		completion("CTRL", "constant", "either control key"),
		completion("META", "constant", "either meta key"),
		completion("SHIFT", "constant", "either shift key")
	],
	mouse: [
		completion("LEFT", "constant", "left mouse button"),
		completion("MIDDLE", "constant", "middle mouse button"),
		completion("RIGHT", "constant", "right mouse button"),
		completion("WHEEL_DOWN", "constant", "scroll wheel down"),
		completion("WHEEL_UP", "constant", "scroll wheel up")
	],
	music: [
		completion("fadeout", "method", "fade and stop background music"),
		completion("get_volume", "method", "current music volume"),
		completion("is_playing", "method", "whether music is playing"),
		completion("play", "method", "start background music"),
		completion("play_once", "method", "play music once"),
		completion("queue", "method", "queue background music"),
		completion("stop", "method", "stop background music"),
		completion("pause", "method", "pause background music"),
		completion("unpause", "method", "resume background music"),
		completion("set_volume", "method", "set music volume")
	],
	tone: [
		completion("create", "method", "create a reusable tone sound"),
		completion("play", "method", "play a synthesized note")
	],
	screen: [
		completion("bounds", "method", "screen rectangle"),
		completion("clear", "method", "clear the canvas"),
		completion("fill", "method", "fill the canvas"),
		completion("blit", "method", "draw an image"),
		completion("draw", "property", "drawing helpers")
	],
	"screen.draw": [
		completion("text", "method", "draw text"),
		completion("textbox", "method", "draw text inside a box"),
		completion("line", "method", "draw a line with optional width"),
		completion(
			"circle",
			"method",
			"draw a circle outline with optional width"
		),
		completion("filled_circle", "method", "draw a filled circle"),
		completion(
			"rect",
			"method",
			"draw a rectangle outline with optional width"
		),
		completion("filled_rect", "method", "draw a filled rectangle")
	]
};

const dataMemberCompletions: Record<string, PythonIdeCompletionOption[]> = {
	pd: [
		completion("DataFrame", "class", "create tabular data"),
		completion("read_csv", "function", "load CSV data")
	],
	plt: [
		completion("plot", "method", "line plot"),
		completion("bar", "method", "bar chart"),
		completion("scatter", "method", "scatter plot"),
		completion("hist", "method", "histogram"),
		completion("show", "method", "render chart")
	],
	np: [
		completion("array", "function", "create an array"),
		completion("mean", "function", "average value"),
		completion("median", "function", "middle value"),
		completion("linspace", "function", "evenly spaced values"),
		completion("zeros", "function", "array of zeros")
	],
	st: [
		completion("write", "method", "render text or data"),
		completion("dataframe", "method", "render a data table"),
		completion("pyplot", "method", "render matplotlib output"),
		completion("altair_chart", "method", "render Altair chart"),
		completion("selectbox", "method", "choice control"),
		completion("slider", "method", "numeric control")
	]
};

const pythonEditorNativeSelectionStyle = {
	backgroundColor: "var(--python-code-selection) !important",
	color: "var(--python-code-selection-ink) !important"
};
const pythonSyntaxErrorMessage =
	"Python syntax error. Check this line before running the project.";
const pythonRuntimeErrorSource = "Python runtime";

const pythonEditorTheme = EditorView.theme({
	"&": {
		height: "100%",
		minHeight: "100%",
		backgroundColor: "var(--python-code-bg)",
		color: "var(--python-code-ink)"
	},
	"&.cm-focused": {
		outline: "none"
	},
	".cm-scroller": {
		overflow: "auto",
		fontFamily: "SFMono-Regular, Cascadia Code, Liberation Mono, monospace",
		fontSize: "0.94rem",
		fontVariantLigatures: "none",
		lineHeight: "1.58"
	},
	".cm-content": {
		minHeight: "100%",
		padding: "1rem",
		caretColor: "var(--python-code-caret)"
	},
	".cm-line": {
		padding: "0"
	},
	".cm-cursor": {
		borderLeftColor: "var(--python-code-caret)"
	},
	".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
		backgroundColor: "var(--python-code-selection) !important"
	},
	".cm-content ::selection, .cm-line ::selection, .cm-line::selection":
		pythonEditorNativeSelectionStyle,
	".cm-content ::-moz-selection, .cm-line ::-moz-selection, .cm-line::-moz-selection":
		pythonEditorNativeSelectionStyle,
	".cm-gutters": {
		borderRight: "1px solid var(--color-border)",
		backgroundColor:
			"color-mix(in srgb, var(--python-code-bg) 88%, var(--color-border))",
		color: "var(--python-code-muted)"
	},
	".cm-activeLine, .cm-activeLineGutter": {
		backgroundColor:
			"color-mix(in srgb, var(--python-code-bg) 82%, var(--color-accent))"
	},
	".cm-matchingBracket": {
		borderRadius: "0.25rem",
		backgroundColor:
			"color-mix(in srgb, var(--python-code-selection) 70%, transparent)",
		color: "inherit"
	},
	".cm-nonmatchingBracket": {
		borderRadius: "0.25rem",
		backgroundColor:
			"color-mix(in srgb, var(--python-output-stderr) 16%, transparent)",
		color: "var(--python-output-stderr)"
	},
	".cm-searchMatch": {
		backgroundColor:
			"color-mix(in srgb, var(--syntax-function) 30%, transparent)"
	},
	".cm-panels": {
		borderColor: "var(--color-border)",
		backgroundColor: "var(--color-surface-strong)",
		color: "var(--color-ink)"
	},
	".cm-panels-top": {
		borderBottom: "1px solid var(--color-border)"
	},
	".cm-panel.cm-search": {
		display: "flex",
		flexWrap: "wrap",
		gap: "0.45rem",
		alignItems: "center",
		padding: "0.65rem 0.75rem",
		fontFamily: "Avenir Next, Segoe UI, sans-serif",
		fontSize: "0.82rem"
	},
	".cm-panel.cm-search label": {
		display: "inline-flex",
		gap: "0.35rem",
		alignItems: "center",
		color: "var(--color-ink-soft)",
		fontWeight: "700"
	},
	".cm-panel.cm-search input": {
		minHeight: "2rem",
		border: "1px solid var(--color-border)",
		borderRadius: "0.65rem",
		backgroundColor:
			"color-mix(in srgb, var(--color-surface-strong) 88%, var(--python-code-bg))",
		color: "var(--color-ink)",
		padding: "0.35rem 0.55rem"
	},
	".cm-panel.cm-search button": {
		minHeight: "2rem",
		border: "1px solid var(--color-border)",
		borderRadius: "0.65rem",
		backgroundColor:
			"color-mix(in srgb, var(--color-surface-strong) 88%, var(--color-accent))",
		color: "var(--color-ink)",
		padding: "0.35rem 0.6rem",
		fontWeight: "800"
	},
	".cm-panel.cm-search button:hover, .cm-panel.cm-search button:focus-visible":
		{
			borderColor: "var(--python-focus-ring)",
			boxShadow: "0 0 0 3px var(--python-focus-glow)"
		},
	".cm-foldPlaceholder": {
		border: "1px solid var(--color-border)",
		borderRadius: "999px",
		backgroundColor:
			"color-mix(in srgb, var(--python-code-bg) 72%, var(--color-accent))",
		color: "var(--python-code-ink)",
		padding: "0 0.45rem"
	},
	".cm-tooltip": {
		border: "1px solid var(--color-border)",
		borderRadius: "0.75rem",
		backgroundColor: "var(--color-surface-strong)",
		color: "var(--color-ink)"
	}
});

export function pythonSyntaxDiagnostics(state: EditorState): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];
	const cursor = syntaxTree(state).cursor();

	do {
		if (!cursor.type.isError) continue;
		diagnostics.push({
			from: cursor.from,
			to: Math.max(
				cursor.to,
				Math.min(cursor.from + 1, state.doc.length)
			),
			severity: "error",
			message: pythonSyntaxErrorMessage
		});
	} while (cursor.next());

	return diagnostics;
}

export const pythonRuntimeDiagnosticEffect =
	StateEffect.define<Diagnostic | null>();

const pythonRuntimeDiagnosticsField = StateField.define<Diagnostic[]>({
	create() {
		return [];
	},
	update(value, transaction) {
		for (const effect of transaction.effects) {
			if (effect.is(pythonRuntimeDiagnosticEffect))
				return effect.value ? [effect.value] : [];
		}
		if (transaction.docChanged && value.length) return [];
		return value;
	}
});

export function pythonRuntimeDiagnosticForLine(
	state: EditorState,
	lineNumber: number,
	message: string
): Diagnostic | null {
	if (!Number.isInteger(lineNumber) || lineNumber < 1) return null;
	const line = state.doc.line(Math.min(lineNumber, state.doc.lines));
	return {
		from: line.from,
		to: Math.max(line.from + 1, line.to),
		severity: "error",
		source: pythonRuntimeErrorSource,
		message
	};
}

export function isPythonBracketPairIgnoredAt(
	state: EditorState,
	position: number
) {
	let node = syntaxTree(state).resolveInner(position, 1);
	while (true) {
		if (pythonBracketPairIgnoredNodeNames.has(node.name)) return true;
		const parent = node.parent;
		if (!parent) return false;
		node = parent;
	}
}

const wrapSelectionKeymap = keymap.of(
	[
		['"', '"'],
		["'", "'"],
		["`", "`"],
		["(", ")"],
		["[", "]"],
		["{", "}"]
	].map(([open, close]) => ({
		key: open,
		run: (view: EditorView) => wrapSelection(view, open, close)
	}))
);
const pythonNewlineKeymap = keymap.of([
	{
		key: "Enter",
		run: insertPythonNewlineAndIndent
	}
]);
const closingTokenSkipKeymap = keymap.of(
	intelligentClosingTokens.map(token => ({
		key: token,
		run: (view: EditorView) => skipExistingClosingToken(view, token)
	}))
);

function pythonEditorActionKeymap(options: PythonCodeMirrorOptions) {
	return keymap.of([
		{
			key: "Mod-s",
			preventDefault: true,
			run() {
				options.onSave?.();
				return true;
			}
		},
		{
			key: "Mod-Enter",
			preventDefault: true,
			run() {
				options.onRun?.();
				return true;
			}
		}
	]);
}

function completion(
	label: string,
	type: string,
	detail?: string,
	boost?: number
): PythonIdeCompletionOption {
	return {
		label,
		type,
		...(boost ? { boost } : {}),
		...(detail ? { detail } : {})
	};
}

function snippetField(name: string) {
	return `\${${name}}`;
}

function snippetLines(...lines: string[]) {
	return lines.join("\n");
}

function pythonSnippet(
	label: string,
	detail: string,
	template: string,
	boost = 50
): PythonIdeCompletionOption {
	return snippetCompletion(template, {
		label,
		type: "snippet",
		detail,
		boost,
		section: "Snippets"
	});
}

const projectSnippetCompletions = [
	pythonSnippet(
		"main_guard",
		"main function guard",
		snippetLines(
			"def main():",
			`    ${snippetField("body")}`,
			"",
			'if __name__ == "__main__":',
			"    main()",
			snippetEnd
		),
		60
	)
];

const turtleSnippetCompletions = [
	pythonSnippet(
		"turtle_screen",
		"Turtle screen setup",
		snippetLines(
			"import turtle",
			"",
			"screen = turtle.Screen()",
			"t = turtle.Turtle()",
			"",
			snippetField("body"),
			"",
			"screen.mainloop()",
			snippetEnd
		),
		80
	),
	pythonSnippet(
		"ontimer_loop",
		"Turtle animation loop",
		snippetLines(
			"def animate():",
			`    ${snippetField("body")}`,
			`    screen.ontimer(animate, ${snippetField("milliseconds")})`,
			"",
			`screen.ontimer(animate, ${snippetField("milliseconds")})`,
			snippetEnd
		),
		75
	),
	pythonSnippet(
		"onkey_handler",
		"Turtle keyboard handler",
		snippetLines(
			"def move():",
			`    ${snippetField("body")}`,
			"",
			`screen.onkey(move, "${snippetField("key")}")`,
			"screen.listen()",
			snippetEnd
		),
		70
	)
];

const dataSnippetCompletions = [
	pythonSnippet(
		"data_setup",
		"pandas chart setup",
		snippetLines(
			"import pandas as pd",
			"import matplotlib.pyplot as plt",
			"",
			snippetField("body"),
			"plt.show()",
			snippetEnd
		),
		75
	),
	pythonSnippet(
		"read_csv_df",
		"load a CSV into a DataFrame",
		snippetLines(
			`df = pd.read_csv("${snippetField("file")}.csv")`,
			snippetEnd
		),
		70
	),
	pythonSnippet(
		"scatter_plot",
		"matplotlib scatter plot",
		snippetLines(
			`plt.figure(figsize=(${snippetField("width")}, ${snippetField("height")}))`,
			`plt.scatter(${snippetField("x")}, ${snippetField("y")})`,
			`plt.xlabel("${snippetField("x_label")}")`,
			`plt.ylabel("${snippetField("y_label")}")`,
			"plt.tight_layout()",
			snippetEnd
		),
		65
	),
	pythonSnippet(
		"decision_tree",
		"train a decision tree classifier",
		snippetLines(
			`model = DecisionTreeClassifier(max_depth=${snippetField("depth")}, random_state=0)`,
			`model.fit(${snippetField("features")}, ${snippetField("labels")})`,
			snippetEnd
		),
		65
	)
];

function turtlePenCompletions() {
	return [
		completion("forward", "method", "move forward"),
		completion("backward", "method", "move backward"),
		completion("right", "method", "turn right"),
		completion("left", "method", "turn left"),
		completion("goto", "method", "move to coordinates"),
		completion("setheading", "method", "set direction"),
		completion("heading", "method", "current direction"),
		completion("xcor", "method", "current x coordinate"),
		completion("ycor", "method", "current y coordinate"),
		completion("penup", "method", "move without drawing"),
		completion("pendown", "method", "resume drawing"),
		completion("color", "method", "set pen and fill color"),
		completion("pencolor", "method", "set pen color"),
		completion("fillcolor", "method", "set fill color"),
		completion("pensize", "method", "set line width"),
		completion("speed", "method", "set animation speed"),
		completion("begin_fill", "method", "start a filled shape"),
		completion("end_fill", "method", "finish a filled shape"),
		completion("circle", "method", "draw a circle"),
		completion("dot", "method", "draw a dot"),
		completion("stamp", "method", "stamp turtle shape"),
		completion("shape", "method", "choose a cursor shape"),
		completion("hideturtle", "method", "hide the cursor"),
		completion("showturtle", "method", "show the cursor"),
		completion("isvisible", "method", "whether the cursor is visible"),
		completion("distance", "method", "distance to a point"),
		completion("ondrag", "method", "bind a drag handler")
	];
}

function actorMemberCompletions() {
	return sharedMemberCompletions.Actor ?? [];
}

function rectMemberCompletions() {
	return [
		completion("copy", "method", "copy the rectangle"),
		completion("move", "method", "return a moved rectangle"),
		completion("move_ip", "method", "move the rectangle in place"),
		completion("inflate", "method", "return a resized rectangle"),
		completion("inflate_ip", "method", "resize the rectangle in place"),
		completion("scale_by", "method", "return a scaled rectangle"),
		completion("scale_by_ip", "method", "scale the rectangle in place"),
		completion("update", "method", "replace position and size"),
		completion("clamp", "method", "move inside another rectangle"),
		completion(
			"clamp_ip",
			"method",
			"move inside another rectangle in place"
		),
		completion("clip", "method", "return overlapping area"),
		completion("union", "method", "return rectangle covering both"),
		completion("union_ip", "method", "cover both rectangles in place"),
		completion("unionall", "method", "cover a sequence of rectangles"),
		completion("unionall_ip", "method", "cover many rectangles in place"),
		completion(
			"fit",
			"method",
			"scale proportionally into another rectangle"
		),
		completion("normalize", "method", "fix negative width or height"),
		completion("contains", "method", "test containment"),
		completion("collidepoint", "method", "test point collision"),
		completion("colliderect", "method", "test rectangle collision"),
		completion("clipline", "method", "clip a line to this rectangle"),
		completion("collidelist", "method", "first collision in a list"),
		completion(
			"collidelistall",
			"method",
			"all collision indexes in a list"
		),
		completion("collidedict", "method", "first collision in a dictionary"),
		completion(
			"collidedictall",
			"method",
			"all collisions in a dictionary"
		),
		completion("collideobjects", "method", "first colliding object"),
		completion("collideobjectsall", "method", "all colliding objects")
	];
}

function runtimeCompletionsForMode(mode: PythonIdeMode = "python") {
	if (mode === "data") {
		return [
			...sharedRuntimeCompletions,
			...projectSnippetCompletions,
			...dataRuntimeCompletions,
			...dataSnippetCompletions
		];
	}
	if (mode === "pgzero") {
		return [
			...sharedRuntimeCompletions,
			...projectSnippetCompletions,
			...pgzeroRuntimeCompletions
		];
	}
	if (mode === "turtle") {
		return [
			...sharedRuntimeCompletions,
			...projectSnippetCompletions,
			...turtleRuntimeCompletions,
			...turtleSnippetCompletions
		];
	}
	return [...sharedRuntimeCompletions, ...projectSnippetCompletions];
}

function memberCompletionMapForMode(mode: PythonIdeMode = "python") {
	if (mode === "data") {
		return {
			...sharedMemberCompletions,
			...dataMemberCompletions
		};
	}
	if (mode === "pgzero") {
		return {
			...sharedMemberCompletions,
			...pgzeroMemberCompletions
		};
	}
	if (mode === "turtle") {
		return {
			...sharedMemberCompletions,
			...turtleMemberCompletions
		};
	}
	return sharedMemberCompletions;
}

export function pythonIdeCompletionsForMode(
	mode: PythonIdeMode = "python",
	receiver?: string,
	assetCompletions?: PythonCodeMirrorAssetCompletionNames
) {
	if (!receiver) return runtimeCompletionsForMode(mode);
	const staticOptions = memberCompletionMapForMode(mode)[receiver] ?? [];
	if (mode !== "pgzero") return staticOptions;

	if (receiver === "images") {
		return [
			...assetCompletionOptions(assetCompletions, "images", {
				identifierOnly: true
			}),
			...staticOptions
		];
	}

	if (receiver === "sounds") {
		return [
			...assetCompletionOptions(assetCompletions, "sounds", {
				identifierOnly: true
			}),
			...staticOptions
		];
	}

	if (/^images\.[A-Z_]\w*$/i.test(receiver)) {
		return imageSurfaceMemberCompletions;
	}

	if (/^sounds\.[A-Z_]\w*$/i.test(receiver)) {
		return soundMemberCompletions;
	}

	return staticOptions;
}

export function pythonIdeCompletionSource(
	mode?: PythonIdeMode,
	assetCompletions?: undefined
): (context: PythonIdeCompletionContext) => PythonIdeCompletionResult;
export function pythonIdeCompletionSource(
	mode: PythonIdeMode | undefined,
	assetCompletions: PythonCodeMirrorAssetCompletionProvider
): (context: PythonIdeCompletionContext) => PythonIdeCompletionAsyncResult;
export function pythonIdeCompletionSource(
	mode: PythonIdeMode | undefined,
	assetCompletions: PythonCodeMirrorAssetCompletionProvider | undefined
): (context: PythonIdeCompletionContext) => PythonIdeCompletionAsyncResult;
export function pythonIdeCompletionSource(
	mode: PythonIdeMode = "python",
	assetCompletions?: PythonCodeMirrorAssetCompletionProvider
) {
	return (context: PythonIdeCompletionContext) => {
		const stringCompletion = pythonIdeStringCompletionContext(
			context.state,
			context.pos,
			mode
		);
		if (stringCompletion) {
			return {
				from: stringCompletion.from,
				options: stringCompletion.options,
				validFor: stringCompletion.validFor
			};
		}

		const assetStringCompletion = assetStringCompletionContext(
			context.state,
			context.pos,
			mode
		);
		if (assetStringCompletion) {
			return withPythonAssetCompletions(
				assetCompletions,
				completions => ({
					from: assetStringCompletion.from,
					options: assetCompletionOptions(
						completions,
						assetStringCompletion.folder
					),
					validFor: pythonAssetStringCompletionValidForRegex
				})
			);
		}

		const node = syntaxTree(context.state).resolveInner(context.pos, -1);
		if (pythonCompletionBlockedNodeNames.has(node.name)) return null;

		const word = context.matchBefore(pythonCompletionTokenRegex);
		if (!word) {
			if (!context.explicit) return null;
			return {
				from: context.pos,
				options: pythonIdeCompletionsForMode(mode),
				validFor: pythonCompletionGlobalValidForRegex
			};
		}
		if (word.from === word.to && !context.explicit) return null;

		const parts = word.text.split(".");
		if (parts.length > 1) {
			const memberPrefix = parts.at(-1) ?? "";
			const receiver = parts.slice(0, -1).join(".");
			const completionFrom = word.to - memberPrefix.length;
			if (mode === "pgzero" && ["images", "sounds"].includes(receiver)) {
				return withPythonAssetCompletions(
					assetCompletions,
					completions => {
						const options = pythonIdeCompletionsForMode(
							mode,
							receiver,
							completions
						);
						if (!options.length) return null;
						return {
							from: completionFrom,
							options,
							validFor: pythonCompletionMemberValidForRegex
						};
					}
				);
			}

			const options = pythonIdeCompletionsForMode(mode, receiver);
			if (!options.length) return null;
			return {
				from: completionFrom,
				options,
				validFor: pythonCompletionMemberValidForRegex
			};
		}

		return {
			from: word.from,
			options: pythonIdeCompletionsForMode(mode),
			validFor: pythonCompletionGlobalValidForRegex
		};
	};
}

function withPythonAssetCompletions<T>(
	provider: PythonCodeMirrorAssetCompletionProvider | undefined,
	createResult: (completions: PythonCodeMirrorAssetCompletionNames) => T
) {
	const completions = provider?.() ?? {};
	if (isPromiseLike(completions)) return completions.then(createResult);
	return createResult(completions);
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
	return (
		typeof value === "object" &&
		value !== null &&
		"then" in value &&
		typeof value.then === "function"
	);
}

function pythonIdeStringCompletionContext(
	state: EditorState,
	position: number,
	mode: PythonIdeMode
): PythonIdeStringCompletionContext | null {
	if (mode !== "turtle") return null;

	const line = state.doc.lineAt(position);
	const lineBeforeCursor = line.text.slice(0, position - line.from);
	const shapeMatch = lineBeforeCursor.match(
		turtleShapeStringCompletionPattern
	);
	if (!shapeMatch) return null;
	const partial = shapeMatch[1] ?? "";
	return {
		from: position - partial.length,
		options: turtleShapeCompletions,
		validFor: pythonTurtleShapeStringCompletionValidForRegex
	};
}

function assetCompletionOptions(
	assetCompletions: PythonCodeMirrorAssetCompletionNames | undefined,
	folder: PythonIdeAssetCompletionFolder,
	options: { identifierOnly?: boolean } = {}
) {
	const names = assetCompletions?.[folder] ?? [];
	return names
		.filter(
			name => !options.identifierOnly || pythonIdentifierRegex.test(name)
		)
		.map(name =>
			completion(
				name,
				folder === "images" ? "constant" : "variable",
				`${folder} asset`,
				80
			)
		);
}

function assetStringCompletionContext(
	state: EditorState,
	position: number,
	mode: PythonIdeMode
): PythonIdeAssetStringCompletionContext | null {
	if (mode !== "pgzero") return null;

	const line = state.doc.lineAt(position);
	const lineBeforeCursor = line.text.slice(0, position - line.from);
	for (const { folder, pattern } of pgzeroAssetStringCompletionPatterns) {
		const match = lineBeforeCursor.match(pattern);
		if (!match) continue;
		const partial = match[1] ?? "";
		return {
			folder,
			from: position - partial.length
		};
	}

	return null;
}

class BracketPairColorPlugin {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = buildBracketPairDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged)
			this.decorations = buildBracketPairDecorations(update.view);
	}
}

const bracketPairColorExtension = [
	EditorView.baseTheme({
		".cm-bracket-pair": {
			fontWeight: "800"
		},
		".cm-bracket-pair-1": {
			color: "var(--syntax-bracket-pair-1)"
		},
		".cm-bracket-pair-2": {
			color: "var(--syntax-bracket-pair-2)"
		},
		".cm-bracket-pair-3": {
			color: "var(--syntax-bracket-pair-3)"
		},
		".cm-bracket-pair-4": {
			color: "var(--syntax-bracket-pair-4)"
		},
		".cm-bracket-pair-5": {
			color: "var(--syntax-bracket-pair-5)"
		},
		".cm-bracket-pair-6": {
			color: "var(--syntax-bracket-pair-6)"
		},
		".cm-bracket-unmatched": {
			color: "var(--syntax-bracket)"
		}
	}),
	ViewPlugin.fromClass(BracketPairColorPlugin, {
		decorations: plugin => plugin.decorations
	})
];

const pythonEditorBaseSetup: Extension[] = [
	lineNumbers(),
	lintGutter({ hoverTime: 220 }),
	highlightActiveLineGutter(),
	highlightSpecialChars(),
	history(),
	foldGutter(),
	drawSelection(),
	dropCursor(),
	scrollPastEnd(),
	EditorState.allowMultipleSelections.of(true),
	indentOnInput(),
	syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
	bracketMatching(),
	closeBrackets(),
	autocompletion(),
	linter(view => pythonSyntaxDiagnostics(view.state)),
	pythonRuntimeDiagnosticsField,
	linter(view => view.state.field(pythonRuntimeDiagnosticsField), {
		needsRefresh(update) {
			return update.transactions.some(transaction =>
				transaction.effects.some(effect =>
					effect.is(pythonRuntimeDiagnosticEffect)
				)
			);
		}
	}),
	rectangularSelection(),
	crosshairCursor(),
	highlightActiveLine(),
	highlightSelectionMatches(),
	keymap.of([
		...closeBracketsKeymap,
		...defaultKeymap,
		...searchKeymap,
		...historyKeymap,
		...foldKeymap,
		...completionKeymap,
		...lintKeymap
	])
];

export function createPythonCodeMirrorExtensions(
	options: PythonCodeMirrorOptions
): Extension[] {
	return [
		pythonEditorBaseSetup,
		python(),
		pythonLanguage.data.of({
			autocomplete: pythonIdeCompletionSource(
				options.mode,
				options.assetCompletions
			)
		}),
		EditorState.tabSize.of(4),
		indentUnit.of(pythonIndentText),
		EditorState.allowMultipleSelections.of(true),
		pythonEditorTheme,
		syntaxHighlighting(pythonHighlightStyle),
		bracketPairColorExtension,
		Prec.highest(closingTokenSkipKeymap),
		Prec.highest(pythonNewlineKeymap),
		Prec.highest(pythonEditorActionKeymap(options)),
		Prec.highest(keymap.of([indentWithTab])),
		Prec.high(wrapSelectionKeymap),
		EditorView.lineWrapping,
		EditorView.contentAttributes.of({
			"aria-label": "Code editor",
			autocapitalize: "off",
			autocomplete: "off",
			autocorrect: "off",
			spellcheck: "false"
		}),
		EditorView.domEventHandlers({
			keydown(event) {
				event.stopPropagation();
				return false;
			},
			keyup(event) {
				event.stopPropagation();
				return false;
			}
		}),
		EditorView.updateListener.of(update => {
			options.onCursorCountChange(update.state.selection.ranges.length);
			if (update.docChanged)
				options.onChange(update.state.doc.toString());
		})
	];
}

export function canSkipExistingClosingToken(state: EditorState, token: string) {
	return state.selection.ranges.every(
		range =>
			range.empty &&
			state.sliceDoc(range.from, range.from + token.length) === token
	);
}

function skipExistingClosingToken(view: EditorView, token: string) {
	if (!canSkipExistingClosingToken(view.state, token)) return false;

	view.dispatch({
		selection: EditorSelection.create(
			view.state.selection.ranges.map(range =>
				EditorSelection.cursor(range.from + token.length)
			),
			view.state.selection.mainIndex
		),
		scrollIntoView: true
	});
	return true;
}

export function pythonNewlineIndentText(state: EditorState, position: number) {
	const line = state.doc.lineAt(position);
	const textBeforeCursor = line.text.slice(0, position - line.from);
	const currentIndent =
		line.text.match(lineLeadingWhitespaceRegex)?.[0] ?? "";
	const shouldIndentOneLevel = textBeforeCursor.trimEnd().endsWith(":");

	return `\n${currentIndent}${shouldIndentOneLevel ? pythonIndentText : ""}`;
}

function insertPythonNewlineWithFallbackIndent(view: EditorView) {
	const transaction = view.state.changeByRange(range => {
		const insertedText = pythonNewlineIndentText(view.state, range.from);

		return {
			changes: {
				from: range.from,
				to: range.to,
				insert: insertedText
			},
			range: EditorSelection.cursor(range.from + insertedText.length)
		};
	});

	view.dispatch({
		...transaction,
		scrollIntoView: true
	});
	return true;
}

function insertPythonNewlineAndIndent(view: EditorView) {
	if (codeMirrorInsertNewlineAndIndent(view)) return true;
	return insertPythonNewlineWithFallbackIndent(view);
}

function buildBracketPairDecorations(view: EditorView) {
	const decorations = pythonBracketPairColorRanges(
		view.state,
		view.visibleRanges
	);
	const builder = new RangeSetBuilder<Decoration>();
	for (const { from, pairIndex, to, unmatched } of decorations) {
		const decoration = unmatched
			? unmatchedBracketDecoration
			: (bracketPairDecorations[pairIndex] ??
				bracketPairDecorations[0] ??
				unmatchedBracketDecoration);
		builder.add(from, to, decoration);
	}
	return builder.finish();
}

export function pythonBracketPairColorRanges(
	state: EditorState,
	visibleRanges: readonly { from: number; to: number }[]
) {
	const ranges: PythonBracketPairColorRange[] = [];
	const docLength = state.doc.length;
	const boundedVisibleRanges = visibleRanges
		.map(range => ({
			from: Math.max(0, Math.min(docLength, range.from)),
			to: Math.max(0, Math.min(docLength, range.to))
		}))
		.filter(range => range.from < range.to);
	if (!boundedVisibleRanges.length) return ranges;

	const visibleStart = Math.min(
		...boundedVisibleRanges.map(range => range.from)
	);
	const visibleEnd = Math.max(...boundedVisibleRanges.map(range => range.to));
	const scanStart = Math.max(0, visibleStart - bracketPairContextScanLimit);
	const scanEnd = Math.min(
		docLength,
		visibleEnd + bracketPairContextScanLimit
	);
	const stack: BracketStackEntry[] = [];
	const ignoredRanges = pythonBracketPairIgnoredRanges(
		state,
		scanStart,
		scanEnd
	);
	let ignoredRangeIndex = 0;

	const isIgnoredByRange = (index: number) => {
		while (
			ignoredRanges[ignoredRangeIndex] &&
			(ignoredRanges[ignoredRangeIndex]?.to ?? 0) <= index
		) {
			ignoredRangeIndex += 1;
		}

		const range = ignoredRanges[ignoredRangeIndex];
		return !!range && range.from <= index && index < range.to;
	};

	const scanBracketText = (text: string, baseOffset: number) => {
		for (let offset = 0; offset < text.length; offset += 1) {
			const character = text[offset] ?? "";
			const index = baseOffset + offset;
			const expectedClose = openingBracketToClosingBracket[character];
			if (
				(expectedClose || closingBrackets.has(character)) &&
				isIgnoredByRange(index)
			) {
				continue;
			}

			if (expectedClose) {
				stack.push({
					expectedClose,
					pairIndex: stack.length % bracketPairDecorations.length,
					position: index
				});
				continue;
			}

			if (!closingBrackets.has(character)) continue;

			const candidate = stack.at(-1);
			if (!candidate || candidate.expectedClose !== character) {
				if (isVisibleBracketPosition(index, boundedVisibleRanges)) {
					ranges.push({
						from: index,
						pairIndex: 0,
						to: index + 1,
						unmatched: true
					});
				}
				continue;
			}

			stack.pop();
			if (
				isVisibleBracketPosition(
					candidate.position,
					boundedVisibleRanges
				)
			) {
				ranges.push({
					from: candidate.position,
					pairIndex: candidate.pairIndex,
					to: candidate.position + 1,
					unmatched: false
				});
			}
			if (isVisibleBracketPosition(index, boundedVisibleRanges)) {
				ranges.push({
					from: index,
					pairIndex: candidate.pairIndex,
					to: index + 1,
					unmatched: false
				});
			}
		}
	};

	scanBracketText(state.doc.sliceString(scanStart, visibleEnd), scanStart);

	const visibleOpenersStillNeedMatch = stack.some(entry =>
		isVisibleBracketPosition(entry.position, boundedVisibleRanges)
	);
	if (visibleOpenersStillNeedMatch && visibleEnd < docLength) {
		scanBracketText(state.doc.sliceString(visibleEnd, scanEnd), visibleEnd);
	}

	for (const unmatched of stack) {
		if (
			!isVisibleBracketPosition(unmatched.position, boundedVisibleRanges)
		) {
			continue;
		}
		ranges.push({
			from: unmatched.position,
			pairIndex: 0,
			to: unmatched.position + 1,
			unmatched: true
		});
	}

	return ranges.sort((first, second) => first.from - second.from);
}

export function pythonBracketPairIgnoredRanges(
	state: EditorState,
	from: number,
	to: number
): PythonBracketPairIgnoredRange[] {
	const boundedFrom = Math.max(0, Math.min(state.doc.length, from));
	const boundedTo = Math.max(0, Math.min(state.doc.length, to));
	if (boundedFrom >= boundedTo) return [];

	const ranges: PythonBracketPairIgnoredRange[] = [];
	syntaxTree(state).iterate({
		from: boundedFrom,
		to: boundedTo,
		enter(node) {
			if (!pythonBracketPairIgnoredNodeNames.has(node.name)) return;
			ranges.push({
				from: Math.max(boundedFrom, node.from),
				to: Math.min(boundedTo, node.to)
			});
			return false;
		}
	});

	return ranges.sort((first, second) => first.from - second.from);
}

function isVisibleBracketPosition(
	position: number,
	visibleRanges: readonly { from: number; to: number }[]
) {
	return visibleRanges.some(
		range => position >= range.from && position < range.to
	);
}

function wrapSelection(view: EditorView, open: string, close: string) {
	const state = view.state;
	if (state.selection.ranges.every(range => range.empty)) return false;

	const transaction = state.changeByRange(range => {
		if (range.empty) {
			return {
				changes: {
					from: range.from,
					insert: `${open}${close}`
				},
				range: EditorSelection.cursor(range.from + open.length)
			};
		}

		return {
			changes: [
				{ from: range.from, insert: open },
				{ from: range.to, insert: close }
			],
			range: EditorSelection.range(
				range.from + open.length,
				range.to + open.length
			)
		};
	});

	view.dispatch({
		...transaction,
		scrollIntoView: true
	});
	return true;
}
