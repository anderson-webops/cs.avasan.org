import type { RequestHandler } from "express";
import type {
	ClassroomCourseID,
	ClassroomSiteID
} from "../types/entities/IClassroomUsageDaily.js";
import { z } from "zod";
import { ClassroomUsageDaily } from "../models/schemas/ClassroomUsageDaily.js";
import { PythonProject } from "../models/schemas/PythonProject.js";
import { Student } from "../models/schemas/Student.js";
import {
	CS_CLASSROOM_COURSES,
	MATH_CLASSROOM_COURSES
} from "../types/entities/IClassroomUsageDaily.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_SUMMARY_DAYS = 30;
const MIN_SUMMARY_DAYS = 7;
const MAX_SUMMARY_DAYS = 90;
const STUDENT_WORK_RECENT_DAYS = 7;

const csClassroomCourseIDs = CS_CLASSROOM_COURSES.map(course => course.id);
const mathClassroomCourseIDs = MATH_CLASSROOM_COURSES.map(course => course.id);
const classroomUsagePayloadSchema = z.union([
	z
		.object({
			siteID: z.literal("cs"),
			courseId: z.enum(csClassroomCourseIDs),
			event: z.literal("course-open")
		})
		.strict(),
	z
		.object({
			siteID: z.literal("cs"),
			courseId: z.enum(csClassroomCourseIDs).optional(),
			event: z.literal("ide-open")
		})
		.strict(),
	z
		.object({
			siteID: z.literal("math"),
			courseId: z.enum(mathClassroomCourseIDs),
			event: z.literal("course-open")
		})
		.strict(),
	z
		.object({
			siteID: z.literal("math"),
			event: z.literal("graph-open")
		})
		.strict()
]);

function utcDay(date: Date): Date {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dateKey(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function summaryDays(value: unknown): number | null {
	if (value === undefined) return DEFAULT_SUMMARY_DAYS;
	if (typeof value !== "string" || !/^\d{1,2}$/.test(value)) return null;
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) && parsed >= MIN_SUMMARY_DAYS && parsed <= MAX_SUMMARY_DAYS ? parsed : null;
}

export function recordClassroomUsage(retentionDays: number): RequestHandler {
	return async (req, res) => {
		res.set("Cache-Control", "no-store");
		const parsed = classroomUsagePayloadSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(400).json({
				message: "Only a supported site, classroom event, and course ID are accepted."
			});
			return;
		}

		const now = new Date();
		const day = utcDay(now);
		const courseID = "courseId" in parsed.data
			? parsed.data.courseId
			: undefined;
		const filter = {
			day,
			event: parsed.data.event,
			...(parsed.data.siteID === "cs"
				? {
						$or: [
							{ siteID: "cs" as const },
							{ siteID: { $exists: false } }
						]
					}
				: { siteID: "math" as const }),
			...(courseID ? { courseID } : { courseID: { $exists: false } })
		};
		const insertFields = {
			day,
			siteID: parsed.data.siteID,
			event: parsed.data.event,
			expiresAt: new Date(now.getTime() + retentionDays * DAY_MS),
			...(courseID ? { courseID } : {})
		};

		try {
			await ClassroomUsageDaily.updateOne(
				filter,
				{
					$inc: { count: 1 },
					$setOnInsert: insertFields
				},
				{
					runValidators: true,
					setDefaultsOnInsert: false,
					upsert: true
				}
			).exec();
			res.sendStatus(204);
		}
		catch {
			res.status(503).json({
				message: "Classroom activity could not be recorded."
			});
		}
	};
}

interface UsageAggregate {
	day: Date;
	siteID?: ClassroomSiteID;
	event: "course-open" | "ide-open" | "graph-open";
	courseID?: ClassroomCourseID;
	count: number;
}

interface DistinctCountAggregate {
	count: number;
}

function distinctProjectStudentCount(filter: Record<string, unknown>) {
	return PythonProject.aggregate<DistinctCountAggregate>([
		{ $match: filter },
		{ $group: { _id: "$user" } },
		{ $count: "count" }
	]);
}

export function getClassroomAnalyticsSummary(retentionDays: number): RequestHandler {
	return async (req, res) => {
		res.set("Cache-Control", "no-store");
		if (Object.keys(req.query).some(key => key !== "days")) {
			res.status(400).json({ message: "Only the days query is accepted." });
			return;
		}
		const days = summaryDays(req.query.days);
		if (days === null) {
			res.status(400).json({
				message: "days must be an integer from 7 to 90."
			});
			return;
		}

		const generatedAt = new Date();
		const endDay = utcDay(generatedAt);
		const startDay = new Date(endDay.getTime() - (days - 1) * DAY_MS);
		const recentStart = new Date(endDay.getTime() - (STUDENT_WORK_RECENT_DAYS - 1) * DAY_MS);
		const activeProjectFilter = { deletedAt: { $exists: false } };
		const recentProjectFilter = {
			...activeProjectFilter,
			updatedAt: { $gte: recentStart }
		};

		try {
			const [
				usageRows,
				activeAccounts,
				recentSignIns,
				activeProjects,
				recentlyUpdatedProjects,
				projectStudentCount,
				recentProjectStudentCount
			] = await Promise.all([
				ClassroomUsageDaily.find({
					day: { $gte: startDay, $lte: endDay }
				})
					.select("day siteID event courseID count -_id")
					.lean()
					.exec() as Promise<UsageAggregate[]>,
				Student.countDocuments({ active: true }).exec(),
				Student.countDocuments({
					active: true,
					lastLoginAt: { $gte: recentStart }
				}).exec(),
				PythonProject.countDocuments(activeProjectFilter).exec(),
				PythonProject.countDocuments(recentProjectFilter).exec(),
				distinctProjectStudentCount(activeProjectFilter),
				distinctProjectStudentCount(recentProjectFilter)
			]);

			const makeDailyRows = () => Array.from(
				{ length: days },
				(_, index) => ({
					date: dateKey(new Date(startDay.getTime() + index * DAY_MS)),
					courseOpens: 0,
					ideOpens: 0,
					graphOpens: 0
				})
			);
			const csDaily = makeDailyRows();
			const mathDaily = makeDailyRows();
			const csDailyByDate = new Map(
				csDaily.map(row => [row.date, row])
			);
			const mathDailyByDate = new Map(
				mathDaily.map(row => [row.date, row])
			);
			const csCourseOpenCounts = new Map<ClassroomCourseID, number>(
				CS_CLASSROOM_COURSES.map(course => [course.id, 0] as const)
			);
			const mathCourseOpenCounts = new Map<ClassroomCourseID, number>(
				MATH_CLASSROOM_COURSES.map(course => [course.id, 0] as const)
			);
			const csTotals = {
				courseOpens: 0,
				ideOpens: 0,
				graphOpens: 0
			};
			const mathTotals = {
				courseOpens: 0,
				ideOpens: 0,
				graphOpens: 0
			};

			for (const row of usageRows) {
				const count = Number.isSafeInteger(row.count) && row.count > 0 ? row.count : 0;
				const siteID = row.siteID === undefined
					? "cs"
					: row.siteID;

				if (siteID === "cs") {
					const dayRow = csDailyByDate.get(dateKey(row.day));
					if (
						row.event === "course-open"
						&& row.courseID
						&& csCourseOpenCounts.has(row.courseID)
					) {
						csTotals.courseOpens += count;
						if (dayRow) dayRow.courseOpens += count;
						csCourseOpenCounts.set(
							row.courseID,
							(csCourseOpenCounts.get(row.courseID) ?? 0) + count
						);
					}
					else if (row.event === "ide-open") {
						csTotals.ideOpens += count;
						if (dayRow) dayRow.ideOpens += count;
					}
				}
				else if (siteID === "math") {
					const dayRow = mathDailyByDate.get(dateKey(row.day));
					if (
						row.event === "course-open"
						&& row.courseID
						&& mathCourseOpenCounts.has(row.courseID)
					) {
						mathTotals.courseOpens += count;
						if (dayRow) dayRow.courseOpens += count;
						mathCourseOpenCounts.set(
							row.courseID,
							(mathCourseOpenCounts.get(row.courseID) ?? 0) + count
						);
					}
					else if (row.event === "graph-open") {
						mathTotals.graphOpens += count;
						if (dayRow) dayRow.graphOpens += count;
					}
				}
			}

			res.json({
				generatedAt: generatedAt.toISOString(),
				period: {
					days,
					startDate: dateKey(startDay),
					endDate: dateKey(endDay)
				},
				retentionDays,
				siteActivity: {
					cs: {
						totals: csTotals,
						daily: csDaily,
						courses: CS_CLASSROOM_COURSES.map(course => ({
							courseId: course.id,
							label: course.label,
							opens: csCourseOpenCounts.get(course.id) ?? 0
						}))
					},
					math: {
						totals: mathTotals,
						daily: mathDaily,
						courses: MATH_CLASSROOM_COURSES.map(course => ({
							courseId: course.id,
							label: course.label,
							opens: mathCourseOpenCounts.get(course.id) ?? 0
						}))
					}
				},
				studentWork: {
					recentWindowDays: STUDENT_WORK_RECENT_DAYS,
					activeAccounts,
					recentSignIns,
					studentsWithProjects: projectStudentCount[0]?.count ?? 0,
					studentsWithRecentProjectUpdates: recentProjectStudentCount[0]?.count ?? 0,
					activeProjects,
					recentlyUpdatedProjects
				}
			});
		}
		catch {
			res.status(500).json({
				message: "Classroom analytics summary could not be prepared."
			});
		}
	};
}
