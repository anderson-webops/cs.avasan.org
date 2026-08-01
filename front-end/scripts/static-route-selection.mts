export const NOT_FOUND_ROUTE = "/404";

const DYNAMIC_ROUTE_MARKER = /[:*]/u;

export function includedStaticRoutes(paths: string[]) {
	return [
		...new Set([
			...paths.filter(path => !DYNAMIC_ROUTE_MARKER.test(path)),
			NOT_FOUND_ROUTE
		])
	];
}
