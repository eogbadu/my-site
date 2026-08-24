import "server-only";
import { z } from "zod";

/**
 * Validated server environment.
 *
 * `import "server-only"` makes the build fail loudly if a client component ever
 * imports this module, which is the guard that keeps secrets out of the browser
 * bundle. Nothing here may ever be prefixed NEXT_PUBLIC_.
 *
 * Validating up front turns a missing variable into one clear message naming the
 * key, instead of a confusing runtime failure deep inside a request handler.
 */
const envSchema = z.object({
  SMTP_HOST: z.string().min(1).default("smtp.ionos.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  MAIL_TO: z.email().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = Object.entries(z.flattenError(parsed.error).fieldErrors)
      .map(([key, errors]) => `  ${key}: ${errors?.join(", ")}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return parsed.data;
}

export const env: Env = loadEnv();

/**
 * SMTP_USER and SMTP_PASS are optional above so that builds and non-mail routes
 * never depend on them. The contact route calls this to assert them at the point
 * of use, where a clear failure is actually actionable.
 */
export function requireSmtpCredentials(): { user: string; pass: string } {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error("SMTP_USER and SMTP_PASS must both be set to send mail.");
  }
  return { user: env.SMTP_USER, pass: env.SMTP_PASS };
}
