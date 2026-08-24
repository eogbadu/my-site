"use client";

import { useId, useState } from "react";

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string[]>>;

type ContactResponse = {
  ok?: boolean;
  fieldErrors?: FieldErrors;
  formError?: string;
};

const EMPTY_FORM = { name: "", email: "", message: "", website: "" };

const inputClass =
  "w-full rounded-xl border bg-surface px-3 py-2 " +
  "focus:outline-none focus:ring-2 focus:ring-accent";

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const uid = useId();
  const errorId = (field: FieldName) => `${uid}-${field}-error`;

  function update(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear a field's error as soon as the user edits it.
    if (field !== "website" && fieldErrors[field]) {
      setFieldErrors((e) => ({ ...e, [field]: undefined }));
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFieldErrors({});
    setFormError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Honeypot tripped server-side — the response is deliberately indistinguishable
      // from success so a bot can't learn to omit the field.
      if (res.status === 204) {
        setStatus("success");
        setForm(EMPTY_FORM);
        return;
      }

      const data: ContactResponse = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setFormError(data.formError ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(EMPTY_FORM);
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function FieldError({ field }: { field: FieldName }) {
    const messages = fieldErrors[field];
    if (!messages?.length) return null;
    return (
      <p id={errorId(field)} className="mt-1 text-sm text-red-600 dark:text-red-400">
        {messages[0]}
      </p>
    );
  }

  function borderFor(field: FieldName) {
    return fieldErrors[field]?.length
      ? "border-red-500 dark:border-red-500"
      : "border-rule";
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-ink-muted max-w-prose">
          Send a note and I&rsquo;ll get back to you.
        </p>
      </header>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4" noValidate>
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className={`${inputClass} ${borderFor("name")}`}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            aria-invalid={!!fieldErrors.name?.length}
            aria-describedby={fieldErrors.name?.length ? errorId("name") : undefined}
          />
          <FieldError field="name" />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`${inputClass} ${borderFor("email")}`}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            maxLength={254}
            autoComplete="email"
            aria-invalid={!!fieldErrors.email?.length}
            aria-describedby={fieldErrors.email?.length ? errorId("email") : undefined}
          />
          <FieldError field="email" />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className={`${inputClass} h-32 ${borderFor("message")}`}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            required
            minLength={10}
            maxLength={5000}
            aria-invalid={!!fieldErrors.message?.length}
            aria-describedby={fieldErrors.message?.length ? errorId("message") : undefined}
          />
          <FieldError field="message" />
        </div>

        {/*
          Honeypot. `inert` (React 19) removes it from both the accessibility tree and
          the tab order — unlike aria-hidden, which is an ARIA violation when it wraps
          a focusable element.
        */}
        <div inert className="sr-only">
          <label htmlFor="website">Website</label>
          <input id="website" type="text" autoComplete="off" tabIndex={-1} value={form.website} onChange={(e) => update("website", e.target.value)} />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        )}

        {status === "success" && (
          <p role="status" className="text-sm text-green-700 dark:text-green-400">
            Thanks! Your message was sent.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-2xl bg-ink text-paper px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
