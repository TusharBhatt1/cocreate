"use client";
import { useMutation, useStorage } from "@liveblocks/react";
import { pointerEventToCanvasPointer, rgbToHex } from "~/utils";
import LayerComponent from "./layer-component";
import {
  LayerType,
  type Layer,
  type RectangleLayer,
  type Point,
  type Camera,
  type EllipseLayer,
  type CanvasState,
  CanvasMode,
} from "~/types";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { useState } from "react";
import Toolsbar from "./toolsbar/toolsbar";
const MAX_LAYERS = 100;

export default function Canvas() {
  const roomColor = useStorage((root) => root.roomColor);
  const layerIds = useStorage((root) => root.layerIds);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");

      if (liveLayers.size >= MAX_LAYERS) return;

      const liveLayerIds = storage.get("layerIds");

      const layerId = nanoid();

      let layer: LiveObject<Layer> | null = null;

      if (layerType === LayerType.Rectangle) {
        layer = new LiveObject<RectangleLayer>({
          type: LayerType.Rectangle,
          x: position.x,
          y: position.y,
          opacity: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          height: 100,
          width: 100,
        });
      } else if (layerType === LayerType.Ellipse) {
        layer = new LiveObject<EllipseLayer>({
          type: LayerType.Ellipse,
          x: position.x,
          y: position.y,
          opacity: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          height: 100,
          width: 100,
        });
      }

      if (layer) {
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
    },
    []
  );

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      if (canvasState.mode === CanvasMode.None) {
        setCanvasState({ mode: CanvasMode.None });
        return;
      }
      const point = pointerEventToCanvasPointer(e, camera);
      insertLayer(LayerType.Ellipse, point);
    },
    [canvasState, setCanvasState, insertLayer]
  );

  return (
    <div className="h-screen w-full">
      <main className="fixed left-0 right-0 h-screen overflow-hidden">
        <div
          style={{ background: roomColor ? rgbToHex(roomColor) : "black" }}
          className="size-full touch-none"
        >
          <svg className="size-full" onPointerUp={onPointerUp}>
            <g>
              {layerIds?.map((layerId) => (
                <LayerComponent key={layerId} id={layerId} />
              ))}
            </g>
          </svg>
        </div>
      </main>

      <Toolsbar canvasState={canvasState} setCanvasState={setCanvasState} />
    </div>
  );
}
