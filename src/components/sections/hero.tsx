import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-bg px-4 pb-16 pt-24 sm:px-6 lg:px-8"
    >
      {/* Satu elemen dekoratif: stiker geometris */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-24 hidden size-24 rotate-12 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-pink shadow-[var(--shadow)] sm:right-12 sm:block sm:size-28 lg:right-24 lg:size-32"
      />

      <div className="relative mx-auto flex min-h-[70dvh] max-w-6xl flex-col items-start justify-center gap-6">
        <span className="rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-yellow px-3 py-1 font-mono text-sm font-bold text-on-accent shadow-[var(--shadow)]">
          Halo, saya
        </span>

        <h1 className="font-bold text-ink">{profile.name}</h1>

        <p className="max-w-2xl text-lg font-medium text-muted sm:text-xl">
          {profile.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <a href="#projects">
              Lihat proyek
              <ArrowRight />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#contact">
              Hubungi saya
              <Mail />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}