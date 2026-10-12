import { profile } from "@/data/profile";

const SEPARATOR = "✦";

export function Marquee() {
  return (
    <div className="border-y-[var(--border-w)] border-ink bg-yellow py-3 text-on-accent">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 items-center"
            >
              {profile.marquee.map((item) => (
                <li
                  key={`${dup}-${item}`}
                  className="flex items-center whitespace-nowrap font-bold"
                >
                  <span>{item}</span>
                  <span aria-hidden="true" className="mx-4">
                    {SEPARATOR}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}