import { cn } from "@/lib/utils";

type PixelPortraitProps = {
  src: string;
  pixelSrc: string;
  alt: string;
  className?: string;
};

export function PixelPortrait({
  src,
  pixelSrc,
  alt,
  className,
}: PixelPortraitProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius)] border-[var(--border-w)] border-ink shadow-[var(--shadow)]",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="size-full object-cover"
      />
      <img
        src={pixelSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 size-full object-cover [image-rendering:pixelated] transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
      />
    </div>
  );
}