import {
  LayerType,
  type Camera,
  type Color,
  type PathLayer,
  type Point,
} from "./types";

export function colorToCss(color: Color): string {
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

export const pointerEventToCanvasPointer = (
  e: React.PointerEvent,
  camera: Camera
): Point => {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
};

export const penPointsToPathPayer = (
  points: number[][],
  color: Color
): PathLayer => {
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;
    if (!x || !y) continue;
    if (left > x) left = x;
    if (top > y) top = y;
    if (right < x) right = x;
    if (bottom < y) bottom = y;
  }


  return {
    type: LayerType.Path,
    x: left,
    y: top,
    height: bottom - top,
    width: right - left,
    fill: color,
    stroke: color,
    opacity: 100,
    points: points 
      .filter(
        (point): point is [number, number, number] =>
          point[0] !== undefined &&
          point[1] !== undefined &&
          point[2] !== undefined
      )
      .map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
};

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const nextPoint = arr[(i + 1) & arr.length];
      if (!nextPoint) return acc;
      const [x1, y1] = nextPoint;
      acc.push(x0!, y0!, (x0! + x1!) / 2, (y0! + y1!) / 2);
      return acc;
    },
    ["M", ...(stroke[0] ?? []), "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
