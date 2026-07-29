import { PythonProject } from "../models/schemas/PythonProject.js";
import { Student } from "../models/schemas/Student.js";

/**
 * Rebuild the denormalized quota ledger from active projects before accepting
 * traffic. The aggregation writes each student's exact totals in one merge and
 * is idempotent, so a stopped startup can safely run it again.
 */
export async function reconcilePythonProjectQuotas(): Promise<void> {
	await Student.collection.aggregate([
		{
			$lookup: {
				as: "activeProjectQuota",
				from: PythonProject.collection.name,
				let: { studentID: "$_id" },
				pipeline: [
					{
						$match: {
							deletedAt: { $exists: false },
							$expr: { $eq: ["$user", "$$studentID"] }
						}
					},
					{
						$group: {
							_id: null,
							activeProjectBytes: {
								$sum: {
									$cond: [
										{
											$and: [
												{
													$in: [
														{ $type: "$byteCount" },
														["decimal", "double", "int", "long"]
													]
												},
												{ $gte: ["$byteCount", 0] }
											]
										},
										"$byteCount",
										{
											$reduce: {
												in: {
													$add: [
														"$$value",
														{
															$strLenBytes: {
																$convert: {
																	input: "$$this.name",
																	onError: "",
																	onNull: "",
																	to: "string"
																}
															}
														},
														{
															$strLenBytes: {
																$convert: {
																	input: "$$this.content",
																	onError: "",
																	onNull: "",
																	to: "string"
																}
															}
														}
													]
												},
												initialValue: 0,
												input: { $ifNull: ["$files", []] }
											}
										}
									]
								}
							},
							activeProjectCount: { $sum: 1 }
						}
					}
				]
			}
		},
		{
			$project: {
				_id: 1,
				activeProjectBytes: {
					$ifNull: [
						{ $arrayElemAt: ["$activeProjectQuota.activeProjectBytes", 0] },
						0
					]
				},
				activeProjectCount: {
					$ifNull: [
						{ $arrayElemAt: ["$activeProjectQuota.activeProjectCount", 0] },
						0
					]
				}
			}
		},
		{
			$merge: {
				into: Student.collection.name,
				on: "_id",
				whenMatched: [
					{
						$set: {
							activeProjectBytes: "$$new.activeProjectBytes",
							activeProjectCount: "$$new.activeProjectCount"
						}
					}
				],
				whenNotMatched: "discard"
			}
		}
	], { allowDiskUse: true }).toArray();
}
