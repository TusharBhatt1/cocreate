import React from "react";
import type { RectangleLayer } from "~/types";
import { colorToCss } from "~/utils";

export default function Rectangle({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) {
  const { x, y, width, height, opacity, fill, stroke, cornerRadius } = layer;
  return (
    <g className="group">
      {/* hover rectangle */}
      <rect
        style={{ transform: `translate(${x}px, ${y}px)` }}
        height={height}
        width={width}
        fill="none"
        stroke="#0b99ff"
        strokeWidth={4}
        className="pointer-events-none opacity-0 group-hover:opacity-100"
      />
      {/* main rectangle */}
      <rect
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        height={height}
        width={width}
        opacity={`${opacity ?? 100}%`}
        rx={cornerRadius ?? 0}
        ry={cornerRadius ?? 0}
        fill={fill ? colorToCss(fill) : "#CCC"}
        stroke={stroke ? colorToCss(stroke) : "#CCC"}
        strokeWidth={1}
      />
    </g>
  );
}
