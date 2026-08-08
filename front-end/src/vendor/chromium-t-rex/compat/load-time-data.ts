// Local compatibility shim for Chromium's generated WebUI load-time data.
const values: Readonly<Record<string, string>> = Object.freeze({
	dinoGameA11yAriaLabel: "T-Rex Runner",
	dinoGameA11yDescription:
		"T-Rex Runner. Press Space or Up Arrow to jump and Down Arrow to duck.",
	dinoGameA11yGameOver: "Game over. Your score is $1.",
	dinoGameA11yHighScore: "Your high score is $1.",
	dinoGameA11yJump: "Press Space or Up Arrow to jump.",
	dinoGameA11ySpeedToggle: "Slow speed",
	dinoGameA11yStartGame: "Game started."
});

export const loadTimeData = Object.freeze({
	getString(key: string): string {
		return values[key] ?? "";
	},
	getValue(key: string): string {
		return values[key] ?? "";
	},
	valueExists(key: string): boolean {
		return Object.hasOwn(values, key);
	}
});
