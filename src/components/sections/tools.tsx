import { profile } from "@/data/profile";
import { tagColor } from "@/lib/tag-colors";

export function Tools() {
  const groups = Object.entries(profile.tools);

  return (
    <section id="tools" className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-bold">Tools</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Teknologi dan alat yang biasa saya pakai untuk membangun aplikasi web
          dan proyek kecerdasan buatan.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(([category, items]) => (
            <div
              key={category}
              className="rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface p-6 shadow-[var(--shadow)]"
            >
              <h3 className="font-bold text-lg">{category}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-[var(--radius)] border-[var(--border-w)] border-ink px-2.5 py-0.5 font-mono text-xs font-bold text-on-accent ${tagColor(item)}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}