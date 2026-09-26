import type { ErrorRequestHandler } from "express";
import express from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { validAdmin } from "../middleware/auth.js";
import { createIdeReportLimiter } from "../middleware/rateLimiters.js";
import { IdeProblemReport } from "../models/schemas/IdeProblemReport.js";
import {
	ideReportRetentionSeconds,
	ideReportSchema
} from "../utils/ideDiagnostics.js";

export const ideReportRoutes = express.Router();
ideReportRoutes.use((_req, res, next) => {
	res.set("Cache-Control", "no-store");
	next();
});

// Mounted before the general body parser. Reporting also works without login.
ideReportRoutes.post(
	"/",
	createIdeReportLimiter(),
	express.json({ limit: "12kb", inflate: false }),
	async (req, res) => {
		const parsed = ideReportSchema.safeParse(req.body);
		if (!parsed.success) {
			return res
				.status(400)
				.json({
					message:
						"Review the diagnostics before submitting a valid report."
				});
		}
		const { diagnostics, description } = parsed.data;
		try {
			await IdeProblemReport.create({
				referenceID: diagnostics.referenceID,
				diagnostics,
				description
			});
		}
		catch (error) {
			// A retry of the same reviewed snapshot is safe and never overwrites it.
			if (!(
				error
				&& typeof error === "object"
				&& "code" in error
				&& error.code === 11000
			)) {
				return res
					.status(503)
					.json({
						message:
							"Report could not be saved. Copy diagnostics and retry later."
					});
			}
		}
		return res.status(201).json({ referenceID: diagnostics.referenceID });
	}
);

ideReportRoutes.get("/", validAdmin, async (req, res) => {
	const cursor = req.query.before;
	const parsedReference = z.uuid().optional().safeParse(req.query.referenceID);
	if (!parsedReference.success) return res.status(400).json({ message: "Invalid reference ID" });
	const referenceID = parsedReference.data;

	if (
		cursor !== undefined
		&& (typeof cursor !== "string" || !/^[a-f0-9]{24}$/.test(cursor))
	) {
		return res.status(400).json({ message: "Invalid report cursor" });
	}
	try {
		const reports = await IdeProblemReport.find({
			...(referenceID ? { referenceID } : {}),
			createdAt: {
				$gt: new Date(Date.now() - ideReportRetentionSeconds * 1000)
			},
			...(cursor
				? { _id: { $lt: new Types.ObjectId(cursor as string) } }
				: {})
		})
			.sort({ _id: -1 })
			.limit(26)
			.lean();
		const page = reports.slice(0, 25);
		return res.json({
			reports: page,
			nextCursor: reports.length > 25 ? String(page.at(-1)?._id) : null
		});
	}
	catch {
		return res
			.status(503)
			.json({ message: "Reports are temporarily unavailable" });
	}
});

ideReportRoutes.patch(
	"/:referenceID",
	validAdmin,
	express.json({ limit: "1kb", inflate: false }),
	async (req, res) => {
		const referenceID = z.uuid().safeParse(req.params.referenceID);
		const body = z
			.object({ status: z.enum(["new", "reviewed", "resolved"]) })
			.strict()
			.safeParse(req.body);
		if (!referenceID.success || !body.success)
			return res.status(400).json({ message: "Invalid report update" });
		try {
			const result = await IdeProblemReport.updateOne(
				{ referenceID: referenceID.data },
				{ $set: body.data }
			);
			return result.matchedCount
				? res.json({ status: body.data.status })
				: res.status(404).json({ message: "Report not found" });
		}
		catch {
			return res
				.status(503)
				.json({ message: "Report could not be updated" });
		}
	}
);

// Parser errors must not echo payloads or enter outage/email logging paths.
const parserError: ErrorRequestHandler = (error, _req, res, _next) => {
	const status = [400, 413, 415].includes(error.status) ? error.status : 500;
	res.status(status).json({
		message: "Report request could not be accepted"
	});
};
ideReportRoutes.use(parserError);
