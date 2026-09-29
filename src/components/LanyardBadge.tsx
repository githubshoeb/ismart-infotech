import { Link } from "@tanstack/react-router";

/** Small floating badge with a gentle sway, links to the contact page. */
export function LanyardBadge() {
  return (
    <div className="pointer-events-none fixed right-5 bottom-6 z-40 hidden lg:block">
      <div className="sway pointer-events-auto">
        <div className="mx-auto h-8 w-px bg-border" />
        <Link
          to="/contact"
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium shadow-lg shadow-foreground/5 transition-colors hover:border-primary"
        >
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot absolute inline-flex h-2 w-2 rounded-full bg-highlight" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Available for new projects
        </Link>
      </div>
    </div>
  );
}
