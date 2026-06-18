import type { Extension } from "@codemirror/state";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import {
	EditorSelection,
	EditorState,
	Prec,
	RangeSetBuilder
} from "@codemirror/state";
import { Decoration, EditorView, keymap, ViewPlugin } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { basicSetup } from "codemirror";

interface PythonCodeMirrorOptions {
	onChange: (content: string) => void;
	onCursorCountChange: (count: number) => void;
}

const openingBracketToClosingBracket: Record<string, string> = {
	"(": ")",
	"[": "]",
	"{": "}"
};
const pythonIndentText = "    ";
const lineLeadingWhitespaceRegex = /^[\t ]*/;
const closingBrackets = new Set(Object.values(openingBracketToClosingBracket));
const bracketPairDecorations = [
	bracketDecorationForIndex(0),
	bracketDecorationForIndex(1),
	bracketDecorationForIndex(2),
	bracketDecorationForIndex(3),
	bracketDecorationForIndex(4),
	bracketDecorationForIndex(5)
];
const unmatchedBracketDecoration = Decoration.mark({
	class: "cm-bracket-pair cm-bracket-unmatched"
});

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
	".cm-selectionBackground, &.cm-focused .cm-selectionBackground, .cm-content ::selection":
		{
			backgroundColor: "var(--python-code-selection)"
		},
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
	".cm-tooltip": {
		border: "1px solid var(--color-border)",
		borderRadius: "0.75rem",
		backgroundColor: "var(--color-surface-strong)",
		color: "var(--color-ink)"
	}
});

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

export function createPythonCodeMirrorExtensions(
	options: PythonCodeMirrorOptions
): Extension[] {
	return [
		basicSetup,
		python(),
		EditorState.tabSize.of(4),
		EditorState.allowMultipleSelections.of(true),
		pythonEditorTheme,
		syntaxHighlighting(pythonHighlightStyle),
		bracketPairColorExtension,
		Prec.highest(pythonNewlineKeymap),
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

export function pythonNewlineIndentText(state: EditorState, position: number) {
	const line = state.doc.lineAt(position);
	const textBeforeCursor = line.text.slice(0, position - line.from);
	const currentIndent =
		line.text.match(lineLeadingWhitespaceRegex)?.[0] ?? "";
	const shouldIndentOneLevel = textBeforeCursor.trimEnd().endsWith(":");

	return `\n${currentIndent}${shouldIndentOneLevel ? pythonIndentText : ""}`;
}

function insertPythonNewlineAndIndent(view: EditorView) {
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

function buildBracketPairDecorations(view: EditorView) {
	const text = view.state.doc.toString();
	const stack: Array<{
		expectedClose: string;
		pairId: number;
		position: number;
	}> = [];
	const decorations: Array<{
		decoration: Decoration;
		from: number;
		to: number;
	}> = [];
	let nextPairId = 1;

	for (let index = 0; index < text.length; index += 1) {
		const character = text[index] ?? "";
		const expectedClose = openingBracketToClosingBracket[character];
		if (expectedClose) {
			stack.push({
				expectedClose,
				pairId: nextPairId,
				position: index
			});
			nextPairId += 1;
			continue;
		}

		if (!closingBrackets.has(character)) continue;

		const candidate = stack.at(-1);
		if (!candidate || candidate.expectedClose !== character) {
			decorations.push({
				decoration: unmatchedBracketDecoration,
				from: index,
				to: index + 1
			});
			continue;
		}

		stack.pop();
		const decoration =
			bracketPairDecorations[
				(candidate.pairId - 1) % bracketPairDecorations.length
			] ??
			bracketPairDecorations[0] ??
			unmatchedBracketDecoration;
		decorations.push(
			{
				decoration,
				from: candidate.position,
				to: candidate.position + 1
			},
			{
				decoration,
				from: index,
				to: index + 1
			}
		);
	}

	for (const unmatched of stack) {
		decorations.push({
			decoration: unmatchedBracketDecoration,
			from: unmatched.position,
			to: unmatched.position + 1
		});
	}

	decorations.sort((first, second) => first.from - second.from);
	const builder = new RangeSetBuilder<Decoration>();
	for (const { decoration, from, to } of decorations) {
		builder.add(from, to, decoration);
	}
	return builder.finish();
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
