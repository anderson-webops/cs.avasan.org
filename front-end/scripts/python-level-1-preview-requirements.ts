import type {
	RawCourse,
	RawCourseModuleItem
} from "../src/stores/courses/types";
import { pythonLevel1ClassroomCourse } from "../src/stores/courses/python-level-1-classroom";

export interface PythonLevel1PreviewRequirement {
	courseId: "python-level-1";
	moduleId: string;
	lessonId: string;
	moduleTitle: string;
	lessonTitle: string;
	priority: "launch" | "core" | "practice";
	materialKind: "fixed-result" | "representative-remix";
	status: "waiting-for-material";
	historicalFilename?: string;
}

// Descriptive names recorded by f96936b4. These are provenance leads, not
// published media links or proof of a license or a matching current result.
const HISTORICAL_FILENAMES: Record<string, string> = {
	"Turtle Exploration": "grs1_turtle_exploration(1).mp4",
	"Basic Shapes": "grs2_basic_shapes.mp4",
	"Smiley Face": "grs2_smiley_face.mp4",
	"More Shapes": "grs2_more_shapes.mp4",
	Bullseye: "grs2_bullseye.mp4",
	"Watermelon Slice": "grs2_watermelon_slice.mp4",
	Taxi: "grs2_taxi.mp4",
	"Captain America Shield": "grs2_captain_american_shield.mp4",
	Minion: "grs2_minion.mp4",
	"Awesome Angles": "grs3_awesome_angles.mp4",
	"Surprise Me Square": "grs3_surprise_me_square.mp4",
	"Random Walk": "grs3_random_walk.mp4",
	"Random Bowtie": "grs3_random_bowtie.mp4",
	"Surprise Shape": "grs9_surprise_shape.gif",
	"Find Your Turtle": "grs4_find_your_turtle.mp4",
	"Navigating the Coordinate Plane":
		"grs4_navigating_the_coordinate_plane.mp4",
	Fireworks: "grs4_fireworks.mp4",
	"While Loops Exploration": "WhileLoopsExploration(1).mp4",
	"Square Spiral": "grs5_square_spiral.mp4",
	"Rainbow Ninja Star": "grs4_rainbow_ninja_star.mp4",
	"Into the Void": "grs4_into_the_void.mp4",
	"Out of the Void": "grs4_out_of_the_void.mp4",
	"Turtle Race": "grs9_turtle_race.gif",
	"Square Inception": "grs5_square_inception.mp4",
	Pyramid: "grs5_pyramid.mp4",
	"Reverse Pyramid": "grs5_reverse_pyramid.mp4",
	"Reverse Square Inception": "grs5_reverse_square_inception.mp4",
	"Rainbow Flower": "grs5_rainbow_flower.mp4",
	"Circle of Circles": "grs5_circle_of_circles.mp4",
	Spirals: "grs1_spirals.mp4",
	"Randomly Random Shapes": "grs6_randomly_random_shapes.mp4",
	"Etch A Sketch": "grs8_etch_a_sketch.gif",
	"Picasso Game": "grs8_picasso_game.gif",
	"Polka Dot Game": "grs8_polka_dot_game.gif",
	"Fruit Stand": "grs8_fruit_stand.gif",
	"Polka Dots": "grs9_polkadots.mp4",
	"Any Shape Staircase": "grs7_any_shape_staircase.mp4",
	"Debugging Functions": "grs7_debugging_functions.mp4",
	"Square Inception with Functions":
		"grs7_square_inception_with_functions.mp4",
	"Rainbow Square Inception": "grs6_rainbow_square_inception.mp4",
	Snowflake: "grs6_snowflake.mp4",
	"Winter Wonderland": "grs7_winter_wonderland.gif",
	"Spiral Staircase": "grs6_spiral_staircase.mp4",
	"Dizzy Hexagon": "grs6_dizzy_hexagon.mp4",
	"Random Age": "grs9_random_age.gif",
	"Turtle Launch": "grs9_turtle_launch.gif",
	"List Exploration": "grs12_list_exploration.mp4",
	"Which Way Turtles": "grs10_which_way_turtles.gif",
	"Random Number Lists": "grs10_random_number_lists.gif",
	"Turtle Launch with Lists": "grs10_turtle_launch_with_lists.gif",
	"Rainbow Path": "grs10_rainbow_path.gif",
	"Perpetual Motion": "grs13_perpetual_motion.mp4",
	"Stay Inbounds": "grs11_stay_inbounds.gif",
	"Fluid Motion": "grs13_fluid_motion.mp4",
	"Bouncy Ball Room": "grs10_bouncy_ball_room.gif",
	"Turtle Collision": "grs11_turtle_collision.gif",
	"Light the Stars": "grs11_light_the_stars.gif",
	Dodgeball: "grs13_dodgeball.mp4",
	"Space Eater": "grs12_space_eater.gif",
	"Turtle Run": "grs12_turtle_run.gif",
	"Target Practice": "grs12_target_practice.gif",
	Pong: "grs12_pong.gif",
	"Fidget Spinner": "grs12_fidget_spinner.gif",
	Snake: "grs12_snake.gif"
};

function needsProjectResultPreview(item: RawCourseModuleItem) {
	return (
		!item.mediaLink?.trim() &&
		/\bproject\b|^launch remix:/i.test(item.title) &&
		!/recap|reflection|presentation/i.test(item.title)
	);
}

// Maintainer-only inventory. The course reader does not import this module:
// missing files must not become empty student cards or speculative URLs.
export function pythonLevel1PreviewRequirements(
	course: RawCourse = pythonLevel1ClassroomCourse
): PythonLevel1PreviewRequirement[] {
	return course.modules.flatMap(module => {
		if (module.kind === "appendix") return [];
		return [...module.curriculum, ...module.supplementalProjects]
			.filter(needsProjectResultPreview)
			.map(item => {
				if (!module.id || !item.id) {
					throw new Error(
						`Preview material request needs a stable ID: ${item.title}`
					);
				}
				const projectName = item.title.split(": ").slice(1).join(": ");
				const historicalFilename = HISTORICAL_FILENAMES[projectName];
				return {
					courseId: "python-level-1" as const,
					moduleId: module.id,
					lessonId: item.id,
					moduleTitle: module.title,
					lessonTitle: item.title,
					priority: module.id.includes("classroom-launch")
						? "launch"
						: item.learningPath === "core"
							? "core"
							: "practice",
					materialKind:
						/open ended|master project|^launch remix:/i.test(
							item.title
						)
							? "representative-remix"
							: "fixed-result",
					status: "waiting-for-material" as const,
					...(historicalFilename ? { historicalFilename } : {})
				} satisfies PythonLevel1PreviewRequirement;
			});
	});
}
