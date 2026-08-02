import type { KarelWorldState } from "@/modules/javaIdeRuntime";

type KarelWorldPlaybackTimer = ReturnType<typeof globalThis.setTimeout>;

export interface KarelWorldPlaybackScheduler {
	clearTimeout: (timer: KarelWorldPlaybackTimer) => void;
	setTimeout: (
		callback: () => void,
		delayMs: number
	) => KarelWorldPlaybackTimer;
}

interface KarelWorldPlaybackControllerOptions {
	delayMs: number;
	scheduler?: KarelWorldPlaybackScheduler;
	showStep: (
		step: KarelWorldState,
		stepNumber: number,
		stepCount: number
	) => void;
}

export function createKarelWorldPlaybackController({
	delayMs,
	scheduler = {
		clearTimeout: timer => globalThis.clearTimeout(timer),
		setTimeout: (callback, timeoutMs) =>
			globalThis.setTimeout(callback, timeoutMs)
	},
	showStep
}: KarelWorldPlaybackControllerOptions) {
	let timer: KarelWorldPlaybackTimer | null = null;
	let playbackID = 0;
	let resolvePlayback: ((completed: boolean) => void) | null = null;

	function clear() {
		if (timer !== null) scheduler.clearTimeout(timer);
		timer = null;
		const resolveCurrentPlayback = resolvePlayback;
		if (resolveCurrentPlayback) resolveCurrentPlayback(false);
		resolvePlayback = null;
		playbackID += 1;
	}

	function play(
		steps: KarelWorldState[] | undefined,
		shouldContinue: () => boolean
	) {
		clear();
		if (!steps?.length) return Promise.resolve(false);

		return new Promise<boolean>(resolve => {
			const currentPlaybackID = playbackID;
			let index = 0;
			const finish = (completed: boolean) => {
				if (currentPlaybackID !== playbackID) return;
				if (timer !== null) scheduler.clearTimeout(timer);
				timer = null;
				resolvePlayback = null;
				resolve(completed);
			};
			resolvePlayback = finish;

			const showNextStep = () => {
				if (currentPlaybackID !== playbackID) return;
				if (!shouldContinue()) {
					finish(false);
					return;
				}

				const step = steps[index];
				if (!step) {
					finish(true);
					return;
				}

				showStep(step, index + 1, steps.length);
				index += 1;
				if (index >= steps.length) {
					finish(true);
					return;
				}

				timer = scheduler.setTimeout(showNextStep, delayMs);
			};

			showNextStep();
		});
	}

	return {
		clear,
		play
	};
}
