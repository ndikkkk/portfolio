import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-bg px-4 pb-16 pt-24 sm:px-6 lg:px-8"
    >
      {/* Pola titik halus sebagai latar */}
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0"
      />

      {/* Elemen dekoratif: beberapa stiker geometris */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-24 hidden rotate-12 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-pink shadow-[var(--shadow)] sm:right-12 sm:block sm:size-28 lg:right-24 lg:size-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-44 hidden size-20 -rotate-6 rounded-full border-[var(--border-w)] border-ink bg-blue shadow-[var(--shadow)] sm:left-8 sm:block lg:left-20 lg:size-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-16 hidden size-16 rotate-12 border-4 border-ink bg-green shadow-[var(--shadow)] [clip-path:polygon(50%_0,100%_100%,0_100%)] sm:block lg:right-40 lg:size-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 bottom-8 hidden size-16 rounded-full border-[var(--border-w)] border-ink bg-lilac shadow-[var(--shadow)] sm:right-24 sm:block lg:right-56 lg:size-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-20 hidden size-12 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-orange shadow-[var(--shadow)] sm:block lg:size-14"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/3 top-8 hidden size-8 rounded-full bg-ink sm:block"
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
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#contact">
              Hubungi saya
              <Mail aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}