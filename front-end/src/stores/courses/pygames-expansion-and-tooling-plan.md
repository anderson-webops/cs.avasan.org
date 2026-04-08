# PyGames Expansion and Tooling Plan

## Setup and Tooling

Preferred IDEs: `Mu` for the earliest weeks, then `VS Code` as the default
long-term tool, with `PyCharm` as the advanced option.

Official links:

- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [PyCharm installation guide](https://www.jetbrains.com/help/pycharm/installation-guide.html)
- [Python downloads](https://www.python.org/downloads/?m=landing)

macOS walkthrough:

1. Install Python 3.
2. Install Mu for beginner-friendly weeks, or install VS Code / PyCharm if the student is ready for a fuller IDE.
3. In VS Code, add `Python`, `Pylance`, and optionally `Error Lens`.
4. Create a course folder with subfolders for `assets`, `images`, `sounds`, and `projects`.
5. Install `pygame` into the course interpreter and verify a tiny window opens before starting the first real game project.

Windows walkthrough:

1. Install Python 3 and enable the PATH option.
2. Install Mu, VS Code, or PyCharm depending on the learner track.
3. In VS Code, add `Python`, `Pylance`, and optionally `Error Lens`.
4. Open the course folder and verify the selected interpreter is the one where `pygame` is installed.
5. Test image and sound loading early, since Windows path mistakes are a common source of student confusion.

Course-specific notes:

- No CMake setup is needed.
- This course should include an early setup check for images, fonts, and audio assets, not just Python execution.

## Positioning

PyGames should remain a project-rich course, but the setup and tooling story
needs to be cleaner. The course can also do more to prepare students for larger
game projects and for the Python 2 transition.

## Tooling Question

The course should explicitly compare:

- `Mu`
- `VS Code`
- `PyCharm`

## Recommended Tooling Path

### Default for younger or newer students

- Start with `Mu`
- Lowest setup friction
- Good for the earliest weeks

### Default for intermediate students

- `VS Code`
- Better debugging, extensions, file management, and long-term transferability

### Optional advanced path

- `PyCharm`
- Stronger project tooling, inspections, and Python-specific workflow

## Suggested Tooling Module

Add an opening module that covers:

- folder layout for assets
- running and rerunning programs
- reading tracebacks
- using a debugger or print statements
- managing images, sounds, and multiple files

## Curriculum Improvements

- Add stronger explanation of game loops, state, collision, and timing
- Add more reusable helper functions and code organization
- Add an explicit transition from "one-file game" to "larger multi-part game"
- Add more debugging-focused lessons on event handling and physics tuning

## Recommended New Projects

- top-down puzzle game
- tower defense prototype
- side-scrolling endless runner
- rhythm or timing game
- multi-level platformer refinement project
- boss fight with finite-state enemy behavior

## Better Bridge to Python 2

Add a wrap-up strand connecting:

- lists of actors
- dictionaries for state
- functions for game logic
- classes for larger projects

That will make PyGames feel less isolated and more like a stepping stone.

## Delivery Notes

- Keep videos for all major projects
- Add setup videos for each editor option
- Add asset-pack organization guidelines
- Add a troubleshooting page for installation and path issues

## Expansion Ideas

- Add a level editor mini-project
- Add controller input or mobile input experiments
- Add sound design and polish lessons
- Add packaging/exporting and portfolio presentation guidance
