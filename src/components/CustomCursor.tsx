import { useEffect, useState } from "react";

/** Small dot following the pointer; scales over interactive elements. Skipped on touch devices. */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement | null;
      setActive(Boolean(el?.closest("a, button, input, textarea, select, [data-cursor]")));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[100] hidden rounded-full bg-primary/70 md:block"
      style={{
        left: 0,
        top: 0,
        width: 12,
        height: 12,
        transform: `translate3d(${pos.x - 6}px, ${pos.y - 6}px, 0) scale(${active ? 2.6 : 1})`,
        transition: "transform 120ms cubic-bezier(0.22, 1, 0.36, 1)",
        mixBlendMode: "multiply",
      }}
    />
  );
}
