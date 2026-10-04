/** Resolve a CSS custom property (any color syntax, e.g. oklch) to an "rgb(r, g, b)" string for canvas/three. */
export function cssColor(varName: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx || !raw) return raw || "rgb(0,0,0)";
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

export function withAlpha(rgb: string, a: number) {
  return rgb.replace("rgb(", "rgba(").replace(")", `, ${a})`);
}
