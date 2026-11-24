import { useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import "./wave-marquee.css";

interface WaveMarqueeProps {
  items: string[];
  separator?: string;
  speed?: number;
  className?: string;
}

/** Custom property yang dipakai keyframes di wave-marquee.css. */
type WaveMarqueeStyle = CSSProperties & {
  "--wave-marquee-duration": string;
  "--wave-marquee-shift": string;
};

interface WaveSlot {
  key: string;
  text: string;
  separator: boolean;
  x: number;
}

interface WavePoint {
  y: number;
  angle: number;
}

/** Lebar kanvas dalam satuan user, semua ukuran lain dihitung relatif ke sini. */
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 236;
const CENTER_Y = VIEW_HEIGHT / 2;

const FONT_SIZE = 52;
const SPARKLE_SIZE = 42;
const CAP_RATIO = 0.35;

const RIBBON_WIDTH = 92;
const RIBBON_OUTLINE = 4.5;
const AMPLITUDE = 58;

const SLOT_GAP = 40;
const CHAR_RATIO = 0.62;

/** Perkiraan panjang gelombang, biar jumlah lekukan mirip di semua lebar layar. */
const TARGET_WAVELENGTH = 440;
const SAMPLE_STEP = 8;
const MAX_SLOTS = 240;

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Titik tengah pita pada koordinat x, sekaligus sudut kemiringan kurva di titik itu.
 */
function wavePoint(x: number, k: number): WavePoint {
  return {
    y: CENTER_Y + AMPLITUDE * Math.sin(k * x),
    angle: (Math.atan(AMPLITUDE * k * Math.cos(k * x)) * 180) / Math.PI,
  };
}

interface WaveLayout {
  slots: WaveSlot[];
  cycle: number;
  wavelength: number;
}

/**
 * Menyusun urutan teks dan pemisah sepanjang kanvas. Panjang gelombang diambil
 * dari pembagi bulat satu siklus teks, supaya saat grup digeser tepat satu siklus
 * bentuk pita dan posisi teks kembali pas (loop tanpa lompatan).
 */
function buildLayout(items: string[], separator: string): WaveLayout | null {
  const pattern: Array<Omit<WaveSlot, "key" | "x"> & { width: number }> = [];

  for (const item of items) {
    pattern.push({ text: item, separator: false, width: item.length * FONT_SIZE * CHAR_RATIO });
    pattern.push({ text: separator, separator: true, width: SPARKLE_SIZE });
  }

  if (pattern.length === 0) return null;

  const cycle = pattern.reduce((total, slot) => total + slot.width + SLOT_GAP, 0);
  const waves = Math.max(2, Math.round(cycle / TARGET_WAVELENGTH));
  const wavelength = cycle / waves;

  const slots: WaveSlot[] = [];
  let cursor = 0;
  let index = 0;

  while (cursor <= VIEW_WIDTH + cycle && slots.length < MAX_SLOTS) {
    const slot = pattern[index % pattern.length];
    slots.push({ ...slot, key: String(index), x: cursor + slot.width / 2 });
    cursor += slot.width + SLOT_GAP;
    index += 1;
  }

  return { slots, cycle, wavelength };
}

function buildRibbonPath(k: number, end: number): string {
  const commands: string[] = [];

  for (let x = -RIBBON_WIDTH; x <= end; x += SAMPLE_STEP) {
    const prefix = commands.length === 0 ? "M" : "L";
    commands.push(`${prefix}${round2(x)} ${round2(wavePoint(x, k).y)}`);
  }

  return commands.join(" ");
}

export default function WaveMarquee({
  items,
  separator = "\u2726",
  speed = 70,
  className,
}: WaveMarqueeProps) {
  const layout = useMemo(() => buildLayout(items, separator), [items, separator]);

  if (!layout) return null;

  const k = (2 * Math.PI) / layout.wavelength;
  const ribbon = buildRibbonPath(k, VIEW_WIDTH + layout.cycle + RIBBON_WIDTH);
  const style: WaveMarqueeStyle = {
    "--wave-marquee-duration": `${round2(layout.cycle / speed)}s`,
    "--wave-marquee-shift": `-${round2(layout.cycle)}px`,
  };

  return (
    <div className={cn("wave-marquee w-full select-none overflow-hidden", className)} style={style}>
      <svg
        aria-hidden="true"
        className="wave-marquee__canvas pointer-events-none"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      >
        <g className="wave-marquee__track">
          <path
            className="wave-marquee__outline"
            d={ribbon}
            strokeWidth={RIBBON_WIDTH + RIBBON_OUTLINE * 2}
          />
          <path className="wave-marquee__ribbon" d={ribbon} strokeWidth={RIBBON_WIDTH} />
          {layout.slots.map((slot) => {
            const point = wavePoint(slot.x, k);
            const size = slot.separator ? SPARKLE_SIZE : FONT_SIZE;
            const x = round2(slot.x);
            const y = round2(point.y);

            return (
              <text
                key={slot.key}
                className={cn(
                  slot.separator ? "wave-marquee__sparkle" : "wave-marquee__label font-sans font-bold",
                )}
                x={x}
                y={round2(point.y + size * CAP_RATIO)}
                fontSize={size}
                transform={`rotate(${round2(point.angle)} ${x} ${y})`}
              >
                {slot.text}
              </text>
            );
          })}
        </g>
      </svg>
      <p className="sr-only">{items.join(" \u00b7 ")}</p>
    </div>
  );
}
