import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { Tools } from "@/components/sections/tools";
import { WhatsAppIcon } from "@/components/icons";
import { whatsAppChatHref } from "@/data/profile";

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

function FloatingWhatsApp() {
  return (
    <a
      href={whatsAppChatHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat lewat WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full border-[var(--border-w)] border-ink bg-green text-on-accent shadow-[var(--shadow)] transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
    >
      <WhatsAppIcon className="size-7" />
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
      <FloatingWhatsApp />
    </>
  );
}