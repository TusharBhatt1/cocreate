"use client";
import {
  useMutation,
  useMyPresence,
  useSelf,
  useStorage,
} from "@liveblocks/react";
import {
  penPointsToPathPayer,
  pointerEventToCanvasPointer,
  colorToCss,
} from "~/utils";
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
  type TextLayer,
} from "~/types";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useState } from "react";
import Toolsbar from "./toolsbar/toolsbar";
import { C } from "node_modules/@liveblocks/react/dist/room-BE4TZf40";
import Path from "./path";
import SelectionBox from "./selection-box";
const MAX_LAYERS = 200;

export default function Canvas() {
  const roomColor = useStorage((root) => root.roomColor);
  const layerIds = useStorage((root) => root.layerIds);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const presence = useMyPresence();

  console.log(presence);

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
      } else if (layerType === LayerType.Text) {
        layer = new LiveObject<TextLayer>({
          type: LayerType.Text,
          text: "Text",
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          fontSize: 16,
          fontWeight: 400,
          opacity: 100,
          fontFamily: "Inter",
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
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

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: { r: 217, g: 217, b: 217 },
      });
    },
    []
  );

  const insertPath = useMutation(({ storage, self, setMyPresence }) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft } = self.presence;

    if (
      pencilDraft === null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();

    liveLayers.set(
      id,
      new LiveObject(
        penPointsToPathPayer(pencilDraft, { r: 217, g: 217, b: 217 })
      )
    );

    const liveLayerIds = storage.get("layerIds");

    liveLayerIds.push(id);

    setMyPresence({ pencilDraft: null });

    setCanvasState({ mode: CanvasMode.Pencil });
  }, []);

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft === null
      )
        return;

      setMyPresence({
        pencilDraft: [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
      zoom: camera.zoom,
    }));
  }, []);

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPointer(e, camera);

      if (canvasState.mode === CanvasMode.None) {
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting)
        //@ts-ignore
        insertLayer(canvasState.layerType, point);
      else if (canvasState.mode === CanvasMode.Dragging) {
        setCanvasState({ mode: CanvasMode.Dragging, origin: null });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      }
    },
    [canvasState, setCanvasState, insertLayer]
  );

  const onPointerDown = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPointer(e, camera);

      if (canvasState.mode === CanvasMode.Dragging) {
        setCanvasState({ mode: CanvasMode.Dragging, origin: point });
        return;
      }
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
    },
    [canvasState.mode, setCanvasState, insertLayer]
  );

  const onPointerMove = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPointer(e, camera);

      if (
        canvasState.mode === CanvasMode.Dragging &&
        canvasState.origin !== null
      ) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;

        setCamera((camera) => ({
          x: camera.x + deltaX,
          y: camera.y + deltaY,
          zoom: camera.zoom,
        }));
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(point, e);
      }
    },

    [canvasState, setCanvasState, insertLayer, camera]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      )
        return;

      e.stopPropagation();

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({
          selection: [layerId],
        });
      }
    },
    []
  );
  return (
    <div className="h-screen w-full">
      <main className="fixed left-0 right-0 h-screen overflow-hidden">
        <div
          style={{ background: roomColor ? colorToCss(roomColor) : "black" }}
          className="size-full touch-none"
        >
          <svg
            onWheel={onWheel}
            className="size-full"
            onPointerUp={onPointerUp}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <g
              style={{
                transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
              }}
            >
              {layerIds?.map((layerId) => (
                <LayerComponent
                  key={layerId}
                  id={layerId}
                  onLayerPointerDown={onLayerPointerDown}
                />
              ))}
              <SelectionBox />
              {pencilDraft !== null && pencilDraft.length > 0 && (
                <Path
                  x={0}
                  y={0}
                  fill={colorToCss({ r: 217, g: 217, b: 217 })}
                  points={pencilDraft}
                  opacity={100}
                />
              )}
            </g>
          </svg>
        </div>
      </main>

      <Toolsbar
        canvasState={canvasState}
        setCanvasState={(newState) => setCanvasState(newState)}
        canZoomIn={camera.zoom < 2}
        canZoomOut={camera.zoom > 0.5}
        zoomIn={() => {
          setCamera((camera) => ({ ...camera, zoom: camera.zoom + 0.1 }));
        }}
        zoomOut={() =>
          setCamera((camera) => ({ ...camera, zoom: camera.zoom - 0.1 }))
        }
      />
    </div>
  );
}
