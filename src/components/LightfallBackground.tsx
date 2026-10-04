import { useEffect, useRef } from "react";

import { cssColor, withAlpha } from "@/lib/css-color";

/** Falling/drifting light beams (Lightfall-style) in the brand palette. Hero only. */
export function LightfallBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = { navy: "", primary: "", cyan: "", dark: false };
    const readColors = () => {
      colors = {
        navy: cssColor("--brand-navy"),
        primary: cssColor("--primary"),
        cyan: cssColor("--highlight"),
        dark: document.documentElement.classList.contains("dark"),
      };
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = w < 640 ? 26 : 60;
    const beams = Array.from({ length: count }, () => spawn(true));
    function spawn(initial = false) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -Math.random() * h * 0.5,
        len: 80 + Math.random() * 260,
        speed: 40 + Math.random() * 140,
        width: 0.6 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 12,
        cyan: Math.random() < 0.25,
        alpha: 0.25 + Math.random() * 0.6,
      };
    }

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      // Deep navy wash
      const wash = ctx!.createLinearGradient(0, 0, 0, h);
      wash.addColorStop(0, withAlpha(colors.navy, colors.dark ? 0.55 : 0.1));
      wash.addColorStop(1, withAlpha(colors.navy, 0));
      ctx!.fillStyle = wash;
      ctx!.fillRect(0, 0, w, h);

      ctx!.globalCompositeOperation = colors.dark ? "lighter" : "source-over";
      for (const b of beams) {
        const c = b.cyan ? colors.cyan : colors.primary;
        const a = b.alpha * (colors.dark ? 1 : 0.55);
        const g = ctx!.createLinearGradient(b.x, b.y - b.len, b.x, b.y);
        g.addColorStop(0, withAlpha(c, 0));
        g.addColorStop(1, withAlpha(c, a));
        ctx!.strokeStyle = g;
        ctx!.lineWidth = b.width;
        ctx!.beginPath();
        ctx!.moveTo(b.x - b.drift * 0.3, b.y - b.len);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
        ctx!.fillStyle = withAlpha(c, a);
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.width * 1.3, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function frame(now: number) {
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i]!;
        b.y += b.speed * dt;
        b.x += b.drift * dt;
        if (b.y - b.len > h) beams[i] = spawn();
      }
      draw();
      raf = requestAnimationFrame(frame);
    }

    if (reduce) draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
