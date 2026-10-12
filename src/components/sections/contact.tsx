import type { ComponentType } from "react";
import { Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons";

type ContactItem = {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

export function Contact() {
  const items: ContactItem[] = [
    { label: "Email", href: `mailto:${profile.links.email}`, Icon: Mail },
    ...(profile.links.whatsapp
      ? [
          {
            label: "WhatsApp",
            href: profile.links.whatsapp,
            Icon: WhatsAppIcon,
          },
        ]
      : []),
    { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedInIcon },
    { label: "GitHub", href: profile.links.github, Icon: GitHubIcon },
  ];

  return (
    <section id="contact" className="bg-bg px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-bold">Kontak</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Punya ide, pertanyaan, atau sekadar ingin menyapa? Silakan hubungi saya
          lewat salah satu kanal di bawah ini.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          {items.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface px-5 font-semibold shadow-[var(--shadow)] transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Icon className="size-5" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}