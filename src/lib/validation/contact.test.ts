import { describe, expect, it } from "vitest";
import { z } from "zod";

import { contactSchema } from "./contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "This message is comfortably long enough to pass validation.",
};

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("normalises the email and trims whitespace", () => {
    expect(contactSchema.parse({ ...valid, email: "  ADA@Example.COM " }).email).toBe(
      "ada@example.com"
    );
  });

  it("rejects the short-field cases that used to crash the form", () => {
    const r = contactSchema.safeParse({ name: "a", email: "nope", message: "x" });
    expect(r.success).toBe(false);
    if (r.success) return;
    const { fieldErrors } = z.flattenError(r.error);
    expect(Object.keys(fieldErrors).sort()).toEqual(["email", "message", "name"]);
    // Every message must be a plain string: rendering objects as React children
    // is what crashed the live form (ERRORS E1).
    for (const msgs of Object.values(fieldErrors)) {
      for (const m of msgs ?? []) expect(typeof m).toBe("string");
    }
  });

  it("enforces upper bounds so an unbounded body cannot be mailed", () => {
    expect(contactSchema.safeParse({ ...valid, message: "z".repeat(5001) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: "z".repeat(101) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "z".repeat(250) + "@e.com" }).success).toBe(false);
  });

  /**
   * Regression guard for ERRORS E13: a filled honeypot must PASS validation so
   * the handler can return a silent 204. Making this field .max(0) reintroduces
   * the bug.
   */
  it("lets a filled honeypot through validation", () => {
    const r = contactSchema.safeParse({ ...valid, website: "http://spam.example" });
    expect(r.success).toBe(true);
    expect(r.success && r.data.website).toBe("http://spam.example");
  });

  it("defaults the honeypot to an empty string when absent", () => {
    expect(contactSchema.parse(valid).website).toBe("");
  });
});
