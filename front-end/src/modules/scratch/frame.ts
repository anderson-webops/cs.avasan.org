/** A project runs in an opaque frame, with no cookies, account APIs or parent DOM. */
export function scratchFrameDocument(origin: string, channel: string) {
	const base = new URL("/scratch-runtime/", origin).href;
	const escape = (value: string) =>
		value
			.replaceAll("&", "&amp;")
			.replaceAll('"', "&quot;")
			.replaceAll("<", "&lt;");
	const policy = `default-src 'none'; base-uri ${origin}; script-src ${base} 'unsafe-eval' 'sha256-AIzpsAr2DJF6Z9BaBAxpkIJ+YqMmAt9+K0Pkb30/BGE='; style-src 'unsafe-inline'; img-src ${base} https://assets.scratch.mit.edu data: blob:; font-src ${base} data:; connect-src ${base} https://assets.scratch.mit.edu; media-src blob: data:; worker-src 'none'; frame-src 'self' blob:; form-action 'none'`;
	return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${escape(policy)}"><base href="${escape(base)}vendor/"><title>Scratch classroom editor</title><style>html,body,#scratch-root{margin:0;width:100%;height:100%;overflow:hidden;font-family:system-ui,sans-serif}*{box-sizing:border-box}#scratch-root>div{height:100%}[class*="menu-bar_menu-bar_"],[class*="gui_backpack-wrapper"]{display:none!important}button:focus-visible{outline:3px solid #13757b;outline-offset:2px}</style></head><body data-parent-origin="${escape(origin)}" data-channel="${escape(channel)}"><div id="scratch-root">Loading Scratch…</div><script crossorigin="anonymous" src="${escape(base)}isolation.js"></script><script crossorigin="anonymous" src="${escape(base)}vendor/scratch-gui-standalone.js"></script><script crossorigin="anonymous" src="${escape(base)}editor.js"></script></body></html>`;
}

export const scratchProjectLimit = 20 * 1024 * 1024;
export function scratchDownloadName(title: string) {
	const printable = [...title]
		.map(character => {
			return character.charCodeAt(0) < 32 ? "-" : character;
		})
		.join("");
	const name = printable
		.replace(/[\\/<>:"|?*]/g, "-")
		.trim()
		.slice(0, 120);
	return `${name || "Scratch project"}.sb3`;
}
