import { z } from "zod";
import nodemailer from "nodemailer";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
  website: z.string().optional().default(""),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

export async function POST(req: Request) {
  // 🔒 Rate limit: e.g., 5 requests per 10 minutes per client
  const key = clientKeyFromRequest(req);
  const { allowed, remaining, retryAfterSec, resetAt } = rateLimit(key, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  // Common RateLimit headers (helps browsers/tools behave nicely)
  const commonHeaders = {
    "Content-Type": "application/json",
    "RateLimit-Limit": "5",
    "RateLimit-Remaining": String(remaining),
    "RateLimit-Reset": String(Math.ceil(resetAt / 1000)), // epoch seconds
  };

  if (!allowed) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Too many requests. Please try later.",
      }),
      {
        status: 429,
        headers: {
          ...commonHeaders,
          "Retry-After": String(retryAfterSec),
        },
      }
    );
  }

  try {
    const data = await req.json();
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message);
      return new Response(JSON.stringify({ ok: false, errors: issues }), {
        status: 400,
        headers: commonHeaders,
      });
    }

    const { name, email, message, website } = parsed.data;

    // Honeypot
    if (website && website.trim().length > 0) {
      return new Response(null, { status: 204, headers: commonHeaders });
    }

    // OPTIONAL email (same as before)...
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
        to: process.env.MAIL_TO ?? process.env.SMTP_USER,
        subject: `New contact from ${name}`,
        replyTo: email,
        text: message,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <pre>${escapeHtml(message)}</pre>
        `,
      });
    } else {
      console.log("[contact] message received:", { name, email, message });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: commonHeaders,
    });
  } catch (err) {
    console.error("[contact] error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: commonHeaders,
    });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
