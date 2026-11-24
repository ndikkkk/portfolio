import { useEffect, useState } from "react";
import ScrollExpand from "@/components/ui/scroll-expand";
import { profile } from "@/data/profile";

export function Opening() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now
        .toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(/\./g, ":");
      setTime(formatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const photoSrc = profile.openingPhoto ?? profile.photo;
  if (!photoSrc) return null;

  return (
    <div id="opening" className="bg-black">
      <ScrollExpand
        src={photoSrc}
        alt={`Foto ${profile.name}`}
        useWindowScroll
        startWidth={28}
        startHeight={38}
        startRadius={16}
        endRadius={0}
        mediaZoom={1.2}
        scrollDistance={0.8}
        holdDistance={0.2}
        overlayScrim={0.25}
        intro={
          <div className="flex h-full w-full flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 select-none">
            {/* Top Bar */}
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/60 sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-white/40" />
                PORTFOLIO / 2026
              </span>
              <span>BOYOLALI, ID - {time || "--:--"} WIB</span>
            </div>

            {/* Center Area */}
            <div className="my-auto flex flex-col items-center justify-center text-center">
              {/* Open for Work Pill */}
              <div className="mb-4 sm:mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 backdrop-blur-sm shadow-[0_0_24px_rgba(16,185,129,0.18)]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-300 sm:text-xs">
                  Open for Work
                </span>
              </div>

              {/* Main Name */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                {profile.name}
              </h1>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-end justify-between font-mono text-xs uppercase tracking-widest text-white/60 sm:text-sm">
              <span>Informatics Student</span>
              <span className="flex items-center gap-1.5 text-white/40">
                SCROLL <span className="animate-bounce">↓</span>
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
}
