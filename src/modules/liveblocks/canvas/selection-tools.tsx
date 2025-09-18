"use client";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import useSelectionBounds from "./hooks/useSelectionBounds";
import { CanvasMode, type Camera } from "~/types";
import { useMutation, useSelf } from "@liveblocks/react";
import { ArrowDown, ArrowUp } from "lucide-react";

function SelectionTools({
  canvasMode,
  camera,
}: {
  canvasMode: CanvasMode;
  camera: Camera;
}) {
  const selectionBounds = useSelectionBounds();
  const selection = useSelf((me) => me.presence.selection);

  useEffect(() => {
    if (canvasMode !== CanvasMode.RightClick) return;
    document.addEventListener(`contextmenu`, (e) => e.preventDefault());
    return () => {
      document.removeEventListener(`contextmenu`, (e) => e.preventDefault());
    };
  }, [canvasMode]);

  const bringToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices = [];

      const array = liveLayerIds.toArray();

      for (let i = 0; i < array.length; i++) {
        const element = array[i];

        if (element && selection?.includes(element)) {
          indices.push(i);
        }
      }

      for (let i = indices.length - 1; i >= 0; i--) {
        const element = indices[i];

        if (element) {
          liveLayerIds.move(
            element,
            array.length - 1 - (indices.length - 1 - i)
          );
        }
      }
    },
    [selection]
  );

  const bringToBack = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices = [];

      const array = liveLayerIds.toArray();

      for (let i = 0; i < array.length; i++) {
        const element = array[i];

        if (element && selection?.includes(element)) {
          indices.push(i);
        }
      }

      for (let i = indices.length - 1; i >= 0; i--) {
        const element = indices[i];

        if (element) {
          liveLayerIds.move(element, i);
        }
      }
    },
    [selection]
  );

  if (!selectionBounds) return null;

  const x =
    selectionBounds.width / 2 + selectionBounds.x * camera.zoom + camera.x;

  const y = selectionBounds.y * camera.zoom + camera.y;

  if (canvasMode !== CanvasMode.RightClick) return null;

  return (
    <div
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 100%))`,
      }}
      className="absolute flex flex-col min-w-40 rounded-xl bg-muted shadow-lg"
    >
      <Button variant="outline" onClick={bringToFront}>
        Bring to front <ArrowUp />
      </Button>
      <Button variant="outline" onClick={bringToBack}>
        Bring to back <ArrowDown />
      </Button>
    </div>
  );
}

export default React.memo(SelectionTools);
