import { useEffect, useRef, useState } from "react";
import { CalendarDays, ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";

export function Achievements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let rafId = 0;
    let layout = {
      startX: 0,
      targetX: 0,
      scrollDistance: 0,
    };

    const measure = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const trackWidth = track.scrollWidth;

      const leftPadding = Math.max(24, (viewportWidth - 1152) / 2);
      const fitsOnScreen = trackWidth + 48 <= viewportWidth;

      // Posisi target berhenti:
      // Jika semua kartu muat di layar (seperti di screenshot), posisikan di tengah / berbaris rapi dengan margin seimbang
      // Jika lebih lebar dari layar, berhenti tepat saat kartu terakhir selesai masuk di tepi kanan
      const targetX = fitsOnScreen
        ? Math.max(24, (viewportWidth - trackWidth) / 2)
        : viewportWidth - trackWidth - Math.min(leftPadding, 32);

      // Mulai dari luar batas kanan layar
      const startX = viewportWidth + 30;

      // Jarak scroll vertikal disesuaikan persis dengan jarak horizontal
      // Begitu kartu tiba di posisi berbaris, scroll vertikal langsung selesai dan berlanjut ke section berikutnya
      const travelDistance = Math.max(1, startX - targetX);
      const scrollDistance = Math.round(travelDistance * 0.85);

      container.style.height = `${viewportHeight + scrollDistance}px`;

      layout = { startX, targetX, scrollDistance };
    };

    const update = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = layout.scrollDistance;
      if (totalScrollable <= 0) return;

      const p = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      setProgress(p);

      const currentX = layout.startX + (layout.targetX - layout.startX) * p;
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative bg-surface"
      style={{ minHeight: "160vh" }}
    >
      <div className="sticky top-10 flex h-screen w-full flex-col justify-between overflow-hidden py-8 sm:py-12">
        {/* Header Section */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Pencapaian
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
                Sertifikasi dan pencapaian yang saya kumpulkan selama proses belajar.
              </p>
            </div>

            {/* Scroll Progress Bar & Counter */}
            <div className="flex items-center gap-3 self-start sm:self-end">
              <div className="h-2 w-28 overflow-hidden rounded-full border border-ink/20 bg-ink/10 sm:w-36">
                <div
                  className="h-full bg-yellow transition-all duration-75"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold tabular-nums text-muted">
                0{progress === 0 ? 0 : Math.min(profile.achievements.length, Math.ceil(progress * profile.achievements.length))} / 0{profile.achievements.length}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Reel Track */}
        <div className="relative w-full overflow-hidden py-4">
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 will-change-transform sm:gap-8"
            style={{ transform: "translate3d(100vw, 0, 0)" }}
          >
            {profile.achievements.map((achievement, index) => (
              <article
                key={achievement.title}
                className="flex h-[400px] w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border-[var(--border-w)] border-ink bg-bg shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1 sm:h-[440px] sm:w-[380px] md:w-[420px]"
              >
                {achievement.url && (
                  <div className="relative aspect-[16/9] overflow-hidden border-b-[var(--border-w)] border-ink bg-white">
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
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-ink bg-red px-3 py-1 text-xs font-bold text-on-accent shadow-sm sm:text-sm">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {achievement.year}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="self-start rounded-full border border-ink/20 bg-yellow/30 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase leading-none tracking-wide text-ink">
                      {achievement.category ?? "Sertifikat"}
                    </span>
                    <span className="font-mono text-xs font-bold text-muted">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-ink sm:text-lg">
                    {achievement.title}
                  </h3>

                  {(achievement.issuer || achievement.date) && (
                    <p className="mt-2 text-xs text-muted sm:text-sm">
                      {[achievement.issuer, achievement.date].filter(Boolean).join(" · ")}
                    </p>
                  )}

                  {(achievement.credentialId || achievement.validUntil) && (
                    <div className="mt-3 space-y-0.5 text-xs text-muted">
                      {achievement.credentialId && <p>ID: {achievement.credentialId}</p>}
                      {achievement.validUntil && <p>Berlaku hingga {achievement.validUntil}</p>}
                    </div>
                  )}

                  {achievement.url && (
                    <div className="mt-auto pt-4">
                      <div className="border-t border-ink/15 pt-3">
                        <a
                          href={achievement.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Lihat sertifikat ${achievement.title} (PDF, tab baru)`}
                          className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-ink underline-offset-4 hover:underline sm:text-sm"
                        >
                          Lihat Sertifikat (PDF)
                          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs text-muted font-mono">
            <span>Scroll ke bawah untuk melihat pencapaian berikutnya</span>
            <span className="hidden sm:inline">↓ Gulir Vertikal ➔ Geser Horizontal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
