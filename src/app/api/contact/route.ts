import { z } from "zod";
import nodemailer from "nodemailer";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
  // honeypot field — should be empty; bots often fill all fields
  website: z.string().optional().default(""),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message);
      return new Response(JSON.stringify({ ok: false, errors: issues }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, email, message, website } = parsed.data;

    // Honeypot check
    if (website && website.trim().length > 0) {
      // treat as bot; respond 204 (no content) so bots “think” it worked
      return new Response(null, { status: 204 });
    }

    // OPTIONAL: send an email (configure env first)
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true", // true for 465
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
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
      // If email not configured, log to server for now
      console.log("[contact] message received:", { name, email, message });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[contact] error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Simple HTML escape to avoid accidental HTML in the email body
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
