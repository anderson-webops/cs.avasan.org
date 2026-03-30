import { existsSync, readFileSync, statSync } from "node:fs";
import { env } from "node:process";
import { Router } from "express";
import { marked } from "marked";
import nodemailer from "nodemailer";
import { z } from "zod";
import { validAdmin } from "../middleware/auth.js";
import { SessionNote } from "../models/schemas/SessionNote.js";

const router = Router();
const DATE_PREFIX_RE = /^(\d{4})-(\d{2})-(\d{2})/;
const DEFAULT_PRIMARY_FROM_ADDR = "classes@jacobdanderson.net";
const DEFAULT_FALLBACK_FROM_ADDR = "jacobdanderson@gmail.com";
const SENDER_HINTS = [
	"from address",
	"sender",
	"sender verify failed"
];
const REJECTION_HINTS = [
	"not authorized",
	"rejected"
] as const;

const PRIMARY_FROM_ADDR = env.MDMAIL_FROM_PRIMARY
	|| env.MDMAIL_FROM
	|| DEFAULT_PRIMARY_FROM_ADDR;
const FALLBACK_FROM_ADDR = env.MDMAIL_FROM_FALLBACK
	|| DEFAULT_FALLBACK_FROM_ADDR;
const ALLOW_TO = (env.MDMAIL_ALLOW_TO || "").split(",").filter(Boolean);
const MAX_MD_LEN = Number(env.MDMAIL_MAX_MD_LEN || 200_000);

const MailSchema = z.object({
	to: z.string().trim().min(1),
	subject: z.string().trim().min(1).max(200),
	md: z.string().min(1),
	recipientName: z.string().trim().min(1).optional(),
	sessionDate: z.string().trim().optional()
});

function parseDateOnly(dateStr: string): Date | null {
	// Accept ISO strings (from toISOString) or raw yyyy-mm-dd
	const normalized = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
	const match = normalized.match(DATE_PREFIX_RE);
	if (!match) return null;
	const [, yearStr, monthStr, dayStr] = match;
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	if (!year || !month || !day) return null;
	// store at UTC noon to avoid TZ-related off-by-one when read in other zones
	const dt = new Date(Date.UTC(year, month - 1, day, 12));
	return Number.isNaN(dt.getTime()) ? null : dt;
}

function wrapEmailHtml(contentHtml: string): string {
	return `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="color-scheme" content="light only" />
		<meta name="supported-color-schemes" content="light only" />
	</head>
	<body style="margin:0;padding:24px;background:#ffffff !important;color:#111827 !important;">
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff !important;">
			<tr>
				<td align="center" style="background:#ffffff !important;">
					<table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" style="width:680px;max-width:680px;background:#ffffff !important;color:#111827 !important;">
						<tr>
							<td style="padding:24px;background:#ffffff !important;color:#111827 !important;">
								${contentHtml}
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`;
}

type SendMailInfo = Awaited<
	ReturnType<ReturnType<typeof nodemailer.createTransport>["sendMail"]>
>;

interface MailBase {
	to: string;
	cc: string[];
	subject: string;
	text: string;
	html: string;
}

interface MailSendError {
	message?: string;
	response?: string;
	responseCode?: number;
}

function getMailErrorText(err: unknown): string {
	if (!err || typeof err !== "object") return "";

	const { message, response } = err as MailSendError;
	return [message, response]
		.filter((value): value is string => typeof value === "string")
		.join(" ")
		.toLowerCase();
}

function summarizeMailError(err: unknown): string {
	if (!err || typeof err !== "object") return String(err);

	const { message, responseCode } = err as MailSendError;
	if (typeof message === "string" && typeof responseCode === "number")
		return `${responseCode} ${message}`;
	if (typeof message === "string") return message;
	return String(err);
}

function isSenderRejection(err: unknown): boolean {
	if (!err || typeof err !== "object") return false;

	const { responseCode } = err as MailSendError;
	const errorText = getMailErrorText(err);
	const hasSenderHint = SENDER_HINTS.some(hint => errorText.includes(hint));
	const hasRejectionHint = REJECTION_HINTS.some(hint => errorText.includes(hint));
	const hasSenderCode = responseCode === 550 || responseCode === 553;

	return hasSenderHint && (hasSenderCode || hasRejectionHint);
}

async function sendWithOptionalFromFallback(
	transporter: ReturnType<typeof nodemailer.createTransport>,
	mailBase: MailBase
): Promise<{ info: SendMailInfo; fromUsed: string; usedFallback: boolean }> {
	try {
		const info = await transporter.sendMail({
			...mailBase,
			from: PRIMARY_FROM_ADDR
		});
		console.info("admin-mail/send sent with primary From", {
			from: PRIMARY_FROM_ADDR,
			messageId: info.messageId
		});
		return { info, fromUsed: PRIMARY_FROM_ADDR, usedFallback: false };
	}
	catch (primaryErr) {
		if (
			!isSenderRejection(primaryErr)
			|| FALLBACK_FROM_ADDR === PRIMARY_FROM_ADDR
		) {
			throw primaryErr;
		}

		console.warn(
			"admin-mail/send primary From rejected, retrying with fallback From",
			{
				primaryFrom: PRIMARY_FROM_ADDR,
				fallbackFrom: FALLBACK_FROM_ADDR,
				error: summarizeMailError(primaryErr)
			}
		);

		try {
			const info = await transporter.sendMail({
				...mailBase,
				from: FALLBACK_FROM_ADDR
			});
			console.info("admin-mail/send sent with fallback From", {
				primaryFrom: PRIMARY_FROM_ADDR,
				from: FALLBACK_FROM_ADDR,
				messageId: info.messageId
			});
			return { info, fromUsed: FALLBACK_FROM_ADDR, usedFallback: true };
		}
		catch (fallbackErr) {
			throw new AggregateError(
				[primaryErr, fallbackErr],
				`Primary From rejected (${summarizeMailError(primaryErr)}); fallback From failed (${summarizeMailError(fallbackErr)})`
			);
		}
	}
}

router.post("/send", validAdmin, async (req, res) => {
	try {
		const parsed = MailSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
		}
		const { to, subject, md, sessionDate: sessionDateStr, recipientName } = parsed.data;

		const recipients = to
			.split(",")
			.map(addr => addr.trim())
			.filter(Boolean);

		if (recipients.length === 0) {
			return res.status(400).json({ message: "At least one recipient is required" });
		}

		const invalid = recipients.filter(addr => !z.string().email().safeParse(addr).success);
		if (invalid.length) {
			return res.status(400).json({ message: "Invalid recipient(s)", invalid });
		}

		if (ALLOW_TO.length && !recipients.every(addr => ALLOW_TO.includes(addr)))
			return res.status(403).json({ message: "Recipient not allowed" });
		if (md.length > MAX_MD_LEN) return res.status(413).json({ message: "Markdown too large" });

		// Parse session date when provided (used to persist notes)
		let sessionDate: Date | null = null;
		if (sessionDateStr) {
			const d = parseDateOnly(sessionDateStr);
			if (!d)
				return res.status(400).json({ message: "Invalid sessionDate" });
			sessionDate = d;
		}

		// Ensure we always pass a string to nodemailer
		const contentHtml = await marked.parse(md);
		if (typeof contentHtml !== "string") {
			// noinspection ExceptionCaughtLocallyJS
			throw new TypeError("HTML render did not return a string");
		}
		const html = wrapEmailHtml(contentHtml);

		function readOptionalCA(p: string) {
			try {
				if (existsSync(p)) {
					const st = statSync(p);
					if (st.size > 0) return readFileSync(p);
				}
			}
			catch {}
			return undefined;
		}

		// replace your ca reading bits with:
		const caPath = env.SMTP_CA_FILE; // new optional var
		const caBuf = caPath ? readOptionalCA(caPath) : undefined;
		// console.log("SMTP TLS CA path:", env.SMTP_CA_FILE || "/etc/ssl/local/mail-ca.pem", "exists:", !!caBuf, "len:", caBuf?.length ?? 0);

		const transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: Number(env.SMTP_PORT ?? 587),
			secure: String(env.SMTP_SECURE || "").toLowerCase() === "true", // 465=true, 587=false
			auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
			connectionTimeout: 15000,
			socketTimeout: 15000,
			tls: {
				servername: env.SMTP_SERVERNAME || env.SMTP_HOST,
				minVersion: "TLSv1.2",
				...(caBuf ? { ca: caBuf } : {}) // only supply CA when you *really* need it
			}
		});

		const mailBase = {
			to: recipients[0],
			cc: recipients.slice(1),
			subject,
			text: md,
			html
		};

		const { info, fromUsed, usedFallback } = await sendWithOptionalFromFallback(
			transporter,
			mailBase
		);

		if (sessionDate && recipientName) {
			await SessionNote.create({
				studentName: recipientName,
				primaryEmail: recipients[0],
				ccEmails: recipients.slice(1),
				subject,
				sessionDate,
				markdown: md,
				html
			});
		}

		console.info("admin-mail/send completed", {
			fromUsed,
			usedFallback,
			messageId: info.messageId
		});
		return res.json({ ok: true, messageId: info.messageId });
	}
	catch (err: any) {
		console.error("admin-mail/send failed:", err);
		return res.status(502).json({ ok: false, message: err?.message ?? "Send failed" });
	}
});

export const adminMailRoutes = router;
