import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";

function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius)] focus:border-[var(--border-w)] focus:border-ink focus:bg-yellow focus:px-4 focus:py-2 focus:font-bold focus:text-on-accent focus:shadow-[var(--shadow)]"
    >
      Lewati ke konten
    </a>
  );
}

export default function App() {
  return (
    <>
      <SkipToContent />
      <Navbar />

      <main id="main-content">
        <Hero />
        <Marquee />

        <section id="about" className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-bold">Tentang</h2>
            <p className="mt-4 text-muted">Bagian ini akan diisi nanti.</p>
          </div>
        </section>

        <section id="projects" className="bg-bg px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-bold">Proyek</h2>
            <p className="mt-4 text-muted">Bagian ini akan diisi nanti.</p>
          </div>
        </section>

        <section
          id="achievements"
          className="bg-surface px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="font-bold">Pencapaian</h2>
            <p className="mt-4 text-muted">Bagian ini akan diisi nanti.</p>
          </div>
        </section>

        <section id="tools" className="bg-bg px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-bold">Tools</h2>
            <p className="mt-4 text-muted">Bagian ini akan diisi nanti.</p>
          </div>
        </section>

        <section id="contact" className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-bold">Kontak</h2>
            <p className="mt-4 text-muted">Bagian ini akan diisi nanti.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}