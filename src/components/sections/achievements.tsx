import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";

export function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState<
    (typeof profile.achievements)[number] | null
  >(null);

  const openAchievement = (achievement: (typeof profile.achievements)[number]) => {
    setSelectedAchievement(achievement);
  };

  useEffect(() => {
    if (!selectedAchievement) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedAchievement(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedAchievement]);

  return (
    <>
      <section id="achievements" className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-bold">Pencapaian</h2>
            <p className="mt-4 max-w-2xl text-muted">
              Sertifikasi dan pencapaian yang saya kumpulkan selama proses belajar.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {profile.achievements.map((achievement, index) => (
              <Reveal key={achievement.title} delay={index * 60} className="h-full">
                <article
                  tabIndex={0}
                  onMouseEnter={() => openAchievement(achievement)}
                  onFocus={() => openAchievement(achievement)}
                  onClick={() => openAchievement(achievement)}
                  className="flex h-full cursor-pointer flex-col rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-bg p-4 shadow-[var(--shadow)] transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] sm:p-6"
                >
                  <h3 className="font-bold text-lg">{achievement.title}</h3>

                  {achievement.url && (
                    <div className="mt-4 overflow-hidden rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-white">
                      <iframe
                        src={`${achievement.url}#toolbar=0&navpanes=0&scrollbar=0`}
                        title={`Preview ${achievement.title}`}
                        className="pointer-events-none h-48 w-full sm:h-56"
                      />
                    </div>
                  )}

                  {(achievement.issuer || achievement.date) && (
                    <p className="mt-3 text-muted">
                      {[achievement.issuer, achievement.date].filter(Boolean).join(" · ")}
                    </p>
                  )}

                  {achievement.url && (
                    <a
                      href={achievement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="mt-5 inline-flex h-10 w-fit items-center gap-1.5 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-yellow px-3 font-semibold text-sm text-on-accent shadow-[var(--shadow)] transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                      Buka PDF
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selectedAchievement?.url && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 sm:p-8"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-dialog-title"
            className="relative flex h-[min(88vh,850px)] w-full max-w-5xl flex-col rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface p-3 shadow-[8px_8px_0_0_var(--ink)] sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id="achievement-dialog-title" className="text-xl font-bold sm:text-2xl">
                {selectedAchievement.title}
              </h2>
              <button
                type="button"
                aria-label="Tutup preview sertifikat"
                onClick={() => setSelectedAchievement(null)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-yellow text-on-accent shadow-[var(--shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <iframe
              src={`${selectedAchievement.url}#toolbar=0&navpanes=0&scrollbar=0`}
              title={`Preview penuh ${selectedAchievement.title}`}
              className="min-h-0 flex-1 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
}