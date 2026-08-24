import { NextRequest, NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";
import { z } from "zod";

import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import { env, requireSmtpCredentials } from "@/lib/env";

/**
 * Why the bounds matter: App Router route handlers don't apply the old Pages-API
 * body cap, so without .max() a single request can push an arbitrarily large
 * payload through to the SMTP provider.
 */
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .email("Please use a valid email address.")
    .trim()
    .toLowerCase()
    .max(254, "Email address is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long.")
    .max(5000, "Message must be 5000 characters or fewer."),
  // Honeypot: real users never see this field, so any value means a bot.
  // Zod strips unknown keys by default, which is why this must be declared
  // explicitly rather than read off the raw body.
  //
  // Deliberately NOT .max(0): that would make zod reject the request with a 400,
  // which both leaks the field's existence and defeats the silent-204 below.
  website: z.string().optional().default(""),
});

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 } as const;

const commonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(body: unknown, status: number, extraHeaders: HeadersInit = {}) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { ...commonHeaders, ...extraHeaders },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Memoized at module scope so warm invocations reuse the SMTP connection instead
 * of paying a fresh TCP + TLS + AUTH handshake on every submission.
 */
let transporter: Transporter | null = null;

function getTransporter(user: string, pass: string): Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE || env.SMTP_PORT === 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 1,
  });

  return transporter;
}

export async function POST(req: NextRequest) {
  try {
    const key = clientKeyFromRequest(req);
    const { allowed, remaining, retryAfterSec, resetAt } = rateLimit(key, RATE_LIMIT);

    const rateHeaders = {
      "RateLimit-Limit": String(RATE_LIMIT.limit),
      "RateLimit-Remaining": String(remaining),
      "RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
    };

    if (!allowed) {
      return json(
        { ok: false, formError: "Too many messages. Please try again later." },
        429,
        { ...rateHeaders, "Retry-After": String(retryAfterSec) }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return json({ ok: false, formError: "Invalid request body." }, 400, rateHeaders);
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const { fieldErrors, formErrors } = z.flattenError(parsed.error);
      return json(
        { ok: false, fieldErrors, formError: formErrors[0] },
        400,
        rateHeaders
      );
    }

    const { name, email, message, website } = parsed.data;

    // Honeypot tripped. Return a silent success so the bot can't distinguish
    // rejection from delivery and retry with the field omitted.
    if (website.length > 0) {
      return new NextResponse(null, { status: 204, headers: rateHeaders });
    }

    let user: string;
    let pass: string;
    try {
      ({ user, pass } = requireSmtpCredentials());
    } catch {
      console.error("[contact] SMTP not configured");
      return json(
        { ok: false, formError: "Email service unavailable. Please try again later." },
        500,
        rateHeaders
      );
    }

    const info = await getTransporter(user, pass).sendMail({
      from: user, // must be the authenticated mailbox, or IONOS rejects on SPF/DMARC
      to: env.MAIL_TO || user,
      subject: `New contact from ${name}`,
      replyTo: email,
      text: message,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:system-ui, -apple-system, BlinkMacSystemFont;">
${escapeHtml(message)}
        </pre>
      `,
    });

    // Deliberately not logging info.accepted / info.rejected — they contain the
    // submitter's email address, which would end up in Vercel's log drain.
    console.log("[contact] sent", info.messageId);

    return json({ ok: true }, 200, rateHeaders);
  } catch (err) {
    console.error("[contact] error", err);
    return json({ ok: false, formError: "Server error. Please try again later." }, 500);
  }
}
