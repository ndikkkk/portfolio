import { ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";
import { GitHubIcon } from "@/components/icons";
import { tagColor } from "@/lib/tag-colors";



export function Projects() {
  return (
    <section id="projects" className="bg-bg px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-bold">Proyek</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Beberapa karya yang pernah saya kerjakan, mulai dari aplikasi web
          sampai proyek perangkat keras.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile.projects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface p-6 shadow-[var(--shadow)]"
            >
              <h3 className="font-bold text-lg">{project.title}</h3>

              <p className="mt-3 flex-1 text-muted">{project.summary}</p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className={`rounded-[var(--radius)] border-[var(--border-w)] border-ink px-2 py-0.5 font-mono text-xs font-bold text-on-accent ${tagColor(tag)}`}
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-2">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface px-3 font-semibold text-sm shadow-[var(--shadow)] transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    Demo
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface px-3 font-semibold text-sm shadow-[var(--shadow)] transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    <GitHubIcon className="size-4" />
                    Repo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}