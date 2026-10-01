import { useEffect, useRef } from "react";

/** True when the reader has asked the system for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Motion primitives for the landing page.
 *
 * Two models, deliberately separated:
 *
 * - POSITION-bound (reversible): the travelling product and the spread wordmark.
 *   Both are recomputed from scroll offset, so scrolling back up plays them in
 *   reverse. Nothing is remembered.
 * - ENTRY-bound (fire once): every `.reveal` rule is scoped to `.motion-ok`,
 *   a class added to <html> only after confirming reduced motion is not set.
 *   The observer disconnects after its first hit, so a reveal cannot un-reveal.
 */

/**
 * Adds `motion-ok` to <html> when motion is welcome. Called once at boot.
 * Every CSS reveal rule hangs off this class, so a reduced-motion reader
 * never gets an element parked at opacity 0.
 */
export function armMotion(): boolean {
  if (typeof document === "undefined") return false;
  if (prefersReducedMotion()) return false;
  document.documentElement.classList.add("motion-ok");
  return true;
}

/**
 * Registers a scroll handler that runs on animation frames. Scroll position is
 * read once per frame and handed to every subscriber, so several components can
 * follow the same offset without stacking listeners.
 */
type ScrollSubscriber = (scrollY: number, viewportHeight: number) => void;

const subscribers = new Set<ScrollSubscriber>();
let frame: number | null = null;
let cachedScrollY = 0;

function publish() {
  frame = null;
  cachedScrollY = window.scrollY || window.pageYOffset || 0;
  const viewportHeight = window.innerHeight || 1;
  subscribers.forEach((fn) => fn(cachedScrollY, viewportHeight));
}

function onScroll() {
  if (frame !== null) return;
  frame = window.requestAnimationFrame(publish);
}

export function subscribeScroll(fn: ScrollSubscriber): () => void {
  subscribers.add(fn);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    }
  };
}

/**
 * Follows scroll position with an animation frame. The handler is kept in a ref
 * so callers can pass an inline closure without resubscribing each render.
 */
export function useScrollFrame(handler: (scrollY: number, viewportHeight: number) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    return subscribeScroll((scrollY, viewportHeight) => {
      handlerRef.current(scrollY, viewportHeight);
    });
  }, []);
}

/**
 * Reveals `[data-reveal]` descendants of `rootRef` once each, on entry.
 * Reveals are one-way: the observer is disconnected after its first batch.
 */
export function useRevealOnce<T extends HTMLElement>() {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.classList.add("is-revealed");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return rootRef;
}