import type { RawCourse } from "./types";

import { cppLevel1Course } from "./cpp-level-1";
import { introToPhysicsCourse } from "./intro-to-physics";
import { introToSwiftAppDevelopmentCourse } from "./intro-to-swift-app-development";
import { javaLevel1Course } from "./java-level-1";
import { javaLevel2Course } from "./java-level-2";
import { javaLevel3Course } from "./java-level-3";
import { javascriptLevel1Course } from "./javascript-level-1";
import { javascriptLevel2Course } from "./javascript-level-2";
import { machineLearningCourse } from "./machine-learning";
import { physicsLevel2Course } from "./physics-level-2";
import { pyGamesCourse } from "./pygames";
import { pythonLevel1Course } from "./python-level-1";
import { pythonLevel2Course } from "./python-level-2";
import { pythonLevel3Course } from "./python-level-3";
import { scratchLevel1Course } from "./scratch-level-1";
import { scratchLevel2Course } from "./scratch-level-2";

export const rawCourses: RawCourse[] = [
	scratchLevel1Course,
	scratchLevel2Course,
	pythonLevel1Course,
	pyGamesCourse,
	pythonLevel2Course,
	pythonLevel3Course,
	cppLevel1Course,
	javaLevel1Course,
	javaLevel2Course,
	javaLevel3Course,
	introToPhysicsCourse,
	physicsLevel2Course,
	introToSwiftAppDevelopmentCourse,
	javascriptLevel1Course,
	javascriptLevel2Course,
	machineLearningCourse
];
