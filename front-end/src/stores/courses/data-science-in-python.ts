import type { RawCourse, RawCourseModuleItem } from "./types";

const DATA_SCIENCE_REPO =
	"https://github.com/instruction-material/Data-Science/tree/main";
const PYTHON_COURSES_DATA_SCIENCE_ARCHIVE =
	"https://github.com/instruction-material/Python-Courses/tree/main/Data%20Science%20in%20Python";

function repoLink(projectId: string) {
	return `${DATA_SCIENCE_REPO}/${projectId}`;
}

function projectItem(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: repoLink(projectId)
	};
}

function pairedProjectItem(
	title: string,
	content: string,
	starterId: string,
	solutionId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: repoLink(starterId),
		solutionLink: repoLink(solutionId)
	};
}

function analysisLog(moduleTitle: string, focus: string): RawCourseModuleItem {
	return {
		title: `Analysis Log: ${moduleTitle}`,
		content: `Keep a compact analysis log for ${moduleTitle.toLowerCase()} that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about ${focus}. Students should practice making their reasoning inspectable.`
	};
}

export const dataScienceInPythonCourse: RawCourse = {
	name: "Data Science in Python",
	modules: [
		{
			title: "DSP0 Setup and Tooling",
			curriculum: [
				{
					title: "Notebook-First and Script-First Workflow",
					content:
						"Set up the course so students can work in `Jupyter`, `VS Code`, `PyCharm`, or `Google Colab` without changing the learning goals. Early lessons should make it clear when exploratory notebook work is appropriate and when a script or small app structure is the better fit."
				},
				{
					title: "Python Packages for Data Work",
					content:
						"Install and verify `pandas`, `numpy`, `matplotlib`, `altair`, `streamlit`, and `scikit-learn` at the start. The course uses these tools in stages, but the environment should be stable from the first day so setup does not interrupt the analysis flow."
				},
				{
					title: "Course Positioning between Python and Machine Learning",
					content:
						"Frame this course as the bridge between core Python and model-centered ML. Students should learn how to load, clean, inspect, visualize, and communicate with data before they are expected to train predictive systems."
				},
				{
					title: "Analysis Habits and Reproducibility",
					content:
						"Require clear file naming, saved notebooks, lightweight markdown explanations, and explicit notes about assumptions. Reproducibility should feel like part of data science itself, not like an extra teacher requirement."
				}
			],
			supplementalProjects: [
				{
					title: "Legacy Archive: Data Science in Python Workspace",
					content:
						"Use the older umbrella Python archive when you need the original single-folder Juni layout or want to compare the current course structure with the legacy material organization.",
					projectLink: PYTHON_COURSES_DATA_SCIENCE_ARCHIVE
				},
				analysisLog(
					"Setup and Tooling",
					"which environment choice makes the current project easiest to reproduce"
				)
			]
		},
		{
			title: "Module 1: What Data Science Is",
			curriculum: [
				{
					title: "Questions before Calculations",
					content:
						"Define data science as asking answerable questions, gathering relevant evidence, and communicating what the evidence can and cannot support. Students should begin every project with a question that matters more than the chart they hope to make."
				},
				{
					title: "Evidence, Assumptions, and Scope",
					content:
						"Teach students to name where the data came from, what is missing, and what assumptions are being imposed during analysis. This helps prevent the common habit of treating a CSV file as a complete or neutral view of reality."
				},
				{
					title: "Data Science versus Machine Learning",
					content:
						"Separate descriptive analysis, visualization, and cleaning work from predictive modeling. Students should understand that a strong data scientist can provide real value before training any model."
				},
				{
					title: "Portfolio Mindset",
					content:
						"Frame the course around shareable outputs: notebooks, short writeups, dashboards, and presentations. The final goal is not merely to finish labs, but to build artifacts that show analytical thinking."
				}
			],
			supplementalProjects: [
				analysisLog(
					"What Data Science Is",
					"why the chosen question is worth answering with data in the first place"
				)
			]
		},
		{
			title: "Module 2: Notebook Workflow and Reproducibility",
			curriculum: [
				{
					title: "Cells, Markdown, and Narrative Structure",
					content:
						"Teach notebooks as a communication tool, not just a place to run code. Students should learn to combine code cells, markdown, and short conclusions so another person can follow the reasoning from question to result."
				},
				{
					title: "Restart-and-Run-All Discipline",
					content:
						"Make reproducibility visible by frequently restarting the kernel and rerunning the notebook from the top. This prevents hidden state from becoming part of the analysis and makes debugging much faster."
				},
				{
					title: "When to Graduate into Scripts or Apps",
					content:
						"Show when a notebook has outgrown itself and should become a reusable Python module, script, or dashboard app. Students should know that notebooks are ideal for exploration, but not always for long-term project structure."
				},
				{
					title: "Versioning Small Analyses",
					content:
						"Require lightweight Git use or at least dated checkpoints for notebooks and datasets. Students should build the habit of saving iterations instead of overwriting analytical work with no trail."
				}
			],
			supplementalProjects: [
				analysisLog(
					"Notebook Workflow and Reproducibility",
					"which parts of the analysis are exploratory and which should be preserved as stable steps"
				)
			]
		},
		{
			title: "Module 3: pandas Foundations",
			curriculum: [
				{
					title: "Loading CSVs and Inspecting Schema",
					content:
						"Use `pandas` to load tabular data, inspect columns, preview rows, and identify the shape of a dataset before deeper analysis begins. Students should stop treating raw data files as opaque blobs."
				},
				{
					title: "Selecting, Filtering, and Sorting",
					content:
						"Teach column selection, row filtering, sorting, and boolean masks as the basic grammar of tabular analysis. These operations should become automatic before grouping and aggregation are introduced."
				},
				{
					title: "Grouping and Aggregation",
					content:
						"Use grouped summaries to answer questions about segments, categories, and trends. The goal is to move students away from manual loops when a data-frame operation expresses the intent more clearly."
				},
				{
					title: "Derived Columns and Transformations",
					content:
						"Have students create new columns from existing data, standardize labels, and compute simple metrics. This is the first place where analytical judgment starts to shape the dataset itself."
				}
			],
			supplementalProjects: [
				analysisLog(
					"pandas Foundations",
					"which transformations are merely helpful and which ones materially change the meaning of the dataset"
				)
			]
		},
		{
			title: "Module 4: Cleaning and Validation",
			curriculum: [
				{
					title: "Missing Values and Type Issues",
					content:
						"Teach students to inspect nulls, mixed types, empty strings, and malformed numeric data before building any chart or summary. Data cleaning should feel like evidence protection rather than tedious prep work."
				},
				{
					title: "Duplicates and Inconsistent Categories",
					content:
						"Work through duplicate rows, inconsistent labels, whitespace issues, and accidental category splits. Students should understand how small formatting defects can distort counts, averages, and rankings."
				},
				{
					title: "Validation Checks and Sanity Tests",
					content:
						"Require quick checks such as row counts, range bounds, category totals, and spot inspections of suspicious records. This helps students catch silent errors before they become polished charts."
				},
				{
					title: "Documenting Cleaning Decisions",
					content:
						"Students should record what they dropped, changed, or imputed and why. A clean analysis includes a clean explanation of how the raw data was turned into something trustworthy enough to use."
				}
			],
			supplementalProjects: [
				analysisLog(
					"Cleaning and Validation",
					"which cleaning decision had the biggest effect on the final answer"
				)
			]
		},
		{
			title: "Module 5: Visualization and Statistics in Context",
			curriculum: [
				{
					title: "Choosing the Right Chart",
					content:
						"Teach line, bar, scatter, histogram, box plot, and basic distribution views as tools for specific questions rather than decorations. Students should be able to defend a chart choice in one sentence."
				},
				{
					title: "Misleading Scales and Weak Comparisons",
					content:
						"Use bad charts on purpose to show how axis choices, poor bin sizes, inconsistent baselines, and decorative clutter can mislead viewers. This gives students a stronger eye for honest presentation."
				},
				{
					title: "Averages, Spread, Correlation, and Outliers",
					content:
						"Teach descriptive statistics in service of context. Students should know what these measures can reveal, but also when a summary number hides important structure in the data."
				},
				{
					title: "Correlation Is Not Causation",
					content:
						"Keep causation claims disciplined by asking what the dataset can actually support. Students should practice writing careful conclusions that do not overstate what a pattern proves."
				}
			],
			supplementalProjects: [
				pairedProjectItem(
					"Project: Simple Stats Starter",
					"Start from a structured statistics starter and turn it into a working analysis that computes core summary measures cleanly. This is a direct warmup for later notebook-first investigations.",
					"DS1-Simple-Stats-Starter",
					"DS1-Simple-Stats"
				),
				projectItem(
					"Project: Mode Finder",
					"Use a tight, focused statistics exercise to reinforce frequency tables, categorical reasoning, and the gap between raw counts and meaningful interpretation.",
					"DS1-Mode"
				),
				analysisLog(
					"Visualization and Statistics in Context",
					"which chart or summary best preserves the important structure of the data"
				)
			]
		},
		{
			title: "Module 6: Storytelling with Data",
			curriculum: [
				{
					title: "Framing a Clear Analytical Claim",
					content:
						"Teach students to move from a vague topic like sports, movies, or weather into a crisp claim backed by evidence. Good data storytelling starts with a claim that can be tested and defended."
				},
				{
					title: "Selecting What Matters",
					content:
						"Have students choose which tables, plots, and metrics belong in the final explanation and which distract from the main question. This is where analysis becomes communication instead of accumulation."
				},
				{
					title: "Writing Short, Useful Conclusions",
					content:
						"Practice two- to four-sentence interpretations that connect a visual to an actual decision or insight. Students should avoid both chart dumping and dramatic overclaiming."
				},
				{
					title: "Audience-Aware Presentation",
					content:
						"Explain how the same data might be presented differently for a peer, a school club, a teacher, or a portfolio reviewer. Students should learn to tune explanations without changing the evidence."
				}
			],
			supplementalProjects: [
				analysisLog(
					"Storytelling with Data",
					"which part of the story is genuinely supported and which part is still only a hypothesis"
				)
			]
		},
		{
			title: "Module 7: Dashboards with Altair and Streamlit",
			curriculum: [
				{
					title: "When Static Charts Stop Being Enough",
					content:
						"Show students the limitations of a notebook that only produces fixed outputs. Once the audience wants filtering, parameter changes, or rapid comparison, a dashboard becomes the better communication tool."
				},
				{
					title: "Altair for Cleaner Chart Construction",
					content:
						"Introduce declarative charting so students can focus on encoding, axes, color, and interaction more intentionally. Altair helps make chart structure explicit rather than buried in imperative plotting calls."
				},
				{
					title: "Streamlit for Interactive Exploration",
					content:
						"Use `Streamlit` to wrap analyses in sliders, selectors, and filtered views. The course should treat dashboards as a communication product, not just a fun extra."
				},
				{
					title: "Designing a Useful Analytical Interface",
					content:
						"Teach restraint in dashboard design: clear controls, few charts, obvious labels, and a visible explanation of what the user is seeing. Students should understand that an overloaded dashboard is not a better dashboard."
				}
			],
			supplementalProjects: [
				analysisLog(
					"Dashboards with Altair and Streamlit",
					"which interactions actually help the user answer the question faster"
				)
			]
		},
		{
			title: "Module 8: Domain Projects",
			curriculum: [
				{
					title: "Pick a Domain with a Real Question",
					content:
						"Offer domain tracks such as sports, movies, finance, tutoring attendance, public weather data, or environmental datasets. The domain matters less than whether it leads to a specific question and a defensible analytical path."
				},
				{
					title: "Shape the Dataset to the Question",
					content:
						"Have students decide which columns matter, which records should be filtered, and what derived metrics are worth creating. This is the stage where an analysis becomes tailored rather than generic."
				},
				{
					title: "Compare Multiple Analytical Angles",
					content:
						"Require at least two complementary views of the same dataset, such as a trend chart plus a grouped comparison or a distribution plus a ranking. Students should learn that one chart rarely answers the whole question."
				},
				{
					title: "Make the Work Portfolio-Ready",
					content:
						"Students should package the project as a notebook, short deck, or dashboard with an introduction, method, findings, and reflection. The finished artifact should be something they could show outside the class."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Simple Sort and Ranking Warmup",
					"Use a compact sorting lab as a way to reason about ranking logic, ordering metrics, and what a leaderboard or sorted report is actually claiming about the data.",
					"DM7-Simple-Sort"
				),
				analysisLog(
					"Domain Projects",
					"why the chosen domain question matters enough to justify the analysis"
				)
			]
		},
		{
			title: "Module 9: Data Science Capstone",
			curriculum: [
				{
					title: "Question, Dataset, and Scope Lock",
					content:
						"Finalize a capstone question, identify the dataset, and set a scope that can be finished well. Students should avoid open-ended ambition and instead commit to a question they can answer clearly."
				},
				{
					title: "Clean, Analyze, and Communicate",
					content:
						"Require the full pipeline: loading, cleaning, validation, analysis, visualization, and explanation. The capstone should feel like a small real project rather than a disconnected set of charts."
				},
				{
					title: "Build a Dashboard or Narrative Notebook",
					content:
						"Choose the right final format for the question. Some capstones are better as a polished notebook with commentary; others should become a compact Streamlit or Altair-backed dashboard."
				},
				{
					title: "Reflect on Next Steps",
					content:
						"Use the capstone reflection to decide whether the next course should be `Machine Learning`, `AI Level 1`, `Web Development Foundations`, or a more advanced Python track. Students should leave with a better sense of whether they enjoy modeling, storytelling, or productizing data work."
				}
			],
			supplementalProjects: [
				analysisLog(
					"Data Science Capstone",
					"what claim the project ultimately makes and what evidence best supports it"
				)
			]
		}
	]
};
