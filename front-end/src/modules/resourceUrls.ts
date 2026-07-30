const STATIC_INSTRUCTION_HOSTS = new Set([
	"static.junilearning.com",
	"static.cs.avasan.org",
	"static.classes.jacobdanderson.net"
]);
const YOUTUBE_HOSTS = new Set([
	"youtube.com",
	"www.youtube.com",
	"m.youtube.com"
]);
const YOUTUBE_PATH_PREFIXES = new Set(["embed", "live", "shorts"]);
const SCIENCE_RESOURCE_HOSTS = new Set([
	"biointeractive.org",
	"www.biointeractive.org",
	"climatekids.nasa.gov",
	"earthobservatory.nasa.gov",
	"gpm.nasa.gov",
	"nasa.gov",
	"www.nasa.gov",
	"noaa.gov",
	"www.noaa.gov",
	"usgs.gov",
	"www.usgs.gov"
]);
const SCRATCH_PROJECT_ID_RE = /^\d+$/;

function parsePublicHttpsUrl(value: string) {
	try {
		const parsed = new URL(value);
		if (
			parsed.protocol !== "https:" ||
			parsed.username ||
			parsed.password ||
			parsed.port
		) {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

function pathSegments(url: URL) {
	return url.pathname.split("/").filter(Boolean);
}

export function isGitHubRepositoryUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	return (
		parsed?.hostname === "github.com" && pathSegments(parsed).length >= 2
	);
}

export function isScratchProjectUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (parsed?.hostname !== "scratch.mit.edu") return false;

	const segments = pathSegments(parsed);
	return (
		segments[0] === "projects" &&
		SCRATCH_PROJECT_ID_RE.test(segments[1] ?? "")
	);
}

export function isInstructionMaterialResourceUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (!parsed) return false;

	const segments = pathSegments(parsed);
	if (parsed.hostname === "github.com") {
		return (
			segments[0]?.toLowerCase() === "instruction-material" &&
			Boolean(segments[1])
		);
	}

	if (parsed.hostname === "scratch.mit.edu") {
		return (
			segments[0] === "projects" &&
			SCRATCH_PROJECT_ID_RE.test(segments[1] ?? "")
		);
	}

	return STATIC_INSTRUCTION_HOSTS.has(parsed.hostname) && segments.length > 0;
}

export function externalDatasetResourceLabel(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (!parsed) return null;

	const pathname = parsed.pathname.toLowerCase();
	if (parsed.hostname === "www.acs.org") {
		if (pathname === "/education/whatischemistry/periodictable.html") {
			return "ACS periodic table";
		}
		if (
			pathname ===
			"/education/policies/middle-and-high-school-chemistry.html"
		) {
			return "ACS chemistry guidelines";
		}
		return "ACS chemistry reference";
	}
	if (parsed.hostname === "www.nist.gov" && pathname !== "/") {
		return "NIST SI units";
	}
	if (
		parsed.hostname === "www.nextgenscience.org" &&
		pathname === "/resources/ngss-appendices"
	) {
		return "NGSS appendices";
	}
	if (
		parsed.hostname === "openstax.org" &&
		pathname.startsWith("/details/")
	) {
		return "OpenStax reference";
	}
	if (
		parsed.hostname === "pubchem.ncbi.nlm.nih.gov" &&
		(pathname === "/" || pathname.startsWith("/periodic-table"))
	) {
		return "Chemistry database";
	}
	if (SCIENCE_RESOURCE_HOSTS.has(parsed.hostname) && pathname !== "/") {
		return "Science resource";
	}

	return null;
}

export function externalMediaResourceLabel(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (!parsed) return null;

	const segments = pathSegments(parsed);
	if (parsed.hostname === "phet.colorado.edu") {
		if (parsed.pathname === "/en/simulations/filter") {
			return "Simulation collection";
		}
		if (
			segments[0] === "en" &&
			segments[1] === "simulations" &&
			Boolean(segments[2])
		) {
			return "PhET simulation";
		}
		return null;
	}

	if (parsed.hostname === "youtu.be" && Boolean(segments[0])) {
		return "Demo video";
	}
	if (YOUTUBE_HOSTS.has(parsed.hostname)) {
		if (segments[0] === "watch" && parsed.searchParams.get("v")) {
			return "Demo video";
		}
		if (
			YOUTUBE_PATH_PREFIXES.has(segments[0] ?? "") &&
			Boolean(segments[1])
		) {
			return "Demo video";
		}
	}
	if (
		parsed.hostname === "javalab.org" &&
		segments[0] === "en" &&
		Boolean(segments[1])
	) {
		return "Interactive simulation";
	}

	return null;
}
