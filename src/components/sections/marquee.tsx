import { profile } from "@/data/profile";

const SEPARATOR = "✦";

export function Marquee() {
  return (
    <div className="border-y-[var(--border-w)] border-ink bg-yellow py-3 text-on-accent">
      <div className="group overflow-hidden">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
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
    </div>
  );
}