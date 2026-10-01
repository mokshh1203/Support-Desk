import { useCallback, useRef } from "react";
import { useScrollFrame } from "../../lib/motion";

/**
 * The spread wordmark.
 *
 * The brand name set letter by letter across slightly more than the full width,
 * at display size with tight negative tracking, translated down so the frame
 * crops the baseline. It reads as a base the page stands on rather than a logo.
 *
 * Two motion models, deliberately separated:
 * - The reveal is ENTRY-bound. It runs on load, not on intersection, because the
 *   wordmark is on screen from the first paint. It fires once.
 * - The opening is POSITION-bound. Letters spread outward from the centre and
 *   sink as the wordmark leaves the frame, so scrolling back up closes it.
 *
 * The two live on nested elements so one transform never overwrites the other.
 */
export function SpreadWordmark({
  word = "Mini Support Desk",
  className = "",
  /** Only the hero wordmark opens with scroll; the close one is a static base. */
  driven = false,
}: {
  word?: string;
  className?: string;
  driven?: boolean;
}) {
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    letterRefs.current.forEach((el, i) => {
      if (!el) return;
      window.setTimeout(() => el.classList.add("is-revealed"), i * 45);
    });
  }, []);

  useScrollFrame((_scrollY: number, viewportHeight: number) => {
    const root = rootRef.current;
    if (!root) return;

    reveal();

    if (!driven) return;

    const rect = root.getBoundingClientRect();
    const travel = Math.max(1, rect.height * 1.4);
    const p = Math.min(1, Math.max(0, -rect.top / travel));
    const sink = p * viewportHeight * 0.06;
    const width = Math.min(window.innerWidth, 1600);
    const letters = letterRefs.current;
    const centre = (letters.length - 1) / 2;

    letters.forEach((el, i) => {
      if (!el) return;
      const spread = (i - centre) * p * width * 0.006;
      el.style.transform = `translate3d(${spread}px, ${sink}px, 0)`;
    });
  });

  const letters = Array.from(word.replace(/\s+/g, ""));

  return (
    <div
      ref={rootRef}
      className={`spread-wordmark${className ? ` ${className}` : ""}`}
      style={{ fontSize: "clamp(34px, 11.2vw, 164px)" }}
      aria-label={word}
    >
      {letters.map((char, i) => (
        <span key={`${char}-${i}`} className="spread-wordmark__letter" aria-hidden="true">
          <span className="spread-wordmark__reveal" ref={(el) => void (letterRefs.current[i] = el)}>
            {char}
          </span>
        </span>
      ))}
    </div>
  );
}