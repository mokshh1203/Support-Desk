import { describe, expect, it } from "vitest";
import {
  TRAVEL_SPAN_PX,
  TRAVEL_STOPS,
  sampleTravel,
  travelPixelPosition,
  travelProgress,
} from "./travel";

/** A reference viewport for measurement. The route is percentage-based, so it holds at any size. */
const VIEWPORT = { width: 1440, height: 900 };

function pixelAt(scrollY: number) {
  return travelPixelPosition(sampleTravel(travelProgress(scrollY)), VIEWPORT.width, VIEWPORT.height);
}

describe("travelling product route", () => {
  it("clamps progress to the route and keeps stops ordered", () => {
    const at = TRAVEL_STOPS.map((s) => s.at);
    expect(at[0]).toBe(0);
    expect(at[at.length - 1]).toBe(1);
    for (let i = 1; i < at.length; i += 1) {
      expect(at[i]).toBeGreaterThan(at[i - 1]);
    }
    expect(travelProgress(-500)).toBe(0);
    expect(travelProgress(TRAVEL_SPAN_PX * 4)).toBe(1);
  });

  it("hits every stop exactly when reached", () => {
    for (const stop of TRAVEL_STOPS) {
      const sample = sampleTravel(stop.at);
      expect(sample.x).toBeCloseTo(stop.x, 5);
      expect(sample.y).toBeCloseTo(stop.y, 5);
      expect(sample.rotate).toBeCloseTo(stop.rotate, 5);
      expect(sample.scale).toBeCloseTo(stop.scale, 5);
      expect(sample.opacity).toBeCloseTo(stop.opacity, 5);
    }
  });

  it("keeps x and y inside the viewport for the whole route", () => {
    for (let step = 0; step <= 100; step += 1) {
      const sample = sampleTravel(step / 100);
      expect(sample.x).toBeGreaterThanOrEqual(0);
      expect(sample.x).toBeLessThanOrEqual(100);
      expect(sample.y).toBeGreaterThanOrEqual(0);
      expect(sample.y).toBeLessThanOrEqual(100);
      expect(sample.scale).toBeGreaterThan(0);
    }
  });

  it("reverses when scroll goes back up, because position is a pure function of offset", () => {
    expect(sampleTravel(travelProgress(1200))).toEqual(sampleTravel(travelProgress(1200)));
    const down = sampleTravel(travelProgress(1200));
    const back = sampleTravel(travelProgress(400));
    expect(back.x).not.toBeCloseTo(down.x, 3);
    // Sampling the same offset twice after moving away returns the same place.
    expect(sampleTravel(travelProgress(400))).toEqual(back);
  });

  it("moves well over 100px across the first 700px of scroll", () => {
    const start = pixelAt(0);
    const end = pixelAt(700);
    const travelled = Math.hypot(end.x - start.x, end.y - start.y);

    expect(travelled).toBeGreaterThan(100);
    // The composition aims much further than the threshold, so assert the real figure.
    expect(travelled).toBeGreaterThan(400);
  });

  it("fades out and hides once the early sections are behind the reader", () => {
    expect(sampleTravel(travelProgress(0)).hidden).toBe(false);
    expect(sampleTravel(travelProgress(TRAVEL_SPAN_PX * 0.7)).hidden).toBe(false);

    const end = sampleTravel(travelProgress(TRAVEL_SPAN_PX));
    expect(end.opacity).toBe(0);
    expect(end.hidden).toBe(true);

    // Hidden stays true for the remainder of the document.
    expect(sampleTravel(travelProgress(TRAVEL_SPAN_PX * 3)).hidden).toBe(true);
  });

  it("holds the same relative position at any viewport size", () => {
    const narrow = travelPixelPosition(sampleTravel(0.3), 390, 844);
    const wide = travelPixelPosition(sampleTravel(0.3), 2560, 1440);
    expect(narrow.x / 390).toBeCloseTo(wide.x / 2560, 5);
    expect(narrow.y / 844).toBeCloseTo(wide.y / 1440, 5);
  });
});