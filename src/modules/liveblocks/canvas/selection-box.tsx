import { useSelf, useStorage } from "@liveblocks/react";
import { useEffect, useRef, useState } from "react";
import { LayerType, Side, type XYWH } from "~/types";

const handleWidth = 10;

export default function SelectionBox({
  onResizeHandlePointerDown,
}: {
  onResizeHandlePointerDown: (side: Side, initialBuild: XYWH) => void;
}) {
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null
  );

  const isShowingHandles = useStorage(
    (root) =>
      soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
  );

  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const padding = 16;

  const layers = useStorage((root) => root.layers);

  const layer = soleLayerId ? layers?.get(soleLayerId) : null;

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setTextWidth(bbox.width);
    }
  }, [layer]);

  if (!layer) return null;

  return (
    <>
      <rect
        className="pointer-events-none fill-transparent stroke-[#0b99ff] stroke-[1px]"
        style={{
          transform: `translate(${layer?.x}px, ${layer?.y}px)`,
        }}
        width={layer?.width}
        height={layer?.height}
      />
      <rect
        className="fill-[#ob99ff]"
        width={textWidth + padding}
        x={layer.x + layer.width / 2 - (textWidth + padding) / 2}
        y={layer.y + layer.height + 10}
        height={20}
        rx={4}
      />
      <text
        ref={textRef}
        style={{
          transform: `translate(${layer?.x + layer?.width / 2}px, ${
            layer?.y + layer.height + 25
          }px)`,
        }}
        className="pointer-events-none fill-white text-4"
        textAnchor="middle"
      >
        {Math.round(layer.width)} x {Math.round(layer.height)}
      </text>

      {isShowingHandles && layer && (
        <>
          {/* Top-left */}
          <rect
            style={{
              cursor: "nwse-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${layer.x - handleWidth / 2}px, ${
                layer.y - handleWidth / 2
              }px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top + Side.Left, layer);
            }}
          />

          {/* Top-center */}
          <rect
            style={{
              cursor: "ns-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${
                layer.x + layer.width / 2 - handleWidth / 2
              }px, ${layer.y - handleWidth / 2}px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top, layer);
            }}
          />

          {/* Top-right */}
          <rect
            style={{
              cursor: "nesw-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${
                layer.x + layer.width - handleWidth / 2
              }px, ${layer.y - handleWidth / 2}px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Top + Side.Right, layer);
            }}
          />

          {/* Middle-left */}
          <rect
            style={{
              cursor: "ew-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${layer.x - handleWidth / 2}px, ${
                layer.y + layer.height / 2 - handleWidth / 2
              }px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Left, layer);
            }}
          />

          {/* Middle-right */}
          <rect
            style={{
              cursor: "ew-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${
                layer.x + layer.width - handleWidth / 2
              }px, ${layer.y + layer.height / 2 - handleWidth / 2}px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Right, layer);
            }}
          />

          {/* Bottom-left */}
          <rect
            style={{
              cursor: "nesw-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${layer.x - handleWidth / 2}px, ${
                layer.y + layer.height - handleWidth / 2
              }px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom + Side.Left, layer);
            }}
          />

          {/* Bottom-center */}
          <rect
            style={{
              cursor: "ns-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${
                layer.x + layer.width / 2 - handleWidth / 2
              }px, ${layer.y + layer.height - handleWidth / 2}px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom, layer);
            }}
          />

          {/* Bottom-right */}
          <rect
            style={{
              cursor: "nwse-resize",
              width: `${handleWidth}px`,
              height: `${handleWidth}px`,
              transform: `translate(${
                layer.x + layer.width - handleWidth / 2
              }px, ${layer.y + layer.height - handleWidth / 2}px)`,
            }}
            className="fill-white stroke-[#0b99ff] stroke-[1px]"
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizeHandlePointerDown(Side.Bottom + Side.Right, layer);
            }}
          />
        </>
      )}
    </>
  );
}
