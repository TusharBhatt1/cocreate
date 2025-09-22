"use client";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import type { User } from "@prisma/client";
import Sidebars from "~/modules/shared/sidebar/sidebars";
import type { Layer } from "~/types";

export default function Room({
  children,
  roomId,
  roomName,
  otherWithAccessToRoom,
}: {
  roomName: string;
  children: React.ReactNode;
  roomId: string;
  otherWithAccessToRoom: User[];
}) {


  return (
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          selection: [],
          cursor: null,
          penColor: null,
          pencilDraft: null,
        }}
        initialStorage={{
          roomColor: { r: 30, g: 30, b: 30 },
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <Sidebars
            roomId={roomId}
            roomName={roomName}
            otherWithAccessToRoom={otherWithAccessToRoom}
          />

          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
