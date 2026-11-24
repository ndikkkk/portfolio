import WaveMarquee from "@/components/ui/wave-marquee";
import { profile } from "@/data/profile";

export function Marquee() {
  return (
    <div id="marquee" className="py-6 sm:py-10">
      <WaveMarquee items={profile.marquee} />
    </div>
  );
}
