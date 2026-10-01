import { useRef } from "react";
import { sampleTravel, travelProgress } from "../../lib/travel";
import { prefersReducedMotion, useScrollFrame } from "../../lib/motion";
import bellUrl from "../../assets/bell.svg";

/**
 * The travelling product.
 *
 * A single cut-out, `position: fixed`, moved along a keyframed route as the
 * page scrolls. Its position is derived from the scroll offset every frame, so
 * scrolling back up plays the route in reverse — there is no state to unwind.
 *
 * x and y come from the route as percentages of the viewport, which keeps the
 * route honest at any size. The element is `pointer-events: none`, and once the
 * route fades it out it is also set to `visibility: hidden` so it cannot
 * intercept anything. Under prefers-reduced-motion the whole element is
 * removed from the document: the page must read as a complete document
 * without the product travelling across it.
 */
export function TravellingProduct() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollFrame((scrollY: number) => {
    const el = ref.current;
    if (!el) return;

    const sample = sampleTravel(travelProgress(scrollY));

    el.style.transform = `translate3d(${(sample.x / 100) * 100}vw, ${
      (sample.y / 100) * 100
    }vh, 0) translate(-50%, -50%) rotate(${sample.rotate}deg) scale(${sample.scale})`;
    el.style.opacity = String(sample.opacity);

    if (sample.hidden) {
      el.style.visibility = "hidden";
    } else {
      el.style.visibility = "visible";
    }
  });

  if (prefersReducedMotion()) return null;

  return (
    <div
      ref={ref}
      className="travelling-product"
      aria-hidden="true"
      style={{ transform: "translate3d(74vw, 30vh, 0) translate(-50%, -50%)", opacity: 1 }}
    >
      <img
        src={bellUrl}
        alt=""
        width={220}
        height={250}
        draggable={false}
        style={{ display: "block", width: "clamp(120px, 13vw, 200px)", height: "auto" }}
      />
    </div>
  );
}