/** Abstract circuit-board / AI-chip backdrop for the hero. Purely decorative. */
export function CircuitBackdrop() {
  const traces = [
    "M0 120 H180 L240 60 H420 L470 110 H720",
    "M0 260 H140 L200 320 H430 L500 250 H720",
    "M0 400 H220 L280 340 H460 L520 400 H720",
    "M120 0 V90 L180 150 V300 L120 360 V520",
    "M600 0 V110 L540 170 V330 L610 400 V520",
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 720 520"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-[0.28] dark:opacity-[0.4]"
      >
        <defs>
          <linearGradient id="trace-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-highlight)" />
          </linearGradient>
        </defs>

        <g stroke="var(--color-primary)" strokeOpacity="0.28" fill="none" strokeWidth="1">
          {traces.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g stroke="url(#trace-grad)" fill="none" strokeWidth="2.2" strokeLinecap="round">
          {traces.map((d, i) => (
            <path
              key={`flow-${d}`}
              d={d}
              className="trace-flow hidden sm:block"
              style={{ animationDelay: `${i * 1.4}s` }}
            />
          ))}
        </g>

        <g fill="var(--color-primary)" fillOpacity="0.35">
          {[
            [180, 120],
            [420, 60],
            [200, 320],
            [500, 250],
            [280, 340],
            [610, 400],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
          ))}
        </g>

        <rect
          x="290"
          y="205"
          width="140"
          height="110"
          rx="12"
          fill="none"
          stroke="var(--color-highlight)"
          strokeOpacity="0.45"
        />
        <rect
          x="322"
          y="238"
          width="76"
          height="44"
          rx="6"
          fill="var(--color-primary)"
          fillOpacity="0.12"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
    </div>
  );
}
