import type { RawCourse } from "./types";

const MEDIA_BASE = "https://static.classes.jacobdanderson.net/algebra-2a";

const media = {
	complexPlane: `${MEDIA_BASE}/ala1-complex-plane.svg`,
	quadraticForms: `${MEDIA_BASE}/ala3-quadratic-forms.svg`,
	quadraticTransforms: `${MEDIA_BASE}/ala3-quadratic-transformations.svg`,
	polynomialBehavior: `${MEDIA_BASE}/ala7-polynomial-behavior.svg`,
	rationalFunctions: `${MEDIA_BASE}/ala8-rational-functions.svg`,
	radicalFunctions: `${MEDIA_BASE}/ala10-radical-functions.svg`,
	piecewiseFunctions: `${MEDIA_BASE}/ala11-piecewise-functions.svg`,
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

export const algebra2ACourse: RawCourse = {
	name: "Algebra 2A",
	modules: [
		createModule("ALA1 Complex Numbers", [
			createLesson(
				"Imaginary Numbers and Powers of i",
				`
Complex numbers extend the real-number system so square roots of negatives make sense. Use \`i = sqrt(-1)\`, and remember the power cycle \`1, i, -1, -i\`.

**Cleaned examples**

- \`sqrt(-9) = 3i\`
- \`sqrt(-16) = 4i\`
- \`sqrt(-24) = 2sqrt(6)i\`
- \`4sqrt(-32) = 16sqrt(2)i\`
- \`sqrt(-49) = 7i\`
- \`sqrt(-100) = 10i\`
- \`i^17 = i\`
- \`i^43 = -i\`
- \`i^112 = 1\`
- \`i^118 = -1\`
- \`8i + 3i = 11i\`
- \`4i + 4i^3 + 4i = 4i\`
- \`(3i)^2 = -9\`
- \`(-9i)^2 = -81\`
- \`i^3 * i^2 = i\`
- \`8 * i * i^2 = -8i\`
- \`x^2 = -16\` -> \`x = plus or minus 4i\`
- \`x^2 + 23 = -2\` -> \`x = plus or minus 5i\`

Use the remainder after dividing the exponent by \`4\` whenever a power of \`i\` looks too large to evaluate directly.
				`.trim()
			),
			createLesson(
				"The Complex Plane",
				`
Write a complex number as \`a + bi\`. Plot it as the point \`(a, b)\`, where the horizontal axis is the real part and the vertical axis is the imaginary part.

**Representative points**

- \`3 + 2i\` -> \`(3, 2)\`
- \`-2 - 5i\` -> \`(-2, -5)\`
- \`2 - i\` -> \`(2, -1)\`
- \`-5 + 3i\` -> \`(-5, 3)\`
- \`7\` -> \`(7, 0)\`
- \`-3i\` -> \`(0, -3)\`
- \`4 - 2i\` -> \`(4, -2)\`
- \`7 + sqrt(-1)\` -> \`7 + i\`
- \`-3 - sqrt(-16)\` -> \`-3 - 4i\`
- \`7 - sqrt(25)\` -> \`2\`
- \`4 + sqrt(-9)\` -> \`4 + 3i\`
- \`4 + i^2\` -> \`3\`
- \`3 - 3i^3\` -> \`3 + 3i\`
- \`1 - (2i)^3\` -> \`1 + 8i\`
- \`3 + 3i^21\` -> \`3 + 3i\`
- \`-4 + 2i^15\` -> \`-4 - 2i\`

**Geometry on the complex plane**

- Distance from \`2 - 4i\` to \`7 + 3i\`: \`sqrt(74)\`
- Triangle with vertices \`-3 - 2i\`, \`5 + 4i\`, and \`5 - 2i\` has area \`24\`
				`.trim(),
				media.complexPlane
			),
			createLesson(
				"Operations with Complex Numbers",
				`
Add and subtract by combining real parts with real parts and imaginary parts with imaginary parts. Multiply with distribution or FOIL. Divide by multiplying numerator and denominator by the conjugate.

**Cleaned examples**

- \`(5i + 13) - (6i + 3) = 10 - i\`
- \`(4i + 9) - 5i(4i + 2) = 29 - 6i\`
- \`5i - 2(i + 3) + 4(i + i^2) = -10 + 7i\`
- \`9i - 9 + 9i^5 - 9i^3 = 27i - 9\`
- \`(2 + 4i)^2 = -12 + 16i\`
- \`(7 - 2i)(2 + 10i) = 34 + 66i\`
- \`(1 + i)^3 = -2 + 2i\`

**Structure fact**

If \`(a + bi)(a + ci)\` is real and \`a != 0\`, then \`c = -b\`, so the product becomes \`(a + bi)(a - bi) = a^2 + b^2\`.
				`.trim()
			)
		]),
		createModule("ALA2 Quadratic Functions", [
			createLesson(
				"Factoring Quadratics and Solving for Zeros",
				`
Start by moving every term to one side so the equation is in the form \`ax^2 + bx + c = 0\`. Then factor when possible.

**Quadratic-form examples**

- \`7x + 3 = 2x^2 - 1\` -> \`2x^2 - 7x - 4 = 0\`
- \`(3x + 2)(2x - 3) = 3x + 3\` -> \`6x^2 - 8x - 9 = 0\`
- \`x(4 + 3x) + 3 = 21 - 2x^2\` -> \`5x^2 + 4x - 18 = 0\`
- \`3x + 7x^2 - 3 = 7x - 4x^2 + 2\` -> \`11x^2 - 4x - 5 = 0\`

**Solving examples**

- \`(x + 2)(x - 4) = 0\` -> \`x = -2, 4\`
- \`x^2 + 4x + 4 = 0\` -> \`x = -2\`
- \`z^2 + 5z + 4 = 0\` -> \`x = -4, -1\`
- \`z^2 - 5z + 4 = 0\` -> \`x = 1, 4\`
- \`z^2 + 2z - 15 = 0\` -> \`x = -5, 3\`
- \`y^2 - 5y - 50 = 0\` -> \`x = -5, 10\`
- \`x^2 - 7x - 44 = 0\` -> \`x = -4, 11\`

**Application checks**

- Triangle with area \`12\` and base two feet longer than height: base \`6\`
- Rocket modeled by \`-4t^2 + 8t + 96\` hits the ground at \`t = 6\`
- A penny dropped from \`64\` feet reaches the ground in \`2\` seconds
				`.trim()
			),
			createLesson(
				"Special Factorizations",
				`
Two high-value patterns repeat constantly in Algebra 2:

- perfect square trinomials: \`a^2 + 2ab + b^2 = (a + b)^2\`
- difference of squares: \`a^2 - b^2 = (a + b)(a - b)\`

**Representative simplifications**

- \`(x + 4)^2 = x^2 + 8x + 16\`
- \`(y - 6)^2 = y^2 - 12y + 36\`
- \`(2x + 1)^2 = 4x^2 + 4x + 1\`
- \`(4x - 9)^2 = 16x^2 - 72x + 81\`
- \`(x - 1)(x + 1) = x^2 - 1\`
- \`(z + 12)(z - 12) = z^2 - 144\`
- \`(8x + 11)(8x - 11) = 64x^2 - 121\`

**Representative factorizations**

- \`y^2 + 6y + 9 = (y + 3)^2\`
- \`z^2 - 18z + 81 = (z - 9)^2\`
- \`16x^2 - 72x + 81 = (4x - 9)^2\`
- \`x^2 - 16 = (x + 4)(x - 4)\`
- \`4x^2 - 81 = (2x - 9)(2x + 9)\`
- \`16x^2 - 9y^2 = (4x - 3y)(4x + 3y)\`

**Application**

- \`4t^2 - 24t + 36 = 0\` factors as \`(2t - 6)^2 = 0\`, so the airplane lands at \`t = 3\`
				`.trim()
			),
			createLesson(
				"Completing the Square and the Quadratic Formula",
				`
When factoring is awkward or impossible, turn the quadratic into a perfect square or apply the quadratic formula directly.

**Completing-the-square examples**

- \`x^2 + 4x - 1 = 0\` -> \`x = -2 - sqrt(5), -2 + sqrt(5)\`
- \`y^2 - 20y + 50 = 0\` -> \`y = 10 - sqrt(50), 10 + sqrt(50)\`
- \`9y^2 - 72y + 9 = 90\` -> \`y = -1, 9\`
- \`17y^2 + 68y + 187 = 272\` -> \`y = -5, 1\`
- \`4x^2 - 32x + 5 = -50\` -> \`x = 5/2, 11/2\`

**Quadratic-formula examples**

- \`x^2 - 6x + 5 = 0\` -> \`x = 1, 5\`
- \`7z^2 - 10z + 3 = 0\` -> \`x = 3/7, 1\`
- \`5z^2 + 2z - 7 = 0\` -> \`x = -7/5, 1\`
- \`2x^2 - 11x + 9 = 0\` -> \`x = 1, 9/2\`

**Non-real roots**

- \`y^2 + 4y + 8 = 0\` -> \`y = -2 plus or minus 2i\`
- \`y^2 - 6y + 34 = 0\` -> \`y = 3 plus or minus 5i\`
- \`x^2 - x + 10 = 0\` -> \`x = (1 plus or minus i sqrt(39)) / 2\`

Use the discriminant \`b^2 - 4ac\` to tell the difference between two real roots, one repeated real root, and two non-real roots.
				`.trim()
			)
		]),
		createModule("ALA3 Graphing Quadratic Functions", [
			createLesson(
				"Vertex Form, Standard Form, and Intercept Form",
				`
Graphing is fastest when you recognize the form of the equation.

- Vertex form: \`y = a(x - h)^2 + k\`
- Standard form: \`y = ax^2 + bx + c\`
- Intercept form: \`y = a(x - r)(x - s)\`

**Recovered feature checks**

- \`y = 2(x + 5)^2 - 4\` -> vertex \`(-5, -4)\`
- \`y = -(x - 7)^2 + 5\` -> vertex \`(7, 5)\`
- \`y = (1/2)x^2 - 3\` -> vertex \`(0, -3)\`
- \`y = -(x - 9)^2\` -> vertex \`(9, 0)\`
- \`y = 5(x + 1)(x + 2)\` -> x-intercepts \`-2, -1\`
- \`y = (1/5)(x - 13)(x + 7)\` -> x-intercepts \`-7, 13\`
- \`y = x^2 + 1\` -> no real x-intercepts
- \`y = -x^2 + 1\` -> x-intercepts \`-1, 1\`

Convert between forms when one view of the parabola is easier to read than another.
				`.trim(),
				media.quadraticForms
			),
			createLesson(
				"Transformations of Parabolas",
				`
Quadratic transformations are predictable:

- \`y = ax^2\`: sign gives the opening direction, and \`|a|\` controls width
- \`(x - h)\`: horizontal shift
- \`+ k\`: vertical shift
- a negative outside the square reflects across the x-axis

**Representative descriptions**

- \`y = 2x^2\` -> up, narrower
- \`y = -12x^2\` -> down, narrower
- \`y = (1/2)x^2\` -> up, wider
- \`y = -2x^2\` -> down, narrower
- Reflect \`y = x^2\` across the x-axis -> \`y = -x^2\`
- Reflect \`y = (x - 4)^2 + 2\` across the x-axis -> \`y = -(x - 4)^2 - 2\`
- Reflect \`y = (x - 2)^2\` across the y-axis -> \`y = (-x - 2)^2\`
- Shift \`y = 2x^2 + 3\` left \`2\` -> \`y = 2(x + 2)^2 + 3\`
- Flip \`y = 2x^2 + 3\` across the x-axis and then shift up \`3\` -> \`y = -2x^2\`
- Scale \`y = 2x^2 + 3\` by \`3\`, shift left \`4\`, shift up \`2\` -> \`y = 6(x + 4)^2 + 11\`

Several original prompts in the recovered source relied on missing color-coded images. The generated comparison graph below replaces those visuals with a clean reusable reference.
				`.trim(),
				media.quadraticTransforms
			),
			createLesson(
				"Applications and Parabola Geometry",
				`
Quadratics model arcs, projectiles, and symmetric structures.

**Application answers**

- Cannonball path \`y = -(x - 4)(x - 10)\`: total horizontal distance \`6\`
- Jill's ball \`h = -4t^2 + 36t - 72\`:
  - thrown at \`t = 3\`
  - lands at \`t = 6\`
  - stays in the air \`3\` seconds
  - reaches a maximum height of \`9\` feet
- Gannet dive \`h = 2t^2 - 32t + 110\`:
  - initial height \`110\` feet
  - reaches the water at \`5\` seconds
  - stays underwater \`6\` seconds
  - returns to starting height at \`16\` seconds
  - dives \`18\` feet below sea level

**Optional advanced topic**

If the directrix is \`y = 1\` and the focus is \`(2, 3)\`, then the parabola is
\`y = (1/4)x^2 - x + 3\`.
				`.trim()
			),
			createLesson(
				"Missing Original Graph Prompts",
				`
The recovered source referenced several graph-only prompts whose original screenshots were not present:

- color-match parabola comparison questions
- a few transformation sketches with no surviving coordinates
- at least one directrix-focus reference image

Use the placeholder below anywhere those original source images are still unavailable.
				`.trim(),
				media.missingImage
			)
		]),
		createModule("Check-in #1", [
			createLesson(
				"Review Targets",
				`
Use this check-in as a guided review of the first three modules, not as a formal exam.

**Skills to revisit**

- simplifying with \`i\`
- plotting and reading complex numbers
- factoring quadratics
- completing the square
- using the quadratic formula
- graphing quadratics in multiple forms

If the student stalls, stop and reteach the specific method immediately.
				`.trim()
			),
			createLesson(
				"Representative Review Problems",
				`
**Cleaned answer-key highlights**

- \`sqrt(-25) + 4i^27 = i\`
- \`(4 - 3i)(2 - i) / (-5i) = 2 + i\`
- \`x^2 + 3x - 10 = 0\` -> \`x = -5, 2\`
- \`2x^2 - 5x - 12 = 0\` -> \`x = -3/2, 4\`
- \`x^2 - 20x + 100 = (x - 10)^2\`
- \`x^2 - 10x + 26 = 8\` -> \`x = 5 plus or minus sqrt(7)\`
- \`y = -(1/2)x^2\` -> down, wider
- \`y = -(x - 3)^2 + 5\` is the result of flipping \`y = x^2 - 5\` across the x-axis and shifting right \`3\`

Reuse the generated complex-plane and quadratic graph packs while the student explains how they found each answer.
				`.trim(),
				media.complexPlane
			)
		]),
		createModule("ALA4 Higher Degree Polynomials", [
			createLesson(
				"Polynomial Operations and Factoring",
				`
In this module, students move from quadratics to higher-degree polynomials and start tracking structure more deliberately.

**Representative skills**

- degree of \`7x - 36x^2 + 2x^7\` is \`7\`
- perimeter of a rectangle with side lengths \`2x^3 - x\` and \`7x^4 + 3x + 1\`:
  - \`14x^4 + 4x^3 + 4x + 2\`
- area of that same rectangle:
  - \`14x^7 - 7x^5 + 6x^4 + 2x^3 - 3x^2 - x\`
- grouping:
  - \`12x^4 + 2x^3 - 30x - 5 = (6x + 1)(2x^3 - 5)\`
- complete factoring:
  - \`8x^3 - 200x = 8x(x - 5)(x + 5)\`

The main upgrade here is organization: sort terms, factor out a greatest common factor first, and only then look for deeper patterns.
				`.trim()
			),
			createLesson(
				"Transformations and the Location Principle",
				`
Higher-degree polynomial graphs still respond predictably to shifts, reflections, and scaling.

**Recovered transformations**

- Reflect \`f(x) = x^5 - 2x^2 + 3\` across the y-axis:
  - \`g(x) = -x^5 - 2x^2 + 3\`
- Scale \`f(x) = 5x^4 - 3x^2 + 2\` vertically by \`3\`:
  - \`g(x) = 15x^4 - 9x^2 + 6\`
- Shift \`f(x) = x^4 + 2x - 1\` right \`1\`, down \`3\`, and reflect across the y-axis:
  - \`g(x) = (-x - 1)^4 + 2(-x - 1) - 4\`

**Location-principle example**

For \`f(x) = 2x^5 - 2x^2 - 9\` with sample values

- \`f(1) = -9\`
- \`f(2) = 47\`

there is at least one real root between \`x = 1\` and \`x = 2\` because the sign changes.
				`.trim()
			)
		]),
		createModule("ALA5 Polynomial Division", [
			createLesson(
				"Long Division and Synthetic Division",
				`
Polynomial division works best when every degree is represented, even if that means adding zero-coefficient placeholder terms.

**Recovered examples**

- \`(-9x^4 - 6x^3 + x^2 + 2) / (x + 1) = -9x^3 + 3x^2 - 2x + 2\`
- \`(x^3 + 6x^2 + 9x + 2) / (x + 2) = x^2 + 4x + 1\`
- \`(2x^4 - 3x^3 + 5x^2 + 1) / (x^2 - 1) = 2x^2 - 3x + 7 + (-3x + 8)/(x^2 - 1)\`

**Process reminder**

- arrange terms in descending powers
- include missing powers explicitly
- divide the leading term first
- multiply back and subtract
- repeat until the remainder has lower degree than the divisor

Synthetic division is the faster version when the divisor is linear and written as \`x - c\`.
				`.trim()
			)
		]),
		createModule("ALA6 Zeros of Polynomials", [
			createLesson(
				"Rational Root Theorem, Descartes, and Bounds",
				`
Finding polynomial zeros is usually a process of narrowing the search before dividing.

**Core example**

Let \`f(x) = 2x^3 - 2x^2 - 20x - 16\`.

- Possible rational roots:
  - \`plus or minus 1\`
  - \`plus or minus 1/2\`
  - \`plus or minus 2, 4, 8, 16\`
- Total roots by the Fundamental Theorem of Algebra: \`3\`
- Possible positive real roots by Descartes' Rule of Signs: at most \`1\`
- Possible negative real roots: at most \`2\`
- Actual roots: \`-2, -1, 4\`

**Additional examples**

- \`2x^3 - 7x^2 + x + 10\` -> roots \`-1, 2, 5/2\`
- \`x^4 - 9x^2 + 4x + 12\` -> roots \`-3, -1, 2\`

The goal is not to guess blindly. Use the theorem list, sign patterns, and intervals first, then divide to confirm.
				`.trim()
			)
		]),
		createModule("ALA7 Graphing Polynomials", [
			createLesson(
				"End Behavior, Turning Points, and Multiplicity",
				`
Polynomial graphs are controlled mainly by degree, leading coefficient, and zero multiplicity.

**Representative features**

- \`f(x) = -5x^5 + x^3 + 9x\`
  - as \`x -> infinity\`, \`f(x) -> -infinity\`
  - as \`x -> -infinity\`, \`f(x) -> infinity\`
  - the function is odd
- A graph with turning points at \`(-1, 1/2)\`, \`(0, 2)\`, and \`(1, 1/2)\` has
  - domain \`(-infinity, infinity)\`
  - range \`[1/2, infinity)\`

**Sketch logic**

- odd degree + positive leading coefficient -> falls left, rises right
- odd degree + negative leading coefficient -> rises left, falls right
- even degree + positive leading coefficient -> rises on both ends
- even degree + negative leading coefficient -> falls on both ends
- odd multiplicity crosses the x-axis
- even multiplicity touches and bounces
				`.trim(),
				media.polynomialBehavior
			),
			createLesson(
				"Feature-Based Graphing",
				`
Sometimes the recovered source gives graph features instead of a full equation. That still tells you a lot.

**Example sketch prompt**

Build a graph with:

- positive leading coefficient
- odd degree
- roots at \`-2\`, \`1\`, and \`6\`
- y-intercept \`(0, 3)\`
- local max near \`(-3/2, 4)\`
- local min near \`(4, -9)\`

That feature set forces a graph that crosses the x-axis three times, rises to the right, and includes at least two turning points. The generated polynomial-behavior graphic is meant to replace several missing original sketches of exactly this kind.
				`.trim(),
				media.polynomialBehavior
			)
		]),
		createModule("Check-in #2", [
			createLesson(
				"Review Targets",
				`
This check-in revisits higher-degree polynomial skills rather than introducing new theory.

**Focus areas**

- degree and leading-term identification
- factoring with grouping and difference of squares
- long division and synthetic division
- rational-root screening
- graph sketches from end behavior and zeros

Treat the results as planning data for the next few sessions.
				`.trim()
			),
			createLesson(
				"Representative Review Problems",
				`
**Cleaned answer-key highlights**

- Degree of \`7x - 36x^2 + 2x^7\` -> \`7\`
- \`12x^4 + 2x^3 - 30x - 5 = (6x + 1)(2x^3 - 5)\`
- \`8x^3 - 200x = 8x(x - 5)(x + 5)\`
- \`(-9x^4 - 6x^3 + x^2 + 2) / (x + 1) = -9x^3 + 3x^2 - 2x + 2\`
- \`2x^3 - 2x^2 - 20x - 16\` has roots \`-2, -1, 4\`
- Reflecting \`x^3 - 2x + 1\` across the y-axis gives \`-x^3 + 2x + 1\`
- Reflecting the same function across the x-axis gives \`-x^3 + 2x - 1\`

Use the generated graph pack anywhere the original check-in referenced a missing sketch or color-coded polynomial graph.
				`.trim(),
				media.polynomialBehavior
			)
		]),
		createModule("ALA8 Rational Functions", [
			createLesson(
				"Asymptotes and Removable Discontinuities",
				`
Rational functions can have two kinds of breaks:

- vertical asymptotes, caused by denominator zeros that do not cancel
- removable discontinuities, caused by common factors that do cancel

**Cleaned examples**

- \`[(x - 1)(x + 4)] / [(x - 1)(x - 2)]\` -> removable discontinuity at \`x = 1\`
- \`(x^2 - 4) / [(x - 2)(x + 2)]\` -> removable discontinuities at \`x = -2, 2\`
- \`(3x^2 + 5x - 12) / (x^2 - 9)\` -> removable discontinuity at \`x = -3\`
- \`(x + 3)(x - 9) / (x + 3)\` -> hole at \`x = -3\`, graph behaves like \`y = x - 9\` except for the missing point

**Horizontal asymptote rules**

- numerator degree smaller than denominator degree -> \`y = 0\`
- equal degrees -> ratio of leading coefficients
- numerator degree larger -> no horizontal asymptote

Always factor first. It is the fastest way to tell a hole from an asymptote.
				`.trim(),
				media.rationalFunctions
			),
			createLesson(
				"Graphing and Roots of Rational Functions",
				`
To find a rational root, set the numerator equal to zero and then reject any value that also makes the denominator zero.

**Representative examples**

- \`(x^2 - 1)/(x^2 - 3x - 4)\`
  - numerator zeros: \`-1, 1\`
  - denominator zeros: \`-1, 4\`
  - valid real root: \`1\`
- \`(x - 2)/(x^2 + 4)\`
  - denominator never reaches zero
  - real root: \`2\`
- \`(3x^2 - 21)/(5x^2 - 35x)\`
  - numerator zeros: \`plus or minus sqrt(7)\`
  - denominator zeros: \`0, 7\`
  - valid roots: \`plus or minus sqrt(7)\`

**Application**

If a basketball player has made \`7\` of the last \`13\` shots, their updated average after making \`x\` more shots is
\`(7 + x)/(13 + x)\`.

To reach \`70%\`, solve
\`(7 + x)/(13 + x) = 0.7\`,
which gives \`x = 7\`.
				`.trim(),
				media.rationalFunctions
			),
			createLesson(
				"Missing Original Rational Graphs",
				`
Some recovered rational-function prompts depended on screenshots that were not preserved, including a few graph-reading exercises with asymptotes, holes, and range questions.

Use the generated rational-function gallery when a clean replacement is enough, and fall back to the placeholder below when the original graph cannot be reconstructed from the text alone.
				`.trim(),
				media.missingImage
			)
		]),
		createModule("ALA9 Rational Function Operations", [
			createLesson(
				"Multiplying, Dividing, and Simplifying Rational Expressions",
				`
Factor first, then cancel common factors, then multiply or divide.

**Representative simplifications**

- \`(6x^3 - 12x)/(3x^2) = 2(x^2 - 2)/x\`
- \`(x^2 + 4x + 3)/(x^2 - 3x - 18) = (x + 1)/(x - 6)\`
- \`(x^3 + 5x^2 - 14x)/(x^2 - 3x + 2) = x(x + 7)/(x - 1)\`
- \`(a^2 - 4)/(4a^2 - 1)\` divided by \`(a - 2)/(2a - 1)\` simplifies to \`(a + 2)/(2a + 1)\`

**Representative products and quotients**

- \`z/(z^2 - 16) * (z^2 - z - 12)/(z^2 - 4z) = (z + 3)/(z^2 - 16)\`
- \`(2x + 6)/(x^2 - 16) * (x - 4)/(x + 3) = 2/(x + 4)\`
- \`(y^2 + 2y - 8)/15\` divided by \`(y - 2)/(5y)\` simplifies to \`y(y + 4)/3\`
- \`(x^2 - 10x + 25)/(x^2 - 16)\` divided by \`(x^2 - 3x - 10)/(3x - 12)\` simplifies to \`3(x - 5)/[(x + 4)(x + 2)]\`

**Application**

Triangle area with

- base \`(x^2 - 9)/(x^2 + 13x + 12)\`
- height \`(x^2 - 3x - 4)/(x - 3)\`

becomes
\`[(x - 4)(x + 3)] / [2(x + 12)]\`
after factoring and canceling.
				`.trim()
			),
			createLesson(
				"Adding, Subtracting, and Solving Rational Equations",
				`
For addition and subtraction, find a least common denominator first. For equations, multiply every term by the LCD and then check for excluded values.

**Representative equation solves**

- \`(x + 1)/6 = (x - 1)/9\` -> \`x = -5\`
- \`(x - 3)/(x + 3) = (x + 2)/(x - 1)\` -> \`x = -1/3\`
- \`1/x + 1/2 = 3/4\` -> \`x = 4\`
- \`1 - 3/(x + 1) = 1/4\` -> \`x = 3\`

**Mixture model**

\`0.03 = (4 + 0.01x)/(100 + x)\`

means \`x = 50\`, so adding \`50\` milliliters of the \`1%\` solution brings \`100\` milliliters of \`4%\` solution down to \`3%\`.

**Average-grade model**

If Penny starts with one \`60%\` test and then scores \`90%\` on each new test, solve
\`(60 + 90x)/(x + 1) = 80\`
to get \`x = 2\`.
				`.trim()
			)
		]),
		createModule("ALA10 Radical Functions", [
			createLesson(
				"Graphing Radical Functions",
				`
Even roots and odd roots behave differently.

- \`sqrt(x)\`, \`x^(1/4)\`, and other even-root functions require a nonnegative radicand
- \`x^(1/3)\`, \`x^(1/5)\`, and other odd-root functions accept all real inputs

**Domain and range examples**

- \`y = sqrt(x - 2)\` -> domain \`x >= 2\`, range \`y >= 0\`
- \`y = -2sqrt(10 - 2x)\` -> domain \`x <= 5\`, range \`y <= 0\`
- \`y = 4 + sqrt(x - 3)\` -> domain \`x >= 3\`, range \`y >= 4\`
- \`y = sqrt(x + 3) - 5\` -> domain \`x >= -3\`, range \`y >= -5\`
- \`y = x^(1/7)\` -> domain all real numbers, range all real numbers

**Comparison fact**

\`x^(1/3)\` and \`x^(1/5)\` have the same domain and range, but the \`1/5\` power grows more slowly for large positive \`x\`.
				`.trim(),
				media.radicalFunctions
			),
			createLesson(
				"Solving Radical Equations",
				`
Isolate the radical, square or raise both sides carefully, and always check for extraneous solutions.

**Representative solves**

- \`sqrt(x + 2) = 5\` -> \`x = 23\`
- \`sqrt(x) = sqrt(1 - x)\` -> \`x = 1/2\`
- \`sqrt(x) + 1 = -sqrt(x)\` -> no solution
- \`3sqrt(x - 4) = sqrt(x)\` -> \`x = 9/2\`
- \`sqrt(x + 1) = sqrt(2x) - 1\` -> \`x = 8\`
- \`2sqrt(x + 2) = 4sqrt(x - 3)\` -> \`x = 14/3\`
- \`x^(1/3) = x^(1/5)\` -> \`x = -1, 0, 1\`

The last step matters: many radical equations create extra algebraic answers that do not satisfy the original domain restrictions.
				`.trim(),
				media.radicalFunctions
			)
		]),
		createModule("ALA11 Piecewise Functions", [
			createLesson(
				"Evaluating and Graphing Piecewise Functions",
				`
A piecewise function changes its rule depending on the input interval.

**Representative evaluations**

- \`f(x) = { x - 1 if x < 0; 3x if x >= 0 }\`
  - \`f(0) = 0\`
  - \`f(1) = 3\`
  - \`f(2) = 6\`
- \`f(x) = { x^2 if x <= 1; 1 if x > 1 }\`
  - \`f(0) = 0\`
  - \`f(1) = 1\`
  - \`f(2) = 1\`
- \`f(x) = { -5 if x <= -1; -x^2 - 4 if x > -1 }\`
  - \`f(0) = -4\`
  - \`f(1) = -5\`
  - \`f(2) = -8\`

**Step-function reminder**

- floor rounds down
- ceiling rounds up
- both have domain all real numbers and range all integers
				`.trim(),
				media.piecewiseFunctions
			),
			createLesson(
				"Piecewise Models and Continuity",
				`
Piecewise functions show up naturally in pricing and pay-rate problems.

**Representative models**

- Alex's pay:
  - \`A(x) = 30x\` for \`0 <= x <= 40\`
  - \`A(x) = 50x - 800\` for \`x > 40\`
- Barbara's pay:
  - \`B(x) = 22x\` for \`0 <= x <= 20\`
  - \`B(x) = 40x - 360\` for \`20 < x <= 30\`
  - \`B(x) = 60x - 960\` for \`x > 30\`
- Candy bags:
  - \`C(x) = 3.50x\` for \`x < 5\`
  - \`C(x) = 2.75x\` for \`x >= 5\`
  - spending \`22\` dollars means \`8\` bags
- Xavier's overtime:
  - \`f(x) = 10.50x\` for \`x <= 20\`
  - \`f(x) = 15.75x - 105\` for \`x > 20\`
  - earning \`257.25\` means \`23\` hours

**Continuity example**

For
\`f(x) = { x^2 + 2c if x <= 3; 2cx + 1 if x > 3 }\`,
continuity at \`x = 3\` requires \`2c + 9 = 6c + 1\`, so \`c = 2\`.
				`.trim(),
				media.piecewiseFunctions
			)
		]),
		createModule("Check-in #3", [
			createLesson(
				"Review Targets",
				`
This check-in closes the course by revisiting rational functions, rational operations, radical equations, and piecewise models.

**Instructor stance**

- let the student try the question independently first
- guide before reteaching
- use the results to decide whether to spiral back or move on
				`.trim()
			),
			createLesson(
				"Representative Review Problems",
				`
**Cleaned answer-key highlights**

- An asymptote is a line the graph approaches but does not reach within the function's defined behavior
- For \`f(x) = (x - 2)/(4x + 1)\`:
  - vertical asymptote \`x = -1/4\`
  - horizontal asymptote \`y = 1/4\`
- For \`[(x^2 - 3x - 10)] / [(x^2 - 4x - 5)]\`:
  - removable discontinuity \`x = 5\`
- For \`(x^2 - x - 2)/(x^2 - 4)\`:
  - valid real root \`x = -1\`
- \`sqrt(x + 1) = sqrt(2x) - 1\` -> \`x = 8\`
- Candy pricing check-in:
  - \`C(x) = 3.50x\` for \`x < 5\`
  - \`C(x) = 2.75x\` for \`x >= 5\`
  - \`22\` dollars means \`8\` bags

Reuse the generated rational, radical, and piecewise visuals for the review whenever the original graph in the recovered source was missing or corrupted.
				`.trim(),
				media.rationalFunctions
			),
			createLesson(
				"Missing Check-In Visuals",
				`
Several surviving check-in prompts still refer to screenshots that do not exist in the recovered source package:

- one rational-function graph with multiple asymptotes and a hole
- at least one piecewise graph-definition prompt
- one floor-function transformation sketch

Use the placeholder below whenever those original references are still unavailable.
				`.trim(),
				media.missingImage
			)
		])
	]
};
