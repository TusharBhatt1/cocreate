import { COLORS } from "./constants";
import {
  LayerType,
  type Camera,
  type Color,
  type PathLayer,
  type Point,
  type XYWH,
  Side,
  type Layer,
} from "./types";

export function colorToCss(color: Color | null): string {
  if (!color) return "";
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

export const resizeBounds = (
  bounds: XYWH,
  corner: Side,
  point: Point
): XYWH => {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if (corner === Side.Left || (corner & Side.Left) !== 0) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }
  if (corner === Side.Right || (corner & Side.Right) !== 0) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }
  if (corner === Side.Top || (corner & Side.Top) !== 0) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }
  if (corner === Side.Bottom || (corner & Side.Bottom) !== 0) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;

  // const top = 1; //binary: 0001
  // const bottom = 2; //binary: 0010
  // const left = 4; //binary: 0100
  // const right = 8; //binary: 1000

  // const topLeft = top | left; //binary:0101
  // const isTop = topLeft & top; // not 0, true
  // const isNotTop = topLeft & bottom; //0, false
};

export const findIntersectionLayersWithRectangle = (
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) => {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);
    if (layer == null) continue;

    const { x, y, width, height } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }

    return ids;
  }
};

export const hexToRGB = (hex: string): Color => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
};

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length]!;
}
