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
const DEFAULT_PRIMARY_TRANSPORT_HOST = "127.0.0.1";
const DEFAULT_PRIMARY_TRANSPORT_PORT = 25;
const DEFAULT_PRIMARY_TRANSPORT_SERVERNAME = "mail.stridewithus.co";
const DEFAULT_FALLBACK_TRANSPORT_HOST = "smtp.gmail.com";
const DEFAULT_FALLBACK_TRANSPORT_PORT = 587;
const DEFAULT_FALLBACK_TRANSPORT_SERVERNAME = "smtp.gmail.com";
const TRANSPORT_FAILURE_CODES = new Set([
	"ECONNREFUSED",
	"ETIMEDOUT",
	"EHOSTUNREACH",
	"ECONNRESET",
	"ESOCKET",
	"ENOTFOUND",
	"EPIPE"
]);
const TRANSPORT_FAILURE_HINTS = [
	"connection refused",
	"connect econnrefused",
	"timeout",
	"timed out",
	"connection reset",
	"ehostunreach",
	"greeting never received",
	"socket closed unexpectedly",
	"service not available",
	"service unavailable",
	"local error in processing"
] as const;
const TRANSPORT_FAILURE_COMMANDS = new Set([
	"CONN",
	"EHLO",
	"HELO",
	"LHLO",
	"STARTTLS",
	"AUTH"
]);
const SENDER_HINTS = [
	"from address",
	"sender",
	"sender verify failed"
];
const REJECTION_HINTS = [
	"not authorized",
	"rejected"
] as const;

const PRIMARY_FROM_ADDR = env.MDMAIL_PRIMARY_FROM
	|| env.MDMAIL_FROM_PRIMARY
	|| env.MDMAIL_FROM
	|| DEFAULT_PRIMARY_FROM_ADDR;
const FALLBACK_FROM_ADDR = env.MDMAIL_FALLBACK_FROM
	|| env.MDMAIL_FROM_FALLBACK
	|| DEFAULT_FALLBACK_FROM_ADDR;
const PRIMARY_TRANSPORT_HOST = env.SMTP_PRIMARY_HOST
	|| env.SMTP_HOST
	|| DEFAULT_PRIMARY_TRANSPORT_HOST;
const PRIMARY_TRANSPORT_PORT = Number(
	env.SMTP_PRIMARY_PORT
	|| env.SMTP_PORT
	|| DEFAULT_PRIMARY_TRANSPORT_PORT
);
const PRIMARY_TRANSPORT_SECURE = String(
	env.SMTP_PRIMARY_SECURE
	|| env.SMTP_SECURE
	|| "false"
).toLowerCase() === "true";
const PRIMARY_TRANSPORT_SERVERNAME = env.SMTP_PRIMARY_SERVERNAME
	|| env.SMTP_SERVERNAME
	|| DEFAULT_PRIMARY_TRANSPORT_SERVERNAME;
const PRIMARY_TRANSPORT_CA_FILE = env.SMTP_PRIMARY_CA_FILE
	|| env.SMTP_CA_FILE;
const FALLBACK_TRANSPORT_HOST = env.SMTP_FALLBACK_HOST
	|| DEFAULT_FALLBACK_TRANSPORT_HOST;
const FALLBACK_TRANSPORT_PORT = Number(
	env.SMTP_FALLBACK_PORT || DEFAULT_FALLBACK_TRANSPORT_PORT
);
const FALLBACK_TRANSPORT_SECURE = String(
	env.SMTP_FALLBACK_SECURE || "false"
).toLowerCase() === "true";
const FALLBACK_TRANSPORT_SERVERNAME = env.SMTP_FALLBACK_SERVERNAME
	|| DEFAULT_FALLBACK_TRANSPORT_SERVERNAME;
const FALLBACK_TRANSPORT_USER = env.SMTP_FALLBACK_USER
	|| env.SMTP_USER;
const FALLBACK_TRANSPORT_PASS = env.SMTP_FALLBACK_PASS
	|| env.SMTP_PASS;
const FALLBACK_TRANSPORT_CA_FILE = env.SMTP_FALLBACK_CA_FILE
	|| env.SMTP_CA_FILE;
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

type TransportKind = "primary-local" | "fallback-gmail";

interface MailSendError {
	code?: string;
	command?: string;
	message?: string;
	response?: string;
	responseCode?: number;
}

interface MailSendResult {
	fromUsed: string;
	info: SendMailInfo;
	transportUsed: TransportKind;
	usedSenderFallback: boolean;
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

function readOptionalCA(path: string) {
	try {
		if (existsSync(path)) {
			const st = statSync(path);
			if (st.size > 0) return readFileSync(path);
		}
	}
	catch {}
	return undefined;
}

function createPrimaryTransporter() {
	const caBuf = PRIMARY_TRANSPORT_CA_FILE
		? readOptionalCA(PRIMARY_TRANSPORT_CA_FILE)
		: undefined;

	return nodemailer.createTransport({
		host: PRIMARY_TRANSPORT_HOST,
		port: PRIMARY_TRANSPORT_PORT,
		secure: PRIMARY_TRANSPORT_SECURE,
		connectionTimeout: 15000,
		socketTimeout: 15000,
		tls: {
			servername: PRIMARY_TRANSPORT_SERVERNAME,
			minVersion: "TLSv1.2",
			...(caBuf ? { ca: caBuf } : {})
		}
	});
}

function createFallbackTransporter() {
	const caBuf = FALLBACK_TRANSPORT_CA_FILE
		? readOptionalCA(FALLBACK_TRANSPORT_CA_FILE)
		: undefined;

	return nodemailer.createTransport({
		host: FALLBACK_TRANSPORT_HOST,
		port: FALLBACK_TRANSPORT_PORT,
		secure: FALLBACK_TRANSPORT_SECURE,
		auth:
			FALLBACK_TRANSPORT_USER && FALLBACK_TRANSPORT_PASS
				? {
						user: FALLBACK_TRANSPORT_USER,
						pass: FALLBACK_TRANSPORT_PASS
					}
				: undefined,
		connectionTimeout: 15000,
		socketTimeout: 15000,
		tls: {
			servername: FALLBACK_TRANSPORT_SERVERNAME,
			minVersion: "TLSv1.2",
			...(caBuf ? { ca: caBuf } : {})
		}
	});
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

function isTransportFailure(err: unknown): boolean {
	if (!err || typeof err !== "object" || isSenderRejection(err))
		return false;

	const { code, command, responseCode } = err as MailSendError;
	const errorText = getMailErrorText(err);
	if (typeof code === "string" && TRANSPORT_FAILURE_CODES.has(code.toUpperCase()))
		return true;
	if (
		TRANSPORT_FAILURE_HINTS.some(hint => errorText.includes(hint))
	)
		return true;
	if (
		typeof responseCode === "number"
		&& responseCode >= 400
		&& responseCode < 600
	) {
		if (
			typeof command === "string"
			&& TRANSPORT_FAILURE_COMMANDS.has(command.toUpperCase())
		) {
			return true;
		}
		return (
			errorText.includes("connection")
			|| errorText.includes("socket")
			|| errorText.includes("timeout")
			|| errorText.includes("service unavailable")
			|| errorText.includes("service not available")
			|| errorText.includes("local error in processing")
		);
	}

	return false;
}

async function sendWithFailover(
	mailBase: MailBase
): Promise<MailSendResult> {
	const primaryTransporter = createPrimaryTransporter();
	try {
		const info = await primaryTransporter.sendMail({
			...mailBase,
			from: PRIMARY_FROM_ADDR
		});
		console.info("admin-mail/send sent with primary transport", {
			transport: "primary-local",
			from: PRIMARY_FROM_ADDR,
			messageId: info.messageId
		});
		return {
			info,
			fromUsed: PRIMARY_FROM_ADDR,
			transportUsed: "primary-local",
			usedSenderFallback: false
		};
	}
	catch (primaryErr) {
		if (!isTransportFailure(primaryErr)) {
			throw primaryErr;
		}
		console.warn(
			"admin-mail/send primary transport failed, retrying with fallback transport",
			{
				transport: "primary-local",
				fallbackTransport: "fallback-gmail",
				from: PRIMARY_FROM_ADDR,
				error: summarizeMailError(primaryErr)
			}
		);

		const fallbackTransporter = createFallbackTransporter();

		try {
			const info = await fallbackTransporter.sendMail({
				...mailBase,
				from: PRIMARY_FROM_ADDR
			});
			console.info("admin-mail/send sent with fallback transport", {
				transport: "fallback-gmail",
				from: PRIMARY_FROM_ADDR,
				messageId: info.messageId
			});
			return {
				info,
				fromUsed: PRIMARY_FROM_ADDR,
				transportUsed: "fallback-gmail",
				usedSenderFallback: false
			};
		}
		catch (fallbackTransportErr) {
			if (
				!isSenderRejection(fallbackTransportErr)
				|| FALLBACK_FROM_ADDR === PRIMARY_FROM_ADDR
			) {
				throw new AggregateError(
					[primaryErr, fallbackTransportErr],
					`Primary transport failed (${summarizeMailError(primaryErr)}); fallback transport failed (${summarizeMailError(fallbackTransportErr)})`
				);
			}

			console.warn(
				"admin-mail/send fallback transport rejected primary From, retrying with fallback From",
				{
					transport: "fallback-gmail",
					primaryFrom: PRIMARY_FROM_ADDR,
					fallbackFrom: FALLBACK_FROM_ADDR,
					error: summarizeMailError(fallbackTransportErr)
				}
			);

			try {
				const info = await fallbackTransporter.sendMail({
					...mailBase,
					from: FALLBACK_FROM_ADDR
				});
				console.info("admin-mail/send sent with fallback transport and fallback From", {
					transport: "fallback-gmail",
					from: FALLBACK_FROM_ADDR,
					messageId: info.messageId
				});
				return {
					info,
					fromUsed: FALLBACK_FROM_ADDR,
					transportUsed: "fallback-gmail",
					usedSenderFallback: true
				};
			}
			catch (senderFallbackErr) {
				throw new AggregateError(
					[primaryErr, fallbackTransportErr, senderFallbackErr],
					`Primary transport failed (${summarizeMailError(primaryErr)}); fallback transport rejected primary From (${summarizeMailError(fallbackTransportErr)}); fallback From failed (${summarizeMailError(senderFallbackErr)})`
				);
			}
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

		const mailBase = {
			to: recipients[0],
			cc: recipients.slice(1),
			subject,
			text: md,
			html
		};

		const { info, fromUsed, transportUsed, usedSenderFallback } = await sendWithFailover(
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
			transportUsed,
			fromUsed,
			usedSenderFallback,
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
