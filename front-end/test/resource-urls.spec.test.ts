import { describe, expect, it } from "vitest";
import {
	externalDatasetResourceLabel,
	externalMediaResourceLabel,
	isGitHubRepositoryUrl,
	isInstructionMaterialResourceUrl,
	isScratchProjectUrl
} from "@/modules/resourceUrls";

describe("resource URL classification", () => {
	it.each([
		"https://github.com/instruction-material/Python-Level-1",
		"https://scratch.mit.edu/projects/123456789/",
		"https://static.junilearning.com/math/example.pdf",
		"https://static.cs.avasan.org/course/example.py",
		"https://static.classes.jacobdanderson.net/ps1_mad_libs.gif"
	])("accepts an exact instruction-material URL: %s", url => {
		expect(isInstructionMaterialResourceUrl(url)).toBe(true);
	});

	it.each([
		"http://static.classes.jacobdanderson.net/ps1_mad_libs.gif",
		"https://static.classes.jacobdanderson.net/",
		"https://static.classes.jacobdanderson.net.evil.example/file",
		"https://static.classes.jacobdanderson.net@evil.example/file",
		"https://evil.example/static.classes.jacobdanderson.net/file",
		"https://github.com/evil/instruction-material/Python-Level-1",
		"https://github.com/instruction-material",
		"https://scratch.mit.edu/projects/not-a-project/"
	])(
		"rejects a lookalike or incomplete instruction-material URL: %s",
		url => {
			expect(isInstructionMaterialResourceUrl(url)).toBe(false);
		}
	);

	it("recognizes exact GitHub repositories and Scratch projects", () => {
		expect(
			isGitHubRepositoryUrl(
				"https://github.com/instruction-material/Python-Level-1/tree/main"
			)
		).toBe(true);
		expect(
			isScratchProjectUrl("https://scratch.mit.edu/projects/214828609/")
		).toBe(true);
	});

	it.each([
		"https://github.com/",
		"https://github.com.evil.example/owner/repo",
		"https://github.com@evil.example/owner/repo",
		"http://github.com/owner/repo"
	])("rejects a GitHub lookalike or incomplete repository URL: %s", url => {
		expect(isGitHubRepositoryUrl(url)).toBe(false);
	});

	it.each([
		"https://scratch.mit.edu/studios/123456789/",
		"https://scratch.mit.edu/projects/not-a-project/",
		"https://scratch.mit.edu.evil.example/projects/214828609/",
		"http://scratch.mit.edu/projects/214828609/"
	])("rejects a Scratch lookalike or non-project URL: %s", url => {
		expect(isScratchProjectUrl(url)).toBe(false);
	});

	it.each([
		[
			"https://www.acs.org/education/whatischemistry/periodictable.html",
			"ACS periodic table"
		],
		[
			"https://www.acs.org/education/policies/middle-and-high-school-chemistry.html",
			"ACS chemistry guidelines"
		],
		["https://www.nist.gov/pml/owm/metric-si/si-units", "NIST SI units"],
		[
			"https://www.nextgenscience.org/resources/ngss-appendices",
			"NGSS appendices"
		],
		[
			"https://openstax.org/details/books/chemistry-2e",
			"OpenStax reference"
		],
		[
			"https://pubchem.ncbi.nlm.nih.gov/periodic-table/",
			"Chemistry database"
		],
		["https://earthobservatory.nasa.gov/biome", "Science resource"]
	])("labels an exact external dataset URL: %s", (url, label) => {
		expect(externalDatasetResourceLabel(url)).toBe(label);
	});

	it.each([
		"https://www.acs.org.evil.example/education/whatischemistry/periodictable.html",
		"https://www.nist.gov@evil.example/pml/owm/metric-si/si-units",
		"https://evil.example/?next=https://openstax.org/details/books/chemistry-2e",
		"http://pubchem.ncbi.nlm.nih.gov/periodic-table/",
		"https://unknown.nasa.gov/biome"
	])("does not trust a lookalike external dataset URL: %s", url => {
		expect(externalDatasetResourceLabel(url)).toBeNull();
	});

	it.each([
		[
			"https://phet.colorado.edu/en/simulations/filter?subjects=chemistry",
			"Simulation collection"
		],
		[
			"https://phet.colorado.edu/en/simulations/build-an-atom",
			"PhET simulation"
		],
		["https://www.youtube.com/watch?v=FJDWHm_ZjoM", "Demo video"],
		["https://youtu.be/FJDWHm_ZjoM", "Demo video"],
		[
			"https://javalab.org/en/dissolution_process_en/",
			"Interactive simulation"
		]
	])("labels an exact external media URL: %s", (url, label) => {
		expect(externalMediaResourceLabel(url)).toBe(label);
	});

	it.each([
		"https://phet.colorado.edu.evil.example/en/simulations/build-an-atom",
		"https://www.youtube.com@evil.example/watch?v=FJDWHm_ZjoM",
		"https://youtube.com.evil.example/watch?v=FJDWHm_ZjoM",
		"http://youtu.be/FJDWHm_ZjoM",
		"https://javalab.org/evil/dissolution_process_en/"
	])("does not trust a lookalike external media URL: %s", url => {
		expect(externalMediaResourceLabel(url)).toBeNull();
	});
});
