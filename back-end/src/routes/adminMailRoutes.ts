import { existsSync, readFileSync, statSync } from "node:fs";
import { env } from "node:process";
import { Router } from "express";
import { marked } from "marked";
import nodemailer from "nodemailer";
import { z } from "zod";
import { validAdmin } from "../middleware/auth.js";

const router = Router();

const FROM_ADDR = env.MDMAIL_FROM || "no-reply@example.com";
const ALLOW_TO = (env.MDMAIL_ALLOW_TO || "").split(",").filter(Boolean);
const MAX_MD_LEN = Number(env.MDMAIL_MAX_MD_LEN || 200_000);

const MailSchema = z.object({
	to: z.string().trim().min(1),
	subject: z.string().trim().min(1).max(200),
	md: z.string().min(1)
});

router.post("/send", validAdmin, async (req, res) => {
	try {
		const parsed = MailSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
		}
		const { to, subject, md } = parsed.data;

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

		// Ensure we always pass a string to nodemailer
		const html = await marked.parse(md);
		if (typeof html !== "string") {
			// noinspection ExceptionCaughtLocallyJS
			throw new TypeError("HTML render did not return a string");
		}

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

		const info = await transporter.sendMail({
			from: FROM_ADDR,
			to: recipients[0],
			cc: recipients.slice(1),
			subject,
			text: md,
			html
		});

		return res.json({ ok: true, messageId: info.messageId });
	}
	catch (err: any) {
		console.error("admin-mail/send failed:", err);
		return res.status(502).json({ ok: false, message: err?.message ?? "Send failed" });
	}
});

export const adminMailRoutes = router;
