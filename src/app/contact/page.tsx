"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot (hidden)
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<string[] | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 204) {
        // honeypot triggered — pretend success
        setStatus("success");
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? ["Something went wrong"]);
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch {
      setErrors(["Network error"]);
      setStatus("error");
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose">
          Send a note and I’ll get back to you.
        </p>
      </header>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            minLength={2}
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="w-full h-32 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            minLength={10}
          />
        </div>

        {/* Honeypot: visually hidden but available to bots */}
        <div className="sr-only" aria-hidden>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>

        {/* Status & errors */}
        {errors && (
          <div className="text-sm text-red-600">
            {errors.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </div>
        )}
        {status === "success" && (
          <div className="text-sm text-green-700">
            Thanks! Your message was sent.
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-2xl bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
