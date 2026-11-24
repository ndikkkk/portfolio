import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import "./scroll-expand.css";

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

type MediaType = "image" | "video";

interface ScrollExpandProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  src?: string;
  mediaType?: MediaType;
  poster?: string;
  alt?: string;
  title?: ReactNode;
  intro?: ReactNode;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface ScrollExpandSettings {
  startWidth: number;
  startHeight: number;
  startRadius: number;
  endRadius: number;
  mediaZoom: number;
  scrollDistance: number;
  holdDistance: number;
  smoothing: number;
  overlayScrim: number;
  useWindowScroll: boolean;
  enabled: boolean;
}

export default function ScrollExpand({
  src = "",
  mediaType = "image",
  poster = "",
  alt = "",
  title = "",
  intro,
  scrollHint = "",
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = "",
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const settingsRef = useRef<ScrollExpandSettings>({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  });
  useEffect(() => {
    settingsRef.current = {
      startWidth,
      startHeight,
      startRadius,
      endRadius,
      mediaZoom,
      scrollDistance,
      holdDistance,
      smoothing,
      overlayScrim,
      useWindowScroll,
      enabled,
    };
  });

  const attachMedia = useCallback((node: HTMLImageElement | HTMLVideoElement | null) => {
    mediaRef.current = node;
  }, []);

  const applyProgress = useCallback((progress: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;

    const c = settingsRef.current;
    const eased = smoothstep(0, 1, progress);

    const width = c.startWidth + (100 - c.startWidth) * eased;
    const height = c.startHeight + (100 - c.startHeight) * eased;
    const insetX = Math.max(0, (100 - width) / 2);
    const insetY = Math.max(0, (100 - height) / 2);
    const radius = c.startRadius + (c.endRadius - c.startRadius) * eased;
    frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * eased})`;

    if (coverRef.current) {
      const coverOut = smoothstep(0, 0.45, progress);
      coverRef.current.style.opacity = `${1 - coverOut}`;
    }

    if (introRef.current) {
      const out = smoothstep(0.08, 0.45, progress);
      introRef.current.style.opacity = `${1 - out}`;
      introRef.current.style.transform = `translate3d(0, ${-24 * out}px, 0)`;
    }

    if (scrimRef.current) {
      const enter = smoothstep(0.4, 0.9, progress);
      scrimRef.current.style.opacity = `${c.overlayScrim * enter}`;
    }

    if (titleRef.current) {
      const out = smoothstep(0.12, 0.5, progress);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-24 * out}px, 0) scale(${1 + 0.04 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, progress);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const enter = smoothstep(0.68, 1, progress);
      overlayRef.current.style.opacity = `${enter}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - enter)}px, 0)`;
    }
  }, []);


  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageHeight = 0;
    let running = false;

    const measure = () => {
      const c = settingsRef.current;
      stageHeight = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageHeight <= 0) return;
      stage.style.height = `${stageHeight}px`;
      track.style.height = `${
        stageHeight * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))
      }px`;

      const width = root.clientWidth || stageHeight;
      stage.style.setProperty("--se-title-size", `${clamp(width * 0.05, 18, 64)}px`);
    };

    const readProgress = () => {
      const c = settingsRef.current;
      if (!c.enabled) return 1;
      const span = stageHeight * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) return clamp(-track.getBoundingClientRect().top / span, 0, 1);
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = settingsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (settingsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    if (useWindowScroll) window.addEventListener("scroll", onScroll, { passive: true });
    else root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(onResize);
    observer.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (useWindowScroll) window.removeEventListener("scroll", onScroll);
      else root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [applyProgress, useWindowScroll]);


  const media =
    mediaType === "video" ? (
      <video
        ref={attachMedia}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        ref={attachMedia}
        className="scroll-expand__media"
        src={src}
        alt={alt}
        draggable={false}
      />
    );

  return (
    <div
      ref={rootRef}
      className={cn("scroll-expand", useWindowScroll ? null : "scroll-expand--scroller", className)}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={coverRef} className="scroll-expand__cover" />
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {intro ? (
            <div ref={introRef} className="scroll-expand__intro">
              {intro}
            </div>
          ) : title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

