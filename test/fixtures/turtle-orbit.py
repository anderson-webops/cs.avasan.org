"""Orbit regression: preserve the reported equations and default time step."""
import turtle
import math

G = 6.678e-11
Mp = 5.972e24
SCALE = 500_000
EARTH_RADIUS = 6_371_000
screen = turtle.Screen()
screen.setup(900, 900)
t = turtle.Turtle()
t.speed(0)


class OrbitSim:
    def __init__(self, r=20_000_000.0, theta=0.0, Vr=0.0, Vtheta=5_000.0, dt=100.0):
        self.r = r
        self.theta = theta
        self.dr = Vr * dt
        self.dtheta = (Vtheta / r) * dt
        self.dt = dt

    def update(self):
        curr_r = self.r
        curr_dr = self.dr
        curr_dtheta = self.dtheta
        self.r += self.dr
        self.theta += self.dtheta
        self.dr += ((curr_r + 0.5 * curr_dr) * curr_dtheta ** 2
                    - (G * Mp / curr_r ** 2) * self.dt ** 2)
        self.dtheta += -(2 * curr_dr * curr_dtheta) / (curr_r + 0.5 * curr_dr)

    def move(self, pen):
        x = self.r * math.cos(self.theta) / SCALE
        y = self.r * math.sin(self.theta) / SCALE
        dx, dy = x - pen.xcor(), y - pen.ycor()
        pen.setheading(math.degrees(math.atan2(dy, dx)))
        pen.forward(math.hypot(dx, dy))


def draw_earth():
    earth = turtle.Turtle()
    earth.hideturtle()
    earth.speed(0)
    radius_px = EARTH_RADIUS / SCALE
    earth.penup()
    earth.goto(0, -radius_px)
    earth.pendown()
    earth.fillcolor("blue")
    earth.begin_fill()
    earth.circle(radius_px)
    earth.end_fill()


draw_earth()
sim = OrbitSim()
t.penup()
sim.move(t)
t.pendown()
screen.tracer(0)

# Checkpoint controls let the browser inspect pixels across real event-loop turns.
i = 0
limit = 999


def advance():
    global limit
    limit = 1000 if i == 999 else 1100


def clear_pending():
    t.clear()
    screen.bgcolor("yellow")
    print("CLEARED LOGICALLY")


def publish_later():
    def publish():
        screen.update()
        print("PUBLISHED WHILE HIDDEN")
    screen.ontimer(publish, 500)


def resume_animation():
    screen.tracer(1)
    t.speed(1)
    t.forward(80)
    print("ANIMATING")


screen.onkey(publish_later, "h")
screen.onkey(advance, "n")
screen.onkey(screen.update, "u")
screen.onkey(clear_pending, "c")
screen.onkey(resume_animation, "a")
screen.listen()
print("READY")
while True:
    if i < limit:
        i += 1
        sim.update()
        sim.move(t)
        if i % 1000 == 0:
            screen.update()
        if i in (999, 1000, 1100):
            print("CHECKPOINT", i)
