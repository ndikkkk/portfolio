import { useState, type ReactNode } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Lanyard from "@/components/ui/lanyard";
import TechText from "@/components/ui/tech-text";
import { profile } from "@/data/profile";

interface DecorationItemConfig {
  id: string;
  w: number;
  h: number;
  mobile: boolean;
  baseRotate: number;
  render: () => ReactNode;
}

interface PlacedDecoration {
  id: string;
  x: number;
  y: number;
  rotate: number;
  mobile: boolean;
  render: () => ReactNode;
}

const DECORATION_ITEMS: DecorationItemConfig[] = [
  {
    id: "math-fx",
    w: 10,
    h: 5,
    mobile: true,
    baseRotate: -6,
    render: () => (
      <span className="block whitespace-nowrap rounded border-2 border-ink bg-yellow px-3 py-1 font-mono text-xs font-medium text-on-accent shadow-[var(--shadow)] sm:text-sm">
        f(x) = x² + 1
      </span>
    ),
  },
  {
    id: "math-set",
    w: 8,
    h: 5,
    mobile: true,
    baseRotate: 6,
    render: () => (
      <span className="block whitespace-nowrap rounded border-2 border-ink bg-lilac px-3 py-1 font-mono text-xs font-medium text-on-accent shadow-[var(--shadow)] sm:text-sm">
        {"{ 0, 1 }"}
      </span>
    ),
  },
  {
    id: "math-bigo",
    w: 8,
    h: 5,
    mobile: true,
    baseRotate: 3,
    render: () => (
      <span className="block whitespace-nowrap rounded border-2 border-ink bg-blue px-3 py-1 font-mono text-xs font-medium text-on-accent shadow-[var(--shadow)] sm:text-sm">
        O(log n)
      </span>
    ),
  },
  {
    id: "math-sum",
    w: 7,
    h: 5,
    mobile: true,
    baseRotate: -6,
    render: () => (
      <span className="block whitespace-nowrap rounded border-2 border-ink bg-green px-3 py-1 font-mono text-xs font-medium text-on-accent shadow-[var(--shadow)] sm:text-sm">
        ∑ xᵢ
      </span>
    ),
  },
  {
    id: "pink-diamond",
    w: 4,
    h: 4,
    mobile: true,
    baseRotate: 45,
    render: () => (
      <span className="block size-5 border-2 border-ink bg-pink" />
    ),
  },
  {
    id: "circle-hollow",
    w: 5,
    h: 5,
    mobile: false,
    baseRotate: 0,
    render: () => (
      <span className="block size-8 rounded-full border-4 border-ink sm:size-9" />
    ),
  },
  {
    id: "pink-card",
    w: 11,
    h: 14,
    mobile: false,
    baseRotate: 12,
    render: () => (
      <div className="size-24 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-pink shadow-[var(--shadow)] sm:size-28 lg:size-32" />
    ),
  },
  {
    id: "blue-circle",
    w: 9,
    h: 11,
    mobile: false,
    baseRotate: -6,
    render: () => (
      <div className="size-16 rounded-full border-[var(--border-w)] border-ink bg-blue shadow-[var(--shadow)] sm:size-20 lg:size-24" />
    ),
  },
  {
    id: "green-triangle",
    w: 8,
    h: 10,
    mobile: false,
    baseRotate: 12,
    render: () => (
      <div className="size-14 border-4 border-ink bg-green shadow-[var(--shadow)] [clip-path:polygon(50%_0,100%_100%,0_100%)] sm:size-16 lg:size-20" />
    ),
  },
  {
    id: "lilac-circle",
    w: 8,
    h: 10,
    mobile: false,
    baseRotate: 0,
    render: () => (
      <div className="size-14 rounded-full border-[var(--border-w)] border-ink bg-lilac shadow-[var(--shadow)] sm:size-16 lg:size-20" />
    ),
  },
  {
    id: "orange-box",
    w: 6,
    h: 8,
    mobile: false,
    baseRotate: 0,
    render: () => (
      <div className="size-10 rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-orange shadow-[var(--shadow)] sm:size-12 lg:size-14" />
    ),
  },
  {
    id: "ink-dot",
    w: 4,
    h: 5,
    mobile: false,
    baseRotate: 0,
    render: () => (
      <div className="size-6 rounded-full bg-ink sm:size-8" />
    ),
  },
];

const CANDIDATE_ZONES = [
  // Top ribbon
  { x: 8, y: 7, mobile: true },
  { x: 24, y: 8, mobile: false },
  { x: 50, y: 6, mobile: true },
  { x: 72, y: 8, mobile: false },
  { x: 90, y: 7, mobile: true },

  // Left & right sides (desktop)
  { x: 6, y: 26, mobile: false },
  { x: 6, y: 46, mobile: false },
  { x: 6, y: 66, mobile: false },
  { x: 92, y: 26, mobile: false },
  { x: 92, y: 46, mobile: false },
  { x: 92, y: 66, mobile: false },

  // Center / aisle gaps (safe from overlapping headline and lanyard)
  { x: 48, y: 20, mobile: false },
  { x: 48, y: 78, mobile: false },

  // Bottom ribbon
  { x: 8, y: 90, mobile: true },
  { x: 24, y: 91, mobile: false },
  { x: 50, y: 92, mobile: true },
  { x: 72, y: 91, mobile: false },
  { x: 90, y: 90, mobile: true },

  // Intermediate floating spots
  { x: 16, y: 14, mobile: false },
  { x: 82, y: 15, mobile: false },
  { x: 16, y: 80, mobile: false },
  { x: 82, y: 80, mobile: false },
];

function generateDecorations(): PlacedDecoration[] {
  const minGap = 2;
  const maxRetries = 40;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const placed: PlacedDecoration[] = [];
    let failed = false;

    const mobilePool = CANDIDATE_ZONES.filter((z) => z.mobile).sort(() => Math.random() - 0.5);
    const desktopPool = CANDIDATE_ZONES.filter((z) => !z.mobile).sort(() => Math.random() - 0.5);

    // Shuffle placement order for maximum variety
    const shuffledItems = [...DECORATION_ITEMS].sort(() => Math.random() - 0.5);

    for (const item of shuffledItems) {
      const candidates = item.mobile
        ? [...mobilePool, ...desktopPool]
        : [...desktopPool, ...mobilePool];

      let placedThis = false;

      for (let i = 0; i < candidates.length; i++) {
        const zone = candidates[i];
        const jx = (Math.random() - 0.5) * 4;
        const jy = (Math.random() - 0.5) * 4;
        const x = Math.max(4, Math.min(94, +(zone.x + jx).toFixed(1)));
        const y = Math.max(5, Math.min(93, +(zone.y + jy).toFixed(1)));

        // AABB Collision check with safe margin
        const hasCollision = placed.some((p) => {
          const prevItem = DECORATION_ITEMS.find((it) => it.id === p.id);
          const prevW = prevItem?.w ?? 8;
          const prevH = prevItem?.h ?? 8;
          const overlapX = Math.abs(x - p.x) < (item.w + prevW) / 2 + minGap;
          const overlapY = Math.abs(y - p.y) < (item.h + prevH) / 2 + minGap;
          return overlapX && overlapY;
        });

        if (!hasCollision) {
          const mIdx = mobilePool.indexOf(zone);
          if (mIdx !== -1) mobilePool.splice(mIdx, 1);
          const dIdx = desktopPool.indexOf(zone);
          if (dIdx !== -1) desktopPool.splice(dIdx, 1);

          const rotJitter = Math.floor(Math.random() * 21) - 10;
          const rotate = item.baseRotate + rotJitter;

          placed.push({
            id: item.id,
            x,
            y,
            rotate,
            mobile: item.mobile,
            render: item.render,
          });
          placedThis = true;
          break;
        }
      }

      if (!placedThis) {
        failed = true;
        break;
      }
    }

    if (!failed && placed.length === DECORATION_ITEMS.length) {
      return placed;
    }
  }

  // Fallback to initial balanced layout if randomizer hits retry limit
  return DECORATION_ITEMS.map((item, index) => {
    const zone = CANDIDATE_ZONES[index % CANDIDATE_ZONES.length];
    return {
      id: item.id,
      x: zone.x,
      y: zone.y,
      rotate: item.baseRotate,
      mobile: item.mobile,
      render: item.render,
    };
  });
}

export function Hero() {
    const [decorations] = useState<PlacedDecoration[]>(() => generateDecorations());
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-bg px-4 pb-16 pt-24 sm:px-6 lg:px-8"
    >
      {/* Pola titik halus sebagai latar */}
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0"
      />

      {/* Elemen dekoratif: stiker & bentuk geometris acak tanpa saling menumpuk */}
      <div
        aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs select-none sm:text-sm"
      >
        {decorations.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.mobile ? "" : "hidden sm:block"}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            }}
          >
            {item.render()}
          </div>
        ))}
      </div>

      <div className="relative mx-auto grid min-h-[70dvh] w-full max-w-6xl items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] md:gap-8">
        <div className="relative z-10 flex flex-col items-start gap-6 py-8">
          <span className="rounded-[var(--radius)] border-[var(--border-w)] border-ink bg-yellow px-3 py-1 font-mono text-sm font-bold text-on-accent shadow-[var(--shadow)]">
            Halo, saya
          </span>

          <h1 className="sr-only">{profile.name}</h1>

          <div
            aria-hidden="true"
            className="relative h-[clamp(8rem,24vw,14rem)] w-full"
          >
            <TechText
              text={profile.name}
              fontWeight={600}
              fontSize={150}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              introDuration={2}
              clickKick
              guides={false}
            />
          </div>

          <p className="max-w-2xl text-lg font-medium text-muted sm:text-xl">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <a href="#projects">
                Lihat proyek
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="blue">
              <a href="#contact">
                Hubungi saya
                <Mail aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        <div
          aria-label="Kartu foto profil interaktif"
          className="mx-auto h-[min(58dvh,30rem)] min-h-80 w-full max-w-md md:h-[min(70dvh,38rem)] md:min-h-[28rem]"
        >
          <Lanyard
            frontImage={profile.photo}
            backImage={profile.photo}
            size={0.68}
            anchor="center"
            strapColor="#111111"
            cardColor="#ffffff"
            finish="matte"
            breeze={0.2}
          />
        </div>
      </div>
    </section>
  );
}