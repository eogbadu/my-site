import { z } from "zod";

/**
 * Extracted from the route handler so it can be tested directly.
 *
 * The honeypot is deliberately NOT `.max(0)`. That would make zod reject a filled
 * honeypot with a 400 before the handler's silent-204 branch runs, which both
 * leaks the field's existence to a bot and defeats the silent accept. See
 * docs/ERRORS.md E13.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name must be 100 characters or fewer."),
  /**
   * Trim and lowercase BEFORE validating.
   *
   * `z.email().trim()` validates first and transforms second, so a pasted address
   * with a stray leading or trailing space was rejected as invalid — a very common
   * real-world input. Piping puts the normalisation first. See docs/ERRORS.md E23.
   */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z
        .email("Please use a valid email address.")
        .max(254, "Email address is too long.")
    ),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long.")
    .max(5000, "Message must be 5000 characters or fewer."),
  website: z.string().optional().default(""),
});
