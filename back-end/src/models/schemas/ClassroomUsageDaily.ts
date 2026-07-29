import type { Model } from "mongoose";
import type {
	IClassroomUsageDaily
} from "../../types/entities/IClassroomUsageDaily.js";
import mongoose, { Schema } from "mongoose";
import {
	CLASSROOM_COURSES,
	CLASSROOM_USAGE_EVENTS
} from "../../types/entities/IClassroomUsageDaily.js";

const classroomCourseIDs = CLASSROOM_COURSES.map(course => course.id);

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

classroomUsageDailySchema.index(
	{ day: 1, event: 1, courseID: 1 },
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
