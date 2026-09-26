// Browser implementation of the Surface APIs used alongside Pygame Zero.
// This is independent of Mu's desktop runner and does not load native SDL.
export const pygameShim = `
import math
import operator
import weakref
from js import OffscreenCanvas
from _classes_pgzero import Rect, _bridge

SRCALPHA = 65536
_surfaces = weakref.WeakSet()
_MAX_PIXELS = 16 * 1024 * 1024
_MAX_DIMENSION = 4096

def _color(value, opaque=False):
    if isinstance(value, str):
        if not _bridge.isValidColor(value):
            raise ValueError("Invalid color: " + value)
        return value
    if len(value) not in (3, 4):
        raise ValueError("Colors need three RGB or four RGBA values.")
    channels = [operator.index(channel) for channel in value]
    if any(channel < 0 or channel > 255 for channel in channels):
        raise ValueError("Color channels must be between 0 and 255.")
    if len(channels) == 3:
        channels.append(255)
    if opaque:
        channels[3] = 255
    return "rgba({}, {}, {}, {})".format(*channels[:3], channels[3] / 255)

def _size(size):
    if len(size) != 2:
        raise ValueError("Surface size must be (width, height).")
    width, height = (operator.index(value) for value in size)
    if min(width, height) < 0:
        raise ValueError("Surface dimensions cannot be negative.")
    if max(width, height) > _MAX_DIMENSION:
        raise ValueError("Browser surfaces are limited to 4096 pixels per side.")
    return width, height

def _require_surface(surface):
    if not isinstance(surface, Surface):
        raise TypeError("Expected a pygame.Surface.")
    return surface

def _no_special_flags(flags):
    if flags:
        raise NotImplementedError("Special blend flags are not supported in the browser IDE.")

class Surface:
    def __init__(self, size, flags=0, depth=0, masks=None):
        width, height = _size(size)
        if flags & ~SRCALPHA or depth not in (0, 32) or masks is not None:
            raise NotImplementedError("Browser surfaces use 32-bit color with optional SRCALPHA.")
        if len(_surfaces) >= 256 or sum(s.get_width() * s.get_height() for s in _surfaces) + width * height > _MAX_PIXELS:
            raise MemoryError("Too many browser surfaces. Reuse surfaces instead of creating them every frame.")
        self._canvas = OffscreenCanvas.new(width, height)
        self._context = self._canvas.getContext("2d")
        self._flags = flags
        self._alpha = 255 if flags & SRCALPHA else None
        self._colorkey = None
        self._clip = Rect(0, 0, width, height)
        _surfaces.add(self)
        if not flags & SRCALPHA:
            self.fill("black")

    def __del__(self):
        canvas = getattr(self, "_canvas", None)
        if canvas is not None:
            canvas.width = canvas.height = 0

    def get_width(self):
        return int(self._canvas.width)

    def get_height(self):
        return int(self._canvas.height)

    def get_size(self):
        return self.get_width(), self.get_height()

    def get_flags(self):
        return self._flags

    def get_rect(self, **kwargs):
        result = Rect((0, 0), self.get_size())
        for name, value in kwargs.items():
            if not hasattr(result, name):
                raise TypeError("Unknown Rect attribute: " + name)
            setattr(result, name, value)
        return result

    def set_clip(self, rect=None):
        self._clip = self.get_rect() if rect is None else self.get_rect().clip(Rect(rect))

    def get_clip(self):
        return self._clip.copy()

    def _begin(self):
        context = self._context
        context.save()
        context.beginPath()
        context.rect(*self._clip)
        context.clip()
        return context

    def fill(self, color, rect=None, special_flags=0):
        _no_special_flags(special_flags)
        color = _color(color, opaque=not self._flags & SRCALPHA)
        area = self._clip.clip(self.get_rect() if rect is None else Rect(rect))
        context = self._begin()
        try:
            # Pygame fill replaces pixels, including their alpha channel.
            context.clearRect(*area)
            if not self._flags & SRCALPHA:
                context.fillStyle = "black"
                context.fillRect(*area)
            context.fillStyle = color
            context.fillRect(*area)
        finally:
            context.restore()
        return area

    def set_alpha(self, value, flags=0):
        _no_special_flags(flags)
        self._alpha = None if value is None else max(0, min(255, operator.index(value)))

    def get_alpha(self):
        return self._alpha

    def set_colorkey(self, color, flags=0):
        _no_special_flags(flags)
        if color is None:
            self._colorkey = None
            return
        sample = Surface((1, 1), SRCALPHA)
        sample.fill(color)
        self._colorkey = sample.get_at((0, 0))

    def get_colorkey(self):
        return self._colorkey

    def get_at(self, pos):
        x, y = (operator.index(value) for value in pos)
        if not self.get_rect().collidepoint(x, y):
            raise IndexError("Pixel position is outside the surface.")
        data = self._context.getImageData(x, y, 1, 1).data
        return tuple(int(data[index]) for index in range(4))

    def set_at(self, pos, color):
        x, y = (operator.index(value) for value in pos)
        if self._clip.collidepoint(x, y):
            self.fill(color, (x, y, 1, 1))

    def copy(self):
        result = Surface(self.get_size(), self._flags)
        if all(self.get_size()):
            result._context.drawImage(self._canvas, 0, 0)
        result._alpha = self._alpha
        result._colorkey = self._colorkey
        result._clip = self._clip.copy()
        return result

    def convert(self, surface=None):
        result = Surface(self.get_size())
        result._context.clearRect(0, 0, *self.get_size())
        if all(self.get_size()):
            result._context.drawImage(self._canvas, 0, 0)
        _bridge.makeSurfaceOpaque(result._canvas)
        result._colorkey = self._colorkey
        return result

    def convert_alpha(self, surface=None):
        result = Surface(self.get_size(), SRCALPHA)
        if all(self.get_size()):
            result._context.drawImage(self._canvas, 0, 0)
        return result

    def _drawable(self):
        if self._colorkey is None or not all(self.get_size()):
            return self
        result = self.copy()
        result._colorkey = None
        # Process pixels in JavaScript rather than crossing the Python/JS
        # boundary separately for every color channel on every frame.
        _bridge.applySurfaceColorKey(result._canvas, *self._colorkey[:3])
        return result

    def blit(self, source, dest, area=None, special_flags=0):
        _no_special_flags(special_flags)
        _require_surface(source)
        x, y = dest[:2] if not isinstance(dest, Rect) else (dest.x, dest.y)
        requested = source.get_rect() if area is None else Rect(area)
        source_rect = requested.clip(source.get_rect())
        x += source_rect.x - requested.x
        y += source_rect.y - requested.y
        result = Rect(x, y, source_rect.width, source_rect.height).clip(self._clip)
        if not source_rect or not result:
            return result
        drawable = source._drawable()
        context = self._begin()
        try:
            context.globalAlpha = 1 if source._alpha is None else source._alpha / 255
            context.drawImage(drawable._canvas, *source_rect, x, y, source_rect.width, source_rect.height)
        finally:
            context.restore()
        return result

    def blits(self, blit_sequence, doreturn=True):
        results = [self.blit(*entry) for entry in blit_sequence]
        return results if doreturn else None

class _Draw:
    def rect(self, surface, color, rect, width=0, border_radius=0):
        _require_surface(surface)
        area = Rect(rect)
        color = _color(color)
        if width < 0:
            return Rect(area.x, area.y, 0, 0)
        if width >= min(area.width, area.height) / 2:
            width = 0
        if width == 0 and border_radius == 0:
            return surface.fill(color, area)
        context = surface._begin()
        try:
            context.fillStyle = context.strokeStyle = color
            context.lineWidth = max(1, width)
            inset = min(width / 2, area.width / 2, area.height / 2)
            context.beginPath()
            context.roundRect(area.x + inset, area.y + inset, max(0, area.width - 2 * inset), max(0, area.height - 2 * inset), max(0, border_radius))
            context.stroke() if width else context.fill()
        finally:
            context.restore()
        return area.clip(surface.get_clip())

    def circle(self, surface, color, center, radius, width=0):
        return self.ellipse(surface, color, (center[0] - radius, center[1] - radius, 2 * radius, 2 * radius), width)

    def ellipse(self, surface, color, rect, width=0):
        _require_surface(surface)
        area = Rect(rect)
        color = _color(color)
        if width < 0 or area.width <= 0 or area.height <= 0:
            return Rect(area.x, area.y, 0, 0)
        if width >= min(area.width, area.height) / 2:
            width = 0
        context = surface._begin()
        try:
            context.fillStyle = context.strokeStyle = color
            context.lineWidth = max(1, width)
            inset = min(width / 2, area.width / 2, area.height / 2)
            context.beginPath()
            context.ellipse(*area.center, area.width / 2 - inset, area.height / 2 - inset, 0, 0, 2 * math.pi)
            context.stroke() if width else context.fill()
        finally:
            context.restore()
        return area.clip(surface.get_clip())

    def line(self, surface, color, start_pos, end_pos, width=1):
        return self.lines(surface, color, False, [start_pos, end_pos], width)

    def lines(self, surface, color, closed, points, width=1):
        if width <= 0:
            return Rect(0, 0, 0, 0)
        return self._path(surface, color, points, width, closed)

    def polygon(self, surface, color, points, width=0):
        return self._path(surface, color, points, width, True)

    def _path(self, surface, color, points, width, closed):
        _require_surface(surface)
        if len(points) < (3 if width == 0 else 2):
            raise ValueError("Not enough points to draw this shape.")
        color = _color(color)
        xs, ys = zip(*points)
        area = Rect(min(xs), min(ys), max(xs) - min(xs) + 1, max(ys) - min(ys) + 1)
        if width < 0:
            return Rect(area.x, area.y, 0, 0)
        context = surface._begin()
        try:
            context.fillStyle = context.strokeStyle = color
            context.lineWidth = max(1, width)
            context.beginPath()
            context.moveTo(*points[0])
            for point in points[1:]:
                context.lineTo(*point)
            if closed:
                context.closePath()
            context.stroke() if width else context.fill()
        finally:
            context.restore()
        return area.inflate(width, width).clip(surface.get_clip())

draw = _Draw()

class _Transform:
    def scale(self, surface, size, dest_surface=None):
        _require_surface(surface)
        size = _size(size)
        result = Surface(size, surface._flags) if dest_surface is None else _require_surface(dest_surface)
        if result.get_size() != size:
            raise ValueError("Destination surface size does not match.")
        if result is surface:
            surface = surface.copy()
        result._context.imageSmoothingEnabled = False
        result._context.clearRect(0, 0, *size)
        if all(surface.get_size()) and all(size):
            result._context.drawImage(surface._canvas, 0, 0, *size)
        result._alpha, result._colorkey = surface._alpha, surface._colorkey
        return result

    def flip(self, surface, flip_x, flip_y):
        _require_surface(surface)
        result = Surface(surface.get_size(), surface._flags)
        context = result._context
        context.save()
        context.translate(surface.get_width() if flip_x else 0, surface.get_height() if flip_y else 0)
        context.scale(-1 if flip_x else 1, -1 if flip_y else 1)
        if all(surface.get_size()):
            context.drawImage(surface._canvas, 0, 0)
        context.restore()
        result._alpha, result._colorkey = surface._alpha, surface._colorkey
        return result

transform = _Transform()

def __getattr__(name):
    raise AttributeError("pygame.{} is not implemented in this browser runtime. Use Pygame Zero draw/update callbacks; Surface, Rect, draw and transform helpers are available.".format(name))
`;
