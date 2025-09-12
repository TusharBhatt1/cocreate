import React from "react";
import type { EllipseLayer, RectangleLayer } from "~/types";
import { colorToCss } from "~/utils";

export default function Ellipse({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) {
  const { x, y, width, height, opacity, fill, stroke } = layer;
  return (
    <g>
      <ellipse
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        height={height}
        width={width}
        opacity={`${opacity ?? 100}%`}
        fill={fill ? colorToCss(fill) : "#CCC"}
        stroke={stroke ? colorToCss(stroke) : "#CCC"}
        strokeWidth={1}
        cx={width / 2}
        cy={height / 2}
        rx={width / 2}
        ry={height / 2}
      />
    </g>
  );
}
