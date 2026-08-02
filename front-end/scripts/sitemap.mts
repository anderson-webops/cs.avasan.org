export const SITE_URL = "https://cs.avasan.org";

export const SITEMAP_EXCLUDED_ROUTES = [
	"/404",
	"/admin",
	"/course-resource",
	"/python-ide",
	"/games",
	"/games/pond-paddlers",
	"/games/crosswalk-critters",
	"/games/machine-workshop",
	"/games/comet-hopper"
];

type SitemapOptions = {
	exclude: string[];
	generateRobotsTxt: boolean;
	hostname: string;
};

type GenerateSitemap = (options: SitemapOptions) => void;

export function sitemapOptions(): SitemapOptions {
	return {
		exclude: SITEMAP_EXCLUDED_ROUTES,
		generateRobotsTxt: false,
		hostname: SITE_URL
	};
}

export function generateProductionSitemap(generateSitemap: GenerateSitemap) {
	generateSitemap(sitemapOptions());
}
