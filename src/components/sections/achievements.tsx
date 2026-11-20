import { CalendarDays, ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";

export function Achievements() {
  return (
      <section id="achievements" className="bg-bg px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-bold">Pencapaian</h2>
            <p className="mt-4 max-w-2xl text-muted">
              Sertifikasi dan pencapaian yang saya kumpulkan selama proses belajar.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profile.achievements.map((achievement, index) => (
              <Reveal key={achievement.title} delay={index * 60} className="min-w-0 h-full">
                <article
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/15 bg-surface shadow-sm"
                >
                  {achievement.url && (
                    <div className="relative aspect-[2/1] overflow-hidden border-b border-ink/10 bg-white">
                      {achievement.image ? (
                        <img
                          src={achievement.image}
                          alt={`Preview ${achievement.title}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <iframe
                          src={`${achievement.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                          title={`Preview ${achievement.title}`}
                          tabIndex={-1}
                          loading="lazy"
                          className="pointer-events-none h-full w-full border-0"
                        />
                      )}
                      {achievement.year && (
                        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-red px-3 py-1 text-sm font-bold text-on-accent shadow-sm">
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          {achievement.year}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base leading-snug font-bold wrap-break-word">{achievement.title}</h3>
                  {(achievement.issuer || achievement.date) && (
                    <p className="mt-2 text-sm text-muted">
                      {[achievement.issuer, achievement.date].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {(achievement.credentialId || achievement.validUntil) && (
                    <div className="mt-4 space-y-1 text-xs text-muted wrap-break-word">
                      {achievement.credentialId && <p>No. Sertifikat: {achievement.credentialId}</p>}
                      {achievement.validUntil && <p>Berlaku hingga {achievement.validUntil}</p>}
                    </div>
                  )}
                  <span className="mt-4 self-start rounded-full border border-ink/15 px-2.5 py-1 text-[11px] leading-none font-bold tracking-wide uppercase">
                    {achievement.category ?? "Sertifikat"}
                  </span>
                  {achievement.url && (
                    <div className="mt-auto pt-4">
                    <div className="border-t border-ink/15 pt-2">
                    <a
                      href={achievement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Lihat sertifikat ${achievement.title} (PDF, tab baru)`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 hover:underline"
                    >
                      Lihat Sertifikat (PDF)
                      <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                    </a>
                    </div>
                    </div>
                  )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
  );
}