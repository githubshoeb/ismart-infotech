import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

export const QUICKSTART_KEY = "ismart-quickstart-email";

export function QuickStart() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.length > 255) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    try {
      sessionStorage.setItem(QUICKSTART_KEY, v);
    } catch {
      /* storage unavailable */
    }
    navigate({ to: "/contact", hash: "form" });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-8 max-w-lg text-left">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="qs-email" className="sr-only">
          Your email
        </label>
        <input
          id="qs-email"
          type="email"
          placeholder="Your email"
          value={email}
          maxLength={255}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-input bg-background px-5 py-3.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-highlight focus:ring-2 focus:ring-highlight/30"
        />
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
        >
          Get Free Consultation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
        </button>
      </div>
      {error && <p className="mt-2 pl-5 text-xs text-destructive">{error}</p>}
    </form>
  );
}
