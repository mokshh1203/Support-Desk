/**
 * The travelling product.
 *
 * One cut-out, `position: fixed`, moved along a keyframed path as the page
 * scrolls. Position is bound to scroll OFFSET, so scrolling back up plays the
 * route in reverse; nothing is remembered.
 *
 * x and y are percentages of the viewport, so the route holds at any size.
 * Rotation, scale and opacity interpolate between the same stops.
 */

export interface TravelStop {
  /** Normalised position along the route, 0 to 1. */
  at: number;
  /** Horizontal offset as a percentage of viewport width. */
  x: number;
  /** Vertical offset as a percentage of viewport height. */
  y: number;
  /** Degrees. */
  rotate: number;
  scale: number;
  opacity: number;
}

export interface TravelSample {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  /** True once the element should stop intercepting pointer events entirely. */
  hidden: boolean;
}

/**
 * The route. Chosen for this composition: the cut-out starts high on the right
 * of the hero (clear of the 46vw copy block), crosses left for the argument,
 * swings right again beside the demonstration, drops low for the material, and
 * fades out before the measurements so it stops competing with the figures.
 */
export const TRAVEL_STOPS: TravelStop[] = [
  { at: 0.0, x: 74, y: 30, rotate: -8, scale: 1, opacity: 1 },
  { at: 0.14, x: 26, y: 22, rotate: 6, scale: 0.86, opacity: 1 },
  { at: 0.3, x: 8, y: 48, rotate: -5, scale: 0.78, opacity: 1 },
  { at: 0.46, x: 22, y: 60, rotate: 9, scale: 0.7, opacity: 1 },
  { at: 0.62, x: 78, y: 26, rotate: -6, scale: 0.64, opacity: 1 },
  { at: 0.78, x: 30, y: 74, rotate: 4, scale: 0.58, opacity: 0.92 },
  { at: 0.9, x: 68, y: 40, rotate: -3, scale: 0.54, opacity: 0 },
  { at: 1.0, x: 52, y: 46, rotate: 0, scale: 0.5, opacity: 0 },
];

/**
 * Total scroll distance the route covers, in pixels. Long enough to carry the
 * cut-out through every early section, short enough that it has left before
 * the measurements.
 */
export const TRAVEL_SPAN_PX = 3200;

/** Below this opacity the element is set to `visibility: hidden`. */
const HIDE_BELOW = 0.004;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Smoothstep: eases in and out of every segment so no stop reads as a snap. */
function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Pure sampling of the route. Progress is clamped to the route's length. */
export function sampleTravel(progress: number): TravelSample {
  const p = clamp01(progress);

  let from = TRAVEL_STOPS[0];
  let to = TRAVEL_STOPS[TRAVEL_STOPS.length - 1];

  for (let i = 0; i < TRAVEL_STOPS.length - 1; i += 1) {
    const a = TRAVEL_STOPS[i];
    const b = TRAVEL_STOPS[i + 1];
    if (p >= a.at && p <= b.at) {
      from = a;
      to = b;
      break;
    }
  }

  const span = to.at - from.at;
  const local = span <= 0 ? 1 : (p - from.at) / span;
  const t = ease(local);

  const opacity = mix(from.opacity, to.opacity, t);

  return {
    x: mix(from.x, to.x, t),
    y: mix(from.y, to.y, t),
    rotate: mix(from.rotate, to.rotate, t),
    scale: mix(from.scale, to.scale, t),
    opacity,
    hidden: opacity < HIDE_BELOW,
  };
}

/** Progress along the route for a given scroll offset. */
export function travelProgress(scrollY: number): number {
  return clamp01(scrollY / TRAVEL_SPAN_PX);
}

/**
 * Absolute pixel position of a sample in a viewport of the given size.
 * Exported so the route can be measured in tests rather than assumed.
 */
export function travelPixelPosition(
  sample: TravelSample,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } {
  return {
    x: (sample.x / 100) * viewportWidth,
    y: (sample.y / 100) * viewportHeight,
  };
}