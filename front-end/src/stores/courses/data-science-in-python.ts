import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

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
						"Frame this course as the bridge between core Python and model-centered ML. Learn how to load, clean, inspect, visualize, and communicate with data before they are expected to train predictive systems."
				},
				{
					title: "Analysis Habits and Reproducibility",
					content:
						"Use clear file naming, saved notebooks, lightweight markdown explanations, and explicit notes about assumptions. Reproducibility should feel like part of data science itself, not an extra external requirement."
				},
				{
					title: "DSP0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "DSP0 Setup and Tooling",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Legacy Archive: Data Science in Python Workspace",
					content:
						"Use the older umbrella Python archive when you need the original single-folder Juni layout or want to compare the current course structure with the legacy material organization.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "DSP0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-dsp0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-dsp0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "DSP0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-dsp0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-dsp0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 1: What Data Science Is",
			curriculum: [
				{
					title: "Questions before Calculations",
					content:
						"Define data science as asking answerable questions, gathering relevant evidence, and communicating what the evidence can and cannot support. Begin every project with a question that matters more than the chart they hope to make."
				},
				{
					title: "Evidence, Assumptions, and Scope",
					content:
						"Name where the data came from, what is missing, and what assumptions are being imposed during analysis. This helps prevent the common habit of treating a CSV file as a complete or neutral view of reality."
				},
				{
					title: "Data Science versus Machine Learning",
					content:
						"Separate descriptive analysis, visualization, and cleaning work from predictive modeling. Key idea: A strong data scientist can provide real value before training any model."
				},
				{
					title: "Portfolio Mindset",
					content:
						"Frame the course around shareable outputs: notebooks, short writeups, dashboards, and presentations. The final goal is not merely to finish labs, but to build artifacts that show analytical thinking."
				},
				{
					title: "Module 1: What Data Science Is: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 1: What Data Science Is",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: What Data Science Is",
					content:
						"Keep a compact analysis log for what data science is that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about why the chosen question is worth answering with data in the first place. Practice target: Making their reasoning inspectable.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-1-what-data-science-is/solution"
				},
				{
					title: "Module 1: What Data Science Is supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 1: What Data Science Is",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-module-1-what-data-science-is-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-module-1-what-data-science-is-supplemental-2/solution"
				},
				{
					title: "Module 1: What Data Science Is supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 1: What Data Science Is",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-module-1-what-data-science-is-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-module-1-what-data-science-is-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 2: Notebook Workflow and Reproducibility",
			curriculum: [
				{
					title: "Cells, Markdown, and Narrative Structure",
					content:
						"This section covers notebooks as a communication tool, not just a place to run code. Skill target: Combine code cells, markdown, and short conclusions so another person can follow the reasoning from question to result."
				},
				{
					title: "Restart-and-Run-All Discipline",
					content:
						"Make reproducibility visible by frequently restarting the kernel and rerunning the notebook from the top. This prevents hidden state from becoming part of the analysis and makes debugging much faster."
				},
				{
					title: "When to Graduate into Scripts or Apps",
					content:
						"Show when a notebook has outgrown itself and should become a reusable Python module, script, or dashboard app. Key idea: That notebooks are ideal for exploration, but not always for long-term project structure."
				},
				{
					title: "Versioning Small Analyses",
					content:
						"Use lightweight Git or at least dated checkpoints for notebooks and datasets. Build the habit of saving iterations instead of overwriting analytical work with no trail."
				},
				{
					title: "Module 2: Notebook Workflow and Reproducibility: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 2: Notebook Workflow and Reproducibility",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Notebook Workflow and Reproducibility",
					content:
						"Keep a compact analysis log for notebook workflow and reproducibility that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which parts of the analysis are exploratory and which should be preserved as stable steps. Practice target: Making their reasoning inspectable.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-2-notebook-workflow-and-reproducibility/solution"
				},
				{
					title: "Module 2: Notebook Workflow and Reproducibility supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 2: Notebook Workflow and Reproducibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-module-2-notebook-workflow-and-reproducibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-module-2-notebook-workflow-and-reproducibility-supplemental-2/solution"
				},
				{
					title: "Module 2: Notebook Workflow and Reproducibility supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 2: Notebook Workflow and Reproducibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-module-2-notebook-workflow-and-reproducibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-module-2-notebook-workflow-and-reproducibility-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 3: pandas Foundations",
			curriculum: [
				{
					title: "Loading CSVs and Inspecting Schema",
					content:
						"Use `pandas` to load tabular data, inspect columns, preview rows, and identify the shape of a dataset before deeper analysis begins. Stop treating raw data files as opaque blobs."
				},
				{
					title: "Selecting, Filtering, and Sorting",
					content:
						"This section covers column selection, row filtering, sorting, and boolean masks as the basic grammar of tabular analysis. These operations should become automatic before grouping and aggregation are introduced."
				},
				{
					title: "Grouping and Aggregation",
					content:
						"Use grouped summaries to answer questions about segments, categories, and trends. The goal is to move students away from manual loops when a data-frame operation expresses the intent more clearly."
				},
				{
					title: "Derived Columns and Transformations",
					content:
						"Create new columns from existing data, standardize labels, and compute simple metrics. This is the first place where analytical judgment starts to shape the dataset itself."
				},
				{
					title: "Module 3: pandas Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 3: pandas Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: pandas Foundations",
					content:
						"Keep a compact analysis log for pandas foundations that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which transformations are merely helpful and which ones materially change the meaning of the dataset. Practice target: Making their reasoning inspectable.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-3-pandas-foundations/solution"
				},
				{
					title: "Module 3: pandas Foundations supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 3: pandas Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-module-3-pandas-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-module-3-pandas-foundations-supplemental-2/solution"
				},
				{
					title: "Module 3: pandas Foundations supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 3: pandas Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-3-pandas-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-08-module-3-pandas-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 4: Cleaning and Validation",
			curriculum: [
				{
					title: "Missing Values and Type Issues",
					content:
						"Inspect nulls, mixed types, empty strings, and malformed numeric data before building any chart or summary. Data cleaning should feel like evidence protection rather than tedious prep work."
				},
				{
					title: "Duplicates and Inconsistent Categories",
					content:
						"Work through duplicate rows, inconsistent labels, whitespace issues, and accidental category splits. Key idea: How small formatting defects can distort counts, averages, and rankings."
				},
				{
					title: "Validation Checks and Sanity Tests",
					content:
						"Use quick checks such as row counts, range bounds, category totals, and spot inspections of suspicious records. This catches silent errors before they become polished charts."
				},
				{
					title: "Documenting Cleaning Decisions",
					content:
						"Record what they dropped, changed, or imputed and why. A clean analysis includes a clean explanation of how the raw data was turned into something trustworthy enough to use."
				},
				{
					title: "Module 4: Cleaning and Validation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 4: Cleaning and Validation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Cleaning and Validation",
					content:
						"Keep a compact analysis log for cleaning and validation that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which cleaning decision had the biggest effect on the final answer. Practice target: Making their reasoning inspectable.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-4-cleaning-and-validation/solution"
				},
				{
					title: "Module 4: Cleaning and Validation supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 4: Cleaning and Validation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-4-cleaning-and-validation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-09-module-4-cleaning-and-validation-supplemental-2/solution"
				},
				{
					title: "Module 4: Cleaning and Validation supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 4: Cleaning and Validation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-4-cleaning-and-validation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-10-module-4-cleaning-and-validation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 5: Visualization and Statistics in Context",
			curriculum: [
				{
					title: "Choosing the Right Chart",
					content:
						"This section covers line, bar, scatter, histogram, box plot, and basic distribution views as tools for specific questions rather than decorations. Skill target: Defend a chart choice in one sentence."
				},
				{
					title: "Misleading Scales and Weak Comparisons",
					content:
						"Use bad charts on purpose to show how axis choices, poor bin sizes, inconsistent baselines, and decorative clutter can mislead viewers. This gives students a stronger eye for honest presentation."
				},
				{
					title: "Averages, Spread, Correlation, and Outliers",
					content:
						"This section covers descriptive statistics in service of context. Key idea: What these measures can reveal, but also when a summary number hides important structure in the data."
				},
				{
					title: "Correlation Is Not Causation",
					content:
						"Keep causation claims disciplined by asking what the dataset can actually support. Practice target: Writing careful conclusions that do not overstate what a pattern proves."
				},
				{
					title: "Module 5: Visualization and Statistics in Context: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 5: Visualization and Statistics in Context",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats-Starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Simple Stats Starter",
					content:
						"Start from a structured statistics starter and turn it into a working analysis that computes core summary measures cleanly. This is a direct warmup for later notebook-first investigations.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats-Starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Simple-Stats"
				},
				{
					title: "Project: Mode Finder",
					content:
						"Use a tight, focused statistics exercise to reinforce frequency tables, categorical reasoning, and the gap between raw counts and meaningful interpretation.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DS1-Mode"
				},
				{
					title: "Module 5: Visualization and Statistics in Context supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 5: Visualization and Statistics in Context",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-11-module-5-visualization-and-statistics-in-context-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 6: Storytelling with Data",
			curriculum: [
				{
					title: "Framing a Clear Analytical Claim",
					content:
						"Move from a vague topic like sports, movies, or weather into a crisp claim backed by evidence. Good data storytelling starts with a claim that can be tested and defended."
				},
				{
					title: "Selecting What Matters",
					content:
						"Choose which tables, plots, and metrics belong in the final explanation and which distract from the main question. This is where analysis becomes communication instead of accumulation."
				},
				{
					title: "Writing Short, Useful Conclusions",
					content:
						"Practice two- to four-sentence interpretations that connect a visual to an actual decision or insight. Avoid both chart dumping and dramatic overclaiming."
				},
				{
					title: "Audience-Aware Presentation",
					content:
						"Explain how the same data might be presented differently for a peer, a school club, an academic audience, or a portfolio reviewer. Skill target: Tune explanations without changing the evidence."
				},
				{
					title: "Module 6: Storytelling with Data: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 6: Storytelling with Data",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Storytelling with Data",
					content:
						"Keep a compact analysis log for storytelling with data that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which part of the story is genuinely supported and which part is still only a hypothesis. Practice target: Making their reasoning inspectable.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data/solution"
				},
				{
					title: "Module 6: Storytelling with Data supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 6: Storytelling with Data",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-12-module-6-storytelling-with-data-supplemental-2/solution"
				},
				{
					title: "Module 6: Storytelling with Data supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 6: Storytelling with Data",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-6-storytelling-with-data-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-6-storytelling-with-data-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 7: Dashboards with Altair and Streamlit",
			curriculum: [
				{
					title: "When Static Charts Stop Being Enough",
					content:
						"A notebook that only produces fixed outputs becomes limiting when the audience needs filtering, parameter changes, or rapid comparison. In those situations, a dashboard becomes the better communication tool."
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
						"This section covers restraint in dashboard design: clear controls, few charts, obvious labels, and a visible explanation of what the user is seeing. Key idea: An overloaded dashboard is not a better dashboard."
				},
				{
					title: "Module 7: Dashboards with Altair and Streamlit: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 7: Dashboards with Altair and Streamlit",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Dashboards with Altair and Streamlit",
					content:
						"Keep a compact analysis log for dashboards with altair and streamlit that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about which interactions actually help the user answer the question faster. Practice target: Making their reasoning inspectable.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-13-module-7-dashboards-with-altair-and-streamlit/solution"
				},
				{
					title: "Module 7: Dashboards with Altair and Streamlit supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 7: Dashboards with Altair and Streamlit",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-7-dashboards-with-altair-and-streamlit-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-7-dashboards-with-altair-and-streamlit-supplemental-2/solution"
				},
				{
					title: "Module 7: Dashboards with Altair and Streamlit supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle:
							"Module 7: Dashboards with Altair and Streamlit",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-15-module-7-dashboards-with-altair-and-streamlit-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-15-module-7-dashboards-with-altair-and-streamlit-supplemental-3/solution"
				}
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
						"Decide which columns matter, which records should be filtered, and what derived metrics are worth creating. This is the stage where an analysis becomes tailored rather than generic."
				},
				{
					title: "Compare Multiple Analytical Angles",
					content:
						"Include at least two complementary views of the same dataset, such as a trend chart plus a grouped comparison or a distribution plus a ranking. Learn that one chart rarely answers the whole question."
				},
				{
					title: "Make the Work Portfolio-Ready",
					content:
						"Package the project as a notebook, short deck, or dashboard with an introduction, method, findings, and reflection. The finished artifact should be something they could show outside the class."
				},
				{
					title: "Module 8: Domain Projects: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 8: Domain Projects",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DM7-Simple-Sort"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Simple Sort and Ranking Warmup",
					content:
						"Use a compact sorting lab as a way to reason about ranking logic, ordering metrics, and what a leaderboard or sorted report is actually claiming about the data.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DM7-Simple-Sort"
				},
				{
					title: "Module 8: Domain Projects supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 8: Domain Projects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-16-module-8-domain-projects-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-16-module-8-domain-projects-supplemental-2/solution"
				},
				{
					title: "Module 8: Domain Projects supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 8: Domain Projects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-17-module-8-domain-projects-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-17-module-8-domain-projects-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 9: Data Science Capstone",
			curriculum: [
				{
					title: "Question, Dataset, and Scope Lock",
					content:
						"Finalize a capstone question, identify the dataset, and set a scope that can be finished well. Avoid open-ended ambition and instead commit to a question they can answer clearly."
				},
				{
					title: "Clean, Analyze, and Communicate",
					content:
						"Include the full pipeline: loading, cleaning, validation, analysis, visualization, and explanation. The capstone should feel like a small real project rather than a disconnected set of charts."
				},
				{
					title: "Build a Dashboard or Narrative Notebook",
					content:
						"Choose the right final format for the question. Some capstones are better as a polished notebook with commentary; others should become a compact Streamlit or Altair-backed dashboard."
				},
				{
					title: "Reflect on Next Steps",
					content:
						"Use the capstone reflection to decide whether the next course should be `Machine Learning`, `AI Level 1`, `Web Development Foundations`, or a more advanced Python track. Leave with a better sense of whether they enjoy modeling, storytelling, or productizing data work."
				},
				{
					title: "Module 9: Data Science Capstone: Core Project",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 9: Data Science Capstone",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Analysis Log: Data Science Capstone",
					content:
						"Keep a compact analysis log for data science capstone that records the question being asked, the dataset assumptions being made, the exact columns or calculations used, and one short note about what claim the project ultimately makes and what evidence best supports it. Practice target: Making their reasoning inspectable.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-14-module-9-data-science-capstone/solution"
				},
				{
					title: "Module 9: Data Science Capstone supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 9: Data Science Capstone",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-18-module-9-data-science-capstone-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-18-module-9-data-science-capstone-supplemental-2/solution"
				},
				{
					title: "Module 9: Data Science Capstone supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Module 9: Data Science Capstone",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-19-module-9-data-science-capstone-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-19-module-9-data-science-capstone-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 11: Implementation Lab",
			curriculum: [
				{
					title: "Data Analysis Lab 11: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 11: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 11: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/solution"
				},
				{
					title: "Data Analysis Lab 11: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 11: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-01-data-analysis-lab-11/solution"
				},
				{
					title: "Data Analysis Lab 11 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-20-applied-studio-11-data-analysis-lab-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-20-applied-studio-11-data-analysis-lab-11-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 11 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 11: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-21-applied-studio-11-data-analysis-lab-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-21-applied-studio-11-data-analysis-lab-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 12: Implementation Lab",
			curriculum: [
				{
					title: "Data Analysis Lab 12: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 12: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 12: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/solution"
				},
				{
					title: "Data Analysis Lab 12: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 12: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-02-data-analysis-lab-12/solution"
				},
				{
					title: "Data Analysis Lab 12 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-22-applied-studio-12-data-analysis-lab-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-22-applied-studio-12-data-analysis-lab-12-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 12 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 12: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-23-applied-studio-12-data-analysis-lab-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-23-applied-studio-12-data-analysis-lab-12-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 13: Implementation Lab",
			curriculum: [
				{
					title: "Data Analysis Lab 13: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 13: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 13: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/solution"
				},
				{
					title: "Data Analysis Lab 13: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 13: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-03-data-analysis-lab-13/solution"
				},
				{
					title: "Data Analysis Lab 13 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-24-applied-studio-13-data-analysis-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-24-applied-studio-13-data-analysis-lab-13-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 13 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 13: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-25-applied-studio-13-data-analysis-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-25-applied-studio-13-data-analysis-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 14: Implementation Lab",
			curriculum: [
				{
					title: "Data Analysis Lab 14: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 14: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 14: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/solution"
				},
				{
					title: "Data Analysis Lab 14: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 14: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-04-data-analysis-lab-14/solution"
				},
				{
					title: "Data Analysis Lab 14 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-26-applied-studio-14-data-analysis-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-26-applied-studio-14-data-analysis-lab-14-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 14 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 14: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-27-applied-studio-14-data-analysis-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-27-applied-studio-14-data-analysis-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 15: Implementation Lab",
			curriculum: [
				{
					title: "Data Analysis Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/solution"
				},
				{
					title: "Data Analysis Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-05-data-analysis-lab-15/solution"
				},
				{
					title: "Data Analysis Lab 15 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-28-applied-studio-15-data-analysis-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-28-applied-studio-15-data-analysis-lab-15-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 15 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-29-applied-studio-15-data-analysis-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-29-applied-studio-15-data-analysis-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 16: Implementation Lab",
			curriculum: [
				{
					title: "Data Analysis Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/solution"
				},
				{
					title: "Data Analysis Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-06-data-analysis-lab-16/solution"
				},
				{
					title: "Data Analysis Lab 16 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-30-applied-studio-16-data-analysis-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-30-applied-studio-16-data-analysis-lab-16-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 16 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-31-applied-studio-16-data-analysis-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-31-applied-studio-16-data-analysis-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Data Analysis Lab 17: Implementation Lab",
			curriculum: [
				{
					title: "Data Analysis Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Data Analysis Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Data Analysis Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/solution"
				},
				{
					title: "Data Analysis Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Analysis Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-07-data-analysis-lab-17/solution"
				},
				{
					title: "Data Analysis Lab 17 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-32-applied-studio-17-data-analysis-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-32-applied-studio-17-data-analysis-lab-17-supplemental-2/solution"
				},
				{
					title: "Data Analysis Lab 17 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "data science in Python",
						moduleTitle: "Data Analysis Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-33-applied-studio-17-data-analysis-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Science/tree/main/DSP-33-applied-studio-17-data-analysis-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};
