import ScrollExpand from "@/components/ui/scroll-expand";
import { profile } from "@/data/profile";

export function Opening() {
  if (!profile.photo) return null;

  return (
    <div id="opening">
      <ScrollExpand
        src={profile.photo}
        alt={`Foto ${profile.name}`}
        title={profile.name}
        scrollHint="Gulir untuk masuk"
        useWindowScroll
        startWidth={42}
        startHeight={58}
        startRadius={8}
        endRadius={0}
        mediaZoom={1.3}
        scrollDistance={1}
        holdDistance={0.6}
        overlayScrim={0.4}
      >
        <p className="max-w-2xl text-lg font-medium text-white [text-shadow:3px_3px_0_rgba(17,17,17,0.85)] sm:text-xl">
          {profile.tagline}
        </p>
      </ScrollExpand>
    </div>
  );
}
