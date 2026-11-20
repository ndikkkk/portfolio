import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./TextLoop.css";

// Adapted from React Bits TextLoop. React Bits is licensed under MIT + Commons Clause.
const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;

type Shape = "wave" | "circle" | "infinity" | "arch" | "line";

export interface TextLoopProps {
  text?: string;
  shape?: Shape;
  path?: string;
  speed?: number;
  direction?: "forward" | "reverse";
  separator?: string;
  curviness?: number;
  waveLength?: number;
  tilt?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  draggable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const wrap = (value: number, length: number) => ((value % length) + length) % length;

const buildPath = (shape: Shape, curviness: number, ribbonWidth: number, waveLength: number) => {
  const room = Math.max(20, CY - ribbonWidth / 2 - 6);
  const amplitude = Math.min(Math.max(0, curviness) * 2.2, room * 2);

  switch (shape) {
    case "circle": {
      const radius = Math.min(90 + Math.max(0, curviness) * 0.95, room);
      return `M ${CX - radius} ${CY} A ${radius} ${radius} 0 1 1 ${CX + radius} ${CY} A ${radius} ${radius} 0 1 1 ${CX - radius} ${CY} Z`;
    }
    case "infinity": {
      const radius = 150 + Math.max(0, curviness) * 1.4;
      const height = Math.min(60 + Math.max(0, curviness) * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + radius * 0.55} ${CY - height} ${CX + radius} ${CY - height} ${CX + radius} ${CY}`,
        `C ${CX + radius} ${CY + height} ${CX + radius * 0.55} ${CY + height} ${CX} ${CY}`,
        `C ${CX - radius * 0.55} ${CY - height} ${CX - radius} ${CY - height} ${CX - radius} ${CY}`,
        `C ${CX - radius} ${CY + height} ${CX - radius * 0.55} ${CY + height} ${CX} ${CY}`,
        "Z",
      ].join(" ");
    }
    case "arch":
      return `M 120 ${CY + amplitude / 4} Q ${CX} ${CY - amplitude} ${VIEW_W - 120} ${CY + amplitude / 4}`;
    case "line":
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case "wave":
    default: {
      // Gelombang dari rangkaian kurva kuadratik: tiap segmen selebar setengah panjang
      // gelombang, titik kontrolnya bergantian di atas dan di bawah garis tengah.
      const half = Math.max(40, waveLength) / 2;
      const start = -320;
      const segments = Math.ceil((VIEW_W + 640) / half);
      let path = `M ${start} ${CY}`;
      for (let index = 0; index < segments; index += 1) {
        const x0 = start + index * half;
        const peak = index % 2 === 0 ? CY - amplitude : CY + amplitude;
        path += ` Q ${x0 + half / 2} ${peak} ${x0 + half} ${CY}`;
      }
      return path;
    }
  }
};

export default function TextLoop({
  text = "React ✦ Bits",
  shape = "wave",
  path,
  speed = 90,
  direction = "forward",
  separator = "✦",
  curviness = 90,
  waveLength = 640,
  tilt = 0,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color,
  ribbon = true,
  ribbonColor = "#5227FF",
  ribbonWidth = 86,
  pauseOnHover = true,
  draggable = false,
  className = "",
  style,
}: TextLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const headRef = useRef<SVGTextPathElement>(null);
  const tailRef = useRef<SVGTextPathElement>(null);
  const progressRef = useRef(0);
  const [metrics, setMetrics] = useState({ length: 0, repetitions: 1 });
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pathId = `text-loop-${rawId}`;

  const d = useMemo(
    () => path || buildPath(shape, curviness, ribbonWidth, waveLength),
    [path, shape, curviness, ribbonWidth, waveLength],
  );
  const unit = useMemo(() => {
    const phrase = uppercase ? text.toUpperCase() : text;
    const gap = separator ? `\u00a0${separator}\u00a0` : "\u00a0\u00a0\u00a0";
    return `${phrase}${gap}`;
  }, [text, separator, uppercase]);
  const textStyle = useMemo(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing],
  );

  useLayoutEffect(() => {
    const pathElement = pathRef.current;
    const measureElement = measureRef.current;
    if (!pathElement || !measureElement) return undefined;
    const measure = () => {
      try {
        const length = pathElement.getTotalLength();
        const unitWidth = measureElement.getComputedTextLength();
        if (length) {
          setMetrics({ length, repetitions: unitWidth ? Math.max(1, Math.round(length / unitWidth)) : 1 });
        }
      } catch {
        // SVG measurement is not available until the element has been laid out.
      }
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    return undefined;
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!root || !svg || !head || !tail || !metrics.length) return undefined;

    let travel = progressRef.current * metrics.length;
    let dragging = false;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;
    let reduced = motionQuery?.matches ?? false;
    const onMotionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      if (reduced) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        startFrame();
      }
    };
    const sign = direction === "reverse" ? -1 : 1;
    const circular = !path && shape === "circle";
    const radius = Math.min(90 + Math.max(0, curviness) * 0.95, Math.max(20, CY - ribbonWidth / 2 - 6));
    const update = () => {
      const offset = wrap(travel, metrics.length);
      progressRef.current = offset / metrics.length;
      head.setAttribute("startOffset", String(offset));
      tail.setAttribute("startOffset", String(offset - metrics.length));
    };
    update();

    // Jeda saat hover: kecepatan dianimasikan manual supaya tidak perlu dependensi animasi tambahan.
    let hoverScale = 1;
    let hoverTarget = 1;
    const enter = () => {
      if (pauseOnHover) hoverTarget = 0;
    };
    const leave = () => {
      if (pauseOnHover) hoverTarget = 1;
    };
    let previous = performance.now();
    let frameId = 0;
    const frame = (now: number) => {
      const deltaMs = now - previous;
      previous = now;
      if (reduced) {
        // prefers-reduced-motion aktif: hentikan loop sama sekali, teks tetap tampil diam.
        frameId = 0;
        return;
      }
      if (!dragging) {
        hoverScale += (hoverTarget - hoverScale) * (1 - Math.exp(-deltaMs / 220));
        if (hoverTarget === 0 && hoverScale < 0.002) hoverScale = 0;
        if (hoverScale > 0) {
          travel += Math.max(0, speed) * sign * hoverScale * Math.min(0.05, deltaMs / 1000);
          update();
        }
      }
      frameId = requestAnimationFrame(frame);
    };
    const startFrame = () => {
      if (frameId || reduced) return;
      previous = performance.now();
      frameId = requestAnimationFrame(frame);
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      root.setPointerCapture(event.pointerId);
      lastX = event.clientX;
      lastY = event.clientY;
      root.classList.add("text-loop--dragging");
    };
    const move = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      const scale = VIEW_W / (svg.getBoundingClientRect().width || VIEW_W);
      const angle = (tilt * Math.PI) / 180;
      const delta = circular
        ? (Math.atan2(event.clientY - svg.getBoundingClientRect().top, event.clientX) - Math.atan2(lastY - svg.getBoundingClientRect().top, lastX)) * radius
        : ((event.clientX - lastX) * Math.cos(angle) + (event.clientY - lastY) * Math.sin(angle)) * scale;
      travel += delta;
      update();
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const up = () => {
      dragging = false;
      pointerId = null;
      root.classList.remove("text-loop--dragging");
    };

    startFrame();
    motionQuery?.addEventListener("change", onMotionChange);
    if (pauseOnHover) {
      root.addEventListener("pointerenter", enter);
      root.addEventListener("pointerleave", leave);
    }
    if (draggable) {
      root.addEventListener("pointerdown", down);
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerup", up);
      root.addEventListener("pointercancel", up);
    }
    return () => {
      cancelAnimationFrame(frameId);
      motionQuery?.removeEventListener("change", onMotionChange);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
    };
  }, [metrics, speed, direction, pauseOnHover, draggable, path, shape, curviness, ribbonWidth, waveLength, tilt]);

  const loopText = unit.repeat(metrics.repetitions);
  const paint = color || (ribbon ? "#ffffff" : "currentColor");
  const transform = tilt ? `rotate(${tilt} ${CX} ${CY})` : undefined;

  return (
    <div ref={rootRef} className={`text-loop ${draggable ? "text-loop--draggable" : ""} ${className}`.trim()} style={style}>
      <svg ref={svgRef} className="text-loop-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={text}>
        <text ref={measureRef} className="text-loop-measure" style={textStyle} aria-hidden="true">{unit}</text>
        <g transform={transform}>
          <path ref={pathRef} id={pathId} d={d} fill="none" stroke={ribbon ? ribbonColor : "none"} strokeWidth={ribbon ? ribbonWidth : 0} strokeLinecap="round" />
          <text className="text-loop-text" style={textStyle} fill={paint} dominantBaseline="central" aria-hidden="true" textLength={metrics.length || undefined} lengthAdjust="spacing">
            <textPath ref={headRef} href={`#${pathId}`} startOffset={0}>{loopText}</textPath>
          </text>
          <text className="text-loop-text" style={textStyle} fill={paint} dominantBaseline="central" aria-hidden="true" textLength={metrics.length || undefined} lengthAdjust="spacing">
            <textPath ref={tailRef} href={`#${pathId}`} startOffset={0}>{loopText}</textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}