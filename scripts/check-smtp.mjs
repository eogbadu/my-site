/**
 * SMTP credential checker.
 *
 *   node --env-file=.env.local scripts/check-smtp.mjs          # verify login only
 *   node --env-file=.env.local scripts/check-smtp.mjs --send   # also send one test email
 *
 * Verifies the SMTP_* variables without going through a deploy. Uses nodemailer's
 * verify(), which performs a real connection + AUTH but sends nothing unless --send.
 */
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.ionos.com";
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const to = process.env.MAIL_TO || user;
const secure = process.env.SMTP_SECURE === "true" || port === 465;

console.log("host  :", host);
console.log("port  :", port, secure ? "(implicit TLS)" : "(STARTTLS)");
console.log("user  :", user ?? "(unset)");
console.log("pass  :", pass ? `set, ${pass.length} chars` : "(unset)");
console.log("to    :", to ?? "(unset)");
console.log();

if (!user || !pass) {
  console.error("✗ SMTP_USER and SMTP_PASS must both be set.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
});

try {
  await transporter.verify();
  console.log("✓ SMTP authentication succeeded.");
} catch (err) {
  console.error("✗ SMTP failed:", err.message);
  const hint = {
    EAUTH:
      "Credentials rejected (535). Wrong password, or the mailbox needs SMTP access\n" +
      "  enabled in the IONOS panel, or it requires an app-specific password.\n" +
      "  Note: repeated failures can get the account temporarily blocked.",
    EDNS: "Hostname did not resolve. Check SMTP_HOST.",
    ETIMEDOUT: "Connection timed out. Check the port, or an outbound firewall.",
    ECONNECTION: "Could not connect. Check host/port/TLS settings.",
  }[err.code];
  if (hint) console.error("\n  " + hint);
  process.exit(1);
}

if (process.argv.includes("--send")) {
  const info = await transporter.sendMail({
    from: user,
    to,
    subject: "SMTP check",
    text: "If you are reading this, the contact form's mail path works.",
  });
  console.log("✓ Test message sent:", info.messageId);
} else {
  console.log("  (re-run with --send to deliver a test message)");
}

transporter.close();
