export interface EditorSelectionRange {
	from: number;
	to: number;
}

export interface EditorEditResult {
	text: string;
	selections: EditorSelectionRange[];
}

export const editorIndentText = "    ";

const pairedCharacters: Record<string, string> = {
	'"': '"',
	"'": "'",
	"`": "`",
	"(": ")",
	"[": "]",
	"{": "}"
};

export function editorPairForKey(key: string) {
	const close = pairedCharacters[key];
	return close ? { open: key, close } : null;
}

export function normalizeEditorSelections(
	selections: EditorSelectionRange[],
	textLength = Number.MAX_SAFE_INTEGER
) {
	const normalized = selections
		.map(selection => ({
			from: clampOffset(
				Math.min(selection.from, selection.to),
				textLength
			),
			to: clampOffset(Math.max(selection.from, selection.to), textLength)
		}))
		.sort((a, b) => a.from - b.from || a.to - b.to);

	const merged: EditorSelectionRange[] = [];
	for (const selection of normalized) {
		const previous = merged[merged.length - 1];
		if (
			previous &&
			previous.from === selection.from &&
			previous.to === selection.to
		) {
			continue;
		}
		if (previous && previous.to > selection.from) {
			previous.to = Math.max(previous.to, selection.to);
			continue;
		}
		merged.push(selection);
	}

	return merged.length ? merged : [{ from: 0, to: 0 }];
}

export function insertTextAtEditorSelections(
	text: string,
	selections: EditorSelectionRange[],
	insertedText: string
): EditorEditResult {
	return replaceEditorSelections(text, selections, () => ({
		text: insertedText,
		selectionFrom: insertedText.length,
		selectionTo: insertedText.length
	}));
}

export function wrapEditorSelections(
	text: string,
	selections: EditorSelectionRange[],
	open: string,
	close: string
): EditorEditResult {
	return replaceEditorSelections(text, selections, selectedText => ({
		text: `${open}${selectedText}${close}`,
		selectionFrom: open.length,
		selectionTo: open.length + selectedText.length
	}));
}

export function deleteAtEditorSelections(
	text: string,
	selections: EditorSelectionRange[],
	direction: "backward" | "forward"
): EditorEditResult {
	const deletionRanges = normalizeEditorSelections(
		selections.map(selection => {
			if (selection.from !== selection.to) return selection;
			if (direction === "backward") {
				return {
					from: Math.max(0, selection.from - 1),
					to: selection.to
				};
			}
			return {
				from: selection.from,
				to: Math.min(text.length, selection.to + 1)
			};
		}),
		text.length
	);

	return replaceEditorSelections(text, deletionRanges, () => ({
		text: "",
		selectionFrom: 0,
		selectionTo: 0
	}));
}

export function indentEditorSelections(
	text: string,
	selections: EditorSelectionRange[],
	indent = editorIndentText
): EditorEditResult {
	const normalizedSelections = normalizeEditorSelections(
		selections,
		text.length
	);
	if (
		normalizedSelections.every(selection => selection.from === selection.to)
	) {
		return insertTextAtEditorSelections(text, normalizedSelections, indent);
	}

	const lineStarts = uniqueSortedOffsets(
		normalizedSelections.flatMap(selection =>
			lineStartsForSelection(text, selection)
		)
	);
	const resultText = insertAtOffsets(text, lineStarts, indent);
	const resultSelections = normalizedSelections.map(selection =>
		shiftRangeForInsertions(selection, lineStarts, indent.length)
	);

	return {
		text: resultText,
		selections: resultSelections
	};
}

export function outdentEditorSelections(
	text: string,
	selections: EditorSelectionRange[],
	indent = editorIndentText
): EditorEditResult {
	const normalizedSelections = normalizeEditorSelections(
		selections,
		text.length
	);
	const candidateLineStarts = normalizedSelections.every(
		selection => selection.from === selection.to
	)
		? uniqueSortedOffsets(
				normalizedSelections.map(selection =>
					lineStartAt(text, selection.from)
				)
			)
		: uniqueSortedOffsets(
				normalizedSelections.flatMap(selection =>
					lineStartsForSelection(text, selection)
				)
			);
	const removals = candidateLineStarts
		.map(offset => outdentRemovalAt(text, offset, indent))
		.filter(
			(removal): removal is { from: number; to: number } => !!removal
		);

	if (!removals.length) {
		return {
			text,
			selections: normalizedSelections
		};
	}

	const resultText = removeRanges(text, removals);
	const resultSelections = normalizedSelections.map(selection =>
		shiftRangeForRemovals(selection, removals)
	);

	return {
		text: resultText,
		selections: resultSelections
	};
}

export function lineEndEditorSelections(
	text: string,
	selection: EditorSelectionRange
) {
	return lineStartsForSelection(text, selection).map(offset => {
		const end = lineEndAt(text, offset);
		return { from: end, to: end };
	});
}

export function addAdjacentLineEditorSelections(
	text: string,
	selections: EditorSelectionRange[],
	direction: "up" | "down"
) {
	const normalizedSelections = normalizeEditorSelections(
		selections,
		text.length
	);
	const additions: EditorSelectionRange[] = [];

	for (const selection of normalizedSelections) {
		const head = selection.to;
		const line = lineBoundsAt(text, head);
		const targetLine =
			direction === "up"
				? previousLineBounds(text, line.from)
				: nextLineBounds(text, line.to);
		if (!targetLine) continue;

		const column = head - line.from;
		const offset = Math.min(targetLine.from + column, targetLine.to);
		additions.push({ from: offset, to: offset });
	}

	return normalizeEditorSelections(
		[...normalizedSelections, ...additions],
		text.length
	);
}

function replaceEditorSelections(
	text: string,
	selections: EditorSelectionRange[],
	createReplacement: (selectedText: string) => {
		text: string;
		selectionFrom: number;
		selectionTo: number;
	}
): EditorEditResult {
	const normalizedSelections = normalizeEditorSelections(
		selections,
		text.length
	);
	let output = "";
	let lastOffset = 0;
	const resultSelections: EditorSelectionRange[] = [];

	for (const selection of normalizedSelections) {
		output += text.slice(lastOffset, selection.from);
		const selectedText = text.slice(selection.from, selection.to);
		const replacement = createReplacement(selectedText);
		const replacementStart = output.length;
		output += replacement.text;
		resultSelections.push({
			from: replacementStart + replacement.selectionFrom,
			to: replacementStart + replacement.selectionTo
		});
		lastOffset = selection.to;
	}

	output += text.slice(lastOffset);
	return {
		text: output,
		selections: resultSelections
	};
}

function clampOffset(offset: number, textLength: number) {
	return Math.max(0, Math.min(textLength, offset));
}

function lineStartAt(text: string, offset: number) {
	const boundedOffset = clampOffset(offset, text.length);
	const previousNewline = text.lastIndexOf(
		"\n",
		Math.max(0, boundedOffset - 1)
	);
	return previousNewline + 1;
}

function lineEndAt(text: string, offset: number) {
	const newline = text.indexOf("\n", clampOffset(offset, text.length));
	return newline === -1 ? text.length : newline;
}

function lineBoundsAt(text: string, offset: number) {
	const from = lineStartAt(text, offset);
	return {
		from,
		to: lineEndAt(text, from)
	};
}

function previousLineBounds(text: string, currentLineStart: number) {
	if (currentLineStart <= 0) return null;
	const previousLineEnd = currentLineStart - 1;
	const from = lineStartAt(text, previousLineEnd);
	return {
		from,
		to: previousLineEnd
	};
}

function nextLineBounds(text: string, currentLineEnd: number) {
	if (currentLineEnd >= text.length) return null;
	const from = currentLineEnd + 1;
	return {
		from,
		to: lineEndAt(text, from)
	};
}

function lineStartsForSelection(text: string, selection: EditorSelectionRange) {
	const starts: number[] = [];
	const selectionEndsAtLineStart =
		selection.to > selection.from && text[selection.to - 1] === "\n";
	const selectionEnd = selectionEndsAtLineStart
		? selection.to - 1
		: selection.to;
	let lineStart = lineStartAt(text, selection.from);

	while (lineStart <= selectionEnd) {
		starts.push(lineStart);
		const nextNewline = text.indexOf("\n", lineStart);
		if (nextNewline === -1) break;
		lineStart = nextNewline + 1;
	}

	return starts;
}

function uniqueSortedOffsets(offsets: number[]) {
	return [...new Set(offsets)].sort((a, b) => a - b);
}

function insertAtOffsets(
	text: string,
	offsets: number[],
	insertedText: string
) {
	let output = "";
	let lastOffset = 0;
	for (const offset of offsets) {
		output += text.slice(lastOffset, offset);
		output += insertedText;
		lastOffset = offset;
	}
	output += text.slice(lastOffset);
	return output;
}

function shiftRangeForInsertions(
	selection: EditorSelectionRange,
	offsets: number[],
	insertLength: number
) {
	let from = selection.from;
	let to = selection.to;
	for (const offset of offsets) {
		if (offset < selection.from) {
			from += insertLength;
			to += insertLength;
		} else if (offset <= selection.to) {
			to += insertLength;
		}
	}
	return { from, to };
}

function outdentRemovalAt(text: string, offset: number, indent: string) {
	if (text.slice(offset, offset + indent.length) === indent) {
		return {
			from: offset,
			to: offset + indent.length
		};
	}

	if (text[offset] === "\t") {
		return {
			from: offset,
			to: offset + 1
		};
	}

	const leadingSpaces = text.slice(offset).match(/^ {1,4}/)?.[0] ?? "";
	if (!leadingSpaces) return null;
	return {
		from: offset,
		to: offset + leadingSpaces.length
	};
}

function removeRanges(text: string, removals: { from: number; to: number }[]) {
	let output = "";
	let lastOffset = 0;
	for (const removal of removals) {
		output += text.slice(lastOffset, removal.from);
		lastOffset = removal.to;
	}
	output += text.slice(lastOffset);
	return output;
}

function shiftRangeForRemovals(
	selection: EditorSelectionRange,
	removals: { from: number; to: number }[]
) {
	let from = selection.from;
	let to = selection.to;
	for (const removal of removals) {
		const length = removal.to - removal.from;
		if (removal.to <= selection.from) {
			from -= length;
			to -= length;
		} else if (removal.from < selection.to) {
			to -= length;
			if (removal.from < selection.from) from -= length;
		}
	}
	return {
		from: Math.max(0, from),
		to: Math.max(0, to)
	};
}
