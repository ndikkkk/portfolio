import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const SEPARATOR = "✦";

export function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative border-y-[var(--border-w)] border-ink bg-yellow py-3 text-on-accent">
      <div className="group overflow-hidden pr-14">
        <div
          className={cn(
            "flex w-max animate-marquee",
            paused
              ? "[animation-play-state:paused]"
              : "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
          )}
        >
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 items-center gap-8 pr-8"
            >
              {profile.marquee.map((item) => (
                <li
                  key={`${dup}-${item}`}
                  className="flex items-center gap-8 whitespace-nowrap font-bold"
                >
                  <span>{item}</span>
                  <span aria-hidden="true">{SEPARATOR}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((prev) => !prev)}
        aria-pressed={paused}
        aria-label={paused ? "Putar marquee" : "Jeda marquee"}
        className="absolute right-2 top-1/2 z-10 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-surface px-2.5 py-1 font-bold text-xs text-ink shadow-[var(--shadow)] transition-shadow hover:shadow-[4px_4px_0_0_var(--ink)] focus-visible:outline-[3px] focus-visible:outline-ink"
      >
        {paused ? (
          <Play className="size-3.5" aria-hidden="true" />
        ) : (
          <Pause className="size-3.5" aria-hidden="true" />
        )}
        {paused ? "Putar" : "Jeda"}
      </button>
    </div>
  );
}