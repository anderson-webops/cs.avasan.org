import { marked } from "marked";

export function wrapEmailHtml(contentHtml: string): string {
	return `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="color-scheme" content="light only" />
		<meta name="supported-color-schemes" content="light only" />
	</head>
	<body style="margin:0;padding:24px;background:#ffffff !important;color:#111827 !important;">
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff !important;">
			<tr>
				<td align="center" style="background:#ffffff !important;">
					<table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" style="width:680px;max-width:680px;background:#ffffff !important;color:#111827 !important;">
						<tr>
							<td style="padding:24px;background:#ffffff !important;color:#111827 !important;">
								${contentHtml}
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`;
}

export async function renderMarkdownEmailHtml(markdown: string): Promise<string> {
	const contentHtml = await marked.parse(markdown);
	if (typeof contentHtml !== "string") {
		throw new TypeError("HTML render did not return a string");
	}
	return wrapEmailHtml(contentHtml);
}
