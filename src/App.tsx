import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { Tools } from "@/components/sections/tools";

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

        <About />

        <Projects />

        <Tools />

        <Contact />
      </main>

      <Footer />
    </>
  );
}