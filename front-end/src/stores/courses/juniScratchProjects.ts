const SCRATCH_LEVEL_1_PROJECT_TITLE_RE =
	/^(?:Project \d+|GS\d+ (?:Supplemental )?Project \d+|Master Project Presentation)(?:\b|\s*[–:-])/i;
const SCRATCH_LEVEL_2_PROJECT_TITLE_RE =
	/^(?:GM\d+ (?:Supplemental )?Project \d+|GM1 Review Project:|Check-In (?:#\d+: Additional |\d+ )Practice Project$|Master Project Presentation$)/i;

export function isJuniScratchProjectTitle(courseId: string, title: string) {
	const normalizedTitle = title.replace(/^Scratch Level [12]\s+/i, "");

	if (courseId === "scratch-level-1") {
		return SCRATCH_LEVEL_1_PROJECT_TITLE_RE.test(normalizedTitle);
	}

	if (courseId === "scratch-level-2") {
		return SCRATCH_LEVEL_2_PROJECT_TITLE_RE.test(normalizedTitle);
	}

	return false;
}
