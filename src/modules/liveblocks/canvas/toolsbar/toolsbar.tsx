import React from "react";
import { CanvasMode, LayerType, type CanvasState } from "~/types";
import SelectionButton from "./selection-button";
import ShapeSelectionButton from "./shape-selection-button";
import ZoomInButton from "./zoom-in-button";
import ZoomOutButton from "./zoom-out-button";
import PencilButton from "./pencil-button";
import TextButton from "./text-button";
import UndoButton from "./undo-button";
import RedoButton from "./redo-button";
import { useHistory } from "@liveblocks/react";

export default function Toolsbar({
  canvasState,
  setCanvasState,
  zoomIn,
  zoomOut,
  canZoomIn,
  canZoomOut,
}: {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}) {
  const { undo, redo, canUndo, canRedo } = useHistory();
  
  return (
    <div className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-lg bg-white p-1 shadow">
      <div className="flex justify-center items-center gap-2">
        <SelectionButton
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Dragging
          }
          canvasMode={canvasState.mode}
          onClick={(canvasMode) =>
            setCanvasState(
              canvasMode === CanvasMode.Dragging
                ? { mode: canvasMode, origin: null }
                : { mode: canvasMode }
            )
          }
        />
        <ShapeSelectionButton
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            [LayerType.Rectangle || LayerType.Ellipse].includes(
              canvasState.layerType
            )
          }
          canvasState={canvasState}
          onClick={(layerType) =>
            setCanvasState({ mode: CanvasMode.Inserting, layerType })
          }
        />
        <PencilButton
          isActive={canvasState.mode === CanvasMode.Pencil}
          onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
        />
        <TextButton
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
        />
        <div className="w-[1px] self-stretch bg-black/20" />
        <div className="flex justify-center items-center">
          <ZoomInButton onClick={zoomIn} disabled={!canZoomIn} />
          <ZoomOutButton onClick={zoomOut} disabled={!canZoomOut} />
        </div>
        <div className="w-[1px] self-stretch bg-black/20" />
        <div className="flex justify-center items-center">
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div>
      </div>
    </div>
  );
}
