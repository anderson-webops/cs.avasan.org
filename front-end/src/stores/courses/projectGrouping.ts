const PROJECT_TITLE_RE = /\b(?:project|capstone)\b/i;
const EXPLICIT_SUPPLEMENTAL_TITLE_RE = /\bsupplemental\b/i;

export function isCoreProjectTitle(title: string) {
	return (
		PROJECT_TITLE_RE.test(title) &&
		!EXPLICIT_SUPPLEMENTAL_TITLE_RE.test(title)
	);
}
