import type { Camera, Color, Point } from "./types";

export function rgbToHex(color: Color): string {
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
