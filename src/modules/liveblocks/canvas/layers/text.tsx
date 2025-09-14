import { useMutation } from "@liveblocks/react";
import { useEffect, useRef, useState } from "react";
import type { TextLayer } from "~/types";
import { colorToCss } from "~/utils";

export default function Text({
  id,
  layer,
  onPointerDown,
}: {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}) {
  const {
    x,
    y,
    width,
    height,
    opacity,
    fill,
    stroke,
    text,
    fontFamily,
    fontSize,
    fontWeight,
  } = layer;

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);

  const inputRef = useRef<HTMLInputElement>(null);

  const updateText = useMutation(({ storage }, newValue: string) => {
    const liveLayer = storage.get("layers");
    const layer = liveLayer.get(id);
    if (layer) {
      layer.update({ text: newValue });
    }
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <g
      onDoubleClick={() => setIsEditing(true)}
      onPointerDown={(e) => onPointerDown(e, id)}
      className="group"
    >
      {isEditing ? (
        <foreignObject x={x} y={y} width={width} height={height}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            style={{
              fontSize: `${fontSize}px`,
              fontFamily,
              fontWeight,
              color: colorToCss(fill),
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
            onBlur={() => {
              setIsEditing(false);
              updateText(inputValue);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsEditing(false);
                updateText(inputValue);
              }
            }}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </foreignObject>
      ) : (
        <>
          <rect
            style={{ transform: `translate(${x}px, ${y}px)` }}
            height={height}
            width={width}
            fill="none"
            stroke="#0b99ff"
            strokeWidth={2}
            className="pointer-events-none opacity-0 group-hover:opacity-100"
          />
          <text
            x={x}
            y={y + fontSize}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fill={colorToCss(fill)}
            stroke={colorToCss(stroke)}
            opacity={opacity}
          >
            {text}
          </text>
        </>
      )}
    </g>
  );
}
