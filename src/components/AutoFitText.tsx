import {useEffect, useLayoutEffect, useRef, useState} from "react";

export type AutoFitTextProps = {
  text: string;
  className?: string;
  min?: number; // minimum font size in px
  max?: number; // maximum font size in px
};

/**
 * AutoFitText
 * - Keeps the text on a single line and adjusts font-size to fit the container's width.
 * - Measures the container's content width (so it fits nicely inside padded wrappers).
 */
export default function AutoFitText({
  text,
  className,
  min = 12,
  max = 800,
}: AutoFitTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(min);
  const [ready, setReady] = useState(false);

  // Binary search to find largest font-size that fits available width
  const measureAndSet = () => {
    const container = containerRef.current;
    const span = spanRef.current;
    if (!container || !span) return;

    const available = container.clientWidth; // content width inside padding
    if (available <= 0) return;

    // Guard for extremely small containers
    let lo = Math.max(1, Math.floor(min));
    let hi = Math.max(lo, Math.floor(max));
    let best = lo;

    // Ensure we don't get stale styles from previous runs
    span.style.whiteSpace = "nowrap";
    span.style.display = "inline-block";
    span.style.lineHeight = "1";

    // Quick escape: if even min overflows, stick to min
    span.style.fontSize = `${lo}px`;
    if (span.scrollWidth > available) {
      setFontSize(lo);
      return;
    }

    // Binary search up to ~20 iterations
    for (let i = 0; i < 20; i++) {
      const mid = Math.floor((lo + hi) / 2);
      span.style.fontSize = `${mid}px`;
      const needed = span.scrollWidth;
      if (needed <= available) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    setFontSize(best);
  };

  // Resize observer on the container for responsive fitting
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      // Use rAF to coalesce rapid changes
      requestAnimationFrame(measureAndSet);
    });
    ro.observe(container);

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-measure on text changes
  useEffect(() => {
    requestAnimationFrame(measureAndSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, min, max]);

  // Re-measure after fonts are ready (if supported)
  useEffect(() => {
    let cancelled = false;
    const fonts = typeof document !== "undefined" && document.fonts;
    if (fonts && fonts.ready) {
      fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(measureAndSet);
      });
    }
    setReady(true);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <span
        ref={spanRef}
        className={className}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          whiteSpace: "nowrap",
          display: "inline-block",
          // Hide initial flicker before first measurement
          opacity: ready ? 1 : 0,
        }}
      >
        {text}
      </span>
    </div>
  );
}
