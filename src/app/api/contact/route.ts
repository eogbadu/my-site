import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.string().email("Please use a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

const commonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return new NextResponse(
        JSON.stringify({ ok: false, error: "Invalid request body" }),
        { status: 400, headers: commonHeaders }
      );
    }

    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return new NextResponse(JSON.stringify({ ok: false, errors }), {
        status: 400,
        headers: commonHeaders,
      });
    }

    const { name, email, message } = parseResult.data;

    const host = process.env.SMTP_HOST || "smtp.ionos.com";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure =
      process.env.SMTP_SECURE === "true" ? true : port === 465 ? true : false;

    if (!user || !pass) {
      console.error("[contact] SMTP not configured correctly");
      return new NextResponse(
        JSON.stringify({
          ok: false,
          error: "Email service not configured. Please try again later.",
        }),
        { status: 500, headers: commonHeaders }
      );
    }

    const toAddress = process.env.MAIL_TO || user;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: user, // keep this VERY simple for IONOS
      to: toAddress,
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

    console.log("[contact] sent", info.messageId, info.accepted, info.rejected);

    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      headers: commonHeaders,
    });
  } catch (err) {
    console.error("[contact] error", err);
    return new NextResponse(
      JSON.stringify({ ok: false, error: "Server error" }),
      { status: 500, headers: commonHeaders }
    );
  }
}
