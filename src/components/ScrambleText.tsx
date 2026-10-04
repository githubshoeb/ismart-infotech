import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=<>/";
const START_DELAY = 180;
const STOP_DELAY = 2000;
const STAGGER = 45;
const CYCLE = 420;

/** Clean at rest; on hover runs a looping staggered decode wave; settles ~2s after leaving. */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);
  const startT = useRef<number>();
  const stopT = useRef<number>();
  const running = useRef(false);

  const stop = () => {
    running.current = false;
    cancelAnimationFrame(raf.current);
    setDisplay(text);
  };

  const run = () => {
    if (running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    let waveStart = performance.now();
    const total = text.length * STAGGER + CYCLE;
    let lastSwap = 0;
    const tick = (now: number) => {
      if (!running.current) return;
      let t = now - waveStart;
      if (t > total + 500) {
        waveStart = now;
        t = 0;
      }
      if (now - lastSwap > 45) {
        lastSwap = now;
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              const local = t - i * STAGGER;
              return local > 0 && local < CYCLE
                ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                : ch;
            })
            .join(""),
        );
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const onEnter = () => {
    clearTimeout(stopT.current);
    clearTimeout(startT.current);
    startT.current = window.setTimeout(run, START_DELAY);
  };
  const onLeave = () => {
    clearTimeout(startT.current);
    stopT.current = window.setTimeout(stop, STOP_DELAY);
  };

  useEffect(
    () => () => {
      clearTimeout(startT.current);
      clearTimeout(stopT.current);
      cancelAnimationFrame(raf.current);
    },
    [],
  );

  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={text}
      className={`relative inline-block cursor-default whitespace-nowrap ${className ?? ""}`}
    >
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {display}
      </span>
    </span>
  );
}
