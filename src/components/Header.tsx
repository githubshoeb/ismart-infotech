import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import iconLogo from "@/assets/ismart-logo-icon.png.asset.json";
import { SERVICES, SITE } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 64);
      setHidden(y > 180 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 ${scrolled && !open ? "glass-warm" : ""}`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <img
              src={iconLogo.url}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-[0.95rem] leading-tight font-medium tracking-tight">
              iSmart <span className="text-muted-foreground">Infotech Solutions</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link to="/" className="link-underline text-foreground/75 hover:text-foreground">
              Home
            </Link>
            <Link to="/about" className="link-underline text-foreground/75 hover:text-foreground">
              About
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                className="flex items-center gap-1 text-foreground/75 hover:text-foreground"
              >
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 w-[34rem] -translate-x-1/2 pt-4"
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-popover p-3 shadow-xl shadow-foreground/5">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to={s.path}
                          onClick={() => setServicesOpen(false)}
                          className="group rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                        >
                          <span className="block text-sm font-medium">{s.name}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {s.short}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/contact"
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
            >
              Contact
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-background pt-24 pb-16 md:hidden"
          >
            <nav className="shell flex flex-col gap-2 text-lg">
              <Link to="/" onClick={() => setOpen(false)} className="border-b border-border py-4">
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="border-b border-border py-4"
              >
                About
              </Link>
              <button
                type="button"
                onClick={() => setMobileServices((v) => !v)}
                className="flex items-center justify-between border-b border-border py-4 text-left"
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${mobileServices ? "rotate-180" : ""}`}
                />
              </button>
              {mobileServices && (
                <div className="flex flex-col gap-1 border-b border-border py-2 pl-4">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.slug}
                      to={s.path}
                      onClick={() => setOpen(false)}
                      className="py-2.5 text-base text-muted-foreground"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-primary px-6 py-3.5 text-center text-base font-medium text-primary-foreground"
              >
                Contact
              </Link>
              <p className="mt-8 text-sm text-muted-foreground">{SITE.email}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
