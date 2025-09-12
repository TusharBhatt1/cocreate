import { useStorage } from "@liveblocks/react";
import React, { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./layers/rectangle";
import Ellipse from "./layers/ellipse";
import Path from "./path";
import { colorToCss } from "~/utils";
import Text from "./layers/text";

const LayerComponent = memo(
  ({
    id,
    onLayerPointerDown,
  }: {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  }) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) return null;

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
          />
        );
      case LayerType.Text:
        return <Text id={id} layer={layer}             onPointerDown={onLayerPointerDown}
        />;
      case LayerType.Path:
        return (
          <Path
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            points={layer.points}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : "#CCC"}
            stroke={layer.stroke ? colorToCss(layer.stroke) : "#CCC"}
            opacity={100}
          />
        );

      default:
        return (
          <g>
            <rect x={0} y={0} width={200} height={200} fill="#FF0000" />
          </g>
        );
    }
  }
);

export default LayerComponent;
