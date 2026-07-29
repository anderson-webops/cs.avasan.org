import type { Model } from "mongoose";
import type {
	IClassroomUsageDaily
} from "../../types/entities/IClassroomUsageDaily.js";
import mongoose, { Schema } from "mongoose";
import {
	CLASSROOM_COURSES,
	CLASSROOM_SITES,
	CLASSROOM_USAGE_EVENTS,
	CS_CLASSROOM_COURSES,
	MATH_CLASSROOM_COURSES
} from "../../types/entities/IClassroomUsageDaily.js";

const classroomCourseIDs = CLASSROOM_COURSES.map(course => course.id);
const csClassroomCourseIDs = new Set<string>(
	CS_CLASSROOM_COURSES.map(course => course.id)
);
const mathClassroomCourseIDs = new Set<string>(
	MATH_CLASSROOM_COURSES.map(course => course.id)
);

function isUtcDay(value: Date): boolean {
	return value.getUTCHours() === 0
		&& value.getUTCMinutes() === 0
		&& value.getUTCSeconds() === 0
		&& value.getUTCMilliseconds() === 0;
}

const classroomUsageDailySchema = new Schema<IClassroomUsageDaily>(
	{
		day: {
			type: Date,
			required: true,
			validate: {
				message: "day must be UTC midnight",
				validator: isUtcDay
			}
		},
		siteID: {
			type: String,
			enum: CLASSROOM_SITES,
			default: "cs",
			required: true
		},
		event: {
			type: String,
			enum: CLASSROOM_USAGE_EVENTS,
			required: true
		},
		courseID: {
			type: String,
			enum: classroomCourseIDs,
			default: undefined
		},
		count: {
			type: Number,
			min: 1,
			required: true
		},
		expiresAt: {
			type: Date,
			required: true
		}
	},
	{
		strict: "throw",
		versionKey: false
	}
);

classroomUsageDailySchema.pre("validate", function validateSiteEventShape() {
	const siteID = this.siteID ?? "cs";
	const courseID = this.courseID;
	const isValidCSShape = siteID === "cs" && (
		(
			this.event === "course-open"
			&& courseID !== undefined
			&& csClassroomCourseIDs.has(courseID)
		)
		|| (
			this.event === "ide-open"
			&& (
				courseID === undefined
				|| csClassroomCourseIDs.has(courseID)
			)
		)
	);
	const isValidMathShape = siteID === "math" && (
		(
			this.event === "course-open"
			&& courseID !== undefined
			&& mathClassroomCourseIDs.has(courseID)
		)
		|| (this.event === "graph-open" && courseID === undefined)
	);

	if (!isValidCSShape && !isValidMathShape) {
		this.invalidate(
			"event",
			"event and courseID must match the classroom site"
		);
	}
});

classroomUsageDailySchema.index(
	{ day: 1, siteID: 1, event: 1, courseID: 1 },
	{ unique: true }
);
classroomUsageDailySchema.index(
	{ expiresAt: 1 },
	{ expireAfterSeconds: 0 }
);

export const ClassroomUsageDaily: Model<IClassroomUsageDaily>
	= mongoose.model<IClassroomUsageDaily>(
		"ClassroomUsageDaily",
		classroomUsageDailySchema
	);
