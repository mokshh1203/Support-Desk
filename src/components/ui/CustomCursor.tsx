import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch-only screen
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect hover on interactive elements (links, buttons, inputs, cursor hover targets)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, [data-cursor-hover="true"], [data-cursor-scale]'
      );
      if (interactive) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth Lerp animation loop using requestAnimationFrame
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      // Lerp factor ~0.16 produces the signature lagging smooth inertia
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.16);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.16);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x - 16}px, ${
          currentPos.current.y - 16
        }px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isVisible]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 300ms ease",
      }}
    >
      <div
        className="size-8 rounded-full border border-black bg-white"
        style={{
          mixBlendMode: "difference",
          transform: isHovered ? "scale(2.5)" : "scale(1)",
          transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
