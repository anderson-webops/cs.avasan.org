import type { PythonIdeFile, PythonIdeMode } from "@/modules/pythonIde";
import {
	getPythonIdeRunnableFile,
	isPythonIdeJavaFile
} from "@/modules/pythonIde";

export type KarelDirection = "North" | "East" | "South" | "West";
export type KarelWallSide = "north" | "east" | "south" | "west";

export interface KarelRobotState {
	avenue: number;
	beepers: number;
	direction: KarelDirection;
	name: string;
	street: number;
}

export interface KarelBeeperState {
	avenue: number;
	count: number;
	street: number;
}

export interface KarelPaintState {
	avenue: number;
	color: string;
	street: number;
}

export interface KarelWallState {
	avenue: number;
	side: KarelWallSide;
	street: number;
}

export interface KarelWorldState {
	beepers: KarelBeeperState[];
	cols: number;
	paints: KarelPaintState[];
	robot: KarelRobotState | null;
	rows: number;
	trace: string[];
	walls: KarelWallState[];
}

interface JavaIdeRunOptions {
	activeFileName: string;
	files: PythonIdeFile[];
	inputText?: string;
	mode: Extract<PythonIdeMode, "java" | "karel">;
}

interface JavaIdeRunResult {
	karelWorld?: KarelWorldState;
	karelWorldSteps?: KarelWorldState[];
	stderr: string[];
	stdout: string[];
}

interface MutableKarelWorld {
	beepers: Map<string, KarelBeeperState>;
	cols: number;
	paints: Map<string, KarelPaintState>;
	rows: number;
	walls: KarelWallState[];
}

interface JavaMethodDefinition {
	body: string;
	name: string;
	parameters: string[];
	returnType: string;
}

interface KarelCommandPlan {
	commands: KarelCommand[];
	warnings: string[];
}

interface KarelPreviewExecution {
	constantsContext: JavaConsoleContext;
	constantsOutput: JavaConsoleOutputState;
	robot: KarelRobotState;
	stopped: boolean;
	world: MutableKarelWorld;
}

interface JavaForLoopIterations {
	capped: boolean;
	count: number;
}

interface JavaConsoleContext {
	constants: Map<string, JavaConsoleValue>;
	input: JavaScannerInput;
	methodCallDepth: number;
	methods: Map<string, JavaMethodDefinition>;
	stderr: string[];
	variables: Map<string, JavaConsoleValue>;
}

interface JavaScannerInput {
	position: number;
	source: string;
}

interface JavaRandomState {
	seed: number | null;
}

interface JavaConsoleOutputState {
	lineTruncated: boolean;
	linesTruncated: boolean;
	pendingLine: string;
	stdout: string[];
}

interface JavaMapEntry {
	key: JavaConsoleValue;
	value: JavaConsoleValue;
}

interface JavaConsoleIndexForLoop {
	body: string;
	condition: string;
	initializer: string;
	kind: "index";
	nextIndex: number;
	update: string;
}

interface JavaConsoleEnhancedForLoop {
	body: string;
	iterableExpression: string;
	itemName: string;
	kind: "enhanced";
	nextIndex: number;
}

type JavaConsoleForLoop = JavaConsoleEnhancedForLoop | JavaConsoleIndexForLoop;

type JavaConsoleValue =
	| {
			elementType: string;
			type: "array";
			value: JavaConsoleValue[];
	  }
	| {
			elementType: string;
			type: "arrayList";
			value: JavaConsoleValue[];
	  }
	| {
			type: "boolean";
			value: boolean;
	  }
	| {
			type: "char";
			value: string;
	  }
	| {
			type: "mapEntry";
			value: JavaMapEntry;
	  }
	| {
			mapKind: "hashMap" | "treeMap";
			type: "map";
			value: JavaMapEntry[];
	  }
	| {
			type: "null";
			value: null;
	  }
	| {
			type: "number";
			value: number;
	  }
	| {
			type: "random";
			value: JavaRandomState;
	  }
	| {
			type: "scanner";
			value: null;
	  }
	| {
			type: "string";
			value: string;
	  };

type JavaConsoleSignal =
	| "break"
	| "continue"
	| {
			kind: "return";
			value: JavaConsoleValue;
	  }
	| null;

const DEFAULT_WORLD_SIZE = 10;
const MAX_KAREL_WORLD_SIZE = 40;
const MAX_KAREL_WORLD_FILE_CHARS = 200000;
const MAX_KAREL_WORLD_LINES = 2000;
const MAX_KAREL_PREVIEW_COMMANDS = 500;
const MAX_JAVA_RUNTIME_SOURCE_CHARS = 200000;
const MAX_JAVA_RUNTIME_PROJECT_SOURCE_CHARS = 800000;
const MAX_JAVA_CONSOLE_INPUT_CHARS = 200000;
const MAX_JAVA_CONSOLE_METHOD_CALL_DEPTH = 40;
const MAX_JAVA_CONSOLE_LOOP_ITERATIONS = 500;
const MAX_JAVA_CONSOLE_OUTPUT_LINES = 500;
const MAX_JAVA_CONSOLE_OUTPUT_LINE_CHARS = 12000;
const JAVA_CONSOLE_OUTPUT_LINE_TRUNCATED_MESSAGE =
	"\n[Output truncated to keep the browser responsive.]";
const javaFormatConversions = "bcdefgosx";
const JAVA_PRINT_RE =
	/System\.out\.(print|println|printf|format)\s*\(([\s\S]*?)\)\s*;/g;
const JAVA_SCANNER_METHOD_RE =
	/^([A-Z_]\w*)\.(next(?:Line|Int|Double|Boolean)?|hasNext(?:Line|Int|Double|Boolean)?)\s*\(\s*\)$/i;
const JAVA_VARIABLE_DECLARATION_START_RE =
	/^((?:[A-Z_]\w*\.)*[A-Z_]\w*(?:\s*<[^>;]+>)?(?:\s*\[\s*\])*)\s+([A-Z_]\w*)\s*=/i;
const JAVA_VARIABLE_ASSIGNMENT_START_RE = /^([A-Z_]\w*)\s*=/i;
const JAVA_COMPOUND_ASSIGNMENT_START_RE = /^([A-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=)/i;
const JAVA_INDEXED_ASSIGNMENT_START_RE =
	/^([A-Z_]\w*)((?:\s*\[[^\][]+\])+)\s*=/i;
const JAVA_INDEXED_COMPOUND_ASSIGNMENT_START_RE =
	/^([A-Z_]\w*)((?:\s*\[[^\][]+\])+)\s*(\+=|-=|\*=|\/=|%=)/i;
const JAVA_INDEXED_INCREMENT_RE =
	/^(?:\+\+([A-Z_]\w*)((?:\s*\[[^\][]+\])+)|([A-Z_]\w*)((?:\s*\[[^\][]+\])+)\+\+|--([A-Z_]\w*)((?:\s*\[[^\][]+\])+)|([A-Z_]\w*)((?:\s*\[[^\][]+\])+)--)$/i;
const JAVA_INCREMENT_RE =
	/^(?:\+\+([A-Z_]\w*)|([A-Z_]\w*)\+\+|--([A-Z_]\w*)|([A-Z_]\w*)--)$/i;
const ROBOT_DECLARATION_RE =
	/\bUrRobot\s+([A-Z_]\w*)\s*=\s*new\s+UrRobot\s*\(([^)]*)\)/i;
const WORLD_READ_RE = /\bWorld\.readWorld\s*\(\s*"([^"]+)"\s*\)/;
const KAREL_SIMPLE_COMMANDS = [
	"move",
	"turnLeft",
	"turnRight",
	"turnAround",
	"putBeeper",
	"pickBeeper",
	"putBall",
	"takeBall"
] as const;
type KarelSimpleCommand =
	| "move"
	| "pickBeeper"
	| "putBeeper"
	| "turnAround"
	| "turnLeft"
	| "turnRight";
type KarelCommand =
	| KarelSimpleCommand
	| {
			color: string;
			kind: "paint";
	  };
const KAREL_COMMAND_ALIASES = {
	move: "move",
	pickBeeper: "pickBeeper",
	putBeeper: "putBeeper",
	putBall: "putBeeper",
	takeBall: "pickBeeper",
	turnAround: "turnAround",
	turnLeft: "turnLeft",
	turnRight: "turnRight"
} satisfies Record<(typeof KAREL_SIMPLE_COMMANDS)[number], KarelSimpleCommand>;
const karelPaintColors: Record<string, string> = {
	black: "#111827",
	blue: "#2563eb",
	cyan: "#06b6d4",
	dark_gray: "#374151",
	darkgray: "#374151",
	gray: "#6b7280",
	green: "#16a34a",
	light_gray: "#d1d5db",
	lightgray: "#d1d5db",
	magenta: "#d946ef",
	orange: "#f97316",
	pink: "#ec4899",
	purple: "#9333ea",
	red: "#dc2626",
	white: "#ffffff",
	yellow: "#facc15"
};
const karelRandomPaintPalette = [
	"red",
	"blue",
	"green",
	"yellow",
	"cyan",
	"orange",
	"purple",
	"pink"
];
const directionOrder: KarelDirection[] = ["North", "East", "South", "West"];
const wallOpposites: Record<KarelWallSide, KarelWallSide> = {
	east: "west",
	north: "south",
	south: "north",
	west: "east"
};
const karelFacingConditions: Record<string, KarelDirection> = {
	facingEast: "East",
	facingNorth: "North",
	facingSouth: "South",
	facingWest: "West",
	notFacingEast: "East",
	notFacingNorth: "North",
	notFacingSouth: "South",
	notFacingWest: "West"
};

export function runJavaIdeProject(
	options: JavaIdeRunOptions
): JavaIdeRunResult {
	const sourceBoundsError = javaRuntimeSourceBoundsError(options.files);
	if (sourceBoundsError) {
		return {
			stderr: [sourceBoundsError],
			stdout: []
		};
	}

	const activeFile = getPythonIdeRunnableFile(options);
	if (!activeFile) {
		return {
			stderr: ["Add a .java file before running this project."],
			stdout: []
		};
	}

	if (
		options.mode === "java" &&
		(options.inputText?.length ?? 0) > MAX_JAVA_CONSOLE_INPUT_CHARS
	) {
		return {
			stderr: [
				`Java preview skipped input over ${MAX_JAVA_CONSOLE_INPUT_CHARS.toLocaleString()} characters. Shorten the input before running in the browser.`
			],
			stdout: []
		};
	}

	return options.mode === "karel"
		? runKarelProject(options.files, activeFile)
		: runConsoleJavaProject(activeFile, options.inputText ?? "");
}

function javaRuntimeSourceBoundsError(files: PythonIdeFile[]) {
	let totalSourceChars = 0;
	for (const file of files) {
		if (!isPythonIdeJavaFile(file.name)) continue;
		totalSourceChars += file.content.length;
		if (file.content.length > MAX_JAVA_RUNTIME_SOURCE_CHARS) {
			return `Java preview skipped files over ${MAX_JAVA_RUNTIME_SOURCE_CHARS.toLocaleString()} characters. Split the project into smaller files or run it in a desktop Java IDE.`;
		}
		if (totalSourceChars > MAX_JAVA_RUNTIME_PROJECT_SOURCE_CHARS) {
			return `Java preview skipped projects over ${MAX_JAVA_RUNTIME_PROJECT_SOURCE_CHARS.toLocaleString()} total Java characters. Run larger projects in BlueJ or a desktop Java IDE.`;
		}
	}
	return "";
}

function runConsoleJavaProject(
	file: PythonIdeFile,
	inputText = ""
): JavaIdeRunResult {
	const { stderr, stdout } = javaConsoleOutput(
		stripJavaComments(file.content),
		inputText
	);
	return {
		stderr:
			stdout.length || stderr.length
				? stderr
				: [
						"The browser Java runner previews beginner console Java from main: System.out output, variables, Scanner input, decisions, loops, helper methods, arrays, ArrayLists, and maps."
					],
		stdout
	};
}

function javaConsoleOutput(source: string, inputText: string) {
	const methods = parseJavaMethods(source);
	const context: JavaConsoleContext = {
		constants: new Map(),
		input: {
			position: 0,
			source: inputText.replace(/\r\n?/g, "\n")
		},
		methodCallDepth: 0,
		methods,
		stderr: [],
		variables: new Map()
	};
	const output: JavaConsoleOutputState = {
		lineTruncated: false,
		linesTruncated: false,
		pendingLine: "",
		stdout: []
	};
	seedJavaLiteralConstants(source, context, output);
	const mainBody = methods.get("main")?.body ?? source;
	executeJavaConsoleBody(mainBody, context, output);

	if (output.pendingLine) flushJavaConsoleLine(output);
	if (output.lineTruncated) {
		context.stderr.push(
			`Truncated Java output lines after ${MAX_JAVA_CONSOLE_OUTPUT_LINE_CHARS.toLocaleString()} characters.`
		);
	}
	if (output.linesTruncated) {
		context.stderr.push(
			`Stopped Java preview after ${MAX_JAVA_CONSOLE_OUTPUT_LINES.toLocaleString()} output lines.`
		);
	}
	return { stderr: context.stderr, stdout: output.stdout };
}

function seedJavaLiteralConstants(
	source: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
) {
	const constantLeftSidePattern =
		/^(?:(?:public|private|protected|static|final)\s+)*(?:String|int|long|double|float|boolean|char)\s+([A-Z_]\w*)$/i;

	for (const rawLine of source.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (
			!line.includes("final") ||
			!line.includes("=") ||
			!line.endsWith(";") ||
			line.includes("{") ||
			line.includes("}")
		) {
			continue;
		}

		const declaration = line.slice(0, -1);
		const separatorIndex = declaration.indexOf("=");
		if (separatorIndex <= 0) {
			continue;
		}

		const leftSide = declaration.slice(0, separatorIndex).trim();
		const rawValue = declaration.slice(separatorIndex + 1).trim();
		if (!/\bfinal\b/i.test(leftSide) || !rawValue) {
			continue;
		}

		const match = leftSide.match(constantLeftSidePattern);
		const name = match?.[1];
		if (!name) {
			continue;
		}
		const value = evaluateJavaExpression(rawValue, context, output);
		context.variables.set(name, value);
		context.constants.set(name, value);
	}
}

function executeJavaConsoleBody(
	body: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState,
	depth = 0
): JavaConsoleSignal {
	if (depth > 30) {
		context.stderr.push("Stopped Java preview after nested control flow.");
		return null;
	}

	let index = 0;
	while (index < body.length) {
		index = skipWhitespace(body, index);
		if (index >= body.length) break;

		if (wordAt(body, index, "if")) {
			const parsedIf = parseJavaIfStatement(body, index);
			if (parsedIf) {
				const branchBody = evaluateJavaBooleanExpression(
					parsedIf.condition,
					context,
					output
				)
					? parsedIf.body
					: parsedIf.elseBody;
				if (branchBody) {
					const signal = executeJavaConsoleBody(
						branchBody,
						context,
						output,
						depth + 1
					);
					if (signal) return signal;
				}
				index = parsedIf.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "for")) {
			const parsedLoop = parseJavaConsoleForLoop(body, index);
			if (parsedLoop) {
				if (parsedLoop.kind === "enhanced") {
					const values = javaIterableValues(
						evaluateJavaExpression(
							parsedLoop.iterableExpression,
							context,
							output
						)
					);
					for (let count = 0; count < values.length; count += 1) {
						if (count >= MAX_JAVA_CONSOLE_LOOP_ITERATIONS) {
							context.stderr.push(
								`Stopped Java preview after ${MAX_JAVA_CONSOLE_LOOP_ITERATIONS} loop iterations.`
							);
							break;
						}
						context.variables.set(
							parsedLoop.itemName,
							values[count] ?? { type: "null", value: null }
						);
						const signal = executeJavaConsoleBody(
							parsedLoop.body,
							context,
							output,
							depth + 1
						);
						if (signal === "break") break;
						if (signal && signal !== "continue") return signal;
						if (signal === "continue") continue;
					}
					index = parsedLoop.nextIndex;
					continue;
				}

				executeJavaConsoleStatement(
					`${parsedLoop.initializer};`,
					context,
					output
				);
				for (
					let count = 0;
					evaluateJavaBooleanExpression(
						parsedLoop.condition,
						context,
						output
					);
					count += 1
				) {
					if (count >= MAX_JAVA_CONSOLE_LOOP_ITERATIONS) {
						context.stderr.push(
							`Stopped Java preview after ${MAX_JAVA_CONSOLE_LOOP_ITERATIONS} loop iterations.`
						);
						break;
					}
					const signal = executeJavaConsoleBody(
						parsedLoop.body,
						context,
						output,
						depth + 1
					);
					if (signal === "break") break;
					if (signal && signal !== "continue") return signal;
					executeJavaConsoleStatement(
						`${parsedLoop.update};`,
						context,
						output
					);
					if (signal === "continue") continue;
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "while")) {
			const parsedLoop = parseJavaConditionalLoop(body, index);
			if (parsedLoop) {
				for (
					let count = 0;
					evaluateJavaBooleanExpression(
						parsedLoop.condition,
						context,
						output
					);
					count += 1
				) {
					if (count >= MAX_JAVA_CONSOLE_LOOP_ITERATIONS) {
						context.stderr.push(
							`Stopped Java preview after ${MAX_JAVA_CONSOLE_LOOP_ITERATIONS} loop iterations.`
						);
						break;
					}
					const signal = executeJavaConsoleBody(
						parsedLoop.body,
						context,
						output,
						depth + 1
					);
					if (signal === "break") break;
					if (signal && signal !== "continue") return signal;
					if (signal === "continue") continue;
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (body[index] === "{") {
			const closingBrace = findMatchingDelimiter(body, index, "{", "}");
			if (closingBrace < 0) break;
			const signal = executeJavaConsoleBody(
				body.slice(index + 1, closingBrace),
				context,
				output,
				depth + 1
			);
			if (signal) return signal;
			index = closingBrace + 1;
			continue;
		}

		const end = findJavaStatementEnd(body, index);
		if (end < 0) break;
		const signal = executeJavaConsoleStatement(
			body.slice(index, end + 1).trim(),
			context,
			output
		);
		if (signal) return signal;
		index = end + 1;
	}

	return null;
}

function executeJavaConsoleStatement(
	statement: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
): JavaConsoleSignal {
	const trimmed = statement.trim().replace(/;$/, "").trim();
	if (trimmed === "break") return "break";
	if (trimmed === "continue") return "continue";
	if (trimmed === "return") {
		return {
			kind: "return",
			value: { type: "null", value: null }
		};
	}
	if (trimmed.startsWith("return ")) {
		return {
			kind: "return",
			value: evaluateJavaExpression(
				trimmed.slice("return ".length),
				context,
				output
			)
		};
	}

	for (const match of statement.matchAll(JAVA_PRINT_RE)) {
		const method = match[1]?.toLowerCase() ?? "print";
		const expression = match[2] ?? "";
		const value =
			method === "printf" || method === "format"
				? formatJavaConsoleExpression(expression, context, output)
				: javaValueToString(
						evaluateJavaExpression(expression, context, output)
					);
		appendJavaConsoleText(output, value, method === "println");
	}

	if (executeJavaConsoleMethodStatement(trimmed, context, output))
		return null;
	if (executeJavaRandomStatement(trimmed, context, output)) return null;
	if (executeJavaCollectionMutationStatement(trimmed, context, output))
		return null;

	storeJavaVariableFromStatement(statement, context, output);
	return null;
}

function executeJavaConsoleMethodStatement(
	statement: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
) {
	const methodCall = statement.match(/^([A-Z_]\w*)\s*\(([\s\S]*)\)$/i);
	const methodName = methodCall?.[1];
	if (!methodName || !context.methods.has(methodName)) return false;
	executeJavaConsoleMethodCall(
		methodName,
		methodCall?.[2] ?? "",
		context,
		output
	);
	return true;
}

function executeJavaRandomStatement(
	statement: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
) {
	return Boolean(
		evaluateJavaRandomMethodExpression(statement, context, output)
	);
}

function executeJavaCollectionMutationStatement(
	statement: string,
	context: JavaConsoleContext,
	output: JavaConsoleOutputState
) {
	const arraySort = statement.match(
		/^Arrays\.sort\s*\(\s*([A-Z_]\w*)\s*\)$/i
	);
	if (arraySort?.[1]) {
		const value = context.variables.get(arraySort[1]);
		if (value?.type !== "array") return false;
		value.value.sort(compareJavaArrayValuesForSort);
		return true;
	}

	const mapMutation = statement.match(
		/^([A-Z_]\w*)\.(put|putIfAbsent|remove|clear)\s*\(([\s\S]*)\)$/i
	);
	if (mapMutation?.[1] && mapMutation[2]) {
		const map = context.variables.get(mapMutation[1]);
		if (map?.type === "map") {
			const args = splitJavaArguments(mapMutation[3] ?? "");
			const method = mapMutation[2].toLowerCase();
			if (method === "clear") {
				map.value.splice(0);
				return true;
			}
			const key = evaluateJavaExpression(args[0] ?? "", context, output);
			if (method === "remove") {
				removeJavaMapEntry(map, key);
				return true;
			}
			const value = evaluateJavaExpression(
				args[1] ?? "",
				context,
				output
			);
			setJavaMapEntry(map, key, value, method === "putifabsent");
			return true;
		}
	}

	const match = statement.match(
		/^([A-Z_]\w*)\.(add|set|remove|clear)\s*\(([\s\S]*)\)$/i
	);
	if (!match?.[1] || !match[2]) return false;
	const collection = context.variables.get(match[1]);
	if (collection?.type !== "arrayList") return false;
	const args = splitJavaArguments(match[3] ?? "");
	const method = match[2].toLowerCase();
	if (method === "add") {
		const item = evaluateJavaExpression(args.at(-1) ?? "", context, output);
		if (args.length >= 2) {
			collection.value.splice(
				javaExpressionToIndex(args[0] ?? "0", context, output),
				0,
				item
			);
		} else {
			collection.value.push(item);
		}
		return true;
	}
	if (method === "set") {
		const index = javaExpressionToIndex(args[0] ?? "", context, output);
		collection.value[index] = evaluateJavaExpression(
			args[1] ?? "",
			context,
			output
		);
		return true;
	}
	if (method === "remove") {
		const rawArgument = args[0] ?? "";
		const argument = evaluateJavaExpression(rawArgument, context, output);
		if (argument.type === "number") {
			collection.value.splice(
				javaExpressionToIndex(rawArgument, context, output),
				1
			);
		} else {
			const index = collection.value.findIndex(value =>
				javaValuesAreEqual(value, argument)
			);
			if (index >= 0) collection.value.splice(index, 1);
		}
		return true;
	}
	collection.value.splice(0);
	return true;
}

function compareJavaArrayValuesForSort(
	left: JavaConsoleValue,
	right: JavaConsoleValue
) {
	if (left.type === "number" && right.type === "number") {
		return left.value - right.value;
	}
	return javaValueToString(left).localeCompare(javaValueToString(right));
}

function storeJavaVariableFromStatement(
	statement: string,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const trimmed = statement.trim().replace(/;$/, "").trim();
	const indexedIncrement = trimmed.match(JAVA_INDEXED_INCREMENT_RE);
	if (indexedIncrement) {
		const variableName =
			indexedIncrement[1] ??
			indexedIncrement[3] ??
			indexedIncrement[5] ??
			indexedIncrement[7];
		const rawIndex =
			indexedIncrement[2] ??
			indexedIncrement[4] ??
			indexedIncrement[6] ??
			indexedIncrement[8] ??
			"";
		if (!variableName) return;
		const currentValue = getJavaIndexedValue(
			variableName,
			rawIndex,
			context,
			output
		);
		const direction = trimmed.includes("--") ? -1 : 1;
		setJavaIndexedValue(
			variableName,
			rawIndex,
			{
				type: "number",
				value: javaValueToNumber(currentValue) + direction
			},
			context,
			output
		);
		return;
	}

	const indexedCompound = trimmed.match(
		JAVA_INDEXED_COMPOUND_ASSIGNMENT_START_RE
	);
	if (indexedCompound?.[1] && indexedCompound[2] && indexedCompound[3]) {
		setJavaIndexedValue(
			indexedCompound[1],
			indexedCompound[2],
			applyJavaCompoundAssignment(
				getJavaIndexedValue(
					indexedCompound[1],
					indexedCompound[2],
					context,
					output
				),
				indexedCompound[3],
				evaluateJavaExpression(
					trimmed.slice(indexedCompound[0].length),
					context,
					output
				)
			),
			context,
			output
		);
		return;
	}

	const indexedAssignment = trimmed.match(JAVA_INDEXED_ASSIGNMENT_START_RE);
	if (indexedAssignment?.[1] && indexedAssignment[2]) {
		setJavaIndexedValue(
			indexedAssignment[1],
			indexedAssignment[2],
			evaluateJavaExpression(
				trimmed.slice(indexedAssignment[0].length),
				context,
				output
			),
			context,
			output
		);
		return;
	}

	const increment = trimmed.match(JAVA_INCREMENT_RE);
	if (increment) {
		const variableName = increment.slice(1).find(Boolean);
		if (!variableName) return;
		const currentValue = context.variables.get(variableName);
		const currentNumber =
			currentValue?.type === "number" ? currentValue.value : 0;
		const direction = trimmed.includes("--") ? -1 : 1;
		context.variables.set(variableName, {
			type: "number",
			value: currentNumber + direction
		});
		return;
	}

	const compound = trimmed.match(JAVA_COMPOUND_ASSIGNMENT_START_RE);
	if (compound?.[1] && compound[2]) {
		context.variables.set(
			compound[1],
			applyJavaCompoundAssignment(
				context.variables.get(compound[1]) ?? {
					type: "number",
					value: 0
				},
				compound[2],
				evaluateJavaExpression(
					trimmed.slice(compound[0].length),
					context,
					output
				)
			)
		);
		return;
	}

	const declaration = trimmed.match(JAVA_VARIABLE_DECLARATION_START_RE);
	if (declaration?.[1] && declaration[2]) {
		const value = evaluateJavaExpression(
			trimmed.slice(declaration[0].length),
			context,
			output
		);
		context.variables.set(
			declaration[2],
			applyDeclaredJavaType(value, declaration[1])
		);
		return;
	}

	const assignment = trimmed.match(JAVA_VARIABLE_ASSIGNMENT_START_RE);
	if (assignment?.[1]) {
		context.variables.set(
			assignment[1],
			evaluateJavaExpression(
				trimmed.slice(assignment[0].length),
				context,
				output
			)
		);
	}
}

function applyJavaCompoundAssignment(
	currentValue: JavaConsoleValue,
	operator: string,
	nextValue: JavaConsoleValue
): JavaConsoleValue {
	if (operator === "+=") {
		if (currentValue.type === "string" || nextValue.type === "string") {
			return {
				type: "string",
				value: `${javaValueToString(currentValue)}${javaValueToString(nextValue)}`
			};
		}
		return {
			type: "number",
			value:
				javaValueToNumber(currentValue) + javaValueToNumber(nextValue)
		};
	}

	const currentNumber = javaValueToNumber(currentValue);
	const nextNumber = javaValueToNumber(nextValue);
	if (operator === "-=")
		return { type: "number", value: currentNumber - nextNumber };
	if (operator === "*=")
		return { type: "number", value: currentNumber * nextNumber };
	if (operator === "/=")
		return { type: "number", value: currentNumber / nextNumber };
	return { type: "number", value: currentNumber % nextNumber };
}

function evaluateJavaExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue {
	const trimmed = expression.trim();
	if (!trimmed) return { type: "string", value: "" };

	const objectValue = evaluateJavaObjectExpression(trimmed, context, output);
	if (objectValue) return objectValue;

	const randomValue = evaluateJavaRandomMethodExpression(
		trimmed,
		context,
		output
	);
	if (randomValue) return randomValue;

	const scannerValue = evaluateJavaScannerRead(trimmed, context);
	if (scannerValue) return scannerValue;

	const collectionValue = evaluateJavaCollectionExpression(
		trimmed,
		context,
		output
	);
	if (collectionValue) return collectionValue;

	const stringFormatValue = evaluateJavaStringFormatExpression(
		trimmed,
		context,
		output
	);
	if (stringFormatValue) return stringFormatValue;

	const castValue = evaluateJavaCastExpression(trimmed, context, output);
	if (castValue) return castValue;

	const mathMethodValue = evaluateJavaMathMethodExpression(
		trimmed,
		context,
		output
	);
	if (mathMethodValue) return mathMethodValue;

	const stringMethodValue = evaluateJavaStringMethodExpression(
		trimmed,
		context,
		output
	);
	if (stringMethodValue) return stringMethodValue;

	const methodCallValue = evaluateJavaMethodCallExpression(
		trimmed,
		context,
		output
	);
	if (methodCallValue) return methodCallValue;

	const booleanValue = evaluateJavaBooleanValueExpression(
		trimmed,
		context,
		output
	);
	if (booleanValue) return booleanValue;

	const numericValue = evaluateNumericExpression(trimmed, context, output);
	if (numericValue !== null) return { type: "number", value: numericValue };

	const mixedAdditionValue = evaluateJavaMixedAdditionExpression(
		trimmed,
		context,
		output
	);
	if (mixedAdditionValue) return mixedAdditionValue;

	if (/^"(?:\\.|[^"\\])*"$/.test(trimmed)) {
		return {
			type: "string",
			value: unescapeJavaString(trimmed.slice(1, -1))
		};
	}
	if (/^'(?:\\.|[^'\\])'$/.test(trimmed)) {
		return {
			type: "char",
			value: unescapeJavaString(trimmed.slice(1, -1))
		};
	}
	if (/^(?:true|false)$/i.test(trimmed)) {
		return { type: "boolean", value: trimmed.toLowerCase() === "true" };
	}
	if (/^null$/i.test(trimmed)) return { type: "null", value: null };

	const variable = context?.variables.get(trimmed);
	if (variable) return variable;

	return { type: "string", value: trimmed };
}

function evaluateJavaScannerRead(
	expression: string,
	context: JavaConsoleContext | undefined
): JavaConsoleValue | null {
	const match = expression.match(JAVA_SCANNER_METHOD_RE);
	if (!match || !context) return null;
	const receiver = match[1] ?? "";
	if (context.variables.get(receiver)?.type !== "scanner") return null;
	const rawMethod = match[2] ?? "";
	const method = rawMethod.toLowerCase();
	if (method.startsWith("hasnext")) {
		return {
			type: "boolean",
			value: javaScannerHasNext(context.input, method)
		};
	}

	const raw =
		method === "nextline"
			? readJavaScannerLine(context.input)
			: readJavaScannerToken(context.input);

	if (raw === null) {
		context.stderr.push(`Scanner input ran out for ${rawMethod}().`);
		return scannerFallbackValue(method);
	}

	if (method === "nextint") {
		const value = parseJavaScannerInt(raw);
		if (Number.isFinite(value)) return { type: "number", value };
		context.stderr.push(`Scanner could not read int from "${raw}".`);
		return { type: "number", value: 0 };
	}

	if (method === "nextdouble") {
		const value = parseJavaScannerDouble(raw);
		if (Number.isFinite(value)) return { type: "number", value };
		context.stderr.push(`Scanner could not read double from "${raw}".`);
		return { type: "number", value: 0 };
	}

	if (method === "nextboolean") {
		const normalized = raw.toLowerCase();
		if (normalized === "true" || normalized === "false") {
			return { type: "boolean", value: normalized === "true" };
		}
		context.stderr.push(`Scanner could not read boolean from "${raw}".`);
		return { type: "boolean", value: false };
	}

	return { type: "string", value: raw };
}

function evaluateJavaObjectExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	if (/^new\s+(?:java\.util\.)?Scanner\s*\([\s\S]*\)$/i.test(expression)) {
		return javaScannerValue();
	}
	const random = expression.match(
		/^new\s+(?:java\.util\.)?Random\s*\(([\s\S]*)\)$/i
	);
	if (random) {
		const args = splitJavaArguments(random[1] ?? "");
		return javaRandomValue(
			args[0] ? evaluateJavaExpression(args[0], context, output) : null
		);
	}
	return null;
}

function javaScannerHasNext(input: JavaScannerInput, method: string) {
	if (method === "hasnextline") return input.position < input.source.length;
	const token = peekJavaScannerToken(input);
	if (token === null) return false;
	if (method === "hasnextint")
		return Number.isFinite(parseJavaScannerInt(token));
	if (method === "hasnextdouble")
		return Number.isFinite(parseJavaScannerDouble(token));
	if (method === "hasnextboolean") return /^(?:true|false)$/i.test(token);
	return true;
}

function scannerFallbackValue(method: string): JavaConsoleValue {
	if (method === "nextint" || method === "nextdouble")
		return { type: "number", value: 0 };
	if (method === "nextboolean") return { type: "boolean", value: false };
	return { type: "string", value: "" };
}

function readJavaScannerLine(input: JavaScannerInput) {
	if (input.position >= input.source.length) return null;
	const newline = input.source.indexOf("\n", input.position);
	if (newline < 0) {
		const line = input.source.slice(input.position);
		input.position = input.source.length;
		return line;
	}
	const line = input.source.slice(input.position, newline);
	input.position = newline + 1;
	return line;
}

function peekJavaScannerToken(input: JavaScannerInput) {
	const bounds = javaScannerTokenBounds(input);
	return bounds ? input.source.slice(bounds.start, bounds.end) : null;
}

function readJavaScannerToken(input: JavaScannerInput) {
	const bounds = javaScannerTokenBounds(input);
	if (!bounds) return null;
	input.position = bounds.end;
	return input.source.slice(bounds.start, bounds.end);
}

function javaScannerTokenBounds(input: JavaScannerInput) {
	let start = input.position;
	while (start < input.source.length && /\s/.test(input.source[start] ?? ""))
		start += 1;
	if (start >= input.source.length) return null;

	let end = start;
	while (end < input.source.length && !/\s/.test(input.source[end] ?? ""))
		end += 1;
	return { end, start };
}

function parseJavaScannerInt(raw: string) {
	if (!/^[+-]?\d+$/.test(raw)) return Number.NaN;
	return Number.parseInt(raw, 10);
}

function parseJavaScannerDouble(raw: string) {
	if (!isJavaScannerDoubleToken(raw)) return Number.NaN;
	return Number.parseFloat(raw);
}

function evaluateJavaStringFormatExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const match = expression.match(/^String\.format\s*\(([\s\S]*)\)$/i);
	if (!match) return null;
	return {
		type: "string",
		value: formatJavaConsoleExpression(match[1] ?? "", context, output)
	};
}

function evaluateJavaMixedAdditionExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const parts = splitJavaConcat(expression);
	if (parts.length <= 1) return null;

	let value = evaluateJavaExpression(parts[0] ?? "", context, output);
	for (const part of parts.slice(1)) {
		value = combineJavaAdditionValues(
			value,
			evaluateJavaExpression(part, context, output)
		);
	}
	return value;
}

function combineJavaAdditionValues(
	left: JavaConsoleValue,
	right: JavaConsoleValue
): JavaConsoleValue {
	if (left.type === "string" || right.type === "string") {
		return {
			type: "string",
			value: `${javaValueToString(left)}${javaValueToString(right)}`
		};
	}
	if (isJavaNumericAdditionValue(left) && isJavaNumericAdditionValue(right)) {
		return {
			type: "number",
			value: javaValueToNumber(left) + javaValueToNumber(right)
		};
	}
	return {
		type: "string",
		value: `${javaValueToString(left)}${javaValueToString(right)}`
	};
}

function isJavaNumericAdditionValue(value: JavaConsoleValue) {
	return value.type === "number" || value.type === "char";
}

function formatJavaConsoleExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const args = splitJavaArguments(expression);
	const formatText = javaValueToString(
		evaluateJavaExpression(args[0] ?? "", context, output)
	);
	const values = args
		.slice(1)
		.map(arg => evaluateJavaExpression(arg, context, output));
	return formatJavaConsoleText(formatText, values);
}

function formatJavaConsoleText(formatText: string, values: JavaConsoleValue[]) {
	let valueIndex = 0;
	let formatted = "";
	for (let index = 0; index < formatText.length; index += 1) {
		const character = formatText[index] ?? "";
		if (character !== "%") {
			formatted += character;
			continue;
		}

		const token = parseJavaFormatToken(formatText, index);
		if (!token) {
			formatted += character;
			continue;
		}
		index = token.end;
		if (token.conversion === "%") {
			formatted += "%";
			continue;
		}
		if (token.conversion === "n") {
			formatted += "\n";
			continue;
		}

		const value = values[valueIndex] ?? { type: "string", value: "" };
		valueIndex += 1;
		formatted += formatJavaFormatValue(value, token);
	}
	return formatted;
}

function parseJavaFormatToken(formatText: string, percentIndex: number) {
	let index = percentIndex + 1;
	if (index >= formatText.length) return null;
	if (formatText[index] === "%" || formatText[index] === "n") {
		return {
			conversion: formatText[index] ?? "",
			end: index,
			flags: "",
			precision: null,
			width: null
		};
	}

	const flagsStart = index;
	while ("-+ 0,(".includes(formatText[index] ?? "")) index += 1;
	const flags = formatText.slice(flagsStart, index);
	const widthStart = index;
	while (/\d/.test(formatText[index] ?? "")) index += 1;
	const width =
		index > widthStart
			? Number.parseInt(formatText.slice(widthStart, index), 10)
			: null;
	let precision: number | null = null;
	if (formatText[index] === ".") {
		index += 1;
		const precisionStart = index;
		while (/\d/.test(formatText[index] ?? "")) index += 1;
		precision =
			index > precisionStart
				? Number.parseInt(formatText.slice(precisionStart, index), 10)
				: 0;
	}

	const conversion = formatText[index] ?? "";
	return javaFormatConversions.includes(conversion.toLowerCase())
		? { conversion, end: index, flags, precision, width }
		: null;
}

function formatJavaFormatValue(
	value: JavaConsoleValue,
	token: {
		conversion: string;
		flags: string;
		precision: number | null;
		width: number | null;
	}
) {
	const conversion = token.conversion.toLowerCase();
	let text: string;
	if (conversion === "d") {
		text = String(Math.trunc(javaValueToNumber(value)));
	} else if (conversion === "f") {
		const number = javaValueToNumber(value);
		text =
			token.precision === null
				? number.toFixed(6)
				: number.toFixed(token.precision);
	} else if (conversion === "b") {
		text =
			value.type === "boolean"
				? String(value.value)
				: String(value.type !== "null" && Boolean(value.value));
	} else {
		text = javaValueToString(value);
		if (token.precision !== null) text = text.slice(0, token.precision);
	}
	if (!token.width || text.length >= token.width) return text;
	const padding = (token.flags.includes("0") ? "0" : " ").repeat(
		token.width - text.length
	);
	return token.flags.includes("-")
		? `${text}${padding}`
		: `${padding}${text}`;
}

function appendJavaConsoleText(
	output: JavaConsoleOutputState,
	text: string,
	flushEnd = false
) {
	if (output.linesTruncated) return;

	const lines = text.split("\n");
	lines.forEach((line, index) => {
		if (index > 0) {
			flushJavaConsoleLine(output);
			if (output.linesTruncated) return;
			output.pendingLine = "";
		}
		appendJavaConsolePendingText(output, line);
	});
	if (flushEnd) {
		flushJavaConsoleLine(output);
		output.pendingLine = "";
	}
}

function appendJavaConsolePendingText(
	output: JavaConsoleOutputState,
	text: string
) {
	const nextLine = `${output.pendingLine}${text}`;
	if (nextLine.length <= MAX_JAVA_CONSOLE_OUTPUT_LINE_CHARS) {
		output.pendingLine = nextLine;
		return;
	}

	output.pendingLine = `${nextLine.slice(0, MAX_JAVA_CONSOLE_OUTPUT_LINE_CHARS)}${JAVA_CONSOLE_OUTPUT_LINE_TRUNCATED_MESSAGE}`;
	output.lineTruncated = true;
}

function flushJavaConsoleLine(output: JavaConsoleOutputState) {
	if (output.stdout.length >= MAX_JAVA_CONSOLE_OUTPUT_LINES) {
		output.linesTruncated = true;
		output.pendingLine = "";
		return;
	}

	output.stdout.push(output.pendingLine);
}

function isJavaScannerDoubleToken(raw: string) {
	let token = raw.toLowerCase();
	if (token.startsWith("+") || token.startsWith("-")) token = token.slice(1);
	const exponentParts = token.split("e");
	if (exponentParts.length > 2) return false;
	const [mantissa = "", exponent] = exponentParts;
	if (exponent !== undefined && !/^[+-]?\d+$/.test(exponent)) return false;
	const decimalParts = mantissa.split(".");
	if (decimalParts.length > 2) return false;
	const [whole = "", fraction = ""] = decimalParts;
	if (decimalParts.length === 1) return /^\d+$/.test(whole);
	if (whole && !/^\d+$/.test(whole)) return false;
	if (fraction && !/^\d+$/.test(fraction)) return false;
	return Boolean(whole || fraction) && Boolean(whole || fraction.length);
}

function evaluateJavaCollectionExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const arrayLiteral = evaluateJavaArrayLiteral(expression, context, output);
	if (arrayLiteral) return arrayLiteral;

	const newArrayLiteral = expression.match(
		/^new\s+([A-Z_]\w*)\s*\[\s*\]\s*\{([^{}]*)\}$/i
	);
	if (newArrayLiteral?.[1]) {
		return javaArrayValue(
			newArrayLiteral[1],
			splitJavaArguments(newArrayLiteral[2] ?? "").map(arg =>
				evaluateJavaExpression(arg, context, output)
			)
		);
	}

	const newArray = parseJavaNewArrayExpression(expression);
	if (newArray) {
		return javaArrayValueForDimensions(
			newArray.elementType,
			newArray.dimensions,
			context,
			output
		);
	}

	const arrayList = expression.match(
		/^new\s+ArrayList(?:\s*<[^>]*>)?\s*\(\s*\)$/i
	);
	if (arrayList) return javaArrayListValue();

	const map = expression.match(
		/^new\s+(HashMap|TreeMap)(?:\s*<[^>]*>)?\s*\(\s*\)$/i
	);
	if (map) {
		return javaMapValue(
			[],
			map[1]?.toLowerCase() === "treemap" ? "treeMap" : "hashMap"
		);
	}

	const arraysCopyOf = expression.match(/^Arrays\.copyOf\s*\(([\s\S]*)\)$/i);
	if (arraysCopyOf?.[1]) {
		const args = splitJavaArguments(arraysCopyOf[1]);
		const original = evaluateJavaExpression(args[0] ?? "", context, output);
		if (original.type === "array") {
			return copyJavaArrayValue(
				original,
				javaExpressionToIndex(args[1] ?? "0", context, output)
			);
		}
	}

	const arraysToString = expression.match(
		/^Arrays\.(?:toString|deepToString)\s*\(([^()]*)\)$/i
	);
	if (arraysToString?.[1]) {
		const value = evaluateJavaExpression(
			arraysToString[1],
			context,
			output
		);
		return {
			type: "string",
			value:
				value.type === "array" ||
				value.type === "arrayList" ||
				value.type === "map"
					? javaCollectionToString(value)
					: javaValueToString(value)
		};
	}

	const lengthMatch = expression.match(
		/^([A-Z_]\w*)((?:\s*\[[^\][]+\])*)\.length$/i
	);
	if (lengthMatch?.[1]) {
		const rawIndexes = lengthMatch[2] ?? "";
		const value = rawIndexes.trim()
			? getJavaIndexedValue(lengthMatch[1], rawIndexes, context, output)
			: context?.variables.get(lengthMatch[1]);
		if (value?.type === "array") {
			return { type: "number", value: value.value.length };
		}
	}

	const arrayAccess = expression.match(
		/^([A-Z_]\w*)((?:\s*\[[^\][]+\])+)\s*$/i
	);
	if (arrayAccess?.[1] && arrayAccess[2]) {
		return getJavaIndexedValue(
			arrayAccess[1],
			arrayAccess[2],
			context,
			output
		);
	}

	const listMethod = expression.match(
		/^([A-Z_]\w*)\.(get|size|isEmpty|contains)\s*\(([^()]*)\)$/i
	);
	if (listMethod?.[1] && listMethod[2]) {
		const value = context?.variables.get(listMethod[1]);
		if (value?.type === "arrayList") {
			const method = listMethod[2].toLowerCase();
			if (method === "size")
				return { type: "number", value: value.value.length };
			if (method === "isempty") {
				return { type: "boolean", value: value.value.length === 0 };
			}
			if (method === "contains") {
				const target = evaluateJavaExpression(
					listMethod[3] ?? "",
					context,
					output
				);
				return {
					type: "boolean",
					value: value.value.some(item =>
						javaValuesAreEqual(item, target)
					)
				};
			}
			return (
				value.value[
					javaExpressionToIndex(listMethod[3] ?? "0", context, output)
				] ?? { type: "null", value: null }
			);
		}
	}

	const mapEntryMethod = expression.match(
		/^([A-Z_]\w*)\.(getKey|getValue)\s*\(\s*\)$/i
	);
	if (mapEntryMethod?.[1] && mapEntryMethod[2]) {
		const value = context?.variables.get(mapEntryMethod[1]);
		if (value?.type !== "mapEntry") return null;
		return mapEntryMethod[2].toLowerCase() === "getkey"
			? value.value.key
			: value.value.value;
	}

	const mapMethod = expression.match(
		/^([A-Z_]\w*)\.(get|containsKey|getOrDefault|keySet|values|entrySet|size|isEmpty)\s*\(([^()]*)\)$/i
	);
	if (!mapMethod?.[1] || !mapMethod[2]) return null;
	const value = context?.variables.get(mapMethod[1]);
	if (value?.type !== "map") return null;
	const method = mapMethod[2].toLowerCase();
	if (method === "size") return { type: "number", value: value.value.length };
	if (method === "isempty") {
		return { type: "boolean", value: value.value.length === 0 };
	}
	if (method === "keyset") {
		return javaArrayListValue(value.value.map(entry => entry.key));
	}
	if (method === "values") {
		return javaArrayListValue(value.value.map(entry => entry.value));
	}
	if (method === "entryset") {
		return javaArrayListValue(
			value.value.map(entry => javaMapEntryValue(entry))
		);
	}
	const args = splitJavaArguments(mapMethod[3] ?? "");
	const key = evaluateJavaExpression(args[0] ?? "", context, output);
	const entry = findJavaMapEntry(value, key);
	if (method === "containskey") {
		return { type: "boolean", value: Boolean(entry) };
	}
	if (method === "getordefault") {
		return (
			entry?.value ??
			evaluateJavaExpression(args[1] ?? "", context, output)
		);
	}
	return entry?.value ?? { type: "null", value: null };
}

function evaluateJavaArrayLiteral(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	if (!expression.startsWith("{")) return null;
	const close = findMatchingDelimiter(expression, 0, "{", "}");
	if (close !== expression.length - 1) return null;
	return javaArrayValue(
		"var",
		splitJavaArguments(expression.slice(1, -1)).map(arg =>
			evaluateJavaExpression(arg, context, output)
		)
	);
}

function javaValueToString(value: JavaConsoleValue): string {
	if (
		value.type === "array" ||
		value.type === "arrayList" ||
		value.type === "map"
	) {
		return javaCollectionToString(value);
	}
	if (value.type === "mapEntry") {
		return `${javaValueToString(value.value.key)}=${javaValueToString(value.value.value)}`;
	}
	if (value.type === "random") return "Random";
	if (value.type === "scanner") return "Scanner";
	if (value.type === "null") return "null";
	return String(value.value);
}

function javaValueToNumber(value: JavaConsoleValue): number {
	if (value.type === "number") return value.value;
	if (value.type === "char") return value.value.codePointAt(0) ?? 0;
	if (
		value.type === "array" ||
		value.type === "arrayList" ||
		value.type === "map" ||
		value.type === "random" ||
		value.type === "scanner"
	) {
		return value.type === "random" || value.type === "scanner"
			? 0
			: value.value.length;
	}
	const parsed = Number(javaValueToString(value).trim());
	return Number.isFinite(parsed) ? parsed : 0;
}

function javaCollectionToString(
	value: Extract<JavaConsoleValue, { type: "array" | "arrayList" | "map" }>
): string {
	if (value.type === "map") {
		return `{${value.value
			.map(
				entry =>
					`${javaValueToString(entry.key)}=${javaValueToString(entry.value)}`
			)
			.join(", ")}}`;
	}
	return `[${value.value.map(javaValueToString).join(", ")}]`;
}

function javaIterableValues(value: JavaConsoleValue): JavaConsoleValue[] {
	return value.type === "array" || value.type === "arrayList"
		? value.value
		: [];
}

function parseJavaNewArrayExpression(expression: string) {
	const trimmed = expression.trim();
	if (!/^new\s+/i.test(trimmed)) return null;
	const afterNew = trimmed.replace(/^new\s+/i, "");
	const typeMatch = afterNew.match(/^([A-Z_]\w*)/i);
	if (!typeMatch?.[1]) return null;
	const dimensions = afterNew.slice(typeMatch[0].length).trim();
	if (!dimensions.startsWith("[")) return null;
	const parsedDimensions = parseJavaIndexExpressions(dimensions);
	if (!parsedDimensions.length) return null;
	return {
		dimensions: parsedDimensions,
		elementType: typeMatch[1]
	};
}

function javaArrayValueForDimensions(
	elementType: string,
	dimensions: string[],
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue {
	const [rawLength = "0", ...remainingDimensions] = dimensions;
	const length = Math.max(
		0,
		javaExpressionToIndex(rawLength || "0", context, output)
	);
	const defaultValue = () => {
		if (!remainingDimensions.length)
			return defaultJavaValueForType(elementType);
		return javaArrayValueForDimensions(
			elementType,
			remainingDimensions,
			context,
			output
		);
	};
	const values = Array.from({ length }, defaultValue);
	return javaArrayValue(elementType, values);
}

function javaArrayValue(
	elementType: string,
	value: JavaConsoleValue[]
): JavaConsoleValue {
	return {
		elementType,
		type: "array",
		value
	};
}

function copyJavaArrayValue(
	original: Extract<JavaConsoleValue, { type: "array" }>,
	rawLength: number
): JavaConsoleValue {
	const length = Math.max(0, rawLength);
	const value = original.value.slice(0, length);
	while (value.length < length) {
		value.push(defaultJavaValueForType(original.elementType));
	}
	return javaArrayValue(original.elementType, value);
}

function applyDeclaredJavaType(
	value: JavaConsoleValue,
	declaredType: string
): JavaConsoleValue {
	if (/^char\b/i.test(declaredType)) {
		if (value.type === "char") return value;
		return {
			type: "char",
			value: String.fromCodePoint(Math.trunc(javaValueToNumber(value)))
		};
	}
	if (value.type !== "array" || !/\[\s*\]/.test(declaredType)) return value;
	const elementType = declaredType.match(/^([A-Z_]\w*)/i)?.[1];
	return elementType ? { ...value, elementType } : value;
}

function javaArrayListValue(value: JavaConsoleValue[] = []): JavaConsoleValue {
	return {
		elementType: "Object",
		type: "arrayList",
		value
	};
}

function javaMapValue(
	value: JavaMapEntry[] = [],
	mapKind: "hashMap" | "treeMap" = "hashMap"
): JavaConsoleValue {
	return {
		mapKind,
		type: "map",
		value
	};
}

function javaScannerValue(): JavaConsoleValue {
	return {
		type: "scanner",
		value: null
	};
}

function javaRandomValue(
	seedValue: JavaConsoleValue | null = null
): JavaConsoleValue {
	return {
		type: "random",
		value: {
			seed: seedValue ? normalizeJavaRandomSeed(seedValue) : null
		}
	};
}

function javaMapEntryValue(value: JavaMapEntry): JavaConsoleValue {
	return {
		type: "mapEntry",
		value
	};
}

function findJavaMapEntry(
	map: Extract<JavaConsoleValue, { type: "map" }>,
	key: JavaConsoleValue
) {
	return map.value.find(entry => javaValuesAreEqual(entry.key, key));
}

function setJavaMapEntry(
	map: Extract<JavaConsoleValue, { type: "map" }>,
	key: JavaConsoleValue,
	value: JavaConsoleValue,
	onlyIfAbsent = false
) {
	const entry = findJavaMapEntry(map, key);
	if (entry) {
		if (!onlyIfAbsent) entry.value = value;
		return;
	}
	map.value.push({ key, value });
	sortJavaMapEntriesIfNeeded(map);
}

function removeJavaMapEntry(
	map: Extract<JavaConsoleValue, { type: "map" }>,
	key: JavaConsoleValue
) {
	const index = map.value.findIndex(entry =>
		javaValuesAreEqual(entry.key, key)
	);
	if (index >= 0) map.value.splice(index, 1);
}

function sortJavaMapEntriesIfNeeded(
	map: Extract<JavaConsoleValue, { type: "map" }>
) {
	if (map.mapKind !== "treeMap") return;
	map.value.sort((left, right) =>
		compareJavaArrayValuesForSort(left.key, right.key)
	);
}

function defaultJavaValueForType(type: string): JavaConsoleValue {
	const normalized = type.toLowerCase();
	if (
		normalized === "int" ||
		normalized === "double" ||
		normalized === "float" ||
		normalized === "long" ||
		normalized === "short" ||
		normalized === "byte"
	) {
		return { type: "number", value: 0 };
	}
	if (normalized === "boolean") return { type: "boolean", value: false };
	if (normalized === "char") return { type: "char", value: "" };
	return { type: "null", value: null };
}

function javaExpressionToIndex(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	return Math.trunc(
		javaValueToNumber(evaluateJavaExpression(expression, context, output))
	);
}

function getJavaIndexedValue(
	variableName: string,
	rawIndexes: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue {
	let current = context?.variables.get(variableName);
	for (const rawIndex of parseJavaIndexExpressions(rawIndexes)) {
		if (current?.type !== "array" && current?.type !== "arrayList") {
			return { type: "null", value: null };
		}
		current = current.value[
			javaExpressionToIndex(rawIndex, context, output)
		] ?? { type: "null", value: null };
	}
	return current ?? { type: "null", value: null };
}

function setJavaIndexedValue(
	variableName: string,
	rawIndexes: string,
	value: JavaConsoleValue,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const indexes = parseJavaIndexExpressions(rawIndexes);
	const finalIndex = indexes.at(-1);
	if (!finalIndex) return;
	let collection = context.variables.get(variableName);
	for (const rawIndex of indexes.slice(0, -1)) {
		if (collection?.type !== "array" && collection?.type !== "arrayList")
			return;
		collection =
			collection.value[javaExpressionToIndex(rawIndex, context, output)];
	}
	if (collection?.type !== "array" && collection?.type !== "arrayList")
		return;
	collection.value[javaExpressionToIndex(finalIndex, context, output)] =
		value;
}

function parseJavaIndexExpressions(rawIndexes: string) {
	const indexes: string[] = [];
	let index = skipWhitespace(rawIndexes, 0);
	while (index < rawIndexes.length) {
		if (rawIndexes[index] !== "[") return [];
		const end = findMatchingDelimiter(rawIndexes, index, "[", "]");
		if (end < 0) return [];
		indexes.push(rawIndexes.slice(index + 1, end).trim());
		index = skipWhitespace(rawIndexes, end + 1);
	}
	return indexes;
}

function evaluateJavaCastExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	if (!expression.startsWith("(")) return null;
	const castEnd = findMatchingDelimiter(expression, 0, "(", ")");
	if (castEnd < 0) return null;
	const castType = expression.slice(1, castEnd).trim().toLowerCase();
	if (castType !== "int" && castType !== "double" && castType !== "char")
		return null;
	const value = javaValueToNumber(
		evaluateJavaExpression(
			expression.slice(castEnd + 1).trim(),
			context,
			output
		)
	);
	if (castType === "char") {
		return { type: "char", value: String.fromCodePoint(Math.trunc(value)) };
	}
	return {
		type: "number",
		value: castType === "int" ? Math.trunc(value) : value
	};
}

function evaluateJavaRandomMethodExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const match = expression.match(
		/^([A-Z_]\w*)\.(nextInt|nextDouble|nextBoolean|nextLong|nextFloat|setSeed)\s*\(([\s\S]*)\)$/i
	);
	if (!match?.[1] || !match[2] || !context) return null;
	const random = context.variables.get(match[1]);
	if (random?.type !== "random") return null;
	const args = splitJavaArguments(match[3] ?? "");
	const method = match[2].toLowerCase();
	if (method === "setseed") {
		random.value.seed = normalizeJavaRandomSeed(
			evaluateJavaExpression(args[0] ?? "0", context, output)
		);
		return { type: "null", value: null };
	}

	const unit = nextJavaRandomUnit(random.value);
	if (method === "nextboolean") {
		return { type: "boolean", value: unit >= 0.5 };
	}
	if (method === "nextdouble" || method === "nextfloat") {
		return { type: "number", value: unit };
	}
	if (method === "nextlong") {
		return {
			type: "number",
			value: Math.trunc((unit * 2 - 1) * Number.MAX_SAFE_INTEGER)
		};
	}

	const boundExpression = args[0]?.trim();
	if (!boundExpression) {
		return {
			type: "number",
			value: Math.trunc(unit * 0x100000000) - 0x80000000
		};
	}
	const bound = Math.trunc(
		javaValueToNumber(
			evaluateJavaExpression(boundExpression, context, output)
		)
	);
	if (bound <= 0) {
		context.stderr.push("Random.nextInt(bound) requires a positive bound.");
		return { type: "number", value: 0 };
	}
	return { type: "number", value: Math.floor(unit * bound) };
}

function nextJavaRandomUnit(random: JavaRandomState) {
	if (random.seed === null) return Math.random();
	random.seed = (Math.imul(random.seed, 1664525) + 1013904223) >>> 0;
	return random.seed / 0x100000000;
}

function normalizeJavaRandomSeed(value: JavaConsoleValue) {
	return Math.trunc(javaValueToNumber(value)) >>> 0;
}

function evaluateJavaMathMethodExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const constant = javaMathConstantValue(expression);
	if (constant !== null) return { type: "number", value: constant };

	const match = expression.match(/^Math\.(\w+)\s*\(([\s\S]*)\)$/);
	if (!match?.[1]) return null;
	const args = splitJavaArguments(match[2] ?? "").map(arg =>
		javaValueToNumber(evaluateJavaExpression(arg, context, output))
	);
	const method = match[1];
	switch (method) {
		case "abs":
			return { type: "number", value: Math.abs(args[0] ?? 0) };
		case "ceil":
			return { type: "number", value: Math.ceil(args[0] ?? 0) };
		case "floor":
			return { type: "number", value: Math.floor(args[0] ?? 0) };
		case "max":
			return { type: "number", value: Math.max(...args) };
		case "min":
			return { type: "number", value: Math.min(...args) };
		case "pow":
			return { type: "number", value: (args[0] ?? 0) ** (args[1] ?? 0) };
		case "random":
			return { type: "number", value: Math.random() };
		case "round":
			return { type: "number", value: Math.round(args[0] ?? 0) };
		case "sqrt":
			return { type: "number", value: Math.sqrt(args[0] ?? 0) };
		default:
			return null;
	}
}

function javaMathConstantValue(expression: string): number | null {
	const normalized = expression.trim().toLowerCase();
	if (normalized === "math.pi") return Math.PI;
	if (normalized === "math.e") return Math.E;
	return null;
}

function evaluateJavaStringMethodExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const match = expression.match(
		/^([\s\S]+)\.(length|charAt|substring|equals|equalsIgnoreCase|compareTo|indexOf|toLowerCase|toUpperCase|trim)\s*\(([\s\S]*)\)$/i
	);
	if (!match?.[1] || !match[2]) return null;
	const receiver = javaValueToString(
		evaluateJavaExpression(match[1], context, output)
	);
	const argValues = splitJavaArguments(match[3] ?? "").map(arg =>
		evaluateJavaExpression(arg, context, output)
	);
	const numericArgs = argValues.map(value =>
		Math.trunc(javaValueToNumber(value))
	);
	const method = match[2].toLowerCase();
	if (method === "length") return { type: "number", value: receiver.length };
	if (method === "charat") {
		return {
			type: "string",
			value: receiver[numericArgs[0] ?? 0] ?? ""
		};
	}
	if (method === "substring") {
		return {
			type: "string",
			value: receiver.slice(
				numericArgs[0] ?? 0,
				numericArgs[1] ?? receiver.length
			)
		};
	}
	if (method === "equals" || method === "equalsignorecase") {
		return {
			type: "boolean",
			value: javaStringsAreEqual(
				receiver,
				javaValueToString(
					argValues[0] ?? { type: "null", value: null }
				),
				method === "equalsignorecase"
			)
		};
	}
	if (method === "compareto") {
		return {
			type: "number",
			value: compareJavaStrings(
				receiver,
				javaValueToString(argValues[0] ?? { type: "string", value: "" })
			)
		};
	}
	if (method === "indexof") {
		return {
			type: "number",
			value: receiver.indexOf(
				javaValueToString(
					argValues[0] ?? { type: "string", value: "" }
				),
				numericArgs[1] ?? 0
			)
		};
	}
	if (method === "tolowercase") {
		return { type: "string", value: receiver.toLowerCase() };
	}
	if (method === "touppercase") {
		return { type: "string", value: receiver.toUpperCase() };
	}
	return { type: "string", value: receiver.trim() };
}

function evaluateJavaMethodCallExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	const methodCall = expression.match(/^([A-Z_]\w*)\s*\(([\s\S]*)\)$/i);
	const methodName = methodCall?.[1];
	if (!methodName || !context?.methods.has(methodName)) return null;
	return executeJavaConsoleMethodCall(
		methodName,
		methodCall?.[2] ?? "",
		context,
		output
	);
}

function executeJavaConsoleMethodCall(
	methodName: string,
	rawArguments: string,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue {
	const method = context.methods.get(methodName);
	if (!method) return { type: "null", value: null };
	if (context.methodCallDepth >= MAX_JAVA_CONSOLE_METHOD_CALL_DEPTH) {
		context.stderr.push(
			`Stopped Java preview after ${MAX_JAVA_CONSOLE_METHOD_CALL_DEPTH} nested method calls.`
		);
		return { type: "null", value: null };
	}

	const localContext: JavaConsoleContext = {
		constants: context.constants,
		input: context.input,
		methodCallDepth: context.methodCallDepth + 1,
		methods: context.methods,
		stderr: context.stderr,
		variables: new Map(context.constants)
	};
	const args = splitJavaArguments(rawArguments);
	method.parameters.forEach((parameter, parameterIndex) => {
		localContext.variables.set(
			parameter,
			evaluateJavaExpression(args[parameterIndex] ?? "", context, output)
		);
	});

	const signal = executeJavaConsoleBody(
		method.body,
		localContext,
		output ?? {
			lineTruncated: false,
			linesTruncated: false,
			pendingLine: "",
			stdout: []
		}
	);
	if (signal && typeof signal === "object" && signal.kind === "return")
		return signal.value;
	return { type: "null", value: null };
}

function evaluateJavaBooleanValueExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaConsoleValue | null {
	if (!context) return null;
	const trimmed = stripJavaOuterParens(expression.trim());
	const orParts = splitJavaTopLevel(trimmed, "||");
	if (orParts.length > 1) {
		return {
			type: "boolean",
			value: orParts.some(part =>
				evaluateJavaBooleanExpression(part, context, output)
			)
		};
	}

	const andParts = splitJavaTopLevel(trimmed, "&&");
	if (andParts.length > 1) {
		return {
			type: "boolean",
			value: andParts.every(part =>
				evaluateJavaBooleanExpression(part, context, output)
			)
		};
	}

	if (trimmed.startsWith("!")) {
		return {
			type: "boolean",
			value: !evaluateJavaBooleanExpression(
				trimmed.slice(1),
				context,
				output
			)
		};
	}

	const comparison = splitJavaComparison(trimmed);
	if (!comparison) return null;
	return {
		type: "boolean",
		value: evaluateJavaComparison(
			evaluateJavaExpression(comparison.left, context, output),
			comparison.operator,
			evaluateJavaExpression(comparison.right, context, output)
		)
	};
}

function parseJavaConsoleForLoop(
	source: string,
	start: number
): JavaConsoleForLoop | null {
	const parenStart = skipWhitespace(source, start + 3);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const header = source.slice(parenStart + 1, parenEnd);
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;

	const enhancedHeader = parseJavaEnhancedForHeader(header);
	if (enhancedHeader) {
		return {
			body: parsedBody.body,
			iterableExpression: enhancedHeader.iterableExpression,
			itemName: enhancedHeader.itemName,
			kind: "enhanced",
			nextIndex: parsedBody.nextIndex
		};
	}

	const headerParts = splitJavaTopLevel(header, ";");
	if (headerParts.length !== 3) return null;
	return {
		body: parsedBody.body,
		condition: headerParts[1] ?? "",
		initializer: headerParts[0] ?? "",
		kind: "index",
		nextIndex: parsedBody.nextIndex,
		update: headerParts[2] ?? ""
	};
}

function parseJavaEnhancedForHeader(header: string) {
	const headerParts = splitJavaTopLevel(header, ":");
	if (headerParts.length !== 2) return null;
	const itemName = headerParts[0]?.match(/\b([A-Z_]\w*)\s*$/i)?.[1];
	const iterableExpression = headerParts[1]?.trim();
	if (!itemName || !iterableExpression) return null;
	return { itemName, iterableExpression };
}

function evaluateJavaBooleanExpression(
	expression: string,
	context: JavaConsoleContext,
	output?: JavaConsoleOutputState
): boolean {
	const trimmed = stripJavaOuterParens(expression.trim());
	if (!trimmed) return false;

	const orParts = splitJavaTopLevel(trimmed, "||");
	if (orParts.length > 1) {
		return orParts.some(part =>
			evaluateJavaBooleanExpression(part, context, output)
		);
	}

	const andParts = splitJavaTopLevel(trimmed, "&&");
	if (andParts.length > 1) {
		return andParts.every(part =>
			evaluateJavaBooleanExpression(part, context, output)
		);
	}

	if (trimmed.startsWith("!")) {
		return !evaluateJavaBooleanExpression(
			trimmed.slice(1),
			context,
			output
		);
	}

	const equalityCall = trimmed.match(
		/^([\s\S]+)\.(equals|equalsIgnoreCase)\s*\(([\s\S]*)\)$/i
	);
	if (equalityCall?.[1] && equalityCall[2] && equalityCall[3]) {
		return javaStringsAreEqual(
			javaValueToString(
				evaluateJavaExpression(equalityCall[1], context, output)
			),
			javaValueToString(
				evaluateJavaExpression(equalityCall[3], context, output)
			),
			equalityCall[2].toLowerCase() === "equalsignorecase"
		);
	}

	const comparison = splitJavaComparison(trimmed);
	if (comparison) {
		return evaluateJavaComparison(
			evaluateJavaExpression(comparison.left, context, output),
			comparison.operator,
			evaluateJavaExpression(comparison.right, context, output)
		);
	}

	const value = evaluateJavaExpression(trimmed, context, output);
	if (value.type === "boolean") return value.value;
	if (value.type === "number") return value.value !== 0;
	if (value.type === "null") return false;
	return Boolean(value.value);
}

function javaValuesAreEqual(
	left: JavaConsoleValue,
	right: JavaConsoleValue,
	ignoreCase = false
) {
	if (left.type === "number" || right.type === "number") {
		return javaValueToNumber(left) === javaValueToNumber(right);
	}
	if (left.type === "boolean" || right.type === "boolean") {
		return javaValueToString(left) === javaValueToString(right);
	}
	const leftString = javaValueToString(left);
	const rightString = javaValueToString(right);
	return ignoreCase
		? leftString.toLowerCase() === rightString.toLowerCase()
		: leftString === rightString;
}

function javaStringsAreEqual(left: string, right: string, ignoreCase = false) {
	return ignoreCase
		? left.toLowerCase() === right.toLowerCase()
		: left === right;
}

function compareJavaStrings(left: string, right: string) {
	const length = Math.min(left.length, right.length);
	for (let index = 0; index < length; index += 1) {
		const difference = left.charCodeAt(index) - right.charCodeAt(index);
		if (difference) return difference;
	}
	return left.length - right.length;
}

function evaluateJavaComparison(
	left: JavaConsoleValue,
	operator: string,
	right: JavaConsoleValue
) {
	if (operator === "==") return javaValuesAreEqual(left, right);
	if (operator === "!=") return !javaValuesAreEqual(left, right);
	const leftNumber = javaValueToNumber(left);
	const rightNumber = javaValueToNumber(right);
	if (operator === "<") return leftNumber < rightNumber;
	if (operator === "<=") return leftNumber <= rightNumber;
	if (operator === ">") return leftNumber > rightNumber;
	return leftNumber >= rightNumber;
}

function splitJavaComparison(expression: string) {
	const operator = findTopLevelJavaOperator(expression, [
		"==",
		"!=",
		">=",
		"<=",
		">",
		"<"
	]);
	if (!operator) return null;
	return {
		left: expression.slice(0, operator.index).trim(),
		operator: operator.operator,
		right: expression
			.slice(operator.index + operator.operator.length)
			.trim()
	};
}

function stripJavaOuterParens(expression: string): string {
	let trimmed = expression;
	while (trimmed.startsWith("(")) {
		const closing = findMatchingDelimiter(trimmed, 0, "(", ")");
		if (closing !== trimmed.length - 1) break;
		trimmed = trimmed.slice(1, -1).trim();
	}
	return trimmed;
}

function splitJavaTopLevel(expression: string, delimiter: string) {
	const parts: string[] = [];
	let start = 0;
	for (const index of topLevelJavaDelimiterIndexes(expression, delimiter)) {
		parts.push(expression.slice(start, index).trim());
		start = index + delimiter.length;
	}
	parts.push(expression.slice(start).trim());
	return parts;
}

function findTopLevelJavaOperator(expression: string, operators: string[]) {
	for (const index of topLevelJavaDelimiterIndexes(expression, operators)) {
		const operator = operators.find(candidate =>
			expression.startsWith(candidate, index)
		);
		if (operator) return { index, operator };
	}
	return null;
}

function topLevelJavaDelimiterIndexes(
	expression: string,
	delimiters: string | string[]
) {
	const delimiterOptions = Array.isArray(delimiters)
		? [...delimiters].sort((a, b) => b.length - a.length)
		: [delimiters];
	const indexes: number[] = [];
	let quote: '"' | "'" | null = null;
	let escaped = false;
	let parenDepth = 0;
	let bracketDepth = 0;
	let braceDepth = 0;

	for (let index = 0; index < expression.length; index += 1) {
		const character = expression[index] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === "(") {
			parenDepth += 1;
			continue;
		}
		if (character === ")") {
			parenDepth = Math.max(0, parenDepth - 1);
			continue;
		}
		if (character === "[") {
			bracketDepth += 1;
			continue;
		}
		if (character === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
			continue;
		}
		if (character === "{") {
			braceDepth += 1;
			continue;
		}
		if (character === "}") {
			braceDepth = Math.max(0, braceDepth - 1);
			continue;
		}
		if (parenDepth > 0 || bracketDepth > 0 || braceDepth > 0) continue;
		const delimiter = delimiterOptions.find(candidate =>
			expression.startsWith(candidate, index)
		);
		if (!delimiter) continue;
		indexes.push(index);
		index += delimiter.length - 1;
	}

	return indexes;
}

function evaluateNumericExpression(
	expression: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const trimmed = expression.trim();
	if (/^'(?:\\.|[^'\\])'$/.test(trimmed)) return null;
	if (/^[A-Z_]\w*$/i.test(trimmed)) return null;
	if (/^[A-Z_]\w*(?:\s*\[[^\][]+\])+$/i.test(trimmed)) return null;
	if (/^(?:[A-Z_]\w*\.)?[A-Z_]\w*\s*\([^()]*\)$/i.test(trimmed)) return null;

	const tokens = trimmed.match(
		/[A-Z_]\w*(?:\s*\[[^\][]+\])+|(?:[A-Z_]\w*\.)?[A-Z_]\w*\s*\([^()]*\)|[A-Z_]\w*\.[A-Z_]\w*|'(?:\\.|[^'\\])'|\d+(?:\.\d+)?|[A-Z_]\w*|[()+\-*/%]/gi
	);
	if (
		!tokens ||
		tokens.join("").replace(/\s+/g, "") !== trimmed.replace(/\s+/g, "")
	) {
		return null;
	}
	let index = 0;

	const parser = {
		parseExpression(): number {
			let value = parser.parseTerm();
			while (tokens[index] === "+" || tokens[index] === "-") {
				const operator = tokens[index];
				index += 1;
				const nextValue = parser.parseTerm();
				value =
					operator === "+" ? value + nextValue : value - nextValue;
			}
			return value;
		},
		parseFactor(): number {
			const token = tokens[index];
			if (token === "+" || token === "-") {
				index += 1;
				const value = parser.parseFactor();
				return token === "-" ? -value : value;
			}
			if (token === "(") {
				index += 1;
				const value = parser.parseExpression();
				if (tokens[index] !== ")")
					throw new Error("Missing closing paren");
				index += 1;
				return value;
			}
			index += 1;
			if (/^'(?:\\.|[^'\\])'$/.test(token ?? "")) {
				return (
					unescapeJavaString((token ?? "").slice(1, -1)).codePointAt(
						0
					) ?? 0
				);
			}
			if (
				/^(?:[A-Z_]\w*\.)?[A-Z_]\w*\s*\(/i.test(token ?? "") ||
				/^[A-Z_]\w*\s*\[/i.test(token ?? "")
			) {
				return javaValueToNumber(
					evaluateJavaExpression(token ?? "", context, output)
				);
			}
			const constant = javaMathConstantValue(token ?? "");
			if (constant !== null) return constant;
			const variable = context?.variables.get(token ?? "");
			const value = variable
				? javaValueToNumber(variable)
				: Number(token);
			if (!Number.isFinite(value)) throw new Error("Invalid number");
			return value;
		},
		parseTerm(): number {
			let value = parser.parseFactor();
			while (
				tokens[index] === "*" ||
				tokens[index] === "/" ||
				tokens[index] === "%"
			) {
				const operator = tokens[index];
				index += 1;
				const nextValue = parser.parseFactor();
				if (operator === "*") value *= nextValue;
				if (operator === "/") value /= nextValue;
				if (operator === "%") value %= nextValue;
			}
			return value;
		}
	};

	try {
		const value = parser.parseExpression();
		if (index !== tokens.length || !Number.isFinite(value)) return null;
		return value;
	} catch {
		return null;
	}
}

function splitJavaConcat(expression: string) {
	const parts: string[] = [];
	let quote: '"' | "'" | null = null;
	let start = 0;
	let escaped = false;
	let parenDepth = 0;
	let bracketDepth = 0;
	let braceDepth = 0;

	for (let index = 0; index < expression.length; index += 1) {
		const character = expression[index];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === "(") {
			parenDepth += 1;
			continue;
		}
		if (character === ")") {
			parenDepth = Math.max(0, parenDepth - 1);
			continue;
		}
		if (character === "[") {
			bracketDepth += 1;
			continue;
		}
		if (character === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
			continue;
		}
		if (character === "{") {
			braceDepth += 1;
			continue;
		}
		if (character === "}") {
			braceDepth = Math.max(0, braceDepth - 1);
			continue;
		}
		if (
			character !== "+" ||
			parenDepth > 0 ||
			bracketDepth > 0 ||
			braceDepth > 0
		) {
			continue;
		}
		parts.push(expression.slice(start, index).trim());
		start = index + 1;
	}

	parts.push(expression.slice(start).trim());
	return parts.filter(Boolean);
}

function unescapeJavaString(value: string) {
	return value
		.replaceAll("\\n", "\n")
		.replaceAll("\\t", "\t")
		.replaceAll("\\r", "\r")
		.replaceAll('\\"', '"')
		.replaceAll("\\'", "'")
		.replaceAll("\\\\", "\\");
}

function runKarelProject(
	files: PythonIdeFile[],
	activeFile: PythonIdeFile
): JavaIdeRunResult {
	const source = stripJavaComments(activeFile.content);
	const declaration = source.match(ROBOT_DECLARATION_RE);
	const declarationArgs = splitJavaArguments(declaration?.[2] ?? "");
	const constantsContext: JavaConsoleContext = {
		constants: new Map(),
		input: {
			position: 0,
			source: ""
		},
		methodCallDepth: 0,
		methods: new Map(),
		stderr: [],
		variables: new Map()
	};
	const constantsOutput: JavaConsoleOutputState = {
		lineTruncated: false,
		linesTruncated: false,
		pendingLine: "",
		stdout: []
	};
	seedJavaLiteralConstants(source, constantsContext, constantsOutput);
	const { warnings: worldWarnings, world } = parseKarelWorld(files, source);
	const stderr: string[] = [];
	const trace: string[] = [];
	const karelWorldSteps: KarelWorldState[] = [];

	const robot: KarelRobotState = {
		name: declaration?.[1] ?? "karel",
		street: javaValueToNumber(
			evaluateJavaExpression(
				declarationArgs[0] ?? "1",
				constantsContext,
				constantsOutput
			)
		),
		avenue: javaValueToNumber(
			evaluateJavaExpression(
				declarationArgs[1] ?? "1",
				constantsContext,
				constantsOutput
			)
		),
		direction: normalizeDirection(
			javaValueToString(
				evaluateJavaExpression(
					declarationArgs[2] ?? "East",
					constantsContext,
					constantsOutput
				)
			)
		),
		beepers: javaValueToNumber(
			evaluateJavaExpression(
				declarationArgs[3] ?? String(MAX_KAREL_PREVIEW_COMMANDS),
				constantsContext,
				constantsOutput
			)
		)
	};
	clampRobotToWorld(robot, world);

	const previewExecution: KarelPreviewExecution = {
		constantsContext,
		constantsOutput,
		robot: cloneKarelRobot(robot),
		stopped: false,
		world: cloneMutableKarelWorld(world)
	};
	const plan = karelCommandsForRobot(source, robot.name, previewExecution);
	if (!declaration && !plan.commands.length) {
		const karelWorld = serializeKarelWorld(world, null, trace);
		return {
			karelWorld,
			stderr: [
				...worldWarnings,
				"Create a Karel robot with new UrRobot(street, avenue, Direction, beepers), or write CodeHS-style Karel commands in main() or run()."
			],
			stdout: []
		};
	}

	trace.push(formatRobotTrace(robot));
	karelWorldSteps.push(
		serializeKarelWorld(world, cloneKarelRobot(robot), [...trace])
	);
	for (const command of plan.commands) {
		const error = applyKarelCommand(world, robot, command);
		trace.push(formatRobotTrace(robot));
		karelWorldSteps.push(
			serializeKarelWorld(world, cloneKarelRobot(robot), [...trace])
		);
		if (!error) continue;
		stderr.push(error);
		break;
	}
	stderr.push(...plan.warnings);
	stderr.push(...worldWarnings);

	return {
		karelWorld: serializeKarelWorld(world, robot, trace),
		karelWorldSteps,
		stderr,
		stdout: trace
	};
}

function stripJavaComments(source: string) {
	let output = "";
	let index = 0;
	let quote: '"' | "'" | null = null;
	let escaped = false;

	while (index < source.length) {
		const character = source[index] ?? "";
		const nextCharacter = source[index + 1] ?? "";

		if (quote) {
			output += character;
			if (escaped) {
				escaped = false;
			} else if (character === "\\") {
				escaped = true;
			} else if (character === quote) {
				quote = null;
			}
			index += 1;
			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			output += character;
			index += 1;
			continue;
		}

		if (character === "/" && nextCharacter === "/") {
			index += 2;
			while (index < source.length && !/[\r\n]/.test(source[index] ?? ""))
				index += 1;
			continue;
		}

		if (character === "/" && nextCharacter === "*") {
			index += 2;
			while (index < source.length) {
				const blockCharacter = source[index] ?? "";
				if (blockCharacter === "\n") output += "\n";
				if (
					blockCharacter === "*" &&
					(source[index + 1] ?? "") === "/"
				) {
					index += 2;
					break;
				}
				index += 1;
			}
			continue;
		}

		output += character;
		index += 1;
	}

	return output;
}

function parseKarelWorld(files: PythonIdeFile[], source: string) {
	const readWorldFileName = source.match(WORLD_READ_RE)?.[1] ?? "world.txt";
	const worldFile = files.find(file => file.name === readWorldFileName);
	const warnings: string[] = [];
	const world: MutableKarelWorld = {
		beepers: new Map(),
		cols: DEFAULT_WORLD_SIZE,
		paints: new Map(),
		rows: DEFAULT_WORLD_SIZE,
		walls: []
	};
	if (!worldFile) return { warnings, world };

	if (worldFile.content.length > MAX_KAREL_WORLD_FILE_CHARS) {
		warnings.push(
			`Skipped Karel world files over ${MAX_KAREL_WORLD_FILE_CHARS.toLocaleString()} characters.`
		);
		return { warnings, world };
	}

	const rawLines = worldFile.content
		.split(/\r?\n/)
		.map(line => stripKarelWorldLineComment(line).trim())
		.filter(line => line && !line.startsWith("#"));
	const lines = rawLines.slice(0, MAX_KAREL_WORLD_LINES);
	if (rawLines.length > MAX_KAREL_WORLD_LINES) {
		warnings.push(
			`Stopped reading Karel world after ${MAX_KAREL_WORLD_LINES} lines.`
		);
	}

	for (const line of lines) {
		applyKarelWorldDimensionLine(world, line);
	}

	for (const line of lines) {
		const { args, command } = parseKarelWorldLine(line);
		const integers = karelWorldLineIntegers(line);
		if (command === "rows") {
			continue;
		}
		if (command === "cols") {
			continue;
		}
		if (command === "dimension") {
			continue;
		}
		if (command === "beeper") {
			const street = positiveInteger(integers[0], 1);
			const avenue = positiveInteger(integers[1], 1);
			const count = positiveInteger(integers[2], 1);
			if (!isKarelWorldCoordinate(world, street, avenue)) continue;
			world.beepers.set(beeperKey(street, avenue), {
				avenue,
				count,
				street
			});
		}
		if (command === "wall") {
			const street = positiveInteger(integers[0], 1);
			const avenue = positiveInteger(integers[1], 1);
			const side = karelWorldLineWallSide(line, args[2]);
			if (side && isKarelWorldCoordinate(world, street, avenue)) {
				addKarelWall(world, street, avenue, side);
			}
		}
		if (command === "paint" || command === "color") {
			const street = positiveInteger(integers[0], 1);
			const avenue = positiveInteger(integers[1], 1);
			if (!isKarelWorldCoordinate(world, street, avenue)) continue;
			const colorName = karelWorldLinePaintColor(line, args[2]);
			const color = colorName
				? resolveKarelPaintColor(colorName, street, avenue, world)
				: null;
			if (color) {
				world.paints.set(beeperKey(street, avenue), {
					avenue,
					color,
					street
				});
			}
		}
	}

	return { warnings, world };
}

function stripKarelWorldLineComment(line: string) {
	const hashIndex = line.indexOf("#");
	const slashIndex = line.indexOf("//");
	const commentIndexes = [hashIndex, slashIndex].filter(index => index >= 0);
	if (!commentIndexes.length) return line;
	const commentStart = Math.min(...commentIndexes);
	return line.slice(0, commentStart);
}

function applyKarelWorldDimensionLine(world: MutableKarelWorld, line: string) {
	const { args, command } = parseKarelWorldLine(line);
	const integers = karelWorldLineIntegers(line);

	if (command === "rows") {
		world.rows = boundedPositiveInteger(args[0] ?? integers[0], world.rows);
	}
	if (command === "cols") {
		world.cols = boundedPositiveInteger(args[0] ?? integers[0], world.cols);
	}
	if (line.toLowerCase().startsWith("rows=")) {
		world.rows = boundedPositiveInteger(line.split("=", 2)[1], world.rows);
	}
	if (line.toLowerCase().startsWith("cols=")) {
		world.cols = boundedPositiveInteger(line.split("=", 2)[1], world.cols);
	}
	if (command === "dimension") {
		world.rows = boundedPositiveInteger(integers[0], world.rows);
		world.cols = boundedPositiveInteger(integers[1], world.cols);
	}
}

function parseKarelWorldLine(line: string) {
	const [rawCommand = "", ...args] = line.split(/\s+/);
	const command = rawCommand.replace(/:$/, "").toLowerCase();
	return { args, command };
}

function karelWorldLineIntegers(line: string) {
	return [...line.matchAll(/\d+/g)].map(match => match[0]);
}

function karelWorldLineWords(line: string) {
	return [...line.matchAll(/[A-Z_]\w*/gi)].map(match => match[0]);
}

function karelWorldLineWallSide(line: string, fallback: string | undefined) {
	const side = normalizeWallSide(fallback);
	if (side) return side;

	for (const word of karelWorldLineWords(line).reverse()) {
		const side = normalizeWallSide(word);
		if (side) return side;
	}

	return null;
}

function karelWorldLinePaintColor(line: string, fallback: string | undefined) {
	const color = normalizeKarelPaintColor(fallback ?? "");
	if (color) return color;

	for (const word of karelWorldLineWords(line).reverse()) {
		const color = normalizeKarelPaintColor(word);
		if (color) return color;
	}

	return null;
}

function positiveInteger(value: string | undefined, fallback: number) {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function boundedPositiveInteger(value: string | undefined, fallback: number) {
	return Math.min(MAX_KAREL_WORLD_SIZE, positiveInteger(value, fallback));
}

function isKarelWorldCoordinate(
	world: MutableKarelWorld,
	street: number,
	avenue: number
) {
	return (
		street >= 1 &&
		street <= world.rows &&
		avenue >= 1 &&
		avenue <= world.cols
	);
}

function addKarelWall(
	world: MutableKarelWorld,
	street: number,
	avenue: number,
	side: KarelWallSide
) {
	if (
		world.walls.some(
			wall =>
				wall.street === street &&
				wall.avenue === avenue &&
				wall.side === side
		)
	) {
		return;
	}

	world.walls.push({ avenue, side, street });
}

function normalizeDirection(value: string): KarelDirection {
	const normalized = value
		.replace(/\s+/g, "")
		.split(".")
		.pop()
		?.toLowerCase();
	if (normalized === "north") return "North";
	if (normalized === "south") return "South";
	if (normalized === "west") return "West";
	return "East";
}

function normalizeWallSide(value: string | undefined): KarelWallSide | null {
	const normalized = value?.toLowerCase();
	if (
		normalized === "north" ||
		normalized === "east" ||
		normalized === "south" ||
		normalized === "west"
	) {
		return normalized;
	}
	return null;
}

function clampRobotToWorld(robot: KarelRobotState, world: MutableKarelWorld) {
	robot.street = Math.min(Math.max(robot.street, 1), world.rows);
	robot.avenue = Math.min(Math.max(robot.avenue, 1), world.cols);
}

function cloneKarelRobot(robot: KarelRobotState): KarelRobotState {
	return { ...robot };
}

function cloneMutableKarelWorld(world: MutableKarelWorld): MutableKarelWorld {
	return {
		beepers: new Map(
			[...world.beepers.entries()].map(([key, beeper]) => [
				key,
				{ ...beeper }
			])
		),
		cols: world.cols,
		paints: new Map(
			[...world.paints.entries()].map(([key, paint]) => [
				key,
				{ ...paint }
			])
		),
		rows: world.rows,
		walls: world.walls.map(wall => ({ ...wall }))
	};
}

function karelCommandsForRobot(
	source: string,
	robotName: string,
	execution: KarelPreviewExecution
) {
	const methods = parseJavaVoidMethods(source);
	const mainBody =
		methods.get("main")?.body ?? methods.get("run")?.body ?? source;
	const plan: KarelCommandPlan = { commands: [], warnings: [] };
	collectKarelCommandsFromBody(
		mainBody,
		methods,
		new Set([robotName]),
		plan,
		execution
	);
	return plan;
}

function parseJavaVoidMethods(source: string) {
	return new Map(
		[...parseJavaMethods(source)].filter(
			([, method]) => method.returnType === "void"
		)
	);
}

function parseJavaMethods(source: string) {
	const methods = new Map<string, JavaMethodDefinition>();
	const methodPattern =
		/\b(?:public|private|protected|static|final|abstract|synchronized|\s)*([A-Z_]\w*(?:\s*<[^>(){};]*>)?(?:\s*\[\s*\])*)\s+([A-Z_]\w*)\s*\(([^)]*)\)\s*\{/gi;
	for (const match of source.matchAll(methodPattern)) {
		const returnType = match[1]?.replace(/\s+/g, " ").trim() ?? "";
		const name = match[2];
		if (!name) continue;
		const openingBrace = (match.index ?? 0) + match[0].length - 1;
		const closingBrace = findMatchingDelimiter(
			source,
			openingBrace,
			"{",
			"}"
		);
		if (closingBrace < 0) continue;
		methods.set(name, {
			body: source.slice(openingBrace + 1, closingBrace),
			name,
			parameters: parseJavaParameterNames(match[3] ?? ""),
			returnType
		});
	}
	return methods;
}

function parseJavaParameterNames(parameters: string) {
	return splitJavaArguments(parameters)
		.map(
			parameter => parameter.match(/\b([A-Z_]\w*)\s*(?:\[\s*\])*$/i)?.[1]
		)
		.filter((parameter): parameter is string => Boolean(parameter));
}

function collectKarelCommandsFromBody(
	body: string,
	methods: Map<string, JavaMethodDefinition>,
	robotAliases: Set<string>,
	plan: KarelCommandPlan,
	execution: KarelPreviewExecution,
	depth = 0
) {
	if (depth > 20) {
		addKarelWarning(
			plan,
			"Stopped Karel preview after nested helper calls."
		);
		return;
	}

	let index = 0;
	while (
		index < body.length &&
		canAddKarelCommand(plan) &&
		!execution.stopped
	) {
		index = skipWhitespace(body, index);
		if (index >= body.length) break;

		if (wordAt(body, index, "if")) {
			const parsedIf = parseJavaIfStatement(body, index);
			if (parsedIf) {
				const branchBody = evaluateKarelCondition(
					parsedIf.condition,
					execution,
					robotAliases
				)
					? parsedIf.body
					: parsedIf.elseBody;
				if (branchBody) {
					collectKarelCommandsFromBody(
						branchBody,
						methods,
						robotAliases,
						plan,
						execution,
						depth + 1
					);
				}
				index = parsedIf.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "while")) {
			const parsedLoop = parseJavaConditionalLoop(body, index);
			if (parsedLoop) {
				let loopCount = 0;
				let previousCommandCount = plan.commands.length;
				while (
					evaluateKarelCondition(
						parsedLoop.condition,
						execution,
						robotAliases
					) &&
					canAddKarelCommand(plan) &&
					!execution.stopped
				) {
					collectKarelCommandsFromBody(
						parsedLoop.body,
						methods,
						robotAliases,
						plan,
						execution,
						depth + 1
					);
					loopCount += 1;
					if (plan.commands.length === previousCommandCount) {
						addKarelWarning(
							plan,
							"Stopped Karel preview after a while loop made no visible progress."
						);
						break;
					}
					previousCommandCount = plan.commands.length;
					if (loopCount >= MAX_KAREL_PREVIEW_COMMANDS) {
						addKarelWarning(
							plan,
							`Stopped Karel preview after ${MAX_KAREL_PREVIEW_COMMANDS} loop iterations.`
						);
						break;
					}
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (wordAt(body, index, "for")) {
			const parsedLoop = parseJavaForLoop(
				body,
				index,
				execution.constantsContext,
				execution.constantsOutput
			);
			if (parsedLoop) {
				for (
					let count = 0;
					count < parsedLoop.iterations && canAddKarelCommand(plan);
					count += 1
				) {
					collectKarelCommandsFromBody(
						parsedLoop.body,
						methods,
						robotAliases,
						plan,
						execution,
						depth + 1
					);
				}
				if (
					parsedLoop.capped &&
					plan.commands.length >= MAX_KAREL_PREVIEW_COMMANDS
				) {
					addKarelWarning(
						plan,
						`Stopped Karel preview after ${MAX_KAREL_PREVIEW_COMMANDS} commands.`
					);
				}
				index = parsedLoop.nextIndex;
				continue;
			}
		}

		if (body[index] === "{") {
			const closingBrace = findMatchingDelimiter(body, index, "{", "}");
			if (closingBrace < 0) break;
			collectKarelCommandsFromBody(
				body.slice(index + 1, closingBrace),
				methods,
				robotAliases,
				plan,
				execution,
				depth + 1
			);
			index = closingBrace + 1;
			continue;
		}

		const statementEnd = findJavaStatementEnd(body, index);
		if (statementEnd < 0) break;
		collectKarelCommandsFromStatement(
			body.slice(index, statementEnd).trim(),
			methods,
			robotAliases,
			plan,
			execution,
			depth
		);
		index = statementEnd + 1;
	}
}

function collectKarelCommandsFromStatement(
	statement: string,
	methods: Map<string, JavaMethodDefinition>,
	robotAliases: Set<string>,
	plan: KarelCommandPlan,
	execution: KarelPreviewExecution,
	depth: number
) {
	const paintCommand = karelPaintCommandForStatement(statement, robotAliases);
	if (paintCommand) {
		addKarelCommand(plan, paintCommand, execution);
		return;
	}

	const commandMatch = statement.match(
		new RegExp(
			`^([A-Z_]\\w*)\\.(${KAREL_SIMPLE_COMMANDS.join("|")})\\s*\\(\\s*\\)$`,
			"i"
		)
	);
	if (commandMatch) {
		if (isKarelCommandReceiver(commandMatch[1] ?? "", robotAliases)) {
			const command = karelCommandForName(commandMatch[2] ?? "");
			if (command) addKarelCommand(plan, command, execution);
		}
		return;
	}

	const receiverMethodCall = statement.match(
		/^([A-Z_]\w*)\.([A-Z_]\w*)\s*\(([\s\S]*)\)$/i
	);
	if (receiverMethodCall) {
		if (!isKarelClassReceiver(receiverMethodCall[1] ?? "")) return;
		const methodName = receiverMethodCall[2] ?? "";
		const method = methods.get(methodName);
		if (!method) return;
		collectKarelHelperMethodCall(
			method,
			receiverMethodCall[3] ?? "",
			methods,
			robotAliases,
			plan,
			execution,
			depth
		);
		return;
	}

	const methodCall = statement.match(/^([A-Z_]\w*)\s*\(([\s\S]*)\)$/i);
	const methodName = methodCall?.[1];
	const method = methodName ? methods.get(methodName) : null;
	if (!methodCall) return;

	if (!method && methodName && !methodCall[2]?.trim()) {
		const command = karelCommandForName(methodName);
		if (command) addKarelCommand(plan, command, execution);
		return;
	}

	if (!method) return;

	collectKarelHelperMethodCall(
		method,
		methodCall[2] ?? "",
		methods,
		robotAliases,
		plan,
		execution,
		depth
	);
}

function isKarelClassReceiver(receiver: string) {
	return /^(?:super|this)$/i.test(receiver);
}

function isKarelCommandReceiver(receiver: string, robotAliases: Set<string>) {
	return isKarelClassReceiver(receiver) || robotAliases.has(receiver);
}

function collectKarelHelperMethodCall(
	method: JavaMethodDefinition,
	rawArgs: string,
	methods: Map<string, JavaMethodDefinition>,
	robotAliases: Set<string>,
	plan: KarelCommandPlan,
	execution: KarelPreviewExecution,
	depth: number
) {
	const args = splitJavaArguments(rawArgs);
	const nextAliases = new Set(robotAliases);
	method.parameters.forEach((parameter, parameterIndex) => {
		const arg = args[parameterIndex]?.trim();
		if (arg && robotAliases.has(arg)) nextAliases.add(parameter);
	});
	collectKarelCommandsFromBody(
		method.body,
		methods,
		nextAliases,
		plan,
		execution,
		depth + 1
	);
}

function karelPaintCommandForStatement(
	statement: string,
	robotAliases: Set<string>
): KarelCommand | null {
	const paintMatch = statement.match(
		/^(?:([A-Z_]\w*)\.)?(?:paint|paintCorner)\s*\(([\s\S]+)\)$/i
	);
	if (!paintMatch) return null;

	const receiver = paintMatch[1];
	if (receiver && !isKarelCommandReceiver(receiver, robotAliases))
		return null;

	const color = normalizeKarelPaintColor(paintMatch[2] ?? "");
	return color ? { color, kind: "paint" } : null;
}

function parseJavaIfStatement(source: string, start: number) {
	const parenStart = skipWhitespace(source, start + 2);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;

	let nextIndex = parsedBody.nextIndex;
	let elseBody = "";
	const elseStart = skipWhitespace(source, nextIndex);
	if (wordAt(source, elseStart, "else")) {
		const elseBodyStart = skipWhitespace(source, elseStart + 4);
		if (wordAt(source, elseBodyStart, "if")) {
			const parsedElseIf = parseJavaIfStatement(source, elseBodyStart);
			if (parsedElseIf) {
				elseBody = source.slice(elseBodyStart, parsedElseIf.nextIndex);
				nextIndex = parsedElseIf.nextIndex;
			}
		} else {
			const parsedElseBody = parseJavaControlBody(source, elseBodyStart);
			if (parsedElseBody) {
				elseBody = parsedElseBody.body;
				nextIndex = parsedElseBody.nextIndex;
			}
		}
	}

	return {
		body: parsedBody.body,
		condition: source.slice(parenStart + 1, parenEnd),
		elseBody,
		nextIndex
	};
}

function parseJavaConditionalLoop(source: string, start: number) {
	const parenStart = skipWhitespace(source, start + 5);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;
	return {
		body: parsedBody.body,
		condition: source.slice(parenStart + 1, parenEnd),
		nextIndex: parsedBody.nextIndex
	};
}

function parseJavaForLoop(
	source: string,
	start: number,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const parenStart = skipWhitespace(source, start + 3);
	if (source[parenStart] !== "(") return null;
	const parenEnd = findMatchingDelimiter(source, parenStart, "(", ")");
	if (parenEnd < 0) return null;
	const iterations = evaluateSimpleForLoopIterations(
		source.slice(parenStart + 1, parenEnd),
		context,
		output
	);
	const bodyStart = skipWhitespace(source, parenEnd + 1);
	const parsedBody = parseJavaControlBody(source, bodyStart);
	if (!parsedBody) return null;
	return {
		body: parsedBody.body,
		capped: iterations.capped,
		iterations: iterations.count,
		nextIndex: parsedBody.nextIndex
	};
}

function parseJavaControlBody(source: string, start: number) {
	if (source[start] === "{") {
		const end = findMatchingDelimiter(source, start, "{", "}");
		if (end < 0) return null;
		return { body: source.slice(start + 1, end), nextIndex: end + 1 };
	}

	const end = findJavaStatementEnd(source, start);
	if (end < 0) return null;
	return { body: source.slice(start, end + 1), nextIndex: end + 1 };
}

function evaluateKarelCondition(
	condition: string,
	execution: KarelPreviewExecution,
	robotAliases: Set<string>
): boolean {
	const trimmed = stripJavaOuterParens(condition.trim().replace(/\s+/g, ""));
	const orParts = splitJavaTopLevel(trimmed, "||");
	if (orParts.length > 1) {
		return orParts.some(part =>
			evaluateKarelCondition(part, execution, robotAliases)
		);
	}

	const andParts = splitJavaTopLevel(trimmed, "&&");
	if (andParts.length > 1) {
		return andParts.every(part =>
			evaluateKarelCondition(part, execution, robotAliases)
		);
	}

	if (trimmed.startsWith("!")) {
		return !evaluateKarelCondition(
			trimmed.slice(1),
			execution,
			robotAliases
		);
	}

	const conditionCall = trimmed.match(
		/^(?:([A-Z_]\w*)\.)?([A-Z_]\w*)\(([\s\S]*)\)$/i
	);
	const conditionReceiver = conditionCall?.[1] ?? "";
	if (
		conditionReceiver &&
		!isKarelCommandReceiver(conditionReceiver, robotAliases)
	) {
		return false;
	}

	const conditionName = conditionCall?.[2];
	if (!conditionName) return false;

	if (conditionName === "frontIsClear")
		return karelDirectionIsClear(execution, execution.robot.direction);
	if (conditionName === "frontIsBlocked")
		return !karelDirectionIsClear(execution, execution.robot.direction);
	if (conditionName === "leftIsClear") {
		return karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, -1)
		);
	}
	if (conditionName === "leftIsBlocked") {
		return !karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, -1)
		);
	}
	if (conditionName === "rightIsClear") {
		return karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, 1)
		);
	}
	if (conditionName === "rightIsBlocked") {
		return !karelDirectionIsClear(
			execution,
			turnRobot(execution.robot.direction, 1)
		);
	}
	const facingDirection = karelFacingConditions[conditionName];
	if (facingDirection) {
		return conditionName.startsWith("not")
			? execution.robot.direction !== facingDirection
			: execution.robot.direction === facingDirection;
	}
	if (
		conditionName === "ballsPresent" ||
		conditionName === "beepersPresent"
	) {
		return karelBeepersAtRobot(execution) > 0;
	}
	if (
		conditionName === "noBallsPresent" ||
		conditionName === "noBeepersPresent"
	) {
		return karelBeepersAtRobot(execution) <= 0;
	}
	if (
		conditionName === "colorIs" ||
		conditionName === "colorIsNot" ||
		conditionName === "cornerColorIs" ||
		conditionName === "cornerColorIsNot"
	) {
		const color = normalizeKarelPaintColor(conditionCall?.[3] ?? "");
		const expected = color
			? resolveKarelPaintColor(
					color,
					execution.robot.street,
					execution.robot.avenue,
					execution.world
				)
			: null;
		const current =
			execution.world.paints.get(
				beeperKey(execution.robot.street, execution.robot.avenue)
			)?.color ?? "";
		const matches = Boolean(expected) && current === expected;
		return conditionName.endsWith("Is") ? matches : !matches;
	}

	return false;
}

function karelDirectionIsClear(
	execution: KarelPreviewExecution,
	direction: KarelDirection
) {
	const robot = { ...execution.robot, direction };
	const next = nextKarelPosition(robot);
	return (
		next.street >= 1 &&
		next.street <= execution.world.rows &&
		next.avenue >= 1 &&
		next.avenue <= execution.world.cols &&
		!hasWallBetween(
			execution.world,
			execution.robot.street,
			execution.robot.avenue,
			sideForDirection(direction)
		)
	);
}

function karelBeepersAtRobot(execution: KarelPreviewExecution) {
	return (
		execution.world.beepers.get(
			beeperKey(execution.robot.street, execution.robot.avenue)
		)?.count ?? 0
	);
}

function evaluateSimpleForLoopIterations(
	header: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
): JavaForLoopIterations {
	const headerParts = splitJavaTopLevel(header, ";");
	if (headerParts.length !== 3) return { capped: false, count: 0 };

	const initializer = headerParts[0] ?? "";
	const condition = headerParts[1] ?? "";
	const update = headerParts[2] ?? "";
	const initializerParts = splitJavaTopLevel(initializer, "=");
	if (initializerParts.length !== 2) return { capped: false, count: 0 };
	const loopVariable = (initializerParts[0] ?? "")
		.trim()
		.replace(/^int\s+/i, "");
	const rawStart = initializerParts[1]?.trim();
	if (!loopVariable || !rawStart) return { capped: false, count: 0 };
	if (!/^[A-Z_]\w*$/i.test(loopVariable)) return { capped: false, count: 0 };

	const comparison = splitJavaComparison(condition);
	const operator = comparison?.operator;
	const rawEnd = comparison?.right;
	if (!operator || !rawEnd) return { capped: false, count: 0 };
	if (comparison?.left !== loopVariable) return { capped: false, count: 0 };
	if (!["<", "<=", ">", ">="].includes(operator)) {
		return { capped: false, count: 0 };
	}

	const step = simpleForLoopStep(update, loopVariable, context, output);
	const start = javaValueToNumber(
		evaluateJavaExpression(rawStart, context, output)
	);
	const end = javaValueToNumber(
		evaluateJavaExpression(rawEnd, context, output)
	);
	if (!Number.isFinite(step) || step === 0)
		return { capped: false, count: 0 };
	if (!Number.isFinite(start) || !Number.isFinite(end))
		return { capped: false, count: 0 };

	let count = 0;
	let value = start;
	while (forLoopConditionIsTrue(value, operator, end)) {
		if (count >= MAX_KAREL_PREVIEW_COMMANDS) return { capped: true, count };
		count += 1;
		value += step;
	}
	return { capped: false, count };
}

function simpleForLoopStep(
	update: string,
	loopVariable: string,
	context?: JavaConsoleContext,
	output?: JavaConsoleOutputState
) {
	const compactUpdate = update.replace(/\s+/g, "");
	if (
		compactUpdate === `++${loopVariable}` ||
		compactUpdate === `${loopVariable}++`
	) {
		return 1;
	}
	if (
		compactUpdate === `--${loopVariable}` ||
		compactUpdate === `${loopVariable}--`
	) {
		return -1;
	}

	const operator = update.includes("+=")
		? "+="
		: update.includes("-=")
			? "-="
			: "";
	const updateParts = operator ? splitJavaTopLevel(update, operator) : [];
	const rawStep = updateParts[1];
	if (updateParts[0]?.trim() !== loopVariable) return Number.NaN;
	if (!operator || !rawStep) return Number.NaN;
	const step = javaValueToNumber(
		evaluateJavaExpression(rawStep, context, output)
	);
	return operator === "-=" ? -step : step;
}

function forLoopConditionIsTrue(value: number, operator: string, end: number) {
	if (operator === "<") return value < end;
	if (operator === "<=") return value <= end;
	if (operator === ">") return value > end;
	return value >= end;
}

function findJavaStatementEnd(source: string, start: number) {
	let quote: '"' | "'" | null = null;
	let escaped = false;
	let parenDepth = 0;
	for (let index = start; index < source.length; index += 1) {
		const character = source[index] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === "(") parenDepth += 1;
		if (character === ")") parenDepth = Math.max(0, parenDepth - 1);
		if (character === ";" && parenDepth === 0) return index;
	}
	return -1;
}

function findMatchingDelimiter(
	source: string,
	start: number,
	open: "(" | "[" | "{",
	close: ")" | "]" | "}"
) {
	let depth = 0;
	let quote: '"' | "'" | null = null;
	let escaped = false;
	for (let index = start; index < source.length; index += 1) {
		const character = source[index] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === open) depth += 1;
		if (character === close) {
			depth -= 1;
			if (depth === 0) return index;
		}
	}
	return -1;
}

function splitJavaArguments(args: string) {
	const parts: string[] = [];
	let quote: '"' | "'" | null = null;
	let start = 0;
	let escaped = false;
	let parenDepth = 0;
	let bracketDepth = 0;
	let braceDepth = 0;
	for (let index = 0; index < args.length; index += 1) {
		const character = args[index] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (character === quote) quote = null;
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === "(") parenDepth += 1;
		if (character === ")") parenDepth = Math.max(0, parenDepth - 1);
		if (character === "[") bracketDepth += 1;
		if (character === "]") bracketDepth = Math.max(0, bracketDepth - 1);
		if (character === "{") braceDepth += 1;
		if (character === "}") braceDepth = Math.max(0, braceDepth - 1);
		if (
			character !== "," ||
			parenDepth > 0 ||
			bracketDepth > 0 ||
			braceDepth > 0
		) {
			continue;
		}
		parts.push(args.slice(start, index).trim());
		start = index + 1;
	}
	const last = args.slice(start).trim();
	if (last) parts.push(last);
	return parts;
}

function wordAt(source: string, index: number, word: string) {
	return (
		source.slice(index, index + word.length) === word &&
		!/\w/.test(source[index - 1] ?? "") &&
		!/\w/.test(source[index + word.length] ?? "")
	);
}

function skipWhitespace(source: string, index: number) {
	let cursor = index;
	while (cursor < source.length && /\s/.test(source[cursor] ?? ""))
		cursor += 1;
	return cursor;
}

function canAddKarelCommand(plan: KarelCommandPlan) {
	if (plan.commands.length < MAX_KAREL_PREVIEW_COMMANDS) return true;
	addKarelWarning(
		plan,
		`Stopped Karel preview after ${MAX_KAREL_PREVIEW_COMMANDS} commands.`
	);
	return false;
}

function addKarelCommand(
	plan: KarelCommandPlan,
	command: KarelCommand,
	execution?: KarelPreviewExecution
) {
	if (!canAddKarelCommand(plan)) return;
	plan.commands.push(command);
	if (!execution || execution.stopped) return;
	const error = applyKarelCommand(execution.world, execution.robot, command);
	if (error) execution.stopped = true;
}

function addKarelWarning(plan: KarelCommandPlan, warning: string) {
	if (!plan.warnings.includes(warning)) plan.warnings.push(warning);
}

function karelCommandForName(name: string): KarelCommand | null {
	return (
		KAREL_COMMAND_ALIASES[name as (typeof KAREL_SIMPLE_COMMANDS)[number]] ??
		null
	);
}

function applyKarelCommand(
	world: MutableKarelWorld,
	robot: KarelRobotState,
	command: KarelCommand
) {
	if (typeof command !== "string")
		return paintKarelCell(world, robot, command);
	if (command === "turnLeft") {
		robot.direction = turnRobot(robot.direction, -1);
		return "";
	}
	if (command === "turnRight") {
		robot.direction = turnRobot(robot.direction, 1);
		return "";
	}
	if (command === "turnAround") {
		robot.direction = turnRobot(robot.direction, 2);
		return "";
	}
	if (command === "putBeeper") return putBeeper(world, robot);
	if (command === "pickBeeper") return pickBeeper(world, robot);
	return moveRobot(world, robot);
}

function paintKarelCell(
	world: MutableKarelWorld,
	robot: KarelRobotState,
	command: Extract<KarelCommand, { kind: "paint" }>
) {
	const color = resolveKarelPaintColor(
		command.color,
		robot.street,
		robot.avenue,
		world
	);
	world.paints.set(beeperKey(robot.street, robot.avenue), {
		avenue: robot.avenue,
		color,
		street: robot.street
	});
	return "";
}

function turnRobot(direction: KarelDirection, step: number) {
	const index = directionOrder.indexOf(direction);
	return (
		directionOrder[
			(index + step + directionOrder.length) % directionOrder.length
		] ?? "East"
	);
}

function moveRobot(world: MutableKarelWorld, robot: KarelRobotState) {
	const side = sideForDirection(robot.direction);
	const next = nextKarelPosition(robot);
	if (
		next.street < 1 ||
		next.street > world.rows ||
		next.avenue < 1 ||
		next.avenue > world.cols
	) {
		return `${robot.name}.move() hit the edge of the world.`;
	}
	if (hasWallBetween(world, robot.street, robot.avenue, side)) {
		return `${robot.name}.move() hit a wall.`;
	}

	robot.street = next.street;
	robot.avenue = next.avenue;
	return "";
}

function sideForDirection(direction: KarelDirection): KarelWallSide {
	if (direction === "North") return "north";
	if (direction === "South") return "south";
	if (direction === "West") return "west";
	return "east";
}

function nextKarelPosition(robot: KarelRobotState) {
	if (robot.direction === "North") {
		return { avenue: robot.avenue, street: robot.street + 1 };
	}
	if (robot.direction === "South") {
		return { avenue: robot.avenue, street: robot.street - 1 };
	}
	if (robot.direction === "West") {
		return { avenue: robot.avenue - 1, street: robot.street };
	}
	return { avenue: robot.avenue + 1, street: robot.street };
}

function hasWallBetween(
	world: MutableKarelWorld,
	street: number,
	avenue: number,
	side: KarelWallSide
) {
	const adjacent = nextKarelPosition({
		avenue,
		beepers: 0,
		direction: directionForSide(side),
		name: "",
		street
	});
	const opposite = wallOpposites[side];
	return world.walls.some(
		wall =>
			(wall.street === street &&
				wall.avenue === avenue &&
				wall.side === side) ||
			(wall.street === adjacent.street &&
				wall.avenue === adjacent.avenue &&
				wall.side === opposite)
	);
}

function directionForSide(side: KarelWallSide): KarelDirection {
	if (side === "north") return "North";
	if (side === "south") return "South";
	if (side === "west") return "West";
	return "East";
}

function putBeeper(world: MutableKarelWorld, robot: KarelRobotState) {
	if (robot.beepers <= 0) {
		return `${robot.name}.putBeeper() needs at least one beeper.`;
	}
	const key = beeperKey(robot.street, robot.avenue);
	const beeper = world.beepers.get(key) ?? {
		avenue: robot.avenue,
		count: 0,
		street: robot.street
	};
	beeper.count += 1;
	world.beepers.set(key, beeper);
	robot.beepers -= 1;
	return "";
}

function pickBeeper(world: MutableKarelWorld, robot: KarelRobotState) {
	const key = beeperKey(robot.street, robot.avenue);
	const beeper = world.beepers.get(key);
	if (!beeper || beeper.count <= 0) {
		return `${robot.name}.pickBeeper() needs a beeper on this corner.`;
	}
	beeper.count -= 1;
	if (beeper.count <= 0) world.beepers.delete(key);
	robot.beepers += 1;
	return "";
}

function beeperKey(street: number, avenue: number) {
	return `${street}:${avenue}`;
}

function normalizeKarelPaintColor(expression: string) {
	const normalized = expression
		.trim()
		.replace(/\s+/g, "")
		.replace(/^(?:java\.awt\.)?Color\./i, "")
		.replace(/^["']|["']$/g, "");
	if (/^random\(\)$/i.test(normalized)) return "random";
	const colorName = normalized.toLowerCase();
	return karelPaintColors[colorName] ? colorName : null;
}

function resolveKarelPaintColor(
	color: string,
	street: number,
	avenue: number,
	world: MutableKarelWorld
) {
	if (color === "random") {
		const paletteIndex =
			(street * 31 + avenue * 17 + world.paints.size) %
			karelRandomPaintPalette.length;
		return (
			karelPaintColors[
				karelRandomPaintPalette[paletteIndex] ?? "purple"
			] ?? "#9333ea"
		);
	}
	return karelPaintColors[color] ?? "#9333ea";
}

function serializeKarelWorld(
	world: MutableKarelWorld,
	robot: KarelRobotState | null,
	trace: string[]
): KarelWorldState {
	return {
		beepers: [...world.beepers.values()]
			.map(beeper => ({ ...beeper }))
			.sort((a, b) => a.street - b.street || a.avenue - b.avenue),
		cols: world.cols,
		paints: [...world.paints.values()]
			.map(paint => ({ ...paint }))
			.sort((a, b) => a.street - b.street || a.avenue - b.avenue),
		robot: robot ? cloneKarelRobot(robot) : null,
		rows: world.rows,
		trace: [...trace],
		walls: world.walls.map(wall => ({ ...wall }))
	};
}

function formatRobotTrace(robot: KarelRobotState) {
	return `Robot ${robot.name} at (street: ${robot.street}) (avenue: ${robot.avenue}) (beepers: ${robot.beepers}) (direction: ${robot.direction})`;
}
