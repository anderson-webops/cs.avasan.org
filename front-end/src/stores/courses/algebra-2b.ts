import type { RawCourse } from "./types";

const MEDIA_BASE = "https://static.classes.jacobdanderson.net/algebra-2b";

const media = {
	logReference: `${MEDIA_BASE}/alb1-logarithms-reference.svg`,
	expLogFamilies: `${MEDIA_BASE}/alb2-exp-log-families.svg`,
	arithmeticReference: `${MEDIA_BASE}/alb3-arithmetic-sequences.svg`,
	geometricReference: `${MEDIA_BASE}/alb4-geometric-sequences.svg`,
	matrixWorkflow: `${MEDIA_BASE}/alb5-matrix-operations.svg`,
	probabilityTables: `${MEDIA_BASE}/alb6-probability-tables.svg`,
	statisticsRegression: `${MEDIA_BASE}/alb7-statistics-regression.svg`,
	unitCircleTrig: `${MEDIA_BASE}/alb8-unit-circle-trig.svg`,
	trigGraphs: `${MEDIA_BASE}/alb9-trig-graphs.svg`,
	missingImage: `${MEDIA_BASE}/missing-image-placeholder.svg`
} as const;

function createLesson(title: string, content: string, mediaLink?: string) {
	return mediaLink ? { title, content, mediaLink } : { title, content };
}

function createModule(
	title: string,
	curriculum: Array<ReturnType<typeof createLesson>>
) {
	return {
		title,
		curriculum,
		supplementalProjects: []
	};
}

export const algebra2BCourse: RawCourse = {
	name: "Algebra 2B",
	modules: [
		createModule("ALB1 Introduction to Logarithms", [
			createLesson(
				"Logarithms, Bases, and Rewriting Forms",
				`
Logarithms undo exponentials. If \`b^x = a\`, then \`log_b(a) = x\`. The base stays the same; the answer to the exponent becomes the logarithm value.

**Cleaned conversion examples**

- \`3^x = 47\` -> \`x = log_3(47)\`
- \`2^x = 13\` -> \`x = log_2(13)\`
- \`0.5^x = 2\` -> \`x = log_0.5(2)\`
- \`e^x = 5\` -> \`x = ln(5)\`
- \`log_2(4) = x\` -> \`2^x = 4\`
- \`log_5(3) = x\` -> \`5^x = 3\`
- \`log_7(152) = 0.5x\` -> \`7^(0.5x) = 152\`
- \`ln(65) = x\` -> \`e^x = 65\`

**Evaluation reminders**

- \`log_b(1) = 0\`
- \`log_3(27) = 3\`
- \`log_2(128) = 7\`
- \`log_5(125) = 3\`
- \`log_10(10000) = 4\`
- \`log_3(1/9) = -2\`
- \`log_125(5) = 1/3\`

Common logarithms use base \`10\`, and natural logarithms use base \`e\`. The graph-and-table reference below replaces the missing introductory screenshots from the recovered source.
				`.trim(),
				media.logReference
			),
			createLesson(
				"Logarithm Properties and Change of Base",
				`
Three identities do most of the work in this module:

- product rule: \`log_b(mn) = log_b(m) + log_b(n)\`
- quotient rule: \`log_b(m/n) = log_b(m) - log_b(n)\`
- power rule: \`log_b(m^n) = n log_b(m)\`

**Cleaned expansions and condensations**

- \`log_5(2x) = log_5(2) + log_5(x)\`
- \`ln(2x^3) = ln(2) + 3ln(x)\`
- \`ln(5x^7 / y) = ln(5) + 7ln(x) - ln(y)\`
- \`ln(8) - ln(4) = ln(2)\`
- \`log_2(x) + 4log_2(y) = log_2(xy^4)\`
- \`5ln(x) + 4ln(y) - 3ln(x) = ln(x^2y^4)\`
- \`log_3(4) + 2log_3(1/2) - log_3(x) = log_3(1/x)\`

**Change of base**

Use
\`log_a(x) = log_b(x) / log_b(a)\`
when your calculator only gives \`log\` or \`ln\`.

Representative calculator values:

- \`log_4(6) = log(6) / log(4) approx 1.29\`
- \`log_3(19) = log(19) / log(3) approx 2.68\`
- \`log_2(12) = log(12) / log(2) approx 3.58\`

This is also the cleanest way to solve exponential growth equations such as \`1300 = 110(1.24)^t\`, which gives \`t approx 11.5\`.
				`.trim()
			)
		]),
		createModule("ALB2 Exponential and Logarithmic Functions", [
			createLesson(
				"Exponential Graphs and Transformations",
				`
The parent exponential family is \`y = b^x\` for \`b > 0\` and \`b != 1\`.

**Core graph facts**

- domain: \`(-infinity, infinity)\`
- range: \`(0, infinity)\`
- horizontal asymptote: \`y = 0\`
- if \`b > 1\`, the graph grows from left to right
- if \`0 < b < 1\`, the graph decays from left to right

**Representative point tables**

For \`y = 3^x\`:

- \`(-2, 1/9)\`
- \`(-1, 1/3)\`
- \`(0, 1)\`
- \`(1, 3)\`
- \`(2, 9)\`

For \`y = 2^(x + 1)\`:

- \`(-2, 1/2)\`
- \`(-1, 1)\`
- \`(0, 2)\`
- \`(1, 4)\`
- \`(2, 8)\`

**Transformation language**

- \`2^x + 3\` -> shift up \`3\`
- \`-(2^x)\` -> reflect across the x-axis
- \`3 * 2^x - 2\` -> vertical stretch by \`3\`, then shift down \`2\`
- \`2^(x - 2) + 1\` -> shift right \`2\`, up \`1\`
- \`2^(2x)\` -> horizontal shrink by factor \`1/2\`
- \`2^(-x)\` -> reflect across the y-axis

The generated reference replaces the original graph screenshots and color-coded solution images.
				`.trim(),
				media.expLogFamilies
			),
			createLesson(
				"Logarithmic Graphs and Growth Models",
				`
The parent logarithmic family is \`y = log_b(x)\`. It is the inverse of \`y = b^x\`.

**Core graph facts**

- domain: \`(0, infinity)\`
- range: \`(-infinity, infinity)\`
- vertical asymptote: \`x = 0\`
- points on \`y = log_4(x)\`: \`(1/4, -1)\`, \`(1, 0)\`, \`(4, 1)\`, \`(16, 2)\`

**Representative transformations**

- \`log_10(x - 1) + 3\` -> right \`1\`, up \`3\`
- \`log_10(x + 1) - 4\` -> left \`1\`, down \`4\`
- \`-log_4(x)\` -> reflect across the x-axis
- \`log_4(-x)\` -> reflect across the y-axis
- \`2log_3(x) - 4\` -> vertical stretch by \`2\`, down \`4\`

**Modeling reminders**

- Exponential growth: \`f(t) = a(1 + r)^t\`
- Continuous growth: \`P = P_0 e^(rt)\`

Representative recovered applications:

- \`10000 = 40e^(0.35t)\` -> \`t = ln(250) / 0.35 approx 16\`
- \`1800 = 300e^(0.18t)\` -> \`ln(6) = 0.18t\`
- \`2.3 = 0.7(1.1)^t\` -> \`t = log_1.1(2.3 / 0.7)\`

Several original graph-reading prompts survived only as captions. When a specific screenshot still cannot be reconstructed from the text, fall back to the course placeholder asset instead of leaving the prompt blank.
				`.trim()
			)
		]),
		createModule("ALB3 Arithmetic Sequences", [
			createLesson(
				"Arithmetic Sequences and nth Terms",
				`
An arithmetic sequence changes by a constant difference \`d\`. The nth-term formula is
\`a_n = a_1 + d(n - 1)\`.

**Cleaned examples**

- \`4, 7, 10, 13, ...\` has \`d = 3\`; next terms: \`16, 19, 22\`
- \`2.7, 3.1, 3.5, 3.9, ...\` has \`d = 0.4\`
- \`100, 90, 80, 70, ...\` has \`d = -10\`
- \`2, -7, -16, -25, ...\` has \`d = -9\`

**Missing-term examples**

- \`1, 6, _, 16, 21, ...\` -> missing term \`11\`
- \`4, _, -4, _, -12, ...\` -> missing terms \`0, -8\`
- \`0.1, _, _, 1, ...\` -> missing terms \`0.4, 0.7\`
- \`_, _, 0, 3, ...\` -> missing terms \`-6, -3\`

**nth-term examples**

- In \`4, 1, -2, -5, ...\`, \`a_21 = -56\`
- If \`a_1 = 5\`, \`d = 3\`, and \`a_n = 38\`, then \`n = 12\`
- If \`a_1 = -0.25\`, \`d = 0.5\`, and \`a_n = 9.75\`, then \`n = 21\`

The generated sequence graphic replaces the original plotted examples and the partially missing sum-pairing diagram.
				`.trim(),
				media.arithmeticReference
			),
			createLesson(
				"Arithmetic Series and Application Problems",
				`
The sum of the first \`n\` terms of an arithmetic sequence is
\`S_n = n(a_1 + a_n) / 2\`.

**Representative sums**

- \`13, 10, 7, ..., -14\` -> \`n = 10\`, so \`S_n = -5\`
- \`-17, -15, -13, ..., 1\` -> \`n = 10\`, so \`S_n = -80\`
- \`14, 24, ..., 44\` -> \`n = 4\`, so \`S_n = 116\`
- \`-6, -51, ..., -141\` -> \`n = 4\`, so \`S_n = -294\`

**Applications**

- A theater starts with \`30\` seats and gains \`2\` per row, so the fifth row has \`38\` seats.
- Jogging starts at \`12\` minutes per day and increases by \`6\` each week, so \`60\` minutes happens in week \`9\`.
- Quiz scores \`54, 58, 62, ...\` reach \`90\` on the tenth quiz; starting on a Monday means that quiz lands on a Friday.
- Summing \`-9 + 7 + 23 + 39 + ... + 279\` gives \`2565\`.

Keep the nth-term and sum formulas separate: one locates a single term, while the other totals an entire run of terms.
				`.trim()
			)
		]),
		createModule("ALB4 Geometric Sequences", [
			createLesson(
				"Geometric Sequences and Exponential Patterns",
				`
A geometric sequence changes by a constant ratio \`r\`. The nth-term formula is
\`a_n = a_1 r^(n - 1)\`.

**Cleaned identification examples**

- \`0.5, 1.5, 4.5, 13.5, ...\` -> geometric with \`r = 3\`
- \`-5, 8, 21, ...\` -> arithmetic, not geometric
- \`100, 25, 6.25, ...\` -> geometric with \`r = 1/4\`
- \`-5, -7.5, -11.25, ...\` -> geometric with \`r = 3/2\`

**Representative nth-term examples**

- \`1, 3, 9, ...\` -> \`a_7 = 729\`
- \`4, 28, 196, ...\` -> \`a_7 = 470596\`
- \`1875, 375, 75, 15, 3, ...\` -> \`a_7 = 0.12\`
- \`0.9, 0.45, 0.225, ...\` -> \`a_7 approx 0.014\`

**Applications**

- Salary growth: \`45600(1.06)^7 approx 68566\`
- Car depreciation after six years: \`32000(0.75)^6 approx 5695\`
- Savings after ten years: \`500(1.05)^10 approx 814\`
- Bouncy-ball rebound heights follow \`20(0.83)^(n - 1)\`

The generated graphic combines the geometric-sequence plots and the rebound table that originally appeared as separate images.
				`.trim(),
				media.geometricReference
			),
			createLesson(
				"Geometric Sums and Infinite Series",
				`
For a finite geometric series with \`r != 1\`,
\`S_n = a_1(1 - r^n) / (1 - r)\`.

If \`|r| < 1\`, the infinite series converges to
\`S = a_1 / (1 - r)\`.

**Representative finite sums**

- \`sum_(n=1)^10 2 * 2^(n - 1) = 2046\`
- \`sum_(n=1)^3 0.5 * 6^(n - 1) = 21.5\`
- \`3, 6, ..., 192\` has sum \`381\`
- \`2, 4, ..., 512\` has sum \`1022\`

**Representative infinite-series facts**

- \`3, 16.5, 90.75, ...\` diverges
- \`-0.7, -0.49, -0.343, ...\` converges
- \`0.1, 0.05, 0.025, 0.0125, ...\` converges to \`0.2\`
- \`0.333333...\` = \`1/3\`
- \`0.444444...\` = \`4/9\`

**Applications**

- Multiplier effect: \`1000 + 800 + 640 + ... = 5000\`
- Bouncing ball total path: initial drop plus an infinite rebound series

The original infinite-series area illustration was missing, so the new reference image includes a clean convergence panel instead.
				`.trim()
			)
		]),
		createModule("ALB5 Matrix Operations", [
			createLesson(
				"Matrix Basics, Addition, and Multiplication",
				`
Add and subtract matrices entry by entry, and only when the dimensions match.

**Representative operations**

- \`[[2, -3], [5, 7]] + [[7, 1], [6.5, -4]] = [[9, -2], [11.5, 3]]\`
- \`[[4, 7], [-1, 0]] - [[3, -2], [5, 8]] = [[1, 9], [-6, -8]]\`
- \`3 * [[1, -2], [4, 0]] = [[3, -6], [12, 0]]\`

For multiplication, the inner dimensions must match. A \`2 x 3\` matrix times a \`3 x 2\` matrix produces a \`2 x 2\` matrix.

**Representative products**

- \`[[1, 2], [3, 4]] [[2, 0], [-1, 5]] = [[0, 10], [2, 20]]\`
- \`[[2, -1, 3], [0, 4, 5]] [[1, 2], [3, 0], [-2, 1]] = [[-7, 7], [2, 5]]\`

The replacement graphic summarizes dimension rules, row-by-column multiplication, and the inverse workflow used in the check-in set.
				`.trim(),
				media.matrixWorkflow
			),
			createLesson(
				"Inverses and Matrix Division",
				`
For a \`2 x 2\` matrix
\`A = [[a, b], [c, d]]\`,
the inverse exists when \`ad - bc != 0\`, and
\`A^(-1) = 1 / (ad - bc) * [[d, -b], [-c, a]]\`.

**Representative inverse examples**

- \`[[3, 0], [1, 2]]^(-1) = (1/6)[[2, 0], [-1, 3]]\`
- \`[[2, 1], [5, 3]]^(-1) = [[3, -1], [-5, 2]]\`

Matrix division is shorthand for multiplying by an inverse:

- \`A / B = A * B^(-1)\`

Example:

- If \`A = [[4, 7], [2, 6]]\` and \`B = [[3, 0], [1, 2]]\`, then
  \`A / B = A * B^(-1) = [[1/6, 3.5], [-1/3, 3]]\`

This covers the matrix-inverse and quotient work that survived into the cleaned Check-in #1 set, even though several of the original screenshots were missing.
				`.trim()
			)
		]),
		createModule("Check-in #1", [
			createLesson(
				"Review Targets",
				`
Use this check-in as a guided review rather than a formal exam.

**Focus areas**

- converting between exponential and logarithmic form
- applying log properties and change of base
- graphing and transforming exponential and logarithmic functions
- arithmetic and geometric sequences
- matrix operations

If the student stalls, stop and reteach the specific skill instead of pressing through the full set.
				`.trim()
			),
			createLesson(
				"Representative Review Problems",
				`
**Cleaned answer-key highlights**

- \`7^x = 378\` -> \`x = log_7(378)\`
- \`log_3.7(x) = 28\` -> \`3.7^28 = x\`
- \`4200 = 500e^(0.23t)\` -> \`t = ln(8.4) / 0.23\`
- If \`log_7(2) = 0.356\` and \`log_7(6) = 0.921\`, then
  - \`log_7(24) = 1.633\`
  - \`log_7(3) = 0.565\`
- \`log_2.89(8.3) = log(8.3) / log(2.89) approx 1.99\`
- Arithmetic review: \`3, 7, 11, 15, ...\` has \`d = 4\` and next terms \`19, 23, 27\`
- Geometric review: \`3, 21, 147, ...\` has \`r = 7\`
- Infinite-series review: \`0.777777... = 7/9\`

Reuse the generated exponential/logarithmic and matrix graphics while the student explains each step aloud.
				`.trim(),
				media.expLogFamilies
			)
		]),
		createModule("ALB6 Probability", [
			createLesson(
				"Probability Rules and Sample Spaces",
				`
Probability measures how likely an event is, on a scale from \`0\` to \`1\`.

**Core language**

- sample space: every possible outcome
- event: the outcomes that match a condition
- independent events: one outcome does not affect the other
- dependent events: the first outcome changes the second probability

**Representative sample spaces**

- One die: \`{1, 2, 3, 4, 5, 6}\`
- Three coin flips: \`{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}\`
- Two dice: \`36\` ordered outcomes

**Core rules**

- and: multiply probabilities
- or: add probabilities when the events are disjoint
- not: subtract from \`1\`

**Recovered examples**

- Even number on a die: \`3/6 = 1/2\`
- Blue marble from a bag with \`4\` red, \`7\` blue, \`8\` green, \`2\` purple:
  \`7/21 = 1/3\`
- Four heads in a row: \`(1/2)^4 = 1/16\`
- Not rolling a \`5\`: \`1 - 1/6 = 5/6\`
- Multiple of three and then a \`4\`: \`(2/6)(1/6) = 1/18\`

The generated reference replaces the original sample-space sketches, Venn-style overlap prompts, and table screenshots.
				`.trim(),
				media.probabilityTables
			),
			createLesson(
				"Two-Way Tables, Permutations, and Combinations",
				`
Two-way tables organize one group of data by two different categories. Use row or column conditionals when you want percentages within a subgroup instead of out of the grand total.

**Representative table reading**

- If dog-preferring Discord users are \`40\` and cat-preferring Discord users are \`210\`, then among Discord users the cat preference is \`210 / 250 = 84%\`.
- If dog-preferring Skype users are \`78\` and cat-preferring Skype users are \`105\`, then among Skype users the cat preference is \`105 / 183 approx 57%\`.

**Counting rules**

- permutation: order matters
- combination: order does not matter

Formulas:

- \`P(n, r) = n! / (n - r)!\`
- \`C(n, r) = n! / (r!(n - r)!)\`

**Cleaned examples**

- \`P(11, 11) = 11! = 39,916,800\`
- Choosing \`2\` friends from \`7\`: \`C(7, 2) = 21\`
- Reordering the letters of PHONE: \`P(5, 5) = 5!\`
- Picking \`4\` marbles from \`16\`: \`C(16, 4)\`
- Probability of a phone number starting with \`615\`: \`10^7 / 10^10 = 1/1000\`

This is the cleaned version of the original probability module after removing the platform instructions and correcting several malformed table captions.
				`.trim()
			)
		]),
		createModule("ALB7 Data and Statistics", [
			createLesson(
				"Correlation and Interpreting Scatter Plots",
				`
Statistics helps you summarize data, notice trends, and decide how trustworthy a prediction might be.

**Core ideas**

- positive correlation: \`x\` increases as \`y\` increases
- negative correlation: \`x\` increases as \`y\` decreases
- stronger correlations have \`r\` values closer to \`1\` or \`-1\`
- no linear correlation means \`r\` is close to \`0\`
- correlation is not the same thing as causation

**Representative interpretations**

- A nearly upward-sloping line can be described as strong positive correlation, such as \`r approx 0.9\`
- A scattered downward trend might be low negative correlation, such as \`r approx -0.49\`
- A perfect line gives \`r = 1\` or \`r = -1\`
- A curved data set can still have \`r approx 0\` even though a non-linear pattern is visible

**Recovered hand-calculation examples**

- For \`(1, 2), (2, 4), (3, 3), (4, 5)\`, \`r approx 0.8\`
- For \`(1, 3), (4, 0), (5, 5), (8, 1)\`, \`r approx -0.23\`
- For \`(3, 10), (5, 9), (8, 8), (9, 5), (10, 3)\`, \`r approx -0.91\`

The replacement graphic includes positive, negative, and weak scatter-plot examples so the original screenshot-only prompts are no longer required.
				`.trim(),
				media.statisticsRegression
			),
			createLesson(
				"Least-Squares Regression and r^2",
				`
The regression line \`y = mx + b\` is the line of best fit. The slope \`m\` estimates average change in \`y\` for each increase of \`1\` in \`x\`.

**Key interpretation**

- \`r\` tells you direction and strength
- \`r^2\` tells you how much of the variation in the data is explained by the regression line

**Representative recovered results**

- Estimated line close to \`y = 0.62x + 1.4\` for a positive-trend scatter plot
- Estimated line close to \`y = -2x + 11\` for a negative-trend scatter plot
- For \`(2, 3), (6, 5), (9, 6)\`, the hand-computed line is \`y = 0.4x + 2.2\` with \`r approx 0.99\`
- For \`(3, 5), (8, 2)\`, the line is \`y = -0.6x + 6.8\` with \`r = -1\`
- For the cleaned Check-in #2 data set, a regression near \`y = 0.28x + 3.61\` gives \`r approx 0.78\` and \`r^2 approx 0.61\`

**Tooling note**

Desmos is an appropriate calculator for the larger tables in this module. Use a table, then enter \`y_1 ~ mx_1 + b\` to recover the regression line and the \`r\` values quickly.
				`.trim()
			),
			createLesson(
				"Missing Original Data Screenshots",
				`
The recovered source referenced several unlabeled scatter plots, slope graphs, and hand-drawn line-of-best-fit sketches that were not preserved.

Use the placeholder below anywhere a prompt still depends on an exact missing screenshot instead of on the cleaned data or the generated regression reference.
				`.trim(),
				media.missingImage
			)
		]),
		createModule("ALB8 Trigonometry Basics", [
			createLesson(
				"Right-Triangle Ratios, Radians, and the Unit Circle",
				`
The three basic trig ratios are:

- \`sin(theta) = opposite / hypotenuse\`
- \`cos(theta) = adjacent / hypotenuse\`
- \`tan(theta) = opposite / adjacent\`

**Representative triangle values**

- If the sides are \`10, 24, 26\`, then
  - \`sin(theta) = 10/26 = 5/13\`
  - \`cos(theta) = 24/26 = 12/13\`
  - \`tan(theta) = 10/24 = 5/12\`

**Unit-circle reminders**

- point on the unit circle: \`(cos(theta), sin(theta))\`
- \`60\` degrees = \`pi/3\` -> point \`(1/2, sqrt(3)/2)\`
- \`45\` degrees = \`pi/4\` -> point \`(sqrt(2)/2, sqrt(2)/2)\`
- \`150\` degrees = \`5pi/6\` -> point \`(-sqrt(3)/2, 1/2)\`
- \`270\` degrees = \`3pi/2\` -> point \`(0, -1)\`

**Degree-radian conversions**

- \`45\` degrees -> \`pi/4\`
- \`90\` degrees -> \`pi/2\`
- \`180\` degrees -> \`pi\`
- \`1.5pi\` radians -> \`270\` degrees
- \`0.875pi\` radians -> \`157.5\` degrees

The generated unit-circle graphic replaces the original diagram links, triangle sketches, and special-angle screenshots.
				`.trim(),
				media.unitCircleTrig
			),
			createLesson(
				"Trig Identities and Function Values",
				`
Useful identities from the recovered course:

- \`csc(theta) = 1 / sin(theta)\`
- \`sec(theta) = 1 / cos(theta)\`
- \`cot(theta) = cos(theta) / sin(theta)\`
- \`sin^2(theta) + cos^2(theta) = 1\`
- \`sin(-theta) = -sin(theta)\`
- \`cos(-theta) = cos(theta)\`
- \`tan(-theta) = -tan(theta)\`

**Representative evaluations**

- If \`x = cos(y)\`, then \`cos(-y) = x\`
- If \`x = tan(y)\`, then \`tan(-y) = -x\`
- \`sin(-42 degrees) approx -0.669\`
- \`cos(238 degrees) approx -0.530\`
- \`tan(-37 degrees) approx -0.753\`

**Representative reciprocal values**

- If \`sin(60 degrees) = 0.866\`, then
  - \`cos(60 degrees) = 0.5\`
  - \`tan(60 degrees) approx 1.732\`
  - \`csc(60 degrees) approx 1.154\`
  - \`sec(60 degrees) = 2\`
  - \`cot(60 degrees) approx 0.577\`

**Triangle-solving reminder**

In a right triangle, the two acute angles are complementary. That is why \`sin(A) = cos(B)\` whenever \`A + B = 90\` degrees.
				`.trim()
			),
			createLesson(
				"Missing Original Triangle Prompts",
				`
Several of the right-triangle and angle-finding exercises originally depended on diagram-only prompts whose exact side labels were not recoverable from the exported text.

Use the placeholder below whenever a specific diagram is still missing and the cleaned written version is not enough to reconstruct the prompt faithfully.
				`.trim(),
				media.missingImage
			)
		]),
		createModule("ALB9 Graphing Trigonometric Functions", [
			createLesson(
				"Sine, Cosine, and Tangent Graph Features",
				`
For the parent functions:

- \`y = sin(x)\` and \`y = cos(x)\` have domain \`(-infinity, infinity)\`
- both have range \`[-1, 1]\`
- both have amplitude \`1\`
- both have period \`2pi\`
- tangent has period \`pi\`, no amplitude, and vertical asymptotes where \`cos(x) = 0\`

**Reference tables**

For \`y = sin(x)\` at
\`-2pi, -3pi/2, -pi, -pi/2, 0, pi/2, pi, 3pi/2, 2pi\`:

- \`0, 1, 0, -1, 0, 1, 0, -1, 0\`

For \`y = cos(x)\` at the same x-values:

- \`1, 0, -1, 0, 1, 0, -1, 0, 1\`

**Feature summary**

- local max of \`sin(x)\`: \`(pi/2, 1)\`
- local min of \`sin(x)\`: \`(3pi/2, -1)\`
- local max of \`cos(x)\`: \`(0, 1)\`
- local min of \`cos(x)\`: \`(pi, -1)\`
- roots of \`tan(x)\`: integer multiples of \`pi\`

The generated graph pack replaces the original sine, cosine, and tangent screenshots and the tan-table explanation that Teddy needed in the recovered lesson.
				`.trim(),
				media.trigGraphs
			),
			createLesson(
				"Transformations of Trig Graphs",
				`
For \`y = a sin(bx) + d\` or \`y = a cos(bx) + d\`:

- amplitude = \`|a|\`
- period = \`2pi / |b|\`
- midline = \`y = d\`

For \`y = a tan(bx) + d\`:

- period = \`pi / |b|\`
- midline = \`y = d\`
- there is no amplitude

**Recovered examples**

- \`-5sin(x) + 3\` -> max \`8\`, min \`-2\`
- \`4cos(x/3)\` -> amplitude \`4\`, period \`6pi\`
- \`2tan(x/5)\` -> period \`5pi\`
- \`2sin(x) - 4\` -> midline \`y = -4\`, amplitude \`2\`
- \`0.5sin(x) + 8\` -> midline \`y = 8\`, amplitude \`0.5\`
- \`4sin(x + pi/2)\` -> left shift by \`pi/2\`, amplitude \`4\`
- \`4sin(2x + pi) + 5\` -> amplitude \`4\`, period \`pi\`, midline \`y = 5\`
- \`2cos(pi x) + 7\` -> amplitude \`2\`, period \`2\`, midline \`y = 7\`
- \`-3cos(2x) + 1.5\` -> amplitude \`3\`, period \`pi\`, midline \`y = 1.5\`

The generated trig-graph reference covers the standard parent graphs. If a particular transformation prompt still depends on a missing screenshot, use the course placeholder asset only for that specific prompt.
				`.trim(),
				media.trigGraphs
			)
		]),
		createModule("Check-in #2", [
			createLesson(
				"Review Targets",
				`
This check-in revisits the second half of the course.

**Focus areas**

- compound probability
- two-way tables and counting methods
- correlation, regression, and interpreting \`r^2\`
- trig ratios, radians, and unit-circle coordinates
- graphing transformed trig functions

Treat the check-in as planning data for future reteaching, not as a formal exam.
				`.trim()
			),
			createLesson(
				"Representative Review Problems",
				`
**Cleaned answer-key highlights**

- Coin sample space: \`{Heads, Tails}\`
- Standard deck sample-space size: \`52\`
- \`P(HHT and an even black card) = (1/8)(10/52) = 5/208\`
- From a bag with \`3\` blue, \`9\` red, and \`6\` green marbles:
  \`P(green then blue without replacement) = (6/18)(3/17) = 1/17\`
- \`P(11, 11) = 39,916,800\`
- \`C(7, 2) = 21\`
- Regression check-in line close to \`y = 0.28x + 3.61\`
- \`r^2 approx 0.61\` means about \`61%\` of the variation is explained by the line
- \`pi/6 = 30\` degrees and gives the unit-circle point \`(sqrt(3)/2, 1/2)\`
- If \`x = sin(y)\`, then \`sin(-y) = -x\`
- \`y = 2cos(pi x) + 7\` has amplitude \`2\`, period \`2\`, and midline \`y = 7\`

Reuse the probability, statistics, unit-circle, and trig-graph references while the student talks through each answer.
				`.trim(),
				media.trigGraphs
			)
		])
	]
};
