import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { PARTNERS } from "@/lib/site";

// Heavy 3D/physics bundle only loads when this section nears the viewport.
const PartnerLanyards = lazy(() => import("./PartnerLanyards"));

export function Partners() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="partners" className="section-pad scroll-mt-24">
      <div className="shell">
        <Reveal>
          <p className="text-eyebrow text-primary">
            Trusted collaborators we ship real work with — grab a badge and give it a swing.
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="text-section mt-4">Partners</h2>
        </Reveal>
        <ul className="sr-only">
          {PARTNERS.map((p) => (
            <li key={p.name}>{p.name}</li>
          ))}
        </ul>
        <div ref={ref} className="relative mt-8 h-[560px] w-full sm:h-[620px]">
          {near && (
            <ClientOnly>
              <Suspense fallback={null}>
                <PartnerLanyards />
              </Suspense>
            </ClientOnly>
          )}
        </div>
      </div>
    </section>
  );
}
