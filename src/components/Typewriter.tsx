"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  words: string[];
  typingSpeed?: number; // ms per character while typing
  deletingSpeed?: number; // ms per character while deleting
  pauseTime?: number; // ms to pause when a word is fully typed
  loop?: boolean;
};

export default function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 50,
  pauseTime = 1200,
  loop = true,
}: Props) {
  // Respect user preference: if reduced motion, just show the first word.
  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  const [index, setIndex] = useState(0); // which word
  const [text, setText] = useState(""); // visible substring
  const [deleting, setDeleting] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      setText(words[0] ?? "");
      return;
    }

    const current = words[index] ?? "";
    const isWordDone = text === current;
    const isEmpty = text.length === 0;

    // Decide next delay
    let delay = typingSpeed;
    if (isWordDone && !deleting) delay = pauseTime;
    if (deleting) delay = deletingSpeed;

    timerRef.current = window.setTimeout(() => {
      if (!deleting) {
        // typing forward
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setDeleting(true);
      } else {
        // deleting backward
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next.length === 0) {
          setDeleting(false);
          const nextIndex = index + 1;
          if (nextIndex >= words.length) {
            if (!loop) return; // stop at the end
            setIndex(0);
          } else {
            setIndex(nextIndex);
          }
        }
      }
    }, delay);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [
    text,
    deleting,
    index,
    words,
    typingSpeed,
    deletingSpeed,
    pauseTime,
    prefersReduced,
    loop,
  ]);

  // Accessibility helpers
  return (
    <span
      className="inline-flex items-baseline"
      aria-live="polite"
      aria-atomic="true"
    >
      <span>{text}</span>
      {/* blinking caret */}
      {!prefersReduced && (
        <span
          className="ml-0.5 inline-block w-[1ch] border-r border-current animate-caret"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
