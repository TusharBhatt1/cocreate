import React from "react";
import type { RectangleLayer } from "~/types";
import { rgbToHex } from "~/utils";

export default function Rectangle({
  id,
  layer,
}: {
  id: string;
  layer: RectangleLayer;
}) {
  const { x, y, width, height, opacity, fill, stroke, cornerRadius } = layer;
  return (
    <g>
      <rect
        style={{ transform: `translate(${x}px, ${y}px)` }}
        height={height}
        width={width}
        opacity={`${opacity ?? 100}%`}
        rx={cornerRadius ?? 0}
        ry={cornerRadius ?? 0}
        fill={fill ? rgbToHex(fill) : "#CCC"}
        stroke={stroke ? rgbToHex(stroke) : "#CCC"}
        strokeWidth={1}
      />
    </g>
  );
}
