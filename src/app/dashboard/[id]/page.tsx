import React from "react";
import Canvas from "~/modules/liveblocks/canvas/canvas";
import Room from "~/modules/liveblocks/components/room";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Room roomId={"roomId:" + id}>
     <Canvas/>
    </Room>
  );
}
