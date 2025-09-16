"use client";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { SidebarTrigger } from "~/components/ui/sidebar";
import LeftSidebar from "~/modules/shared/sidebar/sidebars";
import type { Layer } from "~/types";

export default function Room({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) {
  console.log(roomId);
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
          <LeftSidebar />
          <SidebarTrigger className="z-1000 bg-muted-foreground" />

          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
