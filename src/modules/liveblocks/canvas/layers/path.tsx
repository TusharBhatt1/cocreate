import type { Color } from "~/types";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke, colorToCss } from "~/utils";
export default function Path({
  x,
  y,
  stroke,
  fill,
  opacity,
  points,
  onPointerDown,
}: {
  x: number;
  y: number;
  stroke?: string;
  fill: string;
  opacity: number;
  points: number[][];
  onPointerDown?: (e: React.PointerEvent, layerId: string) => void;
}) {
  const freehandStroke = getStroke(points, {
    size: 10,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const pathData = getSvgPathFromStroke(freehandStroke);

  return (
    <g className="group">
      {/* hover path */}
      <path
        style={{ transform: `translate(${x}px, ${y}px)` }}
        fill="none"
        d={pathData}
        stroke="#0b99ff"
        strokeWidth={4}
        className="pointer-events-none opacity-0 group-hover:opacity-100"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* main path */}
      <path
        style={{ transform: `translate(${x}px, ${y}px)` }}
        d={pathData}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        opacity={`${opacity ?? 100}%`}
      />
    </g>
  );
}
