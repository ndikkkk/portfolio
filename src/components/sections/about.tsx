import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import { PixelPortrait } from "@/components/ui/pixel-portrait";

export function About() {
  return (
    <section id="about" className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <Reveal>
            <h2 className="font-bold">Tentang</h2>
          </Reveal>
          <div className="mt-6 space-y-5 text-muted">
            {profile.about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="blue">
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Kunjungi LinkedIn
              </a>
            </Button>
          </div>
        </div>

        <Reveal delay={120} className="mx-auto">
          {profile.photo && profile.photoPixel ? (
            <PixelPortrait
              src={profile.photo}
              pixelSrc={profile.photoPixel}
              alt={`Foto ${profile.name}`}
              className="size-56 rotate-2 sm:size-64"
            />
          ) : (
            <div className="flex size-56 rotate-2 flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-yellow p-6 text-center text-on-accent shadow-[var(--shadow)] sm:size-64">
              <Image className="size-10" aria-hidden="true" />
              <span className="font-bold">Foto saya</span>
              <span className="text-sm font-medium">belum diisi</span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}