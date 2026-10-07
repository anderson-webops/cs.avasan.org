export function normalizeInlineCourseMarkdown(content: string) {
	let codeFence: string | null = null;

	return content
		.split(/\r?\n/)
		.map(line => {
			const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

			if (fenceMatch) {
				const fence = fenceMatch[1];
				if (!codeFence) {
					codeFence = fence;
				} else if (
					fence.startsWith(codeFence[0]) &&
					fence.length >= codeFence.length
				) {
					codeFence = null;
				}

				return line;
			}

			if (codeFence || /^(?: {4}|\t)/.test(line)) {
				return line;
			}

			let normalized = line
				.replace(/^([ \t]*)•\s+/, "$1- ")
				.replace(
					/(\S)\s+(\*\*[^*\n]{1,80}:\*\*)/g,
					(
						match,
						prefix: string,
						label: string,
						offset: number,
						source: string
					) => {
						const textBeforeLabel = source
							.slice(0, offset + prefix.length)
							.trim();
						if (/^(?:[-*+]|\d+[.)])$/u.test(textBeforeLabel))
							return match;
						return `${prefix}\n\n${label}`;
					}
				)
				.replace(
					/(\*\*[^*\n]{1,80}:\*\*)\s+(?=(?:\d+\.|[-*])\s)/g,
					"$1\n"
				);
			const orderedMarkerCount = (
				normalized.match(/(?:^|\s)\d+\.\s+\S/g) ?? []
			).length;
			const bulletMarkerCount = (
				normalized.match(/(?:^|[:.;!?]\s+)[-*]\s+\S/gm) ?? []
			).length;

			if (orderedMarkerCount >= 2) {
				normalized = normalized.replace(
					/(?!^)\s+(\d+\.)\s+(?=\S)/g,
					"\n$1 "
				);
			}

			if (bulletMarkerCount >= 2) {
				normalized = normalized.replace(
					/([:.;!?])\s+([-*])\s+(?=\S)/g,
					"$1\n$2 "
				);
			}

			return normalized;
		})
		.join("\n");
}
