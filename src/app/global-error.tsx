"use client";

/**
 * Last-resort boundary for errors thrown in the root layout itself.
 *
 * It replaces the entire document, so it must render its own <html>/<body> and
 * cannot rely on any layout styling — hence the inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#ffffff",
          color: "#0f172a",
        }}
      >
        <main style={{ textAlign: "center", padding: "2rem", maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#475569", marginBottom: "1.5rem" }}>
            The page failed to load. Please try again.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              borderRadius: "1rem",
              border: "none",
              background: "#0f172a",
              color: "#ffffff",
              padding: "0.65rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
