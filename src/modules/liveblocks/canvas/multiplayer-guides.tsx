import React, { memo } from "react";
import Cursor from "./cursor";
import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from "@liveblocks/react";
import Path from "./layers/path";
import { colorToCss } from "~/utils";

export default memo(function MultiplayerGuides() {
  return (
    <>
      <Cursors />
      <Drafts />
    </>
  );
});

function Cursors() {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
}

function Drafts() {
  const others = useOthersMapped(
    (others) => ({
      pencilDraft: others.presence.pencilDraft,
      penColor: others.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
         return <Path
            key={key}
            x={0}
            y={0}
            fill={other.penColor ? colorToCss(other.penColor) : "#CCC"}
            points={other.pencilDraft}
            opacity={100}
          />;
        }
        return null;
      })}
    </>
  );
}
