import { api } from "@/api";
import {
	listPreviewFiles,
	loadPreviewFile,
	parseGitHubResource
} from "@/modules/codePreview";

const WHITESPACE_RE = /\s+/g;
const FILE_EXTENSION_RE = /\.[\dA-Z]+$/i;
const PYTHON_EXTENSION_RE = /\.py$/i;
const SAFE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const ROOT_TEXT_FILE_RE = /^\w[\w.-]*\.(?:csv|json|md|py|txt)$/i;
const IMAGE_FILE_RE = /^images\/\w[\w.-]*\.(?:gif|jpe?g|png|svg|webp)$/i;
const AUDIO_FILE_RE = /^(?:music|sounds)\/\w[\w.-]*\.(?:mp3|ogg|wav)$/i;
const ASSET_DIRECTORY_NAMES = new Set(["images", "music", "sounds"]);
const PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES = new Set([
	"_classes_artifacts.py",
	"_classes_keras.py",
	"_classes_pgzero.py",
	"keras.py",
	"pgzero.py",
	"pgzrun.py",
	"pygame.py",
	"pysynth.py",
	"streamlit.py",
	"tensorflow.py",
	"turtle.py",
	"zrect.py"
]);
const PYTHON_IDE_RUNTIME_RESERVED_ROOTS = new Set([
	"keras",
	"pgzero",
	"tensorflow"
]);
const TEXT_FILE_RE = /\.(?:csv|json|md|py|txt|svg)$/i;
const IMAGE_EXTENSION_RE = /\.(?:gif|jpe?g|png|svg|webp)$/i;
const SOUND_EXTENSION_RE = /\.wav$/i;
const MUSIC_EXTENSION_RE = /\.(?:mp3|ogg)$/i;
const STARTER_RELATIVE_PREFIX_RE = /^(?:starter|src)\//i;
const PYTHON_IDE_INDEXED_DB_NAME = "classes-python-ide";
const PYTHON_IDE_INDEXED_DB_VERSION = 1;
const PYTHON_IDE_PROJECT_STORE = "projectStores";
const MAX_REMOTE_PROJECT_TITLE_LENGTH = 120;
const MAX_REMOTE_IMPORT_ID_LENGTH = 128;

export type PythonIdeFileEncoding = "text" | "base64";

export type PythonIdeMode = "data" | "pgzero" | "python" | "turtle";
export type PythonIdeProjectTemplate =
	| "blank"
	| "circle-art"
	| "classroom-project"
	| "course"
	| "demo"
	| "firework-festival"
	| "flower-garden"
	| "maze-explorer"
	| "neon-trail"
	| "picasso"
	| "spiral-galaxy"
	| "turtle-race"
	| "triangle-motion";

export interface PythonIdeFile {
	name: string;
	content: string;
	encoding?: PythonIdeFileEncoding;
}

export interface PythonIdeProject {
	_id: string;
	title: string;
	mode: PythonIdeMode;
	files: PythonIdeFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	importID?: string;
	byteCount?: number;
	createdAt?: string;
	updatedAt?: string;
	serverUpdatedAt?: string;
}

export type PythonIdeProjectReviewRole = "admin";

export interface PythonIdeProjectReview {
	_id: string;
	sourceProject: string;
	title: string;
	mode: PythonIdeMode;
	files: PythonIdeFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	reviewerRole: PythonIdeProjectReviewRole;
	reviewerName?: string;
	lastEditedByRole?: PythonIdeProjectReviewRole;
	lastEditedByName?: string;
	visibleToStudent: boolean;
	note?: string;
	sourceUpdatedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ManagedPythonIdeProject {
	project: PythonIdeProject;
	review: PythonIdeProjectReview | null;
}

export interface PythonIdeProjectPayload {
	title?: string;
	mode?: PythonIdeMode;
	files?: PythonIdeFile[];
	activeFileName?: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
}

export interface CreatePythonIdeProjectOptions {
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	files?: PythonIdeFile[];
	starterLabel?: string;
	starterUrl?: string;
	template?: PythonIdeProjectTemplate;
	title?: string;
}

interface PythonIdeProjectStorageRecord {
	key: string;
	projects: PythonIdeProject[];
	revision?: string;
	updatedAt: string;
	claimedProjectID?: string;
	claimedStudentID?: string;
}

export interface PythonIdeLocalRecoveryRecordToken {
	key: string;
	idbFingerprint?: string;
	idbRevision?: string;
	idbUpdatedAt?: string;
	localValue?: string;
}

export interface PythonIdeLocalRecoverySnapshot {
	projects: PythonIdeProject[];
	records: PythonIdeLocalRecoveryRecordToken[];
}

export interface VolatileStudentPythonProjectRecovery {
	acknowledge: (studentID: string) => void;
	discard: (studentID?: string) => void;
	forStudent: (studentID: string) => PythonIdeProject[];
	has: (studentID: string) => boolean;
	hasAnyUnsynced: () => boolean;
	hasUnsynced: (studentID: string) => boolean;
	replace: (
		studentID: string,
		projects: PythonIdeProject[],
		options?: { unsynced?: boolean }
	) => void;
	retainAcrossOwnerChange: (nextStudentID: string | null) => void;
}

export type PythonIdeRecoveryWrite =
	| {
			importID: string;
			kind: "create";
			project: PythonIdeProject;
	  }
	| {
			expectedUpdatedAt: string;
			kind: "update";
			project: PythonIdeProject;
	  };

export interface PythonIdeRecoveryPlan {
	projects: PythonIdeProject[];
	writes: PythonIdeRecoveryWrite[];
}

export const pythonIdeStorageNamespace = "classes-python-ide-projects";
export const pythonIdeEditorViewStateStoragePrefix =
	"classes-python-ide-editor-view-state";
const legacyPythonIdeEditorViewStateStoragePrefixes = [
	pythonIdeEditorViewStateStoragePrefix,
	"cs-avasan-python-ide-editor-state"
] as const;
const pythonIdeRecoveryTabID =
	typeof crypto === "undefined"
		? `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`
		: crypto.randomUUID();
export const pythonIdeAllowedFileExtensions = [
	".py",
	".csv",
	".json",
	".txt",
	".md",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".svg",
	".webp",
	".wav",
	".mp3",
	".ogg"
] as const;
export const pythonIdeFileUploadAccept =
	pythonIdeAllowedFileExtensions.join(",");

let pythonIdeStorageDbPromise: Promise<IDBDatabase> | null = null;

const pythonIdeCourseModes: Record<string, PythonIdeMode> = {
	"ai-level-1": "data",
	"data-science-in-python": "data",
	"machine-learning": "data",
	pygames: "pgzero",
	"pygames-archive": "pgzero",
	"pygames-classroom": "pgzero",
	"python-level-1": "turtle",
	"python-level-1-classroom": "turtle",
	"python-level-2": "python",
	"python-level-2-archive": "python",
	"python-level-2-classroom": "python",
	"python-level-3": "python",
	"python-to-java-and-cpp-bridge": "python",
	"pythonic-design-patterns": "python"
};

export function normalizePythonIdeMode(
	value: string | null | undefined,
	fallback: PythonIdeMode = "python"
): PythonIdeMode {
	if (value === "data" || value === "pgzero" || value === "turtle")
		return value;
	if (value === "python") return "python";
	return fallback;
}

export function normalizeClassroomPythonIdeMode(
	value: string | null | undefined,
	fallback: PythonIdeMode = "python"
): Exclude<PythonIdeMode, "data"> {
	const mode = normalizePythonIdeMode(value, fallback);
	return mode === "data" ? "python" : mode;
}

export function pythonIdeModeForCourseId(courseId: string | null | undefined) {
	return courseId ? (pythonIdeCourseModes[courseId] ?? null) : null;
}

export const pythonStarterCode = `print("Hello, Python!")

name = input("What is your name? ")
print(f"Nice to meet you, {name}.")
`;

export const turtleStarterCode = `import turtle

screen = turtle.Screen()
screen.bgcolor("white")

pen = turtle.Turtle()
pen.color("teal")
pen.pensize(3)
is_moving = True

def move_forward():
\tpen.forward(30)

def turn_left():
\tpen.left(20)

def toggle_motion():
\tglobal is_moving
\tis_moving = not is_moving

def animate():
\tif is_moving:
\t\tpen.forward(2)
\tscreen.ontimer(animate, 16)

def draw_dot(x, y):
\tpen.penup()
\tpen.goto(x, y)
\tpen.pendown()
\tpen.dot(18, "coral")

def drag_pen(x, y):
\tpen.goto(x, y)

screen.onkey(move_forward, "Up")
screen.onkey(turn_left, "Left")
screen.onkey(toggle_motion, "space")
screen.onclick(draw_dot)
pen.ondrag(drag_pen)
screen.ontimer(animate, 16)
screen.listen()
`;

export const turtleCircleArtStarterCode = `import random
import turtle

#######################
###   CONSTANTS     ###
#######################
BACKGROUND_COLOR = "midnightblue"
ART_COLORS = [
    "red",
    "orange",
    "gold",
    "limegreen",
    "deepskyblue",
    "blueviolet",
    "hotpink"
]
CIRCLE_COUNT = 24
CIRCLE_RADIUS = 55
TURN_ANGLE = 360 / CIRCLE_COUNT
PEN_SIZE = 2
DRAWING_SPEED = 8
ART_POSITIONS = [(-170, 40), (0, -35), (170, 40)]


########################
###   NORMAL SECTION  ###
########################
# Return one color from ART_COLORS
# Use circle_index to create a repeating pattern
def choose_circle_color(circle_index):
    pass


######################
###   HARD SECTION  ###
######################
# Add a center, border, label, or another detail to each burst
def add_burst_detail(x_position, y_position):
    pass


#######################
###   FUNCTIONS     ###
#######################
# Move without drawing a connecting line
def move_to(x_position, y_position):
    artist.penup()
    artist.goto(x_position, y_position)
    artist.pendown()

# Draw one filled circle with a chosen color
def draw_filled_circle(radius, color_name):
    artist.color(color_name)
    artist.begin_fill()
    artist.circle(radius)
    artist.end_fill()

# Build one burst from repeated circles and turns
def draw_circle_burst(x_position, y_position):
    move_to(x_position, y_position)

    for circle_index in range(CIRCLE_COUNT):
        circle_color = choose_circle_color(circle_index)
        if circle_color not in ART_COLORS:
            circle_color = random.choice(ART_COLORS)
        draw_filled_circle(CIRCLE_RADIUS, circle_color)
        artist.right(TURN_ANGLE)

    add_burst_detail(x_position, y_position)


#######################
###   VARIABLES     ###
#######################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Color Circle Art")

artist = turtle.Turtle()
artist.pensize(PEN_SIZE)
artist.speed(DRAWING_SPEED)


#######################
###   MAIN CODE     ###
#######################
# Run the finished design once, then remix the constants above
for art_position in ART_POSITIONS:
    draw_circle_burst(art_position[0], art_position[1])

artist.hideturtle()
`;

export const turtlePicassoStarterCode = `from random import choice
from turtle import Screen, Turtle

#######################
###   VARIABLES     ###
#######################
colors = ["red", "light blue", "green", "yellow", "white", "orange"]

screen = Screen()
screen.bgcolor("black")
screen.title("Picasso Keyboard Painter")

t = Turtle()
t.speed(5)


########################
###   NORMAL SECTION  ###
########################
# Replace this placeholder with your draw_square() function
# Keep the name draw_square or update screen.onkey() below to match
def draw_square():
    pass


######################
###   HARD SECTION  ###
######################
# Add another shape or effect for the B key
def draw_bonus_shape():
    pass


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(draw_square, "s")
screen.onkey(draw_bonus_shape, "b")
screen.listen()
`;

export const turtleTriangleMotionStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "yellow"
OUTLINE_COLOR = "blue"
FILL_COLOR = "deepskyblue"
MOVE_DISTANCE = 20
TRIANGLE_SIDE_LENGTH = 60
TURN_ANGLE = 120


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Triangle Motion Starter")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.color(OUTLINE_COLOR, FILL_COLOR)


########################
###   NORMAL SECTION  ###
########################
# Replace this placeholder with code that draws one triangle
# Use TRIANGLE_SIDE_LENGTH and TURN_ANGLE to draw three equal sides
# Add begin_fill() and end_fill() if the triangle should be filled
def draw_triangle():
    pass


######################
###   HARD SECTION  ###
######################
# Add an interior design or a second movable shape
def add_triangle_detail():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Clear the previous triangle and redraw it at the current position
def redraw_triangle():
    artist.clear()
    artist.pendown()
    draw_triangle()
    add_triangle_detail()
    screen.update()

# Move right without drawing a connecting line
def move_right_and_draw():
    artist.penup()
    artist.goto(artist.xcor() + MOVE_DISTANCE, artist.ycor())
    redraw_triangle()

# Move left without drawing a connecting line
def move_left_and_draw():
    artist.penup()
    artist.goto(artist.xcor() - MOVE_DISTANCE, artist.ycor())
    redraw_triangle()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_right_and_draw, "Right")
screen.onkey(move_left_and_draw, "Left")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Draw once after the student completes draw_triangle()
redraw_triangle()
`;

export const turtleNeonTrailStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "black"
TRAIL_COLORS = ["cyan", "magenta", "yellow", "lime", "orange"]
DEFAULT_TRAIL_COLOR = "cyan"
MOVE_DISTANCE = 28
TURN_ANGLE = 30
DOT_SIZE = 10


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Neon Trail Painter")

artist = turtle.Turtle()
artist.shape("turtle")
artist.pensize(4)
artist.speed(6)


########################
###   NORMAL SECTION  ###
########################
# Return one color from TRAIL_COLORS
# Try returning your favorite color first
def choose_trail_color():
    pass


######################
###   HARD SECTION  ###
######################
# Add a stamp, shape, or short pattern for the space bar
def add_special_effect():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or choose a friendly fallback
def next_trail_color():
    color_name = choose_trail_color()
    if color_name not in TRAIL_COLORS:
        color_name = random.choice(TRAIL_COLORS)
    return color_name

# Move forward and leave a bright trail
def move_forward():
    artist.color(next_trail_color())
    artist.pendown()
    artist.forward(MOVE_DISTANCE)
    artist.dot(DOT_SIZE)

# Move backward and leave a bright trail
def move_backward():
    artist.color(next_trail_color())
    artist.pendown()
    artist.backward(MOVE_DISTANCE)
    artist.dot(DOT_SIZE)

# Turn left without moving
def turn_left():
    artist.left(TURN_ANGLE)

# Turn right without moving
def turn_right():
    artist.right(TURN_ANGLE)

# Remove the drawing while keeping the controls ready
def clear_trail():
    artist.clear()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_forward, "Up")
screen.onkey(move_backward, "Down")
screen.onkey(turn_left, "Left")
screen.onkey(turn_right, "Right")
screen.onkey(add_special_effect, "space")
screen.onkey(clear_trail, "c")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Give the painter a bright starting point
artist.color(DEFAULT_TRAIL_COLOR)
artist.dot(DOT_SIZE)
`;

export const turtleFireworkFestivalStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "midnight blue"
FIREWORK_COLORS = ["gold", "cyan", "magenta", "orange", "lime", "white"]
DEFAULT_FIREWORK_COLOR = "gold"
RAY_COUNT = 16
RAY_LENGTH = 54
FULL_TURN = 360
CENTER_SIZE = 16


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Firework Festival")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.speed(0)
artist.pensize(3)


########################
###   NORMAL SECTION  ###
########################
# Return one color from FIREWORK_COLORS
# Try using random.choice for a surprise color
def choose_firework_color():
    pass


######################
###   HARD SECTION  ###
######################
# Add a second ring, center design, or sparkling trail
def add_bonus_sparks(x_position, y_position, color_name):
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or choose a friendly fallback
def next_firework_color():
    color_name = choose_firework_color()
    if color_name not in FIREWORK_COLORS:
        color_name = random.choice(FIREWORK_COLORS)
    return color_name

# Draw one complete firework around a clicked point
def draw_firework(x_position, y_position):
    color_name = next_firework_color()
    artist.color(color_name)

    for ray_number in range(RAY_COUNT):
        artist.penup()
        artist.goto(x_position, y_position)
        artist.setheading(ray_number * FULL_TURN / RAY_COUNT)
        artist.pendown()
        artist.forward(RAY_LENGTH)

    artist.penup()
    artist.goto(x_position, y_position)
    artist.dot(CENTER_SIZE, color_name)
    add_bonus_sparks(x_position, y_position, color_name)
    screen.update()

# Clear the sky for a new festival
def clear_sky():
    artist.clear()
    screen.update()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onclick(draw_firework)
screen.onkey(clear_sky, "c")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Start with two finished fireworks and invite more clicks
draw_firework(-130, 60)
draw_firework(110, -30)
`;

export const turtleSpiralGalaxyStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "black"
STAR_COLORS = ["white", "cyan", "gold", "violet", "deep sky blue"]
DEFAULT_STAR_COLOR = "white"
SPIRAL_STEPS = 105
START_DISTANCE = 2
DISTANCE_GROWTH = 0.34
TURN_ANGLE = 91
STAR_GAP = 4
STAR_SIZE = 5


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Spiral Galaxy")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.speed(0)
artist.pensize(2)


########################
###   NORMAL SECTION  ###
########################
# Return one color from STAR_COLORS
# Use step_number to alternate between two colors
def choose_star_color(step_number):
    pass


######################
###   HARD SECTION  ###
######################
# Add a planet, moon, comet, or another galaxy
def add_space_feature():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or cycle through the palette
def star_color_for(step_number):
    color_name = choose_star_color(step_number)
    if color_name not in STAR_COLORS:
        color_name = STAR_COLORS[step_number % len(STAR_COLORS)]
    return color_name

# Draw a colorful mathematical spiral
def draw_galaxy():
    for step_number in range(SPIRAL_STEPS):
        artist.color(star_color_for(step_number))
        artist.forward(START_DISTANCE + step_number * DISTANCE_GROWTH)
        artist.left(TURN_ANGLE)

        if step_number % STAR_GAP == 0:
            artist.dot(STAR_SIZE)


#####################
###   MAIN CODE   ###
#####################
# The completed framework creates the galaxy
draw_galaxy()
add_space_feature()
screen.update()
`;

export const turtleRaceDayStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "light cyan"
TRACK_COLOR = "slate gray"
RACER_COLORS = ["red", "blue", "green", "purple"]
START_X = -270
FINISH_X = 250
START_Y = -120
LANE_GAP = 80
RACER_COUNT = 4
MIN_STEP = 2
MAX_STEP = 10
RACE_DELAY_MS = 55


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Turtle Race Day")

finish_line = turtle.Turtle()
finish_line.hideturtle()
finish_line.color(TRACK_COLOR)
finish_line.pensize(3)

announcer = turtle.Turtle()
announcer.hideturtle()
announcer.color("navy")
announcer.penup()

racers = []
race_running = False


########################
###   NORMAL SECTION  ###
########################
# Return a color for each racer number
# Racer numbers begin at zero
def choose_racer_color(racer_number):
    pass


######################
###   HARD SECTION  ###
######################
# Add confetti, a victory lap, or a winner message
def add_finish_celebration(winner):
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or the finished race palette
def racer_color_for(racer_number):
    color_name = choose_racer_color(racer_number)
    if color_name not in RACER_COLORS:
        color_name = RACER_COLORS[racer_number % len(RACER_COLORS)]
    return color_name

# Draw a dashed finish line
def draw_finish_line():
    finish_line.penup()
    finish_line.goto(FINISH_X, -180)
    finish_line.setheading(90)

    for _ in range(15):
        finish_line.pendown()
        finish_line.forward(12)
        finish_line.penup()
        finish_line.forward(12)

# Create the racers and place them in their lanes
def create_racers():
    for racer_number in range(RACER_COUNT):
        racer = turtle.Turtle()
        racer.shape("turtle")
        racer.color(racer_color_for(racer_number))
        racer.penup()
        racer.goto(START_X, START_Y + racer_number * LANE_GAP)
        racers.append(racer)

# Move every racer by one random step
def race_step():
    global race_running
    if not race_running:
        return

    for racer in racers:
        racer.forward(random.randint(MIN_STEP, MAX_STEP))
        if racer.xcor() >= FINISH_X:
            race_running = False
            announcer.goto(0, 165)
            announcer.write(
                "We have a winner!",
                align="center",
                font=("Arial", 20, "bold")
            )
            add_finish_celebration(racer)
            return

    screen.ontimer(race_step, RACE_DELAY_MS)

# Reset every racer and start a fresh race
def start_race():
    global race_running
    if race_running:
        return

    announcer.clear()
    for racer_number in range(len(racers)):
        racers[racer_number].goto(
            START_X,
            START_Y + racer_number * LANE_GAP
        )

    race_running = True
    screen.ontimer(race_step, RACE_DELAY_MS)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(start_race, "space")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Build the track and begin the first race
draw_finish_line()
create_racers()
start_race()
`;

export const turtleFlowerGardenStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "light cyan"
PETAL_COLORS = ["hot pink", "gold", "violet", "orange", "deep sky blue"]
DEFAULT_PETAL_COLOR = "hot pink"
STEM_COLOR = "forest green"
CENTER_COLOR = "goldenrod"
PETAL_COUNT = 8
PETAL_DISTANCE = 18
PETAL_SIZE = 24
CENTER_SIZE = 18
STEM_LENGTH = 55
FULL_TURN = 360


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Flower Garden Clicker")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.speed(0)
artist.pensize(4)


########################
###   NORMAL SECTION  ###
########################
# Return one color from PETAL_COLORS
# Use x_position or y_position to make a pattern
def choose_petal_color(x_position, y_position):
    pass


######################
###   HARD SECTION  ###
######################
# Add a leaf, butterfly, face, or another garden detail
def add_garden_detail(x_position, y_position):
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or choose a friendly fallback
def petal_color_for(x_position, y_position):
    color_name = choose_petal_color(x_position, y_position)
    if color_name not in PETAL_COLORS:
        color_name = random.choice(PETAL_COLORS)
    return color_name

# Draw one flower centered on the selected point
def draw_flower(x_position, y_position):
    petal_color = petal_color_for(x_position, y_position)

    artist.color(STEM_COLOR)
    artist.penup()
    artist.goto(x_position, y_position - STEM_LENGTH)
    artist.pendown()
    artist.goto(x_position, y_position)

    artist.penup()
    for petal_number in range(PETAL_COUNT):
        artist.goto(x_position, y_position)
        artist.setheading(petal_number * FULL_TURN / PETAL_COUNT)
        artist.forward(PETAL_DISTANCE)
        artist.dot(PETAL_SIZE, petal_color)

    artist.goto(x_position, y_position)
    artist.dot(CENTER_SIZE, CENTER_COLOR)
    add_garden_detail(x_position, y_position)
    screen.update()

# Clear the canvas to plant a new garden
def clear_garden():
    artist.clear()
    screen.update()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onclick(draw_flower)
screen.onkey(clear_garden, "c")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Begin with a small finished garden
draw_flower(-130, -20)
draw_flower(0, 65)
draw_flower(135, -35)
`;

export const turtleMazeExplorerStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "alice blue"
WALL_COLOR = "navy"
PLAYER_COLORS = ["orange", "red", "purple", "green"]
DEFAULT_PLAYER_COLOR = "orange"
GOAL_COLOR = "gold"
GOAL_SIZE = 28
MOVE_DISTANCE = 20
PLAYER_RADIUS = 9
LEFT_BOUNDARY = -280
RIGHT_BOUNDARY = 280
BOTTOM_BOUNDARY = -190
TOP_BOUNDARY = 190
START_POSITION = (-240, -140)
GOAL_POSITION = (240, 140)
WALLS = [
    (-150, -170, -120, 100),
    (-20, -80, 10, 180),
    (100, -180, 130, 60)
]


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Maze Explorer")
screen.tracer(0)

wall_artist = turtle.Turtle()
wall_artist.hideturtle()
wall_artist.color(WALL_COLOR)
wall_artist.speed(0)

goal = turtle.Turtle()
goal.hideturtle()
goal.penup()
goal.goto(GOAL_POSITION)

player = turtle.Turtle()
player.shape("turtle")
player.penup()
player.goto(START_POSITION)

status = turtle.Turtle()
status.hideturtle()
status.penup()
status.color(WALL_COLOR)


########################
###   NORMAL SECTION  ###
########################
# Return one color from PLAYER_COLORS
# Try a favorite color before changing anything else
def choose_player_color():
    pass


######################
###   HARD SECTION  ###
######################
# Add a victory drawing, message, or animation
def add_victory_art():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or the finished explorer color
def player_color():
    color_name = choose_player_color()
    if color_name not in PLAYER_COLORS:
        color_name = DEFAULT_PLAYER_COLOR
    return color_name

# Draw one rectangular maze wall
def draw_wall(wall):
    left, bottom, right, top = wall
    wall_artist.penup()
    wall_artist.goto(left, bottom)
    wall_artist.pendown()
    wall_artist.begin_fill()
    wall_artist.goto(right, bottom)
    wall_artist.goto(right, top)
    wall_artist.goto(left, top)
    wall_artist.goto(left, bottom)
    wall_artist.end_fill()

# Check whether a point overlaps a maze wall
def point_touches_wall(x_position, y_position):
    for wall in WALLS:
        left, bottom, right, top = wall
        inside_horizontal = (
            left - PLAYER_RADIUS
            <= x_position
            <= right + PLAYER_RADIUS
        )
        inside_vertical = (
            bottom - PLAYER_RADIUS
            <= y_position
            <= top + PLAYER_RADIUS
        )
        if inside_horizontal and inside_vertical:
            return True
    return False

# Check the canvas boundaries and internal walls
def can_move_to(x_position, y_position):
    inside_canvas = (
        LEFT_BOUNDARY + PLAYER_RADIUS
        <= x_position
        <= RIGHT_BOUNDARY - PLAYER_RADIUS
        and BOTTOM_BOUNDARY + PLAYER_RADIUS
        <= y_position
        <= TOP_BOUNDARY - PLAYER_RADIUS
    )
    return inside_canvas and not point_touches_wall(
        x_position,
        y_position
    )

# Check whether the explorer reached the goal
def check_goal():
    goal_x, goal_y = GOAL_POSITION
    if (
        abs(player.xcor() - goal_x) <= MOVE_DISTANCE
        and abs(player.ycor() - goal_y) <= MOVE_DISTANCE
    ):
        status.clear()
        status.goto(0, 165)
        status.write(
            "Maze complete!",
            align="center",
            font=("Arial", 20, "bold")
        )
        add_victory_art()

# Move only when the next position is open
def move_by(x_change, y_change):
    next_x = player.xcor() + x_change
    next_y = player.ycor() + y_change
    if can_move_to(next_x, next_y):
        player.goto(next_x, next_y)
        check_goal()
    screen.update()

# Face and move in each arrow-key direction
def move_up():
    player.setheading(90)
    move_by(0, MOVE_DISTANCE)

def move_down():
    player.setheading(270)
    move_by(0, -MOVE_DISTANCE)

def move_left():
    player.setheading(180)
    move_by(-MOVE_DISTANCE, 0)

def move_right():
    player.setheading(0)
    move_by(MOVE_DISTANCE, 0)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_up, "Up")
screen.onkey(move_down, "Down")
screen.onkey(move_left, "Left")
screen.onkey(move_right, "Right")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Draw the finished maze and prepare the explorer
for maze_wall in WALLS:
    draw_wall(maze_wall)

player.color(player_color())
goal.dot(GOAL_SIZE, GOAL_COLOR)
screen.update()
`;

export const pgzeroStarterCode = `import pgzrun

WIDTH = 640
HEIGHT = 400

player = Actor("student", (WIDTH / 2, HEIGHT / 2))
player.width = 72
player.height = 72

def draw():
\tscreen.clear()
\tscreen.draw.text("Use the arrow keys to move.", (24, 24), color="white", fontsize=28)
\tplayer.draw()

def update():
\tif keyboard.left:
\t\tplayer.x -= 4
\tif keyboard.right:
\t\tplayer.x += 4
\tif keyboard.up:
\t\tplayer.y -= 4
\tif keyboard.down:
\t\tplayer.y += 4

pgzrun.go()
`;

export const pgzeroCourseStarterCode = `WIDTH = 640
HEIGHT = 400
`;

export const pgzeroStudentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
	<rect width="120" height="120" rx="26" fill="#5eead4"/>
	<circle cx="42" cy="48" r="8" fill="#0f172a"/>
	<circle cx="78" cy="48" r="8" fill="#0f172a"/>
	<path d="M36 75c13 14 35 14 48 0" fill="none" stroke="#0f172a" stroke-linecap="round" stroke-width="8"/>
</svg>
`;

export const dataScienceSampleCsv = `student,pre,post
Ari,62,81
Bao,71,85
Cleo,58,76
Dev,80,90
`;

export const dataScienceStarterCode = `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

scores = pd.read_csv("scores.csv")

scores["growth"] = scores["post"] - scores["pre"]
print(scores)
print()
print("Average growth:", round(scores["growth"].mean(), 2))

plt.figure(figsize=(7, 4))
plt.bar(scores["student"], scores["growth"], color="#0f766e")
plt.title("Growth from pre-check to post-check")
plt.xlabel("Student")
plt.ylabel("Point growth")
plt.tight_layout()
`;

export function getPythonIdeModeLabel(mode: PythonIdeMode) {
	if (mode === "data") return "Data / AI";
	if (mode === "pgzero") return "PyGame Zero";
	if (mode === "turtle") return "Turtle";
	return "Python";
}

function getDemoStarterCode(mode: PythonIdeMode) {
	if (mode === "data") return dataScienceStarterCode;
	if (mode === "pgzero") return pgzeroStarterCode;
	if (mode === "turtle") return turtleStarterCode;
	return pythonStarterCode;
}

function clonePythonIdeFiles(files: PythonIdeFile[]) {
	return files.map(file => ({
		name: file.name,
		content: file.content,
		encoding: file.encoding
	}));
}

function getBlankStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "pgzero") return getCourseStarterFiles(mode);

	return [
		{
			name: "main.py",
			content: ""
		}
	];
}

function getCourseStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "pgzero") {
		return [
			{
				name: "main.py",
				content: pgzeroCourseStarterCode
			}
		];
	}

	return getBlankStarterFiles(mode);
}

function getDemoStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	const files = [
		{
			name: "main.py",
			content: getDemoStarterCode(mode)
		}
	];

	if (mode === "data") {
		files.push({
			name: "scores.csv",
			content: dataScienceSampleCsv
		});
	}

	if (mode === "pgzero") {
		files.push({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});
	}

	return files;
}

function getGuidedTurtleStarterFiles(
	mode: PythonIdeMode,
	starterCode: string
): PythonIdeFile[] {
	if (mode !== "turtle") return getBlankStarterFiles(mode);

	return [
		{
			name: "main.py",
			content: starterCode
		}
	];
}

export const pythonIdeClassroomSectionsCode = `########################
###   NORMAL SECTION  ###
########################
# Complete the Normal task from the course project card
# The completed project still runs while this function is empty
def normal_addition():
    pass


######################
###   HARD SECTION  ###
######################
# Complete the Hard task after the Normal version works
# This section can remain empty without breaking the project
def hard_addition():
    pass
`;

const PYTHON_IDE_CLASSROOM_CALLS = `# Run both classroom additions after the completed setup
normal_addition()
hard_addition()
`;
const PYTHON_IDE_CLASSROOM_BLOCKING_RE =
	/^(?:while\b[^\n]*:|pgzrun\.go\s*\(|(?:\w+\.)*(?:done|exitonclick|listen|mainloop)\s*\()/m;

function pythonIdeClassroomDefinitionIndex(source: string) {
	const lines = source.split("\n");
	let index = 0;

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex] ?? "";
		const trimmedLine = line.trim();
		if (
			trimmedLine &&
			!trimmedLine.startsWith("#") &&
			!trimmedLine.startsWith("from __future__ import ")
		) {
			break;
		}
		index += line.length;
		if (lineIndex < lines.length - 1) index += 1;
	}

	return index;
}

export function addPythonIdeClassroomSectionsToSource(source: string) {
	if (
		source.includes("###   NORMAL SECTION") &&
		source.includes("###   HARD SECTION")
	) {
		return source;
	}

	const blockerIndex = source.search(PYTHON_IDE_CLASSROOM_BLOCKING_RE);
	const completedFramework =
		blockerIndex >= 0
			? `${source.slice(0, blockerIndex)}${PYTHON_IDE_CLASSROOM_CALLS}\n${source.slice(blockerIndex)}`
			: `${source.trimEnd()}\n\n\n${PYTHON_IDE_CLASSROOM_CALLS}`;
	const definitionIndex =
		pythonIdeClassroomDefinitionIndex(completedFramework);

	return `${completedFramework.slice(0, definitionIndex)}${pythonIdeClassroomSectionsCode}\n\n\n${completedFramework.slice(definitionIndex)}`;
}

export function addPythonIdeClassroomSections(
	files: PythonIdeFile[]
): PythonIdeFile[] {
	const targetIndex = files.findIndex(
		file =>
			(file.encoding ?? "text") === "text" &&
			file.name.toLowerCase() === "main.py"
	);
	const fallbackIndex = files.findIndex(
		file =>
			(file.encoding ?? "text") === "text" &&
			file.name.toLowerCase().endsWith(".py")
	);
	const fileIndex = targetIndex >= 0 ? targetIndex : fallbackIndex;
	if (fileIndex < 0) return files.map(file => ({ ...file }));

	return files.map((file, index) =>
		index === fileIndex
			? {
					...file,
					content: addPythonIdeClassroomSectionsToSource(file.content)
				}
			: { ...file }
	);
}

function getStarterFilesForTemplate(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate
) {
	if (template === "circle-art") {
		return getGuidedTurtleStarterFiles(mode, turtleCircleArtStarterCode);
	}
	if (template === "demo") return getDemoStarterFiles(mode);
	if (template === "firework-festival") {
		return getGuidedTurtleStarterFiles(
			mode,
			turtleFireworkFestivalStarterCode
		);
	}
	if (template === "flower-garden") {
		return getGuidedTurtleStarterFiles(mode, turtleFlowerGardenStarterCode);
	}
	if (template === "maze-explorer") {
		return getGuidedTurtleStarterFiles(mode, turtleMazeExplorerStarterCode);
	}
	if (template === "neon-trail") {
		return getGuidedTurtleStarterFiles(mode, turtleNeonTrailStarterCode);
	}
	if (template === "picasso") {
		return getGuidedTurtleStarterFiles(mode, turtlePicassoStarterCode);
	}
	if (template === "spiral-galaxy") {
		return getGuidedTurtleStarterFiles(mode, turtleSpiralGalaxyStarterCode);
	}
	if (template === "turtle-race") {
		return getGuidedTurtleStarterFiles(mode, turtleRaceDayStarterCode);
	}
	if (template === "triangle-motion") {
		return getGuidedTurtleStarterFiles(
			mode,
			turtleTriangleMotionStarterCode
		);
	}
	if (template === "classroom-project") {
		return addPythonIdeClassroomSections(getCourseStarterFiles(mode));
	}
	if (template === "course") return getCourseStarterFiles(mode);
	return getBlankStarterFiles(mode);
}

export function resolvePythonIdeActiveFileName(
	files: PythonIdeFile[],
	preferredFileName?: string
) {
	return (
		files.find(file => file.name === preferredFileName)?.name ??
		files.find(file => file.name === "main.py")?.name ??
		files.find(file => isPythonIdePythonFile(file.name))?.name ??
		files[0]?.name ??
		"main.py"
	);
}

function projectTitleForMode(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate = "blank"
) {
	if (template === "circle-art" && mode === "turtle")
		return "Color Circle Art";
	if (template === "firework-festival" && mode === "turtle")
		return "Firework Festival";
	if (template === "flower-garden" && mode === "turtle")
		return "Flower Garden Clicker";
	if (template === "maze-explorer" && mode === "turtle")
		return "Maze Explorer";
	if (template === "neon-trail" && mode === "turtle")
		return "Neon Trail Painter";
	if (template === "picasso" && mode === "turtle")
		return "Picasso Keyboard Painter";
	if (template === "spiral-galaxy" && mode === "turtle")
		return "Spiral Galaxy";
	if (template === "turtle-race" && mode === "turtle")
		return "Turtle Race Day";
	if (template === "triangle-motion" && mode === "turtle")
		return "Triangle Motion Starter";

	return mode === "data"
		? "Data / AI Notebook"
		: mode === "pgzero"
			? "PyGame Zero Game"
			: mode === "turtle"
				? "Turtle Drawing"
				: "Python Practice";
}

export function createPythonIdeProject(
	mode: PythonIdeMode = "python",
	options: CreatePythonIdeProjectOptions = {}
): PythonIdeProject {
	const now = new Date().toISOString();
	const template = options.template ?? "blank";
	const files = options.files?.length
		? clonePythonIdeFiles(options.files)
		: getStarterFilesForTemplate(mode, template);
	return {
		_id: `local-${crypto.randomUUID()}`,
		title: options.title ?? projectTitleForMode(mode, template),
		mode,
		files,
		activeFileName: resolvePythonIdeActiveFileName(files),
		courseID: options.courseID,
		courseProjectKey: options.courseProjectKey,
		courseProjectTitle: options.courseProjectTitle,
		starterLabel: options.starterLabel,
		starterUrl: options.starterUrl,
		createdAt: now,
		updatedAt: now
	};
}

export function pythonIdeProjectToPayload(
	project: PythonIdeProject
): PythonIdeProjectPayload {
	return {
		title: project.title.trim() || "Untitled Python Project",
		mode: project.mode,
		files: project.files,
		activeFileName: resolvePythonIdeActiveFileName(
			project.files,
			project.activeFileName
		),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl
	};
}

export function plainPythonIdeProjectSnapshot(
	project: PythonIdeProject
): PythonIdeProject {
	return {
		...project,
		files: project.files.map(file => ({ ...file }))
	};
}

export function plainPythonIdeProjectsSnapshot(
	projects: PythonIdeProject[]
): PythonIdeProject[] {
	return projects.map(plainPythonIdeProjectSnapshot);
}

export function createVolatileStudentPythonProjectRecovery(): VolatileStudentPythonProjectRecovery {
	let recovery:
		| {
				unsynced: boolean;
				projects: PythonIdeProject[];
				studentID: string;
		  }
		| undefined;
	return {
		acknowledge(studentID) {
			if (recovery?.studentID === studentID) recovery = undefined;
		},
		discard(studentID) {
			if (!studentID || recovery?.studentID === studentID) {
				recovery = undefined;
			}
		},
		forStudent(studentID) {
			return recovery?.studentID === studentID
				? plainPythonIdeProjectsSnapshot(recovery.projects)
				: [];
		},
		has(studentID) {
			return recovery?.studentID === studentID;
		},
		hasAnyUnsynced() {
			return recovery?.unsynced ?? false;
		},
		hasUnsynced(studentID) {
			return recovery?.studentID === studentID && recovery.unsynced;
		},
		replace(studentID, projects, options = {}) {
			if (!projects.length) {
				if (recovery?.studentID === studentID) recovery = undefined;
				return;
			}
			const existingUnsynced =
				recovery?.studentID === studentID && recovery.unsynced;
			recovery = {
				projects: plainPythonIdeProjectsSnapshot(projects),
				studentID,
				unsynced: options.unsynced !== false || existingUnsynced
			};
		},
		retainAcrossOwnerChange(nextStudentID) {
			if (
				nextStudentID &&
				recovery &&
				recovery.studentID !== nextStudentID
			) {
				recovery = undefined;
			}
		}
	};
}

export const volatileStudentPythonProjectRecovery =
	createVolatileStudentPythonProjectRecovery();

export function pythonIdeImportID(
	project: Pick<PythonIdeProject, "_id" | "importID">
) {
	return project.importID ?? project._id;
}

export function pythonIdeStorageKey(userID?: string | null) {
	return `${pythonIdeStorageNamespace}:${userID || "anonymous"}`;
}

function pythonIdeRecoveryStoragePrefix(userID: string) {
	return `${pythonIdeStorageKey(userID)}:recovery:`;
}

function pythonIdeCurrentRecoveryStorageKey(userID: string) {
	return `${pythonIdeRecoveryStoragePrefix(userID)}${pythonIdeRecoveryTabID}`;
}

function pythonIdeActiveStorageKey(userID?: string | null) {
	return userID
		? pythonIdeCurrentRecoveryStorageKey(userID)
		: pythonIdeStorageKey(null);
}

function pythonIdeAnonymousClaimStoragePrefix() {
	return `${pythonIdeStorageNamespace}:anonymous-claim:`;
}

function pythonIdeAnonymousClaimStorageKey(projectID: string) {
	return `${pythonIdeAnonymousClaimStoragePrefix()}${projectID}`;
}

export function normalizePythonFileName(value: string) {
	const cleaned = value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.\/+/, "")
		.replace(/\/+/g, "/");
	if (!cleaned) return "";
	const segments = cleaned
		.split("/")
		.map(segment => segment.trim().replaceAll(WHITESPACE_RE, "_"))
		.filter(Boolean);
	if (!segments.length) return "";
	const fileName = segments[segments.length - 1] ?? "";
	const extensionMatch = fileName.match(FILE_EXTENSION_RE);
	if (!extensionMatch) return `${segments.join("/")}.py`;
	const extension = extensionMatch[0].toLowerCase();
	const stem = fileName.slice(0, -extensionMatch[0].length);
	segments[segments.length - 1] = `${stem}${extension}`;
	return segments.join("/");
}

export function isPythonIdeRuntimeReservedPath(value: string) {
	const normalized = value.trim().replaceAll("\\", "/").toLowerCase();
	if (!normalized) return false;
	if (PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES.has(normalized)) return true;

	const root = normalized.split("/")[0] ?? "";
	return PYTHON_IDE_RUNTIME_RESERVED_ROOTS.has(root);
}

export function isValidPythonFileName(value: string) {
	if (!value || value.length > 80) return false;
	if (value.startsWith("/") || value.includes("\\") || value.includes("//"))
		return false;

	const segments = value.split("/");
	if (
		segments.some(
			segment =>
				!segment ||
				segment === "." ||
				segment === ".." ||
				!SAFE_FILE_SEGMENT_RE.test(segment)
		)
	) {
		return false;
	}

	if (isPythonIdeRuntimeReservedPath(value)) return false;

	if (PYTHON_EXTENSION_RE.test(value)) {
		const rootDirectory = segments[0]?.toLowerCase();
		return !rootDirectory || !ASSET_DIRECTORY_NAMES.has(rootDirectory);
	}

	if (segments.length === 1) return ROOT_TEXT_FILE_RE.test(value);
	if (segments.length !== 2) return false;
	return IMAGE_FILE_RE.test(value) || AUDIO_FILE_RE.test(value);
}

export function isPythonIdePythonFile(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
}

export function isPythonIdeTextFile(value: string) {
	return TEXT_FILE_RE.test(value);
}

export function isPythonIdeBinaryAssetFile(
	file: Pick<PythonIdeFile, "encoding">
) {
	return file.encoding === "base64";
}

export function normalizeImportedPythonIdeFileName(value: string) {
	const baseName = value.split(/[\\/]/).pop() ?? value;
	const normalized = normalizePythonFileName(baseName);
	if (IMAGE_EXTENSION_RE.test(normalized)) return `images/${normalized}`;
	if (SOUND_EXTENSION_RE.test(normalized)) return `sounds/${normalized}`;
	if (MUSIC_EXTENSION_RE.test(normalized)) return `music/${normalized}`;
	return normalized;
}

export function getPythonIdeFileMimeType(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".gif") return "image/gif";
	if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
	if (extension === ".mp3") return "audio/mpeg";
	if (extension === ".ogg") return "audio/ogg";
	if (extension === ".png") return "image/png";
	if (extension === ".svg") return "image/svg+xml";
	if (extension === ".wav") return "audio/wav";
	if (extension === ".webp") return "image/webp";
	return "";
}

export function getPythonIdeAssetDataUrl(file: PythonIdeFile) {
	const mimeType = getPythonIdeFileMimeType(file.name);
	if (!mimeType) return "";
	if (file.encoding === "base64")
		return `data:${mimeType};base64,${file.content}`;
	if (mimeType === "image/svg+xml") {
		return `data:${mimeType};charset=utf-8,${encodeURIComponent(file.content)}`;
	}
	return "";
}

export function getPythonIdeFileKindLabel(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "CSV";
	if (extension === ".json") return "JSON";
	if (extension === ".md") return "Markdown";
	if (extension === ".txt") return "Text";
	if (IMAGE_EXTENSION_RE.test(value)) return "Image";
	if (value.startsWith("music/")) return "Music";
	if (AUDIO_FILE_RE.test(value)) return "Sound";
	return "Python";
}

export function getPythonIdeDefaultFileContent(fileName: string) {
	const extension = fileName.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "name,value\nsample,1\n";
	if (extension === ".json") return '{\n\t"items": []\n}\n';
	if (extension === ".md") return "# Notes\n\n";
	if (extension === ".txt") return "";
	return "# Add your Python code here.\n";
}

function baseName(path: string) {
	return path.split("/").filter(Boolean).at(-1) ?? path;
}

function safeProjectFileNameFromStarterPath(
	path: string,
	resourceBasePath: string,
	usedFileNames: Set<string>
) {
	const basePath = resourceBasePath.replace(/\/+$/, "");
	const relativePath =
		basePath && path.startsWith(`${basePath}/`)
			? path.slice(basePath.length + 1)
			: path;
	const normalizedRelativePath = relativePath
		.replace(STARTER_RELATIVE_PREFIX_RE, "")
		.replace(/^\/+/, "");
	const candidatePath = normalizePythonFileName(normalizedRelativePath);
	let fileName = isValidPythonFileName(candidatePath)
		? candidatePath
		: normalizePythonFileName(baseName(normalizedRelativePath));

	if (!isValidPythonFileName(fileName)) return "";

	if (usedFileNames.has(fileName)) {
		const extension = fileName.match(FILE_EXTENSION_RE)?.[0] ?? "";
		const stem = extension
			? fileName.slice(0, -extension.length)
			: fileName;
		let duplicateIndex = 2;
		while (usedFileNames.has(`${stem}_${duplicateIndex}${extension}`)) {
			duplicateIndex += 1;
		}
		fileName = `${stem}_${duplicateIndex}${extension}`;
	}

	usedFileNames.add(fileName);
	return fileName;
}

export async function loadPythonIdeStarterFilesFromGitHub(
	starterUrl: string
): Promise<PythonIdeFile[]> {
	const resource = parseGitHubResource(starterUrl);
	if (!resource) {
		throw new Error(
			"Only public GitHub starter links can open in the IDE."
		);
	}

	const previewFiles = await listPreviewFiles(starterUrl);
	const usedFileNames = new Set<string>();
	const starterFiles: PythonIdeFile[] = [];

	for (const file of previewFiles) {
		const name = safeProjectFileNameFromStarterPath(
			file.path,
			resource.path,
			usedFileNames
		);
		if (!name || !isPythonIdeTextFile(name)) continue;

		const preview = await loadPreviewFile(file);
		starterFiles.push({
			name,
			content: preview.content,
			encoding: "text"
		});
	}

	const runnableFileIndex = starterFiles.findIndex(file =>
		isPythonIdePythonFile(file.name)
	);
	if (runnableFileIndex <= 0) return starterFiles;

	const [runnableFile] = starterFiles.splice(runnableFileIndex, 1);
	if (runnableFile) starterFiles.unshift(runnableFile);
	return starterFiles;
}

export function getPythonIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files">
) {
	return (
		project.files.find(
			file =>
				file.name === project.activeFileName &&
				isPythonIdePythonFile(file.name)
		) ??
		project.files.find(file => isPythonIdePythonFile(file.name)) ??
		null
	);
}

function pythonIdeProjectSetUpdatedAt(projects: PythonIdeProject[]) {
	return projects.reduce((latest, project) => {
		const updatedAt = Date.parse(
			project.updatedAt ?? project.createdAt ?? ""
		);
		return Number.isFinite(updatedAt)
			? Math.max(latest, updatedAt)
			: latest;
	}, 0);
}

function newPythonIdeStorageRevision() {
	return typeof crypto === "undefined"
		? `revision-${Date.now()}-${Math.random().toString(36).slice(2)}`
		: crypto.randomUUID();
}

function pythonIdeProjectsFingerprint(projects: PythonIdeProject[]) {
	return JSON.stringify(plainPythonIdeProjectsSnapshot(projects));
}

function parseLocalPythonProjectRecord(
	key: string,
	raw: string
): PythonIdeProjectStorageRecord | null {
	try {
		const parsed = JSON.parse(raw) as
			PythonIdeProject[] | Partial<PythonIdeProjectStorageRecord>;
		if (Array.isArray(parsed)) {
			const latestProjectUpdate = pythonIdeProjectSetUpdatedAt(parsed);
			return {
				key,
				projects: parsed,
				revision: `legacy-${latestProjectUpdate}`,
				updatedAt: new Date(latestProjectUpdate || 0).toISOString()
			};
		}
		if (!parsed || !Array.isArray(parsed.projects)) return null;
		return {
			key,
			projects: parsed.projects,
			revision:
				typeof parsed.revision === "string"
					? parsed.revision
					: `legacy-${pythonIdeProjectSetUpdatedAt(parsed.projects)}`,
			updatedAt:
				typeof parsed.updatedAt === "string"
					? parsed.updatedAt
					: new Date(
							pythonIdeProjectSetUpdatedAt(parsed.projects) || 0
						).toISOString()
		};
	} catch {
		return null;
	}
}

function localStorageKeys() {
	if (typeof window === "undefined") return [];
	const keys: string[] = [];
	try {
		for (let index = 0; index < window.localStorage.length; index++) {
			const key = window.localStorage.key(index);
			if (key) keys.push(key);
		}
	} catch {
		// A directly addressable current-tab key remains available below.
	}
	return keys;
}

function localPythonProjectStorageKeys(userID?: string | null) {
	const baseKey = pythonIdeStorageKey(userID);
	if (!userID) return [baseKey];
	const prefix = pythonIdeRecoveryStoragePrefix(userID);
	return [
		...new Set([
			baseKey,
			pythonIdeCurrentRecoveryStorageKey(userID),
			...localStorageKeys().filter(key => key.startsWith(prefix))
		])
	];
}

function localAnonymousClaimedProjectIDs() {
	if (typeof window === "undefined") return new Set<string>();
	const prefix = pythonIdeAnonymousClaimStoragePrefix();
	return new Set(
		localStorageKeys()
			.filter(key => key.startsWith(prefix))
			.map(key => key.slice(prefix.length))
			.filter(Boolean)
	);
}

function mergePythonIdeRecoveryProjects(
	records: PythonIdeProjectStorageRecord[],
	claimedProjectIDs = new Set<string>()
) {
	const projects: PythonIdeProject[] = [];
	const seen = new Set<string>();
	for (const record of records) {
		for (const project of record.projects) {
			if (claimedProjectIDs.has(project._id)) continue;
			const fingerprint = `${project._id}:${pythonIdeProjectsFingerprint([
				project
			])}`;
			if (seen.has(fingerprint)) continue;
			seen.add(fingerprint);
			projects.push(plainPythonIdeProjectSnapshot(project));
		}
	}
	return projects;
}

export function loadLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return [];
	if (userID) {
		// Authenticated project state is server-authoritative. Never trust
		// owner-keyed browser content, including records planted by another user
		// of a shared classroom device.
		clearAllStudentPythonProjectRecoveryFromLocalStorage();
		return [];
	}
	const records: PythonIdeProjectStorageRecord[] = [];
	for (const key of localPythonProjectStorageKeys(userID)) {
		try {
			const raw = window.localStorage.getItem(key);
			if (!raw) continue;
			const record = parseLocalPythonProjectRecord(key, raw);
			if (record) records.push(record);
		} catch {
			// Ignore only the unreadable browser-storage record.
		}
	}
	return mergePythonIdeRecoveryProjects(
		records,
		userID ? undefined : localAnonymousClaimedProjectIDs()
	);
}

function localStorageRecordValue(
	record: PythonIdeProjectStorageRecord,
	userID?: string | null
) {
	return JSON.stringify(
		userID
			? {
					projects: record.projects,
					revision: record.revision,
					updatedAt: record.updatedAt
				}
			: record.projects
	);
}

function writeLocalPythonProjectRecord(
	record: PythonIdeProjectStorageRecord,
	userID?: string | null
) {
	window.localStorage.setItem(
		record.key,
		localStorageRecordValue(record, userID)
	);
}

export function saveLocalPythonProjects(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	if (typeof window === "undefined") return;
	if (userID) {
		clearAllStudentPythonProjectRecoveryFromLocalStorage();
		return;
	}
	const claimedProjectIDs = userID
		? new Set<string>()
		: localAnonymousClaimedProjectIDs();
	const snapshot = plainPythonIdeProjectsSnapshot(projects).filter(
		project => !claimedProjectIDs.has(project._id)
	);
	writeLocalPythonProjectRecord(
		{
			key: pythonIdeActiveStorageKey(userID),
			projects: snapshot,
			revision: newPythonIdeStorageRevision(),
			updatedAt: new Date().toISOString()
		},
		userID
	);
}

function recordUpdatedAt(record: PythonIdeProjectStorageRecord) {
	const timestamp = Date.parse(record.updatedAt);
	return Number.isFinite(timestamp) ? timestamp : 0;
}

function chooseLatestPythonIdeStorageRecord(
	first: PythonIdeProjectStorageRecord,
	second: PythonIdeProjectStorageRecord
) {
	return recordUpdatedAt(second) >= recordUpdatedAt(first) ? second : first;
}

export async function loadLocalPythonProjectRecoverySnapshot(
	userID?: string | null
): Promise<PythonIdeLocalRecoverySnapshot> {
	if (userID) {
		await purgeAllStudentPythonProjectRecovery();
		return { projects: [], records: [] };
	}
	const idbRecords = await readIndexedDbPythonProjectRecords(userID);
	const idbByKey = new Map(idbRecords.map(record => [record.key, record]));
	const localByKey = new Map<
		string,
		{ raw: string; record: PythonIdeProjectStorageRecord }
	>();
	for (const key of localPythonProjectStorageKeys(userID)) {
		if (typeof window === "undefined") break;
		try {
			const raw = window.localStorage.getItem(key);
			if (!raw) continue;
			const record = parseLocalPythonProjectRecord(key, raw);
			if (record) localByKey.set(key, { raw, record });
		} catch {
			// IndexedDB remains available when its local mirror is blocked.
		}
	}

	const keys = new Set([...idbByKey.keys(), ...localByKey.keys()]);
	const records: PythonIdeProjectStorageRecord[] = [];
	const tokens: PythonIdeLocalRecoveryRecordToken[] = [];
	for (const key of keys) {
		const idbRecord = idbByKey.get(key);
		const localRecord = localByKey.get(key);
		const selected =
			idbRecord && localRecord
				? chooseLatestPythonIdeStorageRecord(
						idbRecord,
						localRecord.record
					)
				: (idbRecord ?? localRecord?.record);
		if (!selected) continue;
		const storesDiverged =
			!!idbRecord &&
			!!localRecord &&
			pythonIdeProjectsFingerprint(idbRecord.projects) !==
				pythonIdeProjectsFingerprint(localRecord.record.projects);
		if (storesDiverged) {
			// A crash can leave IndexedDB and its local mirror at different
			// revisions with indistinguishable wall-clock timestamps. Reconcile
			// both contents rather than guessing and deleting one unseen version.
			records.push(idbRecord, localRecord.record);
		} else {
			records.push(selected);
		}
		tokens.push({
			key,
			idbFingerprint: idbRecord
				? pythonIdeProjectsFingerprint(idbRecord.projects)
				: undefined,
			idbRevision: idbRecord?.revision,
			idbUpdatedAt: idbRecord?.updatedAt,
			localValue: localRecord?.raw
		});
	}

	const claimedProjectIDs = userID
		? new Set<string>()
		: new Set([
				...localAnonymousClaimedProjectIDs(),
				...(await readIndexedDbAnonymousClaimedProjectIDs())
			]);
	return {
		projects: mergePythonIdeRecoveryProjects(records, claimedProjectIDs),
		records: tokens
	};
}

export async function loadCurrentTabPythonProjectRecoverySnapshot(
	userID?: string | null
): Promise<PythonIdeLocalRecoverySnapshot> {
	const snapshot = await loadLocalPythonProjectRecoverySnapshot(userID);
	const currentKey = pythonIdeActiveStorageKey(userID);
	return {
		projects: snapshot.projects,
		records: snapshot.records.filter(record => record.key === currentKey)
	};
}

export async function loadLocalPythonProjectsAsync(userID?: string | null) {
	return (await loadLocalPythonProjectRecoverySnapshot(userID)).projects;
}

export async function saveLocalPythonProjectsAsync(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	if (userID) {
		await purgeAllStudentPythonProjectRecovery();
		return;
	}
	const claimedProjectIDs = userID
		? new Set<string>()
		: new Set([
				...localAnonymousClaimedProjectIDs(),
				...(await readIndexedDbAnonymousClaimedProjectIDs())
			]);
	const snapshot = plainPythonIdeProjectsSnapshot(projects).filter(
		project => !claimedProjectIDs.has(project._id)
	);
	const record = {
		key: pythonIdeActiveStorageKey(userID),
		projects: snapshot,
		revision: newPythonIdeStorageRevision(),
		updatedAt: new Date().toISOString()
	} satisfies PythonIdeProjectStorageRecord;

	try {
		await writeIndexedDbPythonProjects(record);
		saveLegacyLocalPythonProjectsMirror(record, userID);
	} catch (indexedDbError) {
		try {
			writeLocalPythonProjectRecord(record, userID);
		} catch {
			throw new Error(
				`Could not save Python IDE projects locally. Browser project storage may be full or unavailable. (${formatStorageError(indexedDbError)})`
			);
		}
	}
}

/**
 * Atomically remove an anonymous browser project from the shared workspace
 * before an account upload begins. The caller holds the returned project only
 * in authenticated memory. A durable claim marker prevents a stale anonymous
 * tab from publishing it back into shared storage.
 */
export async function claimAnonymousPythonProjectForStudent(
	project: PythonIdeProject,
	studentID: string
) {
	if (typeof window === "undefined" || !window.indexedDB) {
		throw new Error(
			"Could not safely move this browser project into the student account. This browser needs IndexedDB project storage."
		);
	}
	const db = await openPythonIdeStorageDb();
	const anonymousSnapshot =
		await loadLocalPythonProjectRecoverySnapshot(null);
	const claimedProject = anonymousSnapshot.projects.find(
		candidate => candidate._id === project._id
	);
	if (!claimedProject) {
		throw new Error(
			"This browser project changed before it could be moved. Reload and try again."
		);
	}

	const claimKey = pythonIdeAnonymousClaimStorageKey(project._id);
	const claimMarker = JSON.stringify({ studentID });
	const anonymousKey = pythonIdeStorageKey(null);
	const now = new Date().toISOString();
	const latestAnonymousProjects = loadLocalPythonProjects(null);

	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	const store = transaction.objectStore(PYTHON_IDE_PROJECT_STORE);

	try {
		const currentAnonymous = await indexedDbRequest<
			PythonIdeProjectStorageRecord | undefined
		>(store.get(anonymousKey));
		const anonymousProjects = mergePythonIdeRecoveryProjects([
			{
				key: anonymousKey,
				projects: [
					...anonymousSnapshot.projects,
					...latestAnonymousProjects,
					...(currentAnonymous?.projects ?? [])
				],
				updatedAt: now
			}
		]).filter(candidate => candidate._id !== project._id);
		const anonymousRecord = {
			key: anonymousKey,
			projects: anonymousProjects,
			revision: newPythonIdeStorageRevision(),
			updatedAt: now
		} satisfies PythonIdeProjectStorageRecord;
		const claimRecord = {
			key: claimKey,
			projects: [],
			revision: newPythonIdeStorageRevision(),
			updatedAt: now,
			claimedProjectID: project._id,
			claimedStudentID: studentID
		} satisfies PythonIdeProjectStorageRecord;

		store.put(anonymousRecord);
		store.put(claimRecord);
		await indexedDbTransactionDone(transaction);

		// The durable claim marker is authoritative. These mirrors make stale
		// anonymous tabs fail closed before their next IndexedDB read.
		try {
			window.localStorage.setItem(claimKey, claimMarker);
			writeLocalPythonProjectRecord(anonymousRecord, null);
		} catch {
			// Async readers still enforce the committed IndexedDB marker.
		}
		return plainPythonIdeProjectSnapshot(claimedProject);
	} catch (error) {
		try {
			transaction.abort();
		} catch {
			// The transaction may already have aborted.
		}
		// The transaction is atomic: a failed claim leaves the anonymous project
		// in place and creates no trusted owner-side browser record.
		throw error;
	}
}

export function clearLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return;
	for (const key of localPythonProjectStorageKeys(userID)) {
		window.localStorage.removeItem(key);
	}
}

function isAnonymousPythonIdeStorageKey(key: string) {
	return (
		key === pythonIdeStorageKey(null) ||
		key.startsWith(pythonIdeAnonymousClaimStoragePrefix())
	);
}

function isAnonymousPythonIdeEditorStateKey(key: string) {
	return legacyPythonIdeEditorViewStateStoragePrefixes.some(
		prefix => key === `${prefix}:guest`
	);
}

function isStudentPythonIdeBrowserStorageKey(key: string) {
	if (
		key.startsWith(`${pythonIdeStorageNamespace}:`) &&
		!isAnonymousPythonIdeStorageKey(key)
	) {
		return true;
	}
	return legacyPythonIdeEditorViewStateStoragePrefixes.some(
		prefix =>
			key.startsWith(`${prefix}:`) &&
			!isAnonymousPythonIdeEditorStateKey(key)
	);
}

export function clearAllStudentPythonProjectRecoveryFromLocalStorage() {
	if (typeof window === "undefined") return;
	const keys = localStorageKeys();
	for (const key of keys) {
		if (isStudentPythonIdeBrowserStorageKey(key)) {
			window.localStorage.removeItem(key);
		}
	}
}

export async function purgeStudentPythonProjectRecovery(studentID: string) {
	let indexedDbError: unknown;
	let localStorageError: unknown;
	try {
		clearLocalPythonProjects(studentID);
	} catch (error) {
		localStorageError = error;
	}
	if (typeof window !== "undefined" && window.indexedDB) {
		try {
			await deleteIndexedDbPythonProjectRecords(studentID);
		} catch (error) {
			indexedDbError = error;
		}
	}
	if (indexedDbError || localStorageError) {
		throw new Error(
			`Could not purge legacy student project recovery data. (${formatStorageError(indexedDbError ?? localStorageError)})`
		);
	}
}

export async function purgeAllStudentPythonProjectRecovery() {
	let indexedDbError: unknown;
	let localStorageError: unknown;
	try {
		clearAllStudentPythonProjectRecoveryFromLocalStorage();
	} catch (error) {
		localStorageError = error;
	}
	if (typeof window !== "undefined" && window.indexedDB) {
		try {
			await deleteAllIndexedDbStudentPythonProjectRecords();
		} catch (error) {
			indexedDbError = error;
		}
	}
	if (indexedDbError || localStorageError) {
		throw new Error(
			`Could not purge legacy student project recovery data. (${formatStorageError(indexedDbError ?? localStorageError)})`
		);
	}
}

export async function clearLocalPythonProjectsAsync(userID?: string | null) {
	let indexedDbError: unknown;
	let localStorageError: unknown;

	if (typeof window !== "undefined" && window.indexedDB) {
		try {
			await deleteIndexedDbPythonProjectRecords(userID);
		} catch (error) {
			indexedDbError = error;
		}
	}

	try {
		clearLocalPythonProjects(userID);
	} catch (error) {
		localStorageError = error;
	}

	if (indexedDbError || localStorageError) {
		throw new Error(
			`Could not remove the local Python IDE project copy. (${formatStorageError(indexedDbError ?? localStorageError)})`
		);
	}
}

export async function clearCurrentTabLocalPythonProjectsAsync(
	userID?: string | null
) {
	if (typeof window === "undefined") return;
	const key = pythonIdeActiveStorageKey(userID);
	let indexedDbError: unknown;
	let localStorageError: unknown;
	if (typeof window !== "undefined" && window.indexedDB) {
		try {
			await deleteIndexedDbPythonProjects(key);
		} catch (error) {
			indexedDbError = error;
		}
	}
	try {
		window.localStorage.removeItem(key);
	} catch (error) {
		localStorageError = error;
	}
	if (indexedDbError || localStorageError) {
		throw new Error(
			`Could not remove the current Python IDE recovery copy. (${formatStorageError(indexedDbError ?? localStorageError)})`
		);
	}
}

export async function acknowledgeLocalPythonProjectRecovery(
	snapshot: PythonIdeLocalRecoverySnapshot
) {
	for (const token of snapshot.records) {
		await deleteIndexedDbPythonProjectRecordIfUnchanged(token);
		if (token.localValue === undefined || typeof window === "undefined")
			continue;
		try {
			if (window.localStorage.getItem(token.key) === token.localValue) {
				window.localStorage.removeItem(token.key);
			}
		} catch {
			// The unchanged IndexedDB record was already handled; a blocked
			// best-effort mirror cannot justify deleting a newer recovery record.
		}
	}
}

export async function removeLocalPythonProjectAsync(
	projectID: string,
	userID?: string | null
) {
	const projects = await loadLocalPythonProjectsAsync(userID);
	const remainingProjects = projects.filter(
		project => project._id !== projectID
	);
	if (remainingProjects.length === projects.length) return;
	if (remainingProjects.length) {
		await saveLocalPythonProjectsAsync(remainingProjects, userID);
		return;
	}
	await clearLocalPythonProjectsAsync(userID);
}

export function clearLocalPythonIdeEditorState(userID?: string | null) {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(
		`${pythonIdeEditorViewStateStoragePrefix}:${userID ?? "guest"}`
	);
}

async function readIndexedDbPythonProjectRecords(userID?: string | null) {
	if (userID) return [];
	try {
		const db = await openPythonIdeStorageDb();
		const transaction = db.transaction(
			PYTHON_IDE_PROJECT_STORE,
			"readonly"
		);
		const allRecords = await indexedDbRequest<
			PythonIdeProjectStorageRecord[]
		>(transaction.objectStore(PYTHON_IDE_PROJECT_STORE).getAll());
		await indexedDbTransactionDone(transaction);
		const baseKey = pythonIdeStorageKey(userID);
		const recoveryPrefix = userID
			? pythonIdeRecoveryStoragePrefix(userID)
			: "";
		return allRecords.filter(
			record =>
				Array.isArray(record.projects) &&
				(record.key === baseKey ||
					(!!userID && record.key.startsWith(recoveryPrefix)))
		);
	} catch {
		return [];
	}
}

async function readIndexedDbAnonymousClaimedProjectIDs() {
	try {
		const db = await openPythonIdeStorageDb();
		const transaction = db.transaction(
			PYTHON_IDE_PROJECT_STORE,
			"readonly"
		);
		const allRecords = await indexedDbRequest<
			PythonIdeProjectStorageRecord[]
		>(transaction.objectStore(PYTHON_IDE_PROJECT_STORE).getAll());
		await indexedDbTransactionDone(transaction);
		return allRecords.flatMap(record =>
			record.claimedProjectID ? [record.claimedProjectID] : []
		);
	} catch {
		return [];
	}
}

async function writeIndexedDbPythonProjects(
	record: PythonIdeProjectStorageRecord
) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).put(record)
	);
	await indexedDbTransactionDone(transaction);
}

async function deleteIndexedDbPythonProjects(key: string) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).delete(key)
	);
	await indexedDbTransactionDone(transaction);
}

async function deleteIndexedDbPythonProjectRecords(userID?: string | null) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	const store = transaction.objectStore(PYTHON_IDE_PROJECT_STORE);
	const keys = await indexedDbRequest<IDBValidKey[]>(store.getAllKeys());
	const baseKey = pythonIdeStorageKey(userID);
	const recoveryPrefix = userID ? pythonIdeRecoveryStoragePrefix(userID) : "";
	for (const keyValue of keys) {
		const key = String(keyValue);
		if (key === baseKey || (!!userID && key.startsWith(recoveryPrefix))) {
			store.delete(key);
		}
	}
	await indexedDbTransactionDone(transaction);
}

async function deleteAllIndexedDbStudentPythonProjectRecords() {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	const store = transaction.objectStore(PYTHON_IDE_PROJECT_STORE);
	const keys = await indexedDbRequest<IDBValidKey[]>(store.getAllKeys());
	for (const keyValue of keys) {
		const key = String(keyValue);
		if (
			key.startsWith(`${pythonIdeStorageNamespace}:`) &&
			!isAnonymousPythonIdeStorageKey(key)
		) {
			store.delete(key);
		}
	}
	await indexedDbTransactionDone(transaction);
}

async function deleteIndexedDbPythonProjectRecordIfUnchanged(
	token: PythonIdeLocalRecoveryRecordToken
) {
	if (
		typeof window === "undefined" ||
		!window.indexedDB ||
		token.idbUpdatedAt === undefined
	) {
		return;
	}
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	const store = transaction.objectStore(PYTHON_IDE_PROJECT_STORE);
	const current = await indexedDbRequest<
		PythonIdeProjectStorageRecord | undefined
	>(store.get(token.key));
	if (
		current &&
		current.updatedAt === token.idbUpdatedAt &&
		current.revision === token.idbRevision &&
		pythonIdeProjectsFingerprint(current.projects) === token.idbFingerprint
	) {
		store.delete(token.key);
	}
	await indexedDbTransactionDone(transaction);
}

function openPythonIdeStorageDb() {
	if (typeof window === "undefined" || !window.indexedDB) {
		return Promise.reject(new Error("IndexedDB is unavailable."));
	}

	pythonIdeStorageDbPromise ??= new Promise<IDBDatabase>(
		(resolve, reject) => {
			const request = window.indexedDB.open(
				PYTHON_IDE_INDEXED_DB_NAME,
				PYTHON_IDE_INDEXED_DB_VERSION
			);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(PYTHON_IDE_PROJECT_STORE)) {
					db.createObjectStore(PYTHON_IDE_PROJECT_STORE, {
						keyPath: "key"
					});
				}
			};
			request.onsuccess = () => {
				const db = request.result;
				db.onversionchange = () => {
					db.close();
					pythonIdeStorageDbPromise = null;
				};
				resolve(db);
			};
			request.onerror = () =>
				reject(request.error ?? new Error("Could not open IndexedDB."));
			request.onblocked = () =>
				reject(
					new Error(
						"Python IDE project storage is blocked by another tab."
					)
				);
		}
	).catch(error => {
		pythonIdeStorageDbPromise = null;
		throw error;
	});

	return pythonIdeStorageDbPromise;
}

function indexedDbRequest<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error("IndexedDB request failed."));
	});
}

function indexedDbTransactionDone(transaction: IDBTransaction) {
	return new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction failed.")
			);
		transaction.onabort = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction aborted.")
			);
	});
}

function saveLegacyLocalPythonProjectsMirror(
	record: PythonIdeProjectStorageRecord,
	userID?: string | null
) {
	try {
		writeLocalPythonProjectRecord(record, userID);
	} catch {
		// IndexedDB remains the primary store; the mirror is best-effort.
	}
}

function formatStorageError(error: unknown) {
	return error instanceof Error ? error.message : "storage unavailable";
}

function normalizeRemotePythonIdeProject(
	project: PythonIdeProject
): PythonIdeProject {
	const snapshot = plainPythonIdeProjectSnapshot(project);
	return {
		...snapshot,
		serverUpdatedAt: snapshot.serverUpdatedAt ?? snapshot.updatedAt
	};
}

function canonicalPythonIdeProjectPayload(payload: PythonIdeProjectPayload) {
	const sourceFiles = payload.files?.length
		? payload.files
		: [{ name: "main.py", content: "", encoding: "text" as const }];
	const seenFileNames = new Set<string>();
	const files = sourceFiles.flatMap(file => {
		const name = file.name.trim();
		if (seenFileNames.has(name)) return [];
		seenFileNames.add(name);
		return [
			{
				content: file.content,
				encoding: file.encoding ?? "text",
				name
			}
		];
	});
	const normalizedFiles = files.length
		? files
		: [{ name: "main.py", content: "", encoding: "text" as const }];
	const requestedActiveFileName = payload.activeFileName?.trim();
	const activeFileName =
		requestedActiveFileName &&
		normalizedFiles.some(file => file.name === requestedActiveFileName)
			? requestedActiveFileName
			: (normalizedFiles[0]?.name ?? "main.py");
	const optionalValue = (value: string | undefined) =>
		value === undefined ? null : value.trim();

	return {
		activeFileName,
		courseID: optionalValue(payload.courseID),
		courseProjectKey: optionalValue(payload.courseProjectKey),
		courseProjectTitle: optionalValue(payload.courseProjectTitle),
		files: normalizedFiles,
		mode: payload.mode ?? "python",
		starterLabel: optionalValue(payload.starterLabel),
		starterUrl: optionalValue(payload.starterUrl),
		title: payload.title?.trim() || "Untitled Python Project"
	};
}

function pythonIdePayloadMatchesProject(
	payload: PythonIdeProjectPayload,
	project: PythonIdeProject
) {
	return (
		JSON.stringify(canonicalPythonIdeProjectPayload(payload)) ===
		JSON.stringify(
			canonicalPythonIdeProjectPayload(pythonIdeProjectToPayload(project))
		)
	);
}

function pythonIdeServerVersionsEqual(
	first: string | undefined,
	second: string | undefined
) {
	if (!first || !second) return false;
	const firstTimestamp = Date.parse(first);
	const secondTimestamp = Date.parse(second);
	if (Number.isFinite(firstTimestamp) && Number.isFinite(secondTimestamp))
		return firstTimestamp === secondTimestamp;
	return first === second;
}

function pythonIdeRemoteProjectIsPristine(project: PythonIdeProject) {
	return pythonIdeServerVersionsEqual(
		project.createdAt,
		project.serverUpdatedAt ?? project.updatedAt
	);
}

function stablePythonIdePayloadToken(payload: PythonIdeProjectPayload) {
	const value = JSON.stringify(canonicalPythonIdeProjectPayload(payload));
	let first = 0x811c9dc5;
	let second = 0x9e3779b9;
	for (let index = 0; index < value.length; index++) {
		const code = value.charCodeAt(index);
		first = Math.imul(first ^ code, 0x01000193);
		second = Math.imul(second ^ code, 0x85ebca6b);
	}
	return `${(first >>> 0).toString(36)}${(second >>> 0).toString(36)}`;
}

function recoveredPythonIdeImportID(
	originalImportID: string,
	localUpdatedAt: string | undefined,
	payload: PythonIdeProjectPayload
) {
	const versionToken = (
		localUpdatedAt || `content-${stablePythonIdePayloadToken(payload)}`
	)
		.replace(/[^\w.:-]+/g, "_")
		.slice(0, 48);
	const suffix = `:recovered:${versionToken}`;
	const prefixLength = Math.max(
		0,
		MAX_REMOTE_IMPORT_ID_LENGTH - suffix.length
	);
	const safeOriginalImportID = originalImportID.replace(/[^\w.:-]+/g, "_");
	return `${safeOriginalImportID.slice(0, prefixLength)}${suffix}`;
}

function recoveredPythonIdeTitle(title: string | undefined) {
	const suffix = " (recovered)";
	const baseTitle = (title?.trim() || "Untitled Python Project").replace(
		/\s+\(recovered\)$/i,
		""
	);
	return `${baseTitle.slice(
		0,
		MAX_REMOTE_PROJECT_TITLE_LENGTH - suffix.length
	)}${suffix}`;
}

function recoveredPythonIdeProject(
	project: PythonIdeProject,
	originalImportID = project._id
) {
	const payload = pythonIdeProjectToPayload(project);
	const importID = recoveredPythonIdeImportID(
		originalImportID,
		project.updatedAt,
		payload
	);
	return {
		importID,
		project: {
			...plainPythonIdeProjectSnapshot(project),
			_id: `local-${importID}`,
			importID,
			serverUpdatedAt: undefined,
			title: recoveredPythonIdeTitle(project.title)
		}
	};
}

function isPythonIdeSaveConflict(error: unknown) {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		(error as { response?: { status?: number } }).response?.status === 409
	);
}

/**
 * Reconcile a device recovery snapshot with a freshly fetched server list.
 *
 * Content and the last confirmed server version are authoritative; client wall
 * clocks are never compared with server clocks. Matching content accepts the
 * server copy. A local edit based on the current server revision is updated
 * optimistically. Ambiguous/stale local edits become a separate recovered copy
 * so neither version is overwritten.
 */
export function reconcilePythonIdeRecoveryProjects(
	localProjects: PythonIdeProject[],
	remoteProjects: PythonIdeProject[]
): PythonIdeRecoveryPlan {
	const remoteByID = new Map(
		remoteProjects.map(project => [
			project._id,
			normalizeRemotePythonIdeProject(project)
		])
	);
	const mergedProjects: PythonIdeProject[] = [];
	const writes: PythonIdeRecoveryWrite[] = [];
	const includedRemoteIDs = new Set<string>();

	for (const localSource of localProjects) {
		const localProject = plainPythonIdeProjectSnapshot(localSource);
		if (localProject._id.startsWith("local-")) {
			mergedProjects.push(localProject);
			writes.push({
				importID: pythonIdeImportID(localProject),
				kind: "create",
				project: localProject
			});
			continue;
		}

		const remoteProject = remoteByID.get(localProject._id);
		if (!remoteProject) {
			const localChangedAfterConfirmedServerVersion =
				!!localProject.updatedAt &&
				(!localProject.serverUpdatedAt ||
					!pythonIdeServerVersionsEqual(
						localProject.updatedAt,
						localProject.serverUpdatedAt
					));
			if (localChangedAfterConfirmedServerVersion) {
				// A delete may have succeeded while its response was lost. If the
				// student kept editing the still-visible project, preserve those
				// post-delete edits as a separate retry-safe recovery project.
				const recovered = recoveredPythonIdeProject(localProject);
				mergedProjects.push(recovered.project);
				writes.push({
					importID: recovered.importID,
					kind: "create",
					project: recovered.project
				});
			}
			// An unchanged missing project reflects a confirmed delete on this or
			// another device and should stay deleted.
			continue;
		}

		includedRemoteIDs.add(remoteProject._id);
		const localPayload = pythonIdeProjectToPayload(localProject);
		if (pythonIdePayloadMatchesProject(localPayload, remoteProject)) {
			mergedProjects.push(remoteProject);
			continue;
		}

		const remoteUpdatedAt =
			remoteProject.serverUpdatedAt ?? remoteProject.updatedAt;
		if (
			remoteUpdatedAt &&
			pythonIdeServerVersionsEqual(
				localProject.serverUpdatedAt,
				remoteUpdatedAt
			)
		) {
			const localRecoveryProject = {
				...localProject,
				serverUpdatedAt: remoteUpdatedAt
			};
			mergedProjects.push(localRecoveryProject);
			writes.push({
				expectedUpdatedAt: remoteUpdatedAt,
				kind: "update",
				project: localRecoveryProject
			});
			continue;
		}

		const recovered = recoveredPythonIdeProject(localProject);
		mergedProjects.push(remoteProject, recovered.project);
		writes.push({
			importID: recovered.importID,
			kind: "create",
			project: recovered.project
		});
	}

	for (const remoteProject of remoteByID.values()) {
		if (!includedRemoteIDs.has(remoteProject._id))
			mergedProjects.push(remoteProject);
	}

	return {
		projects: mergedProjects,
		writes
	};
}

export async function applyPythonIdeRecoveryPlan(
	plan: PythonIdeRecoveryPlan,
	studentID: string
) {
	const mergedProjects = plan.projects.map(plainPythonIdeProjectSnapshot);

	for (const write of plan.writes) {
		const savedProject =
			write.kind === "create"
				? await createRemotePythonIdeProject(
						pythonIdeProjectToPayload(write.project),
						studentID,
						{
							importID: write.importID,
							localUpdatedAt: write.project.updatedAt
						}
					)
				: await updateRemotePythonIdeProject(
						write.project._id,
						pythonIdeProjectToPayload(write.project),
						studentID,
						{ expectedUpdatedAt: write.expectedUpdatedAt }
					);
		const localIndex = mergedProjects.findIndex(
			project => project._id === write.project._id
		);
		if (localIndex >= 0) mergedProjects.splice(localIndex, 1, savedProject);
		else mergedProjects.push(savedProject);
	}

	return mergedProjects.filter(
		(project, index, allProjects) =>
			allProjects.findIndex(
				candidate => candidate._id === project._id
			) === index
	);
}

export async function syncStoredStudentPythonProjects(studentID: string) {
	void studentID;
	await purgeAllStudentPythonProjectRecovery();
	return [];
}

export async function fetchPythonIdeProjects(studentID: string) {
	const { data } = await api.get<{ projects: PythonIdeProject[] }>(
		"/students/projects",
		{ headers: { "X-Student-ID": studentID } }
	);
	return data.projects.map(normalizeRemotePythonIdeProject);
}

export async function fetchVisiblePythonIdeProjectReviews(studentID: string) {
	const { data } = await api.get<{ reviews: PythonIdeProjectReview[] }>(
		"/students/project-reviews",
		{ headers: { "X-Student-ID": studentID } }
	);
	return data.reviews;
}

export async function fetchManagedPythonIdeProjects(studentID: string) {
	const { data } = await api.get<{ projects: ManagedPythonIdeProject[] }>(
		`/admins/students/${studentID}/projects`
	);
	return data.projects;
}

export async function createRemotePythonIdeProject(
	payload: PythonIdeProjectPayload,
	studentID: string,
	options: { importID: string; localUpdatedAt?: string }
) {
	const response = await api.post<{
		idempotentReplay?: boolean;
		project: PythonIdeProject;
	}>(
		"/students/projects",
		{
			...payload,
			importID: options.importID
		},
		{ headers: { "X-Student-ID": studentID } }
	);
	const remoteProject = normalizeRemotePythonIdeProject(
		response.data.project
	);
	const idempotentReplay =
		response.data.idempotentReplay ?? response.status === 200;
	if (
		!idempotentReplay ||
		pythonIdePayloadMatchesProject(payload, remoteProject)
	) {
		return remoteProject;
	}

	const expectedUpdatedAt =
		remoteProject.serverUpdatedAt ?? remoteProject.updatedAt;
	if (expectedUpdatedAt && pythonIdeRemoteProjectIsPristine(remoteProject)) {
		try {
			return await updateRemotePythonIdeProject(
				remoteProject._id,
				payload,
				studentID,
				{ expectedUpdatedAt }
			);
		} catch (error) {
			if (!isPythonIdeSaveConflict(error)) throw error;
		}
	}

	const recoveredPayload = {
		...payload,
		title: recoveredPythonIdeTitle(payload.title)
	};
	const recoveredImportID = recoveredPythonIdeImportID(
		options.importID,
		options.localUpdatedAt,
		payload
	);
	const recoveredResponse = await api.post<{
		idempotentReplay?: boolean;
		project: PythonIdeProject;
	}>(
		"/students/projects",
		{
			...recoveredPayload,
			importID: recoveredImportID
		},
		{ headers: { "X-Student-ID": studentID } }
	);
	const recoveredProject = normalizeRemotePythonIdeProject(
		recoveredResponse.data.project
	);
	const recoveredReplay =
		recoveredResponse.data.idempotentReplay ??
		recoveredResponse.status === 200;
	if (
		recoveredReplay &&
		!pythonIdePayloadMatchesProject(recoveredPayload, recoveredProject)
	) {
		throw new Error(
			"An existing recovered project changed. The newer local copy was kept on this device."
		);
	}
	return recoveredProject;
}

export async function createPythonIdeProjectReview(
	studentID: string,
	projectID: string
) {
	const { data } = await api.post<{
		project: PythonIdeProject;
		review: PythonIdeProjectReview;
	}>(`/admins/students/${studentID}/projects/${projectID}/review`, {});
	return data;
}

export async function updatePythonIdeProjectReview(
	studentID: string,
	projectID: string,
	reviewID: string,
	payload: {
		activeFileName?: string;
		files?: PythonIdeFile[];
		note?: string;
		visibleToStudent?: boolean;
	}
) {
	const { data } = await api.put<{
		project: PythonIdeProject;
		review: PythonIdeProjectReview;
	}>(
		`/admins/students/${studentID}/projects/${projectID}/review/${reviewID}`,
		payload
	);
	return data;
}

export async function updateRemotePythonIdeProject(
	projectID: string,
	payload: PythonIdeProjectPayload,
	studentID: string,
	options: { expectedUpdatedAt: string }
) {
	const { data } = await api.put<{ project: PythonIdeProject }>(
		`/students/projects/${projectID}`,
		{
			...payload,
			expectedUpdatedAt: options.expectedUpdatedAt
		},
		{ headers: { "X-Student-ID": studentID } }
	);
	return normalizeRemotePythonIdeProject(data.project);
}

export async function deleteRemotePythonIdeProject(
	projectID: string,
	studentID: string,
	options: { expectedUpdatedAt: string }
) {
	try {
		await api.delete(`/students/projects/${projectID}`, {
			data: { expectedUpdatedAt: options.expectedUpdatedAt },
			headers: { "X-Student-ID": studentID }
		});
	} catch (error) {
		const status =
			typeof error === "object" && error !== null && "response" in error
				? (error as { response?: { status?: number } }).response?.status
				: undefined;
		const requestMayHaveSucceeded =
			status === undefined || (status >= 500 && status <= 599);
		if (!requestMayHaveSucceeded) throw error;

		try {
			const projects = await fetchPythonIdeProjects(studentID);
			if (!projects.some(project => project._id === projectID)) return;
		} catch {
			// An inconclusive probe cannot authorize removing the local project.
		}
		throw error;
	}
}
