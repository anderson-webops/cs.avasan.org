# Pygame in the browser IDE

The PyGame Zero mode runs Python in the browser using Pyodide. It supplies the
game loop through `draw()`, `update()` and keyboard/mouse callbacks. It does not
start a Python process or native SDL window on the server.

## Surfaces

`import pygame` and `from pygame import Surface, SRCALPHA` support reusable
offscreen images. For example:

```python
import pygame

WIDTH = 640
HEIGHT = 400

# Create the image once, then reuse it in every frame.
card = pygame.Surface((160, 80), pygame.SRCALPHA)
card.fill((30, 120, 220, 180))
pygame.draw.circle(card, "white", (40, 40), 20)


def draw():
    """Draw the background and the prepared image."""
    screen.fill("black")
    screen.blit(card, (100, 100))
```

Supported Surface methods include size queries, positioned `get_rect()`,
`fill()`, `blit()` with source cropping, `blits()`, `copy()`, `convert()`,
`convert_alpha()`, alpha and color-key accessors, pixel access, and clipping.
`pygame.draw` includes rectangles, circles, ellipses, lines and polygons.
`pygame.transform.scale()` and `flip()` return reusable images.

The browser uses 32-bit canvas pixels. Surfaces are limited to 4096 pixels per
side, 256 live surfaces and 16 million total live surface pixels. Create game
images outside `draw()`/`update()` and reuse them. Special SDL blend flags,
native display/event loops, custom masks and other unimplemented Pygame APIs
raise explicit errors. Shape edge rasterization follows browser Canvas rules
and can differ slightly from native Pygame.

## Mu reference

[Mu's Pygame Zero mode](https://github.com/mu-editor/mu/blob/master/mu/modes/pygamezero.py)
was reviewed as an editor/workflow reference, not embedded or copied. Mu's
repository is archived. Its desktop Python/Qt process runner is not part of
this integration.

The relevant classroom workflow includes:

- Run/Stop, saving edits before execution, and F5 or Cmd/Ctrl+Enter from the editor.
- `Actor`, `Rect`, keyboard/mouse callbacks, clock scheduling and animation.
- Project image, sound and music files, asset-name suggestions and shared assets.
- Pygame Zero builtins and method suggestions, now including Surface creation,
  drawing helpers and methods on named Surface variables.
- `screen.blit()` accepting both existing named images and generated Surfaces.

Mu's native font-folder management is not currently provided here. Existing
screen text uses browser fonts. This is a browser classroom runtime, not a claim
of full Mu or native Pygame compatibility.

References: [Pygame Surface](https://www.pygame.org/docs/ref/surface.html),
[Pygame Zero builtins](https://pygame-zero.readthedocs.io/en/stable/builtins.html),
[Mu API suggestions](https://github.com/mu-editor/mu/blob/master/mu/modes/api/pygamezero.py).

## Verification

`node --test test/pygame-browser-runtime.test.mjs` opens a disposable local IDE
with a generated-image project, loads the actual Pyodide runtime, checks API
behavior and rendered RGBA pixels, then stops and reruns the project with F5.
It uses installed Chrome (or `PUPPETEER_EXECUTABLE_PATH`), requires access to
the configured Pyodide CDN, and closes its browser and local server afterward.
Run it through `scripts/classes-family-heavy-task.mjs` on shared workstations.

## Classroom isolation

In this fork, Surface uses OffscreenCanvas inside the opaque-origin runtime worker. Only bounded pixel snapshots cross the validated rendering channel; Python never receives the parent document or authenticated browser storage. Pixel snapshots count toward the existing per-operation, per-second, and total output budgets. Large or excessive drawing fails with a visible safety-budget error rather than removing the sandbox limits.
