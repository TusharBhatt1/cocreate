"use client";
import { useHistory, useSelf, useStorage } from "@liveblocks/react";
import { colorToCss } from "~/utils";
import LayerComponent from "./layer-component";
import React from "react";
import Toolsbar from "./toolsbar/toolsbar";
import Path from "./layers/path";
import SelectionBox from "./selection-box";
import useCanvas from "./hooks/useCanvas";

export default function Canvas() {
  const roomColor = useStorage((root) => root.roomColor);
  const layerIds = useStorage((root) => root.layerIds);

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const {
    camera,
    canvasState,
    setCamera,
    setCanvasState,
    onLayerPointerDown,
    onWheel,
    onPointerDown,
    onPointerLeave,
    onPointerMove,
    onPointerUp,
    onResizeHandlePointerDown,
  } = useCanvas();

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
              <SelectionBox
                onResizeHandlePointerDown={onResizeHandlePointerDown}
              />
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
