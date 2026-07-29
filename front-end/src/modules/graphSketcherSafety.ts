export const GRAPH_SKETCHER_SESSION_STORAGE_KEY =
	"cs-avasan-graph-sketcher-session-v1";
export const MAX_INTERACTIVE_GRAPH_POINTS = 5_000;
export const MAX_GRAPH_HISTORY_ENTRIES = 60;
export const MAX_GRAPH_HISTORY_ESTIMATED_BYTES = 24 * 1024 * 1024;
export const MAX_GRAPH_PNG_PIXELS = 16_777_216;

export function estimatedGraphSnapshotBytes(snapshot: string) {
	return snapshot.length * 2;
}

function historyBytes(...stacks: readonly string[][]) {
	return stacks.reduce(
		(total, stack) =>
			total +
			stack.reduce(
				(stackTotal, snapshot) =>
					stackTotal + estimatedGraphSnapshotBytes(snapshot),
				0
			),
		0
	);
}

export function pushBoundedGraphHistorySnapshot(
	target: string[],
	other: string[],
	snapshot: string
) {
	if (target.at(-1) === snapshot) return false;
	if (
		estimatedGraphSnapshotBytes(snapshot) >
		MAX_GRAPH_HISTORY_ESTIMATED_BYTES
	) {
		return false;
	}

	target.push(snapshot);
	while (target.length > MAX_GRAPH_HISTORY_ENTRIES) target.shift();

	while (historyBytes(target, other) > MAX_GRAPH_HISTORY_ESTIMATED_BYTES) {
		if (target.length > 1) {
			target.shift();
		} else if (other.length) {
			other.shift();
		} else {
			target.pop();
			return false;
		}
	}
	return true;
}

export function evenlySampleIndexes(length: number, limit: number) {
	const boundedLength = Math.max(0, Math.floor(length));
	const boundedLimit = Math.max(0, Math.floor(limit));
	if (!boundedLength || !boundedLimit) return [];
	if (boundedLimit >= boundedLength) {
		return Array.from({ length: boundedLength }, (_, index) => index);
	}
	if (boundedLimit === 1) return [Math.floor((boundedLength - 1) / 2)];

	const indexes: number[] = [];
	for (let index = 0; index < boundedLimit; index++) {
		indexes.push(
			Math.round((index * (boundedLength - 1)) / (boundedLimit - 1))
		);
	}
	return indexes;
}

export function evenlySampleSeriesIndexes(
	seriesLengths: readonly number[],
	limit = MAX_INTERACTIVE_GRAPH_POINTS
) {
	const lengths = seriesLengths.map(length =>
		Math.max(0, Math.floor(length))
	);
	const total = lengths.reduce((sum, length) => sum + length, 0);
	const boundedLimit = Math.min(total, Math.max(0, Math.floor(limit)));
	const allocations = lengths.map(() => 0);

	let remaining = boundedLimit;
	while (remaining > 0) {
		let allocated = false;
		for (let index = 0; index < lengths.length && remaining > 0; index++) {
			if (allocations[index] >= lengths[index]) continue;
			allocations[index] += 1;
			remaining -= 1;
			allocated = true;
		}
		if (!allocated) break;
	}

	return lengths.map((length, index) =>
		evenlySampleIndexes(length, allocations[index])
	);
}

export function graphPngDimensions(
	width: number,
	height: number,
	preferredScale = 2
) {
	const safeWidth = Math.max(1, Math.floor(width));
	const safeHeight = Math.max(1, Math.floor(height));
	const safeScale = Math.max(0.01, preferredScale);
	const pixelLimitedScale = Math.sqrt(
		MAX_GRAPH_PNG_PIXELS / (safeWidth * safeHeight)
	);
	const scale = Math.min(safeScale, pixelLimitedScale);
	let outputWidth = Math.max(1, Math.floor(safeWidth * scale));
	let outputHeight = Math.max(1, Math.floor(safeHeight * scale));

	while (outputWidth * outputHeight > MAX_GRAPH_PNG_PIXELS) {
		if (outputWidth >= outputHeight) outputWidth -= 1;
		else outputHeight -= 1;
	}

	return {
		height: outputHeight,
		scale,
		width: outputWidth
	};
}
