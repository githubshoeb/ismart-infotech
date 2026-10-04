/** Original animated AI chip on a circuit board: current pulses out of and back into the chip. */
const CX = 360;
const CY = 260;
const HALF = 62;

function buildTraces() {
  const traces: string[] = [];
  const offsets = [-45, -27, -9, 9, 27, 45];
  offsets.forEach((o, i) => {
    const bend = 40 + (i % 3) * 30;
    // right / left
    traces.push(`M${CX + HALF} ${CY + o} H${CX + HALF + bend} L${CX + HALF + bend + 40} ${CY + o * 2.4} H760`);
    traces.push(`M${CX - HALF} ${CY + o} H${CX - HALF - bend} L${CX - HALF - bend - 40} ${CY + o * 2.4} H-40`);
    // top / bottom
    traces.push(`M${CX + o} ${CY - HALF} V${CY - HALF - bend * 0.6} L${CX + o * 3} ${CY - HALF - bend * 0.6 - 40} V-40`);
    traces.push(`M${CX + o} ${CY + HALF} V${CY + HALF + bend * 0.6} L${CX + o * 3} ${CY + HALF + bend * 0.6 + 40} V560`);
  });
  return traces;
}
const TRACES = buildTraces();

export function CircuitBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 720 520"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-[0.32] dark:opacity-[0.45]"
      >
        <defs>
          <linearGradient id="chip-trace-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-highlight)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
          <radialGradient id="chip-glow">
            <stop offset="0%" stopColor="var(--color-highlight)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="var(--color-primary)" strokeOpacity="0.3" fill="none" strokeWidth="1">
          {TRACES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g stroke="url(#chip-trace-grad)" fill="none" strokeWidth="2.2" strokeLinecap="round">
          {TRACES.map((d, i) => (
            <path
              key={`p-${d}`}
              d={d}
              pathLength={440}
              className={`chip-pulse ${i % 2 ? "hidden sm:block" : ""}`}
              style={{ animationDelay: `${(i % 6) * 0.35}s` }}
            />
          ))}
        </g>

        <circle cx={CX} cy={CY} r="150" fill="url(#chip-glow)" className="chip-breathe" />

        {/* pins */}
        <g fill="var(--color-primary)" fillOpacity="0.6">
          {[-45, -27, -9, 9, 27, 45].flatMap((o) => [
            <rect key={`r${o}`} x={CX + HALF} y={CY + o - 2} width="10" height="4" />,
            <rect key={`l${o}`} x={CX - HALF - 10} y={CY + o - 2} width="10" height="4" />,
            <rect key={`t${o}`} x={CX + o - 2} y={CY - HALF - 10} width="4" height="10" />,
            <rect key={`b${o}`} x={CX + o - 2} y={CY + HALF} width="4" height="10" />,
          ])}
        </g>

        <rect
          x={CX - HALF}
          y={CY - HALF}
          width={HALF * 2}
          height={HALF * 2}
          rx="10"
          fill="var(--color-background)"
          fillOpacity="0.6"
          stroke="var(--color-highlight)"
          strokeOpacity="0.7"
          strokeWidth="1.5"
        />
        <rect
          x={CX - 34}
          y={CY - 34}
          width="68"
          height="68"
          rx="6"
          fill="var(--color-primary)"
          fillOpacity="0.25"
          stroke="var(--color-primary)"
          strokeOpacity="0.6"
          className="chip-breathe"
        />
        <text
          x={CX}
          y={CY + 7}
          textAnchor="middle"
          fontSize="20"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          fill="var(--color-highlight)"
        >
          AI
        </text>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
    </div>
  );
}
