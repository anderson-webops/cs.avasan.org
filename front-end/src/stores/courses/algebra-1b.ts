import type { RawCourse } from "./types";

const MEDIA_BASE = "https://static.classes.jacobdanderson.net/algebra-1b";

const media = {
	ridePathParabolas: `${MEDIA_BASE}/ride-path-parabolas.svg`,
	functionComposition: `${MEDIA_BASE}/ab16-function-composition.svg`,
	absoluteValueBasics: `${MEDIA_BASE}/ab17-absolute-value-basics.svg`,
	absoluteValueTransforms: `${MEDIA_BASE}/ab17-absolute-value-transforms.svg`,
	absoluteValueComposite: `${MEDIA_BASE}/ab17-absolute-value-composite.svg`,
	exponentialFunctions: `${MEDIA_BASE}/ab17-exponential-functions.svg`,
	costOfLivingTrend: `${MEDIA_BASE}/ab19-cost-of-living-trend.svg`,
	photonCounts: `${MEDIA_BASE}/ab20-photon-counts.svg`,
	radiofungiCanopies: `${MEDIA_BASE}/ab21-radiofungi-canopies.svg`,
	checkIn2QuadraticGraph: `${MEDIA_BASE}/checkin-2-quadratic-graph.svg`,
	checkIn2FunctionGraph: `${MEDIA_BASE}/checkin-2-function-graph.svg`,
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

export const algebra1BCourse: RawCourse = {
	name: "Algebra 1B",
	modules: [
		createModule("Algebra 1B Kick-Off Project", [
			createLesson(
				"Kick-Off Overview",
				`
Use the kick-off project as placement rather than as a formal test.

- Project 1 checks polynomial manipulation and quadratic solving.
- Project 2 checks graphing quadratics, function notation, inverse functions, and data modeling.
- If the student stalls on a question, jump directly to the matching module instead of forcing a full completion.
- Keep the focus on the math tasks rather than on platform logistics or repeated instructor notes.
				`.trim()
			),
			createLesson(
				"Project 1: Amusement Park Shenanigans",
				`
**Task 1: Arcade Games**

- Total tickets after \`g\` games: \`(20g + 2) + (12g + 5) = 32g + 7\`
- After \`5\` games: \`32(5) + 7 = 167\` tickets
- Poster area: \`(2x + 7)(3x + 4) = 6x^2 + 29x + 28\`
- Ticket-average expression:
  - \`z/5 + 5/(z + 1) = (z^2 + z + 25) / [5(z + 1)]\`
  - At \`z = 3\`: \`3/5 + 5/4 = 1.85\`

**Task 2: Speedy Roller Coasters**

- \`-4t^2 + 8t + 96 = 0\` -> \`t^2 - 2t - 24 = 0\` -> \`(t - 6)(t + 4) = 0\` -> \`t = 6\`
- \`4t^2 - 16t + 16 = 0\` -> \`(2t - 4)^2 = 0\` -> \`t = 2\`
- \`(t - 5)^2 - 49 = 0\` -> \`t = -2\` or \`12\`, so physical time is \`12\`
- \`5t^2 - 12t - 9 = 0\` -> \`t = 3\` or \`-3/5\`, so physical time is \`3\`
- Fastest coaster: the second one at \`2\` seconds
				`.trim()
			),
			createLesson(
				"Project 2: Ride Paths and Snack Break",
				`
**Task 3: Ride Paths**

- Vertex: \`(30, 3)\`
- Use \`(25, 40.5)\` or \`(35, 40.5)\` to solve for \`a\`
- Vertex form: \`y = 1.5(x - 30)^2 + 3\`
- Standard form: \`y = 1.5x^2 - 90x + 1353\`
- Three times as steep: \`y = 4.5(x - 30)^2 + 3\`
- Half as steep: \`y = 0.75(x - 30)^2 + 3\`

**Task 4: Snack Break**

- Calories burned: \`C(h) = 175h + 50\`, so \`C(4) = 750\`
- Sale function: \`f(p) = 0.9p\`
- Coupon function: \`c(p) = p - 2\`
- Compositions:
  - \`f(c(p)) = 0.9(p - 2)\`
  - \`c(f(p)) = 0.9p - 2\`
- Temperature conversion inverse: \`C = (5/9)(F - 32)\`
- Sundae weight tolerance: \`|w - 2.6| <= 0.1\`, so \`2.5 <= w <= 2.7\`
- Summer pay model: \`s(w) = 7.65(1.015)^w\`, and \`s(12) ≈ 9.15\`
- Food-item cost: \`13 * (45/7) ≈ 83.57\`
- To finish the same order in \`15\` minutes, at least \`3\` employees are needed
- Using the estimated line of best fit \`y ≈ 2x\`, predicted sales at \`123\` visitors are \`246\`, so the residual for an actual value of \`221\` is \`221 - 246 = -25\`
				`.trim(),
				media.ridePathParabolas
			)
		]),
		createModule("AB1 Introduction to Polynomials", [
			createLesson(
				"Polynomial Vocabulary and Simplifying Like Terms",
				`
Polynomials are built from terms with nonnegative integer exponents. The core cleanup rule is simple: only combine like terms.

**Key reminders**

- Degree of a term = the sum of the exponents in that term
- Degree of a polynomial = the largest degree among its terms
- Leading term = the term with the highest degree
- Leading coefficient = the coefficient of the leading term

**Representative simplifications**

- \`2x^2 + x^2 = 3x^2\`
- \`10z^3 - 2z^3 + 4 = 8z^3 + 4\`
- \`20 - 3x^3 + 4x^4 + 2x = 4x^4 - 3x^3 + 2x + 20\`
- \`3x^3 - 10y^2 + 10x^2 - 4y^3 - 3x^2 + 4y^3 = 3x^3 + 7x^2 - 10y^2\`

**Not a polynomial**

- \`5/z = 5z^-1\` is not a polynomial because the exponent is negative
				`.trim()
			),
			createLesson(
				"Adding and Subtracting Polynomials",
				`
Adding and subtracting polynomials is just like combining like terms after removing parentheses carefully.

**Representative results**

- \`(2x + 1) + (4x - 1) = 6x\`
- \`(x^2 - 2x + 4) + (3x^2 + 6x - 12) = 4x^2 + 4x - 8\`
- \`(12x^2 - 13x + 6) - (3x^2 - 8x + 5) = 9x^2 - 5x + 1\`
- \`(y^5 - 9y^3 + y - 7) - (y^4 + 9y^3 - y + 14) = y^5 - y^4 - 18y^3 + 2y - 21\`

**Word problems**

- Rabbit populations:
  - black rabbits: \`2t^2 + 10\`
  - white rabbits: \`t^3 + 5t - 6\`
  - total: \`t^3 + 2t^2 + 5t + 4\`
- Halloween candy:
  - Jane: \`15t + 2\`
  - Billy: \`5t + 22\`
  - total: \`20t + 24\`
				`.trim()
			)
		]),
		createModule("AB2 Multiplying Polynomials", [
			createLesson(
				"Multiplying by Constants and Single Terms",
				`
Distribute the monomial through every term.

**Representative results**

- \`2(x + 2) = 2x + 4\`
- \`9y(2y^2 - 5) = 18y^3 - 45y\`
- \`x(x^2 - 1) = x^3 - x\`
- \`(2y^2 - y + 9)(7y^2) = 14y^4 - 7y^3 + 63y^2\`
- \`(3x - 10 + 4x^3)(5x) = 20x^4 + 15x^2 - 50x\`

**Area model**

- Rectangle with side lengths \`3x + 5\` and \`2x + 3\` has area \`6x^2 + 19x + 15\`
				`.trim()
			),
			createLesson(
				"FOIL and Special Binomials",
				`
FOIL is a special case of distribution for binomials.

**Representative results**

- \`(y + 1)(y - 2) = y^2 - y - 2\`
- \`(z - 3)(2z + 4) = 2z^2 - 2z - 12\`
- \`(2x - 3)(2x + 3) = 4x^2 - 9\`
- \`(x - 7)^2 = x^2 - 14x + 49\`
- \`(z + 2)^2 = z^2 + 4z + 4\`
- \`(x^2 - 1)(x^2 + 5) = x^4 + 4x^2 - 5\`

**Difference of squares preview**

- \`(x - 1)(x + 1) = x^2 - 1\`
- \`(y - 9)(y + 9) = y^2 - 81\`
				`.trim()
			),
			createLesson(
				"Complex Polynomial Multiplication",
				`
For larger polynomials, distribute one full term at a time and combine like terms only after every product has been written out.

**Representative results**

- \`(x^2 - 2x + 9)(2x + 1) = 2x^3 - 3x^2 + 16x + 9\`
- \`(-y^2 + 3)(4y^2 + y - 9) = -4y^4 - y^3 + 21y^2 + 3y - 27\`
- \`(x^2 - 9x + 10)(2x^2 + 5x - 1) = 2x^4 - 13x^3 - 26x^2 + 59x - 10\`
- Triangle area with base \`2x + 4\` and height \`x^2 - 2x + 7\`:
  - \`A = 1/2(2x + 4)(x^2 - 2x + 7) = x^3 + 3x + 14\`
				`.trim()
			)
		]),
		createModule("AB3 Fractions with Polynomials", [
			createLesson(
				"Fractions Warm-Up and Least Common Denominators",
				`
This lesson emphasizes method-first fraction work and uses fully readable examples.

**Least common denominator examples**

- \`1/2 + 1/3\` -> LCD \`6\`
- \`1/x - 1/y\` -> LCD \`xy\`
- \`1/x - 1/y - 1/z\` -> LCD \`xyz\`
- \`1/x^2 + 1/y^3 - 1/6\` -> LCD \`6x^2y^3\`

**Single-fraction examples**

- \`1/x + 1/z^2 = (z^2 + x)/(xz^2)\`
- \`x/2 - 5/x^2 = (x^3 - 10)/(2x^2)\`
- \`z - 1/z = (z^2 - 1)/z\`
				`.trim()
			),
			createLesson(
				"Fractions with Polynomial Denominators",
				`
To combine rational expressions, use a shared denominator exactly as you would with ordinary fractions.

**Representative results**

- \`(x - 3)/(x + 2) + (x + 3)/(x - 4) = (2x^2 - 2x + 18)/[(x + 2)(x - 4)]\`
- \`5/z + (1 + z)/5 = (z^2 + z + 25)/(5z)\`
- \`2/(5y) - 4/(2y + 4)\` is a good recomputation exercise after factoring the second denominator:
  - \`2y + 4 = 2(y + 2)\`
  - then build a shared denominator from \`5y\` and \`2(y + 2)\`

**Instructional note**

- Encourage students to factor denominators first; it often reveals a smaller least common denominator than a direct product would.
				`.trim()
			),
			createLesson(
				"Rationalizing Denominators",
				`
Rationalizing removes radicals from the denominator.

**Representative results**

- \`1/sqrt(3) = sqrt(3)/3\`
- \`1/sqrt(7) = sqrt(7)/7\`
- \`1/sqrt(4) = 1/2\`
- \`1/(1 + sqrt(2)) = sqrt(2) - 1\`
- \`1/(2 + sqrt(3)) = 2 - sqrt(3)\`

**Conjugate rule**

- For a denominator like \`a + sqrt(b)\`, multiply numerator and denominator by \`a - sqrt(b)\`
- This works because \`(a + sqrt(b))(a - sqrt(b)) = a^2 - b\`
				`.trim()
			)
		]),
		createModule("AB4 Module Project: Smart and Elegant (with Amy Katz)", [
			createLesson(
				"Project Brief",
				`
This project applies polynomial modeling to event-planning revenue, cost, and competition.

**Mission 1**

- Revenue: \`R(x) = -0.05x^2 + 70x\`
- Cost: \`C(x) = 20x + 750\`
- Build the profit model \`P(x) = R(x) - C(x)\`
- Compare four revised pricing strategies:
  - double both revenue and cost
  - halve both revenue and cost
  - keep revenue fixed and reduce cost to \`66%\`
  - keep revenue fixed and increase cost by \`33%\`

**Mission 2**

- Competitor revenue: \`R_2(x) = -0.055x^2 + 60x\`
- Competitor cost: \`C_2(x) = 9x + 600\`
- Build the competitor profit model and a ratio function comparing Amy's profit to the competitor's
				`.trim()
			),
			createLesson(
				"Answer Key and Cleaned Profit Models",
				`
**Base model**

- \`P(x) = (-0.05x^2 + 70x) - (20x + 750)\`
- \`P(x) = -0.05x^2 + 50x - 750\`

**One strong revised option**

- Doubling both revenue and cost gives
  - \`P_d(x) = -0.10x^2 + 100x - 1500\`
- This doubles the original profit curve and keeps the same basic shape

**Competitor**

- \`P_2(x) = (-0.055x^2 + 60x) - (9x + 600)\`
- \`P_2(x) = -0.055x^2 + 51x - 600\`

**Ratio functions**

- Amy vs. competitor:
  - \`T(x) = (-0.05x^2 + 50x - 750) / (-0.055x^2 + 51x - 600)\`
- Doubled-price version vs. competitor:
  - \`T_d(x) = (-0.10x^2 + 100x - 1500) / (-0.055x^2 + 51x - 600)\`

Use the ratio definitions above so that \`T(x) > 1\` means Amy is doing better than the competitor.
				`.trim()
			)
		]),
		createModule("AB5 Solving Quadratics by Factoring", [
			createLesson(
				"Simple Polynomial Factoring",
				`
Start by pulling out the greatest common factor before looking for deeper structure.

**Representative results**

- \`x^2 + x = x(x + 1)\`
- \`2x - 4x^2 = 2x(1 - 2x)\`
- \`8x^3 - 12x^2 = 4x^2(2x - 3)\`
- \`45x^3 - 60x^2 = 15x^2(3x - 4)\`
- \`34t^3 - 17t^2 = 17t^2(2t - 1)\`
				`.trim()
			),
			createLesson(
				"Factoring Quadratics and Solving by Factoring",
				`
After factoring, set each factor equal to zero.

**Representative solutions**

- \`x^2 + 5x + 6 = (x + 2)(x + 3)\` -> \`x = -3, -2\`
- \`x^2 - 3x - 28 = (x - 7)(x + 4)\` -> \`x = -4, 7\`
- \`5x^2 - 20x + 15 = 5(x - 1)(x - 3)\` -> \`x = 1, 3\`
- \`8x^3 - 8x^2 + 2x = 2x(2x - 1)^2\` -> \`x = 0, 1/2\`

**Word problems**

- Rocket height: \`-4t^2 + 8t + 96 = 0\` -> \`t = 6\`
- Falling penny from \`64\` feet:
  - \`-16t^2 + 64 = 0\`
  - \`t = 2\`
				`.trim()
			)
		]),
		createModule("AB6 Special Factorizations", [
			createLesson(
				"Perfect Squares and Difference of Squares",
				`
Use this module to highlight the algebra patterns that appear most often before solving quadratics.

**Core identities**

- \`a^2 - b^2 = (a - b)(a + b)\`
- \`a^2 + 2ab + b^2 = (a + b)^2\`
- \`a^2 - 2ab + b^2 = (a - b)^2\`

**Representative examples**

- \`x^2 - 81 = (x - 9)(x + 9)\`
- \`x^2 + 10x + 25 = (x + 5)^2\`
- \`x^2 - 14x + 49 = (x - 7)^2\`
- \`4t^2 - 16t + 16 = (2t - 4)^2\`
- \`x^3 + 6x^2 + 9x = x(x + 3)^2\`

Use this module to sharpen factor recognition before moving into completing the square and the quadratic formula.
				`.trim()
			)
		]),
		createModule("AB7 Solving Quadratics by Completing the Square", [
			createLesson(
				"Completing the Square",
				`
Completing the square rewrites a quadratic so the left side becomes a perfect square trinomial.

**Representative examples**

- \`x^2 - 10x - 24 = 0\`
  - \`x^2 - 10x = 24\`
  - \`x^2 - 10x + 25 = 49\`
  - \`(x - 5)^2 = 49\`
  - \`x = 12\` or \`-2\`

- \`(t - 5)^2 - 49 = 0\`
  - already in completed-square form
  - \`(t - 5)^2 = 49\`
  - \`t = 12\` or \`-2\`

This method is especially useful when the quadratic does not factor cleanly.
				`.trim()
			)
		]),
		createModule("AB8 Quadratic Formula", [
			createLesson(
				"Quadratic Formula Review",
				`
Use the quadratic formula when factoring is inconvenient:

\`x = [-b ± sqrt(b^2 - 4ac)] / (2a)\`

**Representative examples**

- \`5t^2 - 12t - 9 = 0\`
  - \`a = 5\`, \`b = -12\`, \`c = -9\`
  - \`t = [12 ± sqrt(144 + 180)] / 10\`
  - \`t = [12 ± 18] / 10\`
  - \`t = 3\` or \`-3/5\`

- \`x^2 + 4x - 12 = 0\`
  - \`x = [-4 ± sqrt(16 + 48)] / 2\`
  - \`x = (-4 ± 8)/2\`
  - \`x = 2\` or \`-6\`

The positive physical solution is often the only answer that makes sense in application problems.
				`.trim()
			)
		]),
		createModule(
			"AB9 Module Project: The Half-Court Challenge (with Ian Kennedy)",
			[
				createLesson(
					"Project Bridge",
					`
Use this module as a short sports-modeling bridge between solving quadratics and graphing them.

**Project focus**

- Use factoring, completing the square, and the quadratic formula to analyze shot paths
- Compare vertex form and intercept form for basketball arcs
- Ask students to justify which solving method is fastest for each quadratic they encounter

Have the student finish by sketching a half-court shot model and explaining which form of the quadratic is most useful for each question.
				`.trim()
				)
			]
		),
		createModule("Check-in #1", [
			createLesson(
				"Review Targets",
				`
Use this check-in as a guided review rather than as a formal exam.

**Skills to revisit**

- polynomial vocabulary and simplification
- multiplying polynomials
- factoring
- special factorizations
- completing the square
- quadratic formula

Pause whenever the student gets stuck and reteach the relevant method immediately.
				`.trim()
			),
			createLesson(
				"Representative Review Problems",
				`
**Selected review set**

- Simplify: \`3x^2 - 2x + 5 + x^2 + 7x - 3 = 4x^2 + 5x + 2\`
- Multiply: \`(x + 5)(x + 2) = x^2 + 7x + 10\`
- Factor: \`x^2 - 5x - 6 = (x - 6)(x + 1)\`
- Complete the square:
  - \`x^2 - 10x + 9 = 0\`
  - \`(x - 5)^2 = 16\`
  - \`x = 1, 9\`
- Quadratic formula:
  - \`2x^2 + 3x - 2 = 0\`
  - \`x = 1/2, -2\`
				`.trim()
			)
		]),
		createModule("AB10 Graphing Vertex Form", [
			createLesson(
				"Graphing from Vertex Form",
				`
Vertex form makes the vertex and axis of symmetry visible immediately:

\`y = a(x - h)^2 + k\`

- Vertex = \`(h, k)\`
- Axis of symmetry = \`x = h\`
- Positive \`a\` opens upward, negative \`a\` opens downward
- Larger \`|a|\` makes the parabola narrower

Use the ride-path example to practice choosing symmetric points around the vertex.
				`.trim(),
				media.ridePathParabolas
			)
		]),
		createModule("AB11 Graphing Standard Form", [
			createLesson(
				"From Standard Form Back to Structure",
				`
Standard form hides the graph's structure, so convert when needed.

**Representative example**

- Start with the ride-path equation:
  - vertex form: \`y = 1.5(x - 30)^2 + 3\`
  - standard form: \`y = 1.5x^2 - 90x + 1353\`
- Even in standard form, it is the same graph with the same vertex and axis of symmetry

**Intercept-form reminder**

- \`y = (1/6)(x - 2)(x + 3)\`
- x-intercepts: \`-3\` and \`2\`
				`.trim(),
				media.ridePathParabolas
			)
		]),
		createModule("AB12 Transformations", [
			createLesson(
				"Shifts, Reflections, and Stretches",
				`
Quadratic transformations are easiest to understand by comparing equations with the same base shape.

**Representative transformations**

- Up \`3\`, left \`6\` from \`y = x^2\` -> \`y = (x + 6)^2 + 3\`
- Vertical scale of \`1/4\` on \`y = x^2 - 3\` -> \`y = (1/4)x^2 - 3/4\`
- Reflect \`y = (x - 1)^2 + 2\` across the x-axis -> \`y = -(x - 1)^2 - 2\`
- Reflect that same graph across the y-axis -> \`y = (x + 1)^2 + 2\`
- Flip \`y = 3x^2 - 4\` across the x-axis and shift right \`1\` -> \`y = -3(x - 1)^2 + 4\`

Use the ride-path family to compare how steepness changes without moving the vertex.
				`.trim(),
				media.ridePathParabolas
			)
		]),
		createModule(
			"AB13 Module Project: Put Me in Coach! (with Tom Dethlefs)",
			[
				createLesson(
					"Project Bridge",
					`
Use this module as a short sports-graphing project tied to quadratic transformations.

**Project focus**

- graphing in vertex form
- graphing in standard form
- transformations of quadratic models

Ask the student to design a sports shot or stadium-arc model, then describe how shifting, stretching, or reflecting the parabola changes the situation.
				`.trim()
				)
			]
		),
		createModule("AB14 Introduction to Functions", [
			createLesson(
				"Function Definitions and Notation",
				`
Functions assign each input exactly one output.

**Representative examples**

- Calories burned while walking:
  - \`C(h) = 175h + 50\`
  - \`C(4) = 750\`
- A function's domain is the set of allowed inputs
- A function's range is the set of outputs it can produce

Use tables and graphs together so students see how a function behaves, not just how it is written.
				`.trim(),
				media.checkIn2FunctionGraph
			),
			createLesson(
				"Function Behavior from a Graph",
				`
The sample function \`f(x) = 0.5(x - 3)^2\` is a good review model.

- Domain: \`(-∞, ∞)\`
- Range: \`[0, ∞)\`
- Absolute minimum: \`(3, 0)\`
- Relative minimum: \`(3, 0)\`
- Decreasing on \`(-∞, 3)\`
- Increasing on \`(3, ∞)\`

Those same ideas carry over into later modules on exponential, absolute-value, and inverse-variation functions.
				`.trim(),
				media.checkIn2FunctionGraph
			)
		]),
		createModule("AB15 Function Composition and Inverse Functions", [
			createLesson(
				"Composition",
				`
Composition applies one function to the output of another.

**Coupon and sale example**

- Sale discount: \`f(p) = 0.9p\`
- Coupon: \`c(p) = p - 2\`
- Coupon first, then sale:
  - \`f(c(p)) = 0.9(p - 2)\`
- Sale first, then coupon:
  - \`c(f(p)) = 0.9p - 2\`

Composition order matters because the output of the first function becomes the input of the second.
				`.trim()
			),
			createLesson(
				"Inverse Functions",
				`
An inverse undoes the original function.

**Representative examples**

- Temperature conversion:
  - original: \`F(C) = (9/5)C + 32\`
  - inverse: \`C(F) = (5/9)(F - 32)\`
- Linear function:
  - \`g(x) = 3x\`
  - \`g^-1(x) = x/3\`

For an inverse to exist as a function, each output of the original function must come from only one input.
				`.trim()
			)
		]),
		createModule("AB16 Module Project: J.T. Phone Home", [
			createLesson(
				"Project Brief",
				`
This project uses composition and inverse functions to model a fictional wormhole system.

**Mission 1**

- time to acceleration: choose \`a(t)\`
- acceleration to force: choose \`f(a)\`
- force to space-tearing power: choose \`p(f)\`
- compose them into a single function \`p(t)\`

**Mission 2**

- invert the composed function to recover the required time for a given power level
- write the return-trip explanation for the script
				`.trim()
			),
			createLesson(
				"Answer Key",
				`
One consistent choice set is:

- \`a(t) = t^2\`
- \`f(a) = 2a\`
- \`p(f) = ln(f)\`

**Composition**

- \`p(t) = ln(2t^2)\`

**Inverse**

- Start with \`p = ln(2t^2)\`
- Exponentiate: \`e^p = 2t^2\`
- Solve for positive time:
  - \`t = sqrt(e^p / 2)\`
				`.trim(),
				media.functionComposition
			)
		]),
		createModule("AB17 Absolute Value and Exponential Functions", [
			createLesson(
				"Absolute Value Equations",
				`
To solve an absolute-value equation, isolate the absolute-value term and split into two linear cases.

**Representative solutions**

- \`-|3x - 2| = -11\` -> \`x = -3, 13/3\`
- \`|5x + 2| - 13 = 27\` -> \`x = -42/5, 38/5\`
- \`|-x - 11| = 12\` -> \`x = -23, 1\`
- \`-3|2x - 1| + 2 = -1\` -> \`x = 0, 1\`

Always check whether the right side is negative before splitting; \`|expression|\` can never equal a negative number.
				`.trim()
			),
			createLesson(
				"Absolute Value Graph Gallery",
				`
Absolute-value graphs are built from a V-shape plus transformations.

**What to notice**

- the vertex location
- whether the graph opens upward or downward
- whether the graph gets narrower or wider

Use the graph set below to compare shifts and stretches directly.
				`.trim(),
				media.absoluteValueBasics
			),
			createLesson(
				"More Absolute Value Transformations",
				`
The second gallery focuses on reflection, stretching, and combined absolute-value expressions.

**Key observations**

- \`-5|x + 9|\` opens downward and is vertically stretched
- \`|x| - 2\` moves the parent graph down \`2\`
- \`-|0.5x + 5| + 4\` combines a reflection, horizontal scaling, and translation
- \`|x + 3| + |x - 2|\` produces a flat minimum segment from \`x = -3\` to \`x = 2\`
				`.trim(),
				media.absoluteValueTransforms
			),
			createLesson(
				"Piecewise-Style Absolute Value Example",
				`
The graph below isolates the combined function \`|x + 3| + |x - 2|\`.

- Minimum value: \`5\`
- Minimum interval: \`[-3, 2]\`
- The function decreases up to \`x = -3\`, stays flat through \`x = 2\`, then increases
				`.trim(),
				media.absoluteValueComposite
			),
			createLesson(
				"Exponential Functions and Growth/Decay",
				`
Exponential functions change by multiplying by a common factor rather than adding a common difference.

**Selected equations**

- \`6 = 2^x\` -> \`x ≈ 2.58\`
- \`12 = 3^(x - 10)\` -> \`x ≈ 12.26\`
- \`3^(4x) = 3^8\` -> \`x = 2\`
- \`4^(3x) = 16^3\` -> \`x = 2\`

**Growth and decay models**

- Fish growth: \`0.4(1.12)^6 ≈ 0.79\` grams after \`6\` weeks
- Subscriber decay: \`3,500,000(0.96)^5 ≈ 2,853,804\`
- Weekly raise: \`7.65(1.015)^w\`, reaching \`$10\` per hour at about week \`18\`

**Graph note**

- \`7 * 1^x + 5 = 12\` is a constant function, so its range is \`{12}\`
				`.trim(),
				media.exponentialFunctions
			)
		]),
		createModule("AB18 Direct and Inverse Variation", [
			createLesson(
				"Direct Variation",
				`
Direct variation has the form \`y = kx\`.

**Representative results**

- If \`y = 1/2\` when \`x = 1/4\`, then \`k = 2\` and the equation is \`y = 2x\`
- If \`y = 35\` when \`x = -5\`, then \`k = -7\` and the equation is \`y = -7x\`
- If \`x = 3\` and \`y = 7\`, then for \`y = 23\` we get \`x = 69/7\`

**Word problems**

- \`42\` cookies need \`3.5\` cups of sugar, so \`150\` cookies need \`12.5\` cups
- A design scale of \`5\` cm to \`30\` cm turns a \`2.25\` cm drawing headlight into \`13.5\` cm in real life
				`.trim()
			),
			createLesson(
				"Inverse Variation",
				`
Inverse variation has the form \`y = k/x\`.

**Representative results**

- If \`y = -1\` when \`x = 5\`, then \`k = -5\` and \`y = -5/x\`
- If \`y = 18\` when \`x = 2\`, then \`k = 36\` and \`y = 36/x\`
- If \`x = 6\` and \`y = 5\`, then for \`y = 3\` we get \`x = 10\`
- If \`x = -4\` and \`y = 7\`, then for \`x = 14\` we get \`y = -2\`

**Word problems**

- A pool fills in \`7\` hours at \`6\` liters/minute, so at \`4\` liters/minute it takes \`10.5\` hours
- A flight that takes \`16\` hours at \`500\` mph takes \`20\` hours at \`400\` mph
				`.trim()
			)
		]),
		createModule("AB19 Data Modeling", [
			createLesson(
				"Trend Lines and Interpreting a Fit",
				`
Data rarely lands perfectly on a clean function, so this module focuses on choosing a reasonable model and interpreting what it says.

**Image-based classification answer notes**

- quadratic
- exponential
- linear
- none
- cubic
- linear

Use those labels as answer-key notes for the original graph prompts, and pair them with a live graphing tool if you want students to recreate the shapes.
				`.trim(),
				media.costOfLivingTrend
			),
			createLesson(
				"Residuals and Source Gaps",
				`
Residual = actual value minus predicted value.

**Representative residuals**

- Height \`175\` cm with foot length \`26\` cm and trend \`y = 0.05x + 15\`:
  - predicted \`= 23.75\`
  - residual \`= 26 - 23.75 = 2.25\`
- Temperature \`75\` degrees with profit \`$3250\` and trend \`y = 50x - 125\`:
  - predicted \`= 3625\`
  - residual \`= 3250 - 3625 = -375\`

**Visual-reference note**

- Several residual plots and scatterplots depend on visual references that are still missing from the imported material.
- Use the placeholder below wherever one of those prompts still needs an image box.
				`.trim(),
				media.missingImage
			)
		]),
		createModule(
			"AB20 Module Project: The Mysteries of Light (with Blake Eaton)",
			[
				createLesson(
					"Project Brief",
					`
This project connects interference patterns, data visualization, and inverse proportionality through a light-and-atoms theme.

**Mission 1**

- predict the sensor pattern for a double-slit setup
- graph the photon-count data
- compare the measured shape with several candidate best-fit ideas

**Mission 2**

- connect wavelength to mass and speed
- use the de Broglie relationship to compare atoms with very different masses
				`.trim()
				),
				createLesson(
					"Photon Count Graph and Modeling Notes",
					`
The photon-count data for this activity is:

- \`(-4, 30)\`
- \`(-3, 60)\`
- \`(-2, 120)\`
- \`(-1, 400)\`
- \`(0, 800)\`
- \`(1, 430)\`
- \`(2, 130)\`
- \`(3, 55)\`
- \`(4, 29)\`

**Cleaned observations**

- Highest measured count: \`x = 0\`
- Lowest-likelihood positions in the zero-filled comparison line are the inserted half-step gaps such as \`x = -3.5, -2.5, ..., 3.5\`
- The candidate best-fit equations in this activity appear to be on a different scale than the raw count data, so treat them as qualitative prompts unless the data is rescaled first

**de Broglie wavelength**

- \`lambda = h / (mv)\`
- Carbon atom with \`m = 6.63 x 10^-27\` kg and \`v = 2200\` m/s:
  - \`lambda ≈ 4.55 x 10^-11\` m
- Uranium atom with \`m = 3.95 x 10^-22\` kg and \`lambda = 3.9 x 10^-16\` m:
  - \`v ≈ 4.30 x 10^3\` m/s
				`.trim(),
					media.photonCounts
				),
				createLesson(
					"Experiment Visual Placeholder",
					`
Some simulator screenshots, graph-choice images, and a helium-atom data graphic are still missing from the imported material.

Use the placeholder below wherever this project still depends on one of those missing visuals.
				`.trim(),
					media.missingImage
				)
			]
		),
		createModule("AB21 Module Project: Radiofungi (with Sunanda Sharma)", [
			createLesson(
				"Project Brief and Cleaned Answers",
				`
This project combines exponential growth with quadratic transformations.

**Mission 1: Radiofungi in the Lab**

- Earth model: \`f(t) = s * 7^t\`
- To reach \`50,000,000\` bacteria after \`2\` weeks:
  - \`s = 50,000,000 / 7^2 ≈ 1,020,408\`
- Space model: \`f(t) = s * 5^t\`
- To reach the same goal in space:
  - \`s = 50,000,000 / 5^2 = 2,000,000\`
- Because the space growth factor is smaller, the initial population must be larger

**Mission 2: The First Radiofungal Canopy**

- Earth canopy: \`y = -(x - 4)^2 + 7\`
- Space canopy after a vertical stretch of \`2\` and a shift right by \`3\`:
  - \`y = -2(x - 7)^2 + 14\`
- Earth ground contacts:
  - \`x = 4 ± sqrt(7)\`
  - about \`1.35\` and \`6.65\`
- Space ground contacts:
  - \`x = 7 ± sqrt(7)\`
  - about \`4.35\` and \`9.65\`

**Earth-side use cases**

- nuclear cleanup sites
- medical or industrial radiation-shielding structures
- mining or research environments with elevated exposure risk
				`.trim(),
				media.radiofungiCanopies
			)
		]),
		createModule("AB22 Master Project: Algebra 1B", [
			createLesson(
				"Course Reflection and Recording Studio Prompt",
				`
Use the master project to let the student explain one idea from Algebra 1B in their own words.

**Student task**

- choose the concept that felt most challenging or most satisfying
- explain the purpose of that concept
- give at least one real-world application
- design and solve at least two original problems

This module works best as a short, student-led teaching demo rather than as a written worksheet.
				`.trim()
			)
		]),
		createModule("Check-in #2", [
			createLesson(
				"Review Overview",
				`
This check-in reviews graphing quadratics, transformations, functions, inverse functions, variation, exponential models, and data analysis.

**Instructor stance**

- let the student try each problem independently first
- use guiding questions before full reteaching
- treat the results as feedback for the next few sessions, not as a formal exam grade
				`.trim()
			),
			createLesson(
				"Quadratic Graphing Review",
				`
**Answer key highlights**

- Graph \`y = -(1/4)x^2\` using representative points such as
  - \`(-8, -16)\`
  - \`(-4, -4)\`
  - \`(0, 0)\`
  - \`(4, -4)\`
  - \`(8, -16)\`
- For \`y = 3(x + 1)^2 - 4\`:
  - axis of symmetry: \`x = -1\`
  - vertex: \`(-1, -4)\`
- For \`y = (1/6)(x - 2)(x + 3)\`:
  - x-intercepts: \`-3, 2\`
- Through points \`(0, 0)\`, \`(1, 2)\`, and \`(2, 5)\`:
  - standard form: \`y = (1/2)x^2 + (3/2)x\`
  - vertex form: \`y = (1/2)(x + 3/2)^2 - 9/8\`
  - intercept form: \`y = (1/2)x(x + 3)\`
				`.trim(),
				media.checkIn2QuadraticGraph
			),
			createLesson(
				"Function and Transformation Review",
				`
**Recovered answer key highlights**

- Translate \`y = x^2\` up \`3\` and left \`6\`:
  - \`y = (x + 6)^2 + 3\`
- Scale \`y = x^2 - 3\` by \`1/4\`:
  - \`y = (1/4)x^2 - 3/4\`
- Reflect \`y = (x - 1)^2 + 2\` across the x-axis:
  - \`y = -(x - 1)^2 - 2\`
- Reflect it across the y-axis:
  - \`y = (x + 1)^2 + 2\`
- For \`f(x) = 2x^2\` and \`g(x) = x + 4\`:
  - \`f + g = 2x^2 + x + 4\`
  - \`f - g = 2x^2 - x - 4\`
  - \`fg = 2x^3 + 8x^2\`
  - \`f/g = 2x^2 / (x + 4)\`
  - \`g ◦ f = 2x^2 + 4\`
  - \`f(g(3)) = 98\`
- Inverse of \`g(x) = 3x\`:
  - \`g^-1(x) = x/3\`
				`.trim(),
				media.checkIn2FunctionGraph
			),
			createLesson(
				"Check-In Visual Placeholder",
				`
Some graph-only prompts in this check-in still depend on missing reference images:

- the vertical-line-test example
- the inverse-existence graph in the advanced section
- one additional practice graph used for extrema and intervals

Use the placeholder below anywhere the check-in still depends on one of those missing visuals.
				`.trim(),
				media.missingImage
			)
		])
	]
};
