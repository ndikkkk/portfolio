import { Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { GitHubIcon, InstagramIcon, LinkedInIcon } from "@/components/icons";

export function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.links.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: `mailto:${profile.links.email}`, label: "Email", Icon: Mail },
  ];

  return (
    <footer className="border-t-[var(--border-w)] border-ink bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <p className="font-bold">{profile.name}</p>

        <div className="flex items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              aria-label={label}
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface shadow-[var(--shadow)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>

        <p className="text-sm text-muted">
          Dibuat dengan React dan Tailwind CSS.
        </p>
        <p className="text-xs text-muted">
          &copy; {year} {profile.name}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}