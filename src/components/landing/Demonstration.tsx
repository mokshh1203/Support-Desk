import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../lib/motion";

export type DemoVariantId = "triaged" | "escalated" | "closed";

interface Variant {
  id: DemoVariantId;
  label: string;
  /** The same path, re-shaped for this variant. */
  d: string;
  strokeWidth: number;
  /** The three facts printed beneath the panel. */
  facts: [string, string][];
}

/**
 * One path, three variants.
 *
 * The panel shows the product's own output: a ticket's trace through the desk,
 * drawn as a single SVG path. Choosing a variant swaps the `d` and the stroke
 * width on that SAME path element and swaps the three facts beneath it together,
 * so the drawing and the printed numbers can never disagree.
 */
const VARIANTS: Variant[] = [
  {
    id: "triaged",
    label: "Triaged",
    d: "M40 214 H96 L134 132 H188 L226 96 H276",
    strokeWidth: 3,
    facts: [
      ["Queue position", "1 of 10"],
      ["Priority", "Urgent"],
      ["Waiting", "2 hours"],
    ],
  },
  {
    id: "escalated",
    label: "Escalated",
    d: "M40 214 H84 L118 176 L150 108 L188 62 L226 96 H276",
    strokeWidth: 4.5,
    facts: [
      ["Queue position", "4 of 10"],
      ["Priority", "High"],
      ["Waiting", "1 day"],
    ],
  },
  {
    id: "closed",
    label: "Closed",
    d: "M40 214 H92 L128 150 H172 L214 118 H276",
    strokeWidth: 2.5,
    facts: [
      ["Queue position", "Resolved"],
      ["Priority", "Medium"],
      ["Waiting", "Closed out"],
    ],
  },
];

export function Demonstration() {
  const [activeId, setActiveId] = useState<DemoVariantId>("triaged");
  const pathRef = useRef<SVGPathElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const entryDrawnRef = useRef(false);
  const variant = VARIANTS.find((v) => v.id === activeId) ?? VARIANTS[0];

  /**
   * The demonstration draws itself.
   *
   * Measure with getTotalLength(), set strokeDasharray and strokeDashoffset to
   * that length, then transition the offset to zero over roughly two seconds.
   * Re-runs on entry and again whenever the variant changes the shape, because
   * a new `d` has a new length.
   */
  const draw = useCallback(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();

    if (prefersReducedMotion()) {
      path.style.transition = "none";
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      return;
    }

    path.style.transition = "none";
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // Force a style flush so the browser sees the offset before it is animated.
    void path.getBoundingClientRect();

    path.style.transition = "stroke-dashoffset 2000ms cubic-bezier(0.33, 0, 0.15, 1)";
    path.style.strokeDashoffset = "0";
  }, []);

  /**
   * The FIRST draw waits for the section to come into view, so the trace is
   * already on screen by the time anyone reaches it and it draws itself on
   * entry rather than behind their back. Later draws, from picking a variant,
   * run immediately.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      entryDrawnRef.current = true;
      draw();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        entryDrawnRef.current = true;
        draw();
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [draw]);

  // Re-draws only after the entry draw has happened, so the first paint is not
  // spent animating a trace the reader cannot see yet.
  const isFirstVariant = useRef(true);
  useEffect(() => {
    if (isFirstVariant.current) {
      isFirstVariant.current = false;
      return;
    }
    if (!entryDrawnRef.current) return;
    draw();
  }, [draw, variant.id]);

  return (
    <div className="demonstration" ref={rootRef}>
      <div className="demonstration__picker" role="group" aria-label="Trace variant">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            className="variant-button"
            aria-pressed={v.id === activeId}
            onClick={() => setActiveId(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <figure className="demonstration__panel">
        <div className="demonstration__panel-head">
          <span className="type-kicker">Trace output</span>
          <span className="type-kicker" style={{ color: "var(--color-muted)" }}>
            {variant.label}
          </span>
        </div>

        <svg
          viewBox="0 0 320 250"
          role="img"
          aria-label={`Ticket trace for the ${variant.label.toLowerCase()} variant`}
          style={{ display: "block", width: "100%", height: "auto" }}
        >
          {/* Baseline rules, so the trace reads against the page's own grid */}
          <path className="draw-path__ghost" d="M40 214 H280" strokeWidth={1} />
          <path className="draw-path__ghost" d="M40 96 H280" strokeWidth={1} />
          <path
            className="draw-path__ghost"
            d="M40 40 V214 M160 40 V214 M280 40 V214"
            strokeWidth={1}
          />

          {/* The path that draws itself */}
          <path
            ref={pathRef}
            className="draw-path draw-path--animated draw-path--accent"
            d={variant.d}
            strokeWidth={variant.strokeWidth}
          />

          {/* Origin cap: a square, matching the zero-radius rule of the page */}
          <rect x={36} y={210} width={8} height={8} fill="var(--color-ink)" />
        </svg>

        <figcaption className="demonstration__facts">
          {variant.facts.map(([label, value]) => (
            <div key={label} className="rule-row">
              <span className="rule-row__label">{label}</span>
              <span className="rule-row__value">{value}</span>
            </div>
          ))}
        </figcaption>
      </figure>
    </div>
  );
}