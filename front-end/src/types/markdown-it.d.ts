declare module "markdown-it" {
	export default class MarkdownIt {
		constructor(options?: {
			breaks?: boolean;
			linkify?: boolean;
		});

		render(content: string): string;
	}
}
