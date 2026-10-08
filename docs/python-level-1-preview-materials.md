# Python Level 1 result-preview material request

Status: **To do when matching, publishable GIF/video files are provided.**
This is a maintainer checklist, not a student-facing placeholder page. It does
not claim the missing previews are implemented.

## What is already available

The course reader already supports inline GIF/image and MP4/WebM result previews.
The public Python Level 1 course currently has no result-media mappings. The
reviewed Python IDE assets archive contains drawing/game sprites and audio, not
these lesson-result recordings.

The historical reservation list in commit `f96936b4` named 75 original files.
All 75 returned HTTP 404 on `static.cs.avasan.org` when checked on October 7,
2026 (New York time). Descriptive filename leads below are retained only to help
locate the original material. They are not published links, proof of ownership,
or verified matches for the current classroom lesson. Avoid guessing mappings
from old module numbers or filenames such as `project_1.mp4`.

## Provide this with each file

- The **stable lesson ID** from the inventory below, the original filename, and
  the actual GIF, MP4 (H.264), or WebM file. A file or download we are permitted
  to obtain is required; a screenshot of a missing link is not enough.
- Creator, source URL or original source/project identifier, and the license or
  written permission allowing hosting and display on Julio's public classroom
  site. Public availability alone is not redistribution permission.
- A short text description of the visible result and controls. For an
  interactive project, demonstrate the input, visible response, and reset or
  replay. For a drawing, show the construction and the finished drawing.
- The current starter/project revision used to make the recording, so the
  result can be compared with the actual lesson. Do not send a different
  project's recording merely because its title or appearance is similar.
- Confirmation that the recording contains no student identity, faces, voices,
  login/account information, private projects, or teacher-only solution code.
  Show the result canvas and necessary controls, not the solution editor.

A clean original recording of the current project is acceptable. Third-party
source videos need their own reuse clearance. If sound is necessary, provide
licensed audio and a text equivalent. A poster image is optional.

## Priority and acceptance

1. Supply the nine **Launch Project** recordings first, especially Color Circle
   Art and Picasso Keyboard Painter. Show the completed Normal result; label
   any Hard addition separately so pupils can distinguish required work from
   an optional challenge.
2. Supply the remaining required/core projects, then the choice and challenge
   examples. Files may be delivered and accepted in batches.
3. Open-ended projects, Master Project, and Launch Remix recordings should be
   labeled **one possible example**, not presented as the only correct result.
   Written recaps, reflections, and presentations do not need fabricated
   animation previews.

After a file is provided, a maintainer must:

- Verify its source/permission and privacy clearance, inspect the complete
  recording, and compare it with the current lesson's required result.
- Record the creator, source, permission, file checksum, short description,
  and stable lesson ID in the media provenance record.
- Place the approved file on the existing classroom static host or approved
  local asset path; verify real bytes, HTTP 200, and the correct MIME type.
- Set `mediaLink` on **that exact lesson**, then run the static-media audit
  and the repository's required checks. A host-only upload is a later
  server-AI task; do not attempt SSH or bypass the timer-managed deployment.
- Check the rendered preview on desktop and phone, including loading failure
  and reduced-motion behavior. GIFs need a non-animated alternative or a
  controllable video equivalent for reduced-motion use.
- Remove the lesson from the deferred list only after its deployed preview
  matches the approved recording and is browser-verified.

Do not add dead URLs, unrelated stock animations, or empty public cards while
waiting. The missing material blocks publication of the preview, not anonymous
course browsing or IDE use.

## Exact current inventory

The following 100 project/remix lessons need matching result material.
IDs come from `front-end/scripts/python-level-1-preview-requirements.ts` and
retain the original GrS identifiers even when the public course is named
Classroom Edition. Historical names are search leads only; "New recording
needed" is not a request to reuse another lesson's preview. This inventory
tracks material awaiting a source mapping, not deployed acceptance: the helper
removes a request after its approved `mediaLink` is mapped, but the completion
ledger must remain unverified until deployment and browser checks pass.
Regenerate this table and run the inventory test when adding a preview.

### Classroom Launch: Normal and Hard Projects

| Lesson                                     | Stable lesson ID                                                                                                          | Historical filename lead |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Launch Project 1: Color Circle Art         | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-1-color-circle-art`         | New recording needed     |
| Launch Project 2: Picasso Keyboard Painter | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-2-picasso-keyboard-painter` | New recording needed     |
| Launch Project 3: Triangle Motion          | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-3-triangle-motion`          | New recording needed     |
| Launch Project 4: Neon Trail Painter       | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-4-neon-trail-painter`       | New recording needed     |
| Launch Project 5: Firework Festival        | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-5-firework-festival`        | New recording needed     |
| Launch Project 6: Spiral Galaxy            | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-6-spiral-galaxy`            | New recording needed     |
| Launch Project 7: Turtle Race Day          | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-7-turtle-race-day`          | New recording needed     |
| Launch Project 8: Flower Garden Clicker    | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-8-flower-garden-clicker`    | New recording needed     |
| Launch Project 9: Maze Explorer            | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-9-maze-explorer`            | New recording needed     |
| Launch Remix: Palette and Theme            | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-supplemental-launch-remix-palette-and-theme`          | New recording needed     |
| Launch Remix: Controls and Feedback        | `python-level-1-classroom-classroom-launch-normal-and-hard-projects-supplemental-launch-remix-controls-and-feedback`      | New recording needed     |

### GrS1 Coordinates and Movement

| Lesson                                                             | Stable lesson ID                                                                                                            | Historical filename lead         |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| GrS1 Project 1: Turtle Exploration                                 | `python-level-1-grs1-coordinates-and-movement-curriculum-grs1-project-1-turtle-exploration`                                 | `grs1_turtle_exploration(1).mp4` |
| GrS1 Supplemental Project 2: Open Ended Project - Create a Drawing | `python-level-1-grs1-coordinates-and-movement-supplemental-grs1-supplemental-project-2-open-ended-project-create-a-drawing` | New recording needed             |

### GrS2 Loops

| Lesson                                                  | Stable lesson ID                                                                            | Historical filename lead           |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| GrS2 Project 1: Basic Shapes                            | `python-level-1-grs2-loops-curriculum-grs2-project-1-basic-shapes`                          | `grs2_basic_shapes.mp4`            |
| GrS2 Project 2: Smiley Face                             | `python-level-1-grs2-loops-curriculum-grs2-project-2-smiley-face`                           | `grs2_smiley_face.mp4`             |
| GrS2 Project 3: Open Ended Project - Drawing with Loops | `python-level-1-grs2-loops-curriculum-grs2-project-3-open-ended-project-drawing-with-loops` | New recording needed               |
| GrS2 Supplemental Project 1: More Shapes                | `python-level-1-grs2-loops-supplemental-grs2-supplemental-project-1-more-shapes`            | `grs2_more_shapes.mp4`             |
| GrS2 Supplemental Project 2: Bullseye                   | `python-level-1-grs2-loops-supplemental-grs2-supplemental-project-2-bullseye`               | `grs2_bullseye.mp4`                |
| GrS2 Supplemental Project 3: Watermelon Slice           | `python-level-1-grs2-loops-supplemental-grs2-supplemental-project-3-watermelon-slice`       | `grs2_watermelon_slice.mp4`        |
| GrS2 Supplemental Project 4: Taxi                       | `python-level-1-grs2-loops-supplemental-grs2-supplemental-project-4-taxi`                   | `grs2_taxi.mp4`                    |
| GrS2 Supplemental Project 5: Captain America Shield     | `python-level-1-grs2-loops-supplemental-grs2-supplemental-project-5-captain-america-shield` | `grs2_captain_american_shield.mp4` |
| GrS2 Supplemental Project 6: Minion                     | `python-level-1-grs2-loops-supplemental-grs2-supplemental-project-6-minion`                 | `grs2_minion.mp4`                  |

### GrS3 Variables and Random Numbers

| Lesson                                                              | Stable lesson ID                                                                                                                 | Historical filename lead      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| GrS3 Project 1: Awesome Angles                                      | `python-level-1-grs3-variables-and-random-numbers-curriculum-grs3-project-1-awesome-angles`                                      | `grs3_awesome_angles.mp4`     |
| GrS3 Project 2: Surprise Me Square                                  | `python-level-1-grs3-variables-and-random-numbers-curriculum-grs3-project-2-surprise-me-square`                                  | `grs3_surprise_me_square.mp4` |
| GrS3 Guided Project: User Input Shape Designer                      | `python-level-1-grs3-variables-and-random-numbers-curriculum-grs3-guided-project-user-input-shape-designer`                      | New recording needed          |
| GrS3 Project 3: Random Walk                                         | `python-level-1-grs3-variables-and-random-numbers-curriculum-grs3-project-3-random-walk`                                         | `grs3_random_walk.mp4`        |
| GrS3 Supplemental Project 1: Random Bowtie                          | `python-level-1-grs3-variables-and-random-numbers-supplemental-grs3-supplemental-project-1-random-bowtie`                        | `grs3_random_bowtie.mp4`      |
| GrS3 Supplemental Project 2: Debugging Practice                     | `python-level-1-grs3-variables-and-random-numbers-supplemental-grs3-supplemental-project-2-debugging-practice`                   | New recording needed          |
| GrS3 Supplemental Project 4: Open Ended Project - Haphazard Artwork | `python-level-1-grs3-variables-and-random-numbers-supplemental-grs3-supplemental-project-4-open-ended-project-haphazard-artwork` | New recording needed          |

### GrS4 Conditionals Part 1

| Lesson                                                            | Stable lesson ID                                                                                                      | Historical filename lead                   |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| GrS4 Project 1: Surprise Shape                                    | `python-level-1-grs4-conditionals-part-1-curriculum-grs4-project-1-surprise-shape`                                    | `grs9_surprise_shape.gif`                  |
| GrS4 Project 2: Find Your Turtle                                  | `python-level-1-grs4-conditionals-part-1-curriculum-grs4-project-2-find-your-turtle`                                  | `grs4_find_your_turtle.mp4`                |
| GrS4 Supplemental Project 1: Navigating the Coordinate Plane      | `python-level-1-grs4-conditionals-part-1-supplemental-grs4-supplemental-project-1-navigating-the-coordinate-plane`    | `grs4_navigating_the_coordinate_plane.mp4` |
| GrS4 Supplemental Project 2: Open Ended Project - Boolean Bonanza | `python-level-1-grs4-conditionals-part-1-supplemental-grs4-supplemental-project-2-open-ended-project-boolean-bonanza` | New recording needed                       |

### Check-In #1

| Lesson                                   | Stable lesson ID                                                              | Historical filename lead |
| ---------------------------------------- | ----------------------------------------------------------------------------- | ------------------------ |
| Check-In #1: Additional Practice Project | `python-level-1-check-in-1-curriculum-check-in-1-additional-practice-project` | New recording needed     |

### GrS5 Loops with Variables

| Lesson                                          | Stable lesson ID                                                                                       | Historical filename lead       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ |
| GrS5 Project 1: Fireworks                       | `python-level-1-grs5-loops-with-variables-curriculum-grs5-project-1-fireworks`                         | `grs4_fireworks.mp4`           |
| GrS5 Project 2: While Loops Exploration         | `python-level-1-grs5-loops-with-variables-curriculum-grs5-project-2-while-loops-exploration`           | `WhileLoopsExploration(1).mp4` |
| GrS5 Project 3: Square Spiral                   | `python-level-1-grs5-loops-with-variables-curriculum-grs5-project-3-square-spiral`                     | `grs5_square_spiral.mp4`       |
| GrS5 Supplemental Project 1: Rainbow Ninja Star | `python-level-1-grs5-loops-with-variables-supplemental-grs5-supplemental-project-1-rainbow-ninja-star` | `grs4_rainbow_ninja_star.mp4`  |
| GrS5 Supplemental Project 2: Into the Void      | `python-level-1-grs5-loops-with-variables-supplemental-grs5-supplemental-project-2-into-the-void`      | `grs4_into_the_void.mp4`       |
| GrS5 Supplemental Project 3: Out of the Void    | `python-level-1-grs5-loops-with-variables-supplemental-grs5-supplemental-project-3-out-of-the-void`    | `grs4_out_of_the_void.mp4`     |
| GrS5 Supplemental Project 4: Turtle Race        | `python-level-1-grs5-loops-with-variables-supplemental-grs5-supplemental-project-4-turtle-race`        | `grs9_turtle_race.gif`         |

### GrS6 Nested Loops Part 1

| Lesson                                                   | Stable lesson ID                                                                                            | Historical filename lead            |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| GrS6 Project 1: Nested Loops Exploration                 | `python-level-1-grs6-nested-loops-part-1-curriculum-grs6-project-1-nested-loops-exploration`                | New recording needed                |
| GrS6 Project 2: Square Inception                         | `python-level-1-grs6-nested-loops-part-1-curriculum-grs6-project-2-square-inception`                        | `grs5_square_inception.mp4`         |
| GrS6 Project 3: Open Ended Project - Nested Loop Pattern | `python-level-1-grs6-nested-loops-part-1-curriculum-grs6-project-3-open-ended-project-nested-loop-pattern`  | New recording needed                |
| GrS6 Supplemental Project 1: Pyramid                     | `python-level-1-grs6-nested-loops-part-1-supplemental-grs6-supplemental-project-1-pyramid`                  | `grs5_pyramid.mp4`                  |
| GrS6 Supplemental Project 2: Reverse Pyramid             | `python-level-1-grs6-nested-loops-part-1-supplemental-grs6-supplemental-project-2-reverse-pyramid`          | `grs5_reverse_pyramid.mp4`          |
| GrS6 Supplemental Project 3: Reverse Square Inception    | `python-level-1-grs6-nested-loops-part-1-supplemental-grs6-supplemental-project-3-reverse-square-inception` | `grs5_reverse_square_inception.mp4` |
| GrS6 Supplemental Project 4: Rainbow Flower              | `python-level-1-grs6-nested-loops-part-1-supplemental-grs6-supplemental-project-4-rainbow-flower`           | `grs5_rainbow_flower.mp4`           |
| GrS6 Supplemental Project 5: Circle of Circles           | `python-level-1-grs6-nested-loops-part-1-supplemental-grs6-supplemental-project-5-circle-of-circles`        | `grs5_circle_of_circles.mp4`        |
| GrS6 Supplemental Project 6: Spirals                     | `python-level-1-grs6-nested-loops-part-1-supplemental-grs6-supplemental-project-6-spirals`                  | `grs1_spirals.mp4`                  |

### GrS7 Functions Part 1

| Lesson                                                                   | Stable lesson ID                                                                                                          | Historical filename lead          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| GrS7 Project 1: Build a Neighborhood                                     | `python-level-1-grs7-functions-part-1-curriculum-grs7-project-1-build-a-neighborhood`                                     | New recording needed              |
| GrS7 Project 2: Basic Functions                                          | `python-level-1-grs7-functions-part-1-curriculum-grs7-project-2-basic-functions`                                          | New recording needed              |
| GrS7 Supplemental Project 1: Open Ended Project - Make Your Own Function | `python-level-1-grs7-functions-part-1-supplemental-grs7-supplemental-project-1-open-ended-project-make-your-own-function` | New recording needed              |
| GrS7 Supplemental Project 2: Randomly Random Shapes                      | `python-level-1-grs7-functions-part-1-supplemental-grs7-supplemental-project-2-randomly-random-shapes`                    | `grs6_randomly_random_shapes.mp4` |

### GrS8 Event Listeners

| Lesson                                                                | Stable lesson ID                                                                                                      | Historical filename lead  |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| GrS8 Project 1: Event Listener Discovery                              | `python-level-1-grs8-event-listeners-curriculum-grs8-project-1-event-listener-discovery`                              | New recording needed      |
| GrS8 Project 2: Etch A Sketch                                         | `python-level-1-grs8-event-listeners-curriculum-grs8-project-2-etch-a-sketch`                                         | `grs8_etch_a_sketch.gif`  |
| GrS8 Project 3: Picasso Game                                          | `python-level-1-grs8-event-listeners-curriculum-grs8-project-3-picasso-game`                                          | `grs8_picasso_game.gif`   |
| GrS8 Supplemental Project 1: Polka Dot Game                           | `python-level-1-grs8-event-listeners-supplemental-grs8-supplemental-project-1-polka-dot-game`                         | `grs8_polka_dot_game.gif` |
| GrS8 Supplemental Project 2: Fruit Stand                              | `python-level-1-grs8-event-listeners-supplemental-grs8-supplemental-project-2-fruit-stand`                            | `grs8_fruit_stand.gif`    |
| GrS8 Supplemental Project 3: Open Ended Project - Interactive Drawing | `python-level-1-grs8-event-listeners-supplemental-grs8-supplemental-project-3-open-ended-project-interactive-drawing` | New recording needed      |

### Check-In #2

| Lesson                                   | Stable lesson ID                                                              | Historical filename lead |
| ---------------------------------------- | ----------------------------------------------------------------------------- | ------------------------ |
| Check-In #2: Additional Practice Project | `python-level-1-check-in-2-curriculum-check-in-2-additional-practice-project` | New recording needed     |

### GrS9 Functions Part 2

| Lesson                                                       | Stable lesson ID                                                                                                | Historical filename lead                   |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| GrS9 Project 1: Build a Snowman                              | `python-level-1-grs9-functions-part-2-curriculum-grs9-project-1-build-a-snowman`                                | New recording needed                       |
| GrS9 Project 2: More Functions                               | `python-level-1-grs9-functions-part-2-curriculum-grs9-project-2-more-functions`                                 | New recording needed                       |
| GrS9 Project 3: Polka Dots                                   | `python-level-1-grs9-functions-part-2-curriculum-grs9-project-3-polka-dots`                                     | `grs9_polkadots.mp4`                       |
| GrS9 Project 4: Click and Draw Rectangles                    | `python-level-1-grs9-functions-part-2-curriculum-grs9-project-4-click-and-draw-rectangles`                      | New recording needed                       |
| GrS9 Supplemental Project 1: Any Shape Staircase             | `python-level-1-grs9-functions-part-2-supplemental-grs9-supplemental-project-1-any-shape-staircase`             | `grs7_any_shape_staircase.mp4`             |
| GrS9 Supplemental Project 2: Debugging Functions             | `python-level-1-grs9-functions-part-2-supplemental-grs9-supplemental-project-2-debugging-functions`             | `grs7_debugging_functions.mp4`             |
| GrS9 Supplemental Project 3: Pyramid with Functions          | `python-level-1-grs9-functions-part-2-supplemental-grs9-supplemental-project-3-pyramid-with-functions`          | New recording needed                       |
| GrS9 Supplemental Project 4: Square Inception with Functions | `python-level-1-grs9-functions-part-2-supplemental-grs9-supplemental-project-4-square-inception-with-functions` | `grs7_square_inception_with_functions.mp4` |

### GrS10 Nested Loops Part 2

| Lesson                                         | Stable lesson ID                                                                                      | Historical filename lead            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------- |
| GrS10 Project 1: Rainbow Square Inception      | `python-level-1-grs10-nested-loops-part-2-curriculum-grs10-project-1-rainbow-square-inception`        | `grs6_rainbow_square_inception.mp4` |
| GrS10 Project 2: Snowflake                     | `python-level-1-grs10-nested-loops-part-2-curriculum-grs10-project-2-snowflake`                       | `grs6_snowflake.mp4`                |
| GrS10 Project 3: Winter Wonderland             | `python-level-1-grs10-nested-loops-part-2-curriculum-grs10-project-3-winter-wonderland`               | `grs7_winter_wonderland.gif`        |
| GrS10 Supplemental Project 1: Spiral Staircase | `python-level-1-grs10-nested-loops-part-2-supplemental-grs10-supplemental-project-1-spiral-staircase` | `grs6_spiral_staircase.mp4`         |
| GrS10 Supplemental Project 2: Dizzy Hexagon    | `python-level-1-grs10-nested-loops-part-2-supplemental-grs10-supplemental-project-2-dizzy-hexagon`    | `grs6_dizzy_hexagon.mp4`            |
| GrS10 Supplemental Project 3: Dot Grid         | `python-level-1-grs10-nested-loops-part-2-supplemental-grs10-supplemental-project-3-dot-grid`         | New recording needed                |

### GrS11 Conditionals Part 2

| Lesson                                                   | Stable lesson ID                                                                                                | Historical filename lead |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------ |
| GrS11 Project 1: Advanced Conditionals Exploration       | `python-level-1-grs11-conditionals-part-2-curriculum-grs11-project-1-advanced-conditionals-exploration`         | New recording needed     |
| GrS11 Project 2: Random Age                              | `python-level-1-grs11-conditionals-part-2-curriculum-grs11-project-2-random-age`                                | `grs9_random_age.gif`    |
| GrS11 Supplemental Project 1: Turtle Launch              | `python-level-1-grs11-conditionals-part-2-supplemental-grs11-supplemental-project-1-turtle-launch`              | `grs9_turtle_launch.gif` |
| GrS11 Supplemental Project 2: Bullseye with Nested Loops | `python-level-1-grs11-conditionals-part-2-supplemental-grs11-supplemental-project-2-bullseye-with-nested-loops` | New recording needed     |

### GrS12 Lists

| Lesson                                                 | Stable lesson ID                                                                                | Historical filename lead             |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------ |
| GrS12 Project 1: List Exploration                      | `python-level-1-grs12-lists-curriculum-grs12-project-1-list-exploration`                        | `grs12_list_exploration.mp4`         |
| GrS12 Project 2: Which Way Turtles                     | `python-level-1-grs12-lists-curriculum-grs12-project-2-which-way-turtles`                       | `grs10_which_way_turtles.gif`        |
| GrS12 Project 3: Random Number Lists                   | `python-level-1-grs12-lists-curriculum-grs12-project-3-random-number-lists`                     | `grs10_random_number_lists.gif`      |
| GrS12 Supplemental Project 1: Turtle Launch with Lists | `python-level-1-grs12-lists-supplemental-grs12-supplemental-project-1-turtle-launch-with-lists` | `grs10_turtle_launch_with_lists.gif` |
| GrS12 Supplemental Project 2: Rainbow Path             | `python-level-1-grs12-lists-supplemental-grs12-supplemental-project-2-rainbow-path`             | `grs10_rainbow_path.gif`             |
| GrS12 Supplemental Project 3: Debugging Lists          | `python-level-1-grs12-lists-supplemental-grs12-supplemental-project-3-debugging-lists`          | New recording needed                 |

### GrS13 Game Mechanics

| Lesson                                        | Stable lesson ID                                                                                | Historical filename lead     |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------- |
| GrS13 Project 1: Perpetual Motion             | `python-level-1-grs13-game-mechanics-curriculum-grs13-project-1-perpetual-motion`               | `grs13_perpetual_motion.mp4` |
| GrS13 Project 2: Stay Inbounds                | `python-level-1-grs13-game-mechanics-curriculum-grs13-project-2-stay-inbounds`                  | `grs11_stay_inbounds.gif`    |
| GrS13 Project 3: Fluid Motion                 | `python-level-1-grs13-game-mechanics-curriculum-grs13-project-3-fluid-motion`                   | `grs13_fluid_motion.mp4`     |
| GrS13 Project 4: Bouncy Ball Room             | `python-level-1-grs13-game-mechanics-curriculum-grs13-project-4-bouncy-ball-room`               | `grs10_bouncy_ball_room.gif` |
| GrS13 Project 5: Turtle Collision             | `python-level-1-grs13-game-mechanics-curriculum-grs13-project-5-turtle-collision`               | `grs11_turtle_collision.gif` |
| GrS13 Supplemental Project 1: Light the Stars | `python-level-1-grs13-game-mechanics-supplemental-grs13-supplemental-project-1-light-the-stars` | `grs11_light_the_stars.gif`  |
| GrS13 Supplemental Project 2: Dodgeball       | `python-level-1-grs13-game-mechanics-supplemental-grs13-supplemental-project-2-dodgeball`       | `grs13_dodgeball.mp4`        |

### Check-In #3

| Lesson                                   | Stable lesson ID                                                              | Historical filename lead |
| ---------------------------------------- | ----------------------------------------------------------------------------- | ------------------------ |
| Check-In #3: Additional Practice Project | `python-level-1-check-in-3-curriculum-check-in-3-additional-practice-project` | New recording needed     |

### GrS14 Space Eater

| Lesson                                        | Stable lesson ID                                                                             | Historical filename lead    |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------- |
| GrS14 Project 1: Space Eater                  | `python-level-1-grs14-space-eater-curriculum-grs14-project-1-space-eater`                    | `grs12_space_eater.gif`     |
| GrS14 Supplemental Project 1: Turtle Run      | `python-level-1-grs14-space-eater-supplemental-grs14-supplemental-project-1-turtle-run`      | `grs12_turtle_run.gif`      |
| GrS14 Supplemental Project 2: Target Practice | `python-level-1-grs14-space-eater-supplemental-grs14-supplemental-project-2-target-practice` | `grs12_target_practice.gif` |
| GrS14 Supplemental Project 3: Pong            | `python-level-1-grs14-space-eater-supplemental-grs14-supplemental-project-3-pong`            | `grs12_pong.gif`            |
| GrS14 Supplemental Project 4: Fidget Spinner  | `python-level-1-grs14-space-eater-supplemental-grs14-supplemental-project-4-fidget-spinner`  | `grs12_fidget_spinner.gif`  |
| GrS14 Supplemental Project 5: Snake           | `python-level-1-grs14-space-eater-supplemental-grs14-supplemental-project-5-snake`           | `grs12_snake.gif`           |

### GrS15 Master Project

| Lesson                          | Stable lesson ID                                                                | Historical filename lead |
| ------------------------------- | ------------------------------------------------------------------------------- | ------------------------ |
| GrS15 Project 1: Master Project | `python-level-1-grs15-master-project-curriculum-grs15-project-1-master-project` | New recording needed     |
