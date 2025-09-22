import { redirect } from "next/navigation";
import React from "react";
import Canvas from "~/modules/liveblocks/canvas/canvas";
import Room from "~/modules/liveblocks/components/room";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  const room = await db.room.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      ownerId: true,
      roomInvites: {
        select: {
          user: true,
        },
      },
    },
  });

  if (!session?.user.id || !room) {
    redirect("/dashboard");
  }

  const isUserInvited = room.roomInvites
    .map((invite) => invite.user.id)
    .includes(session.user.id);

  if (!isUserInvited && session.user.id !== room.ownerId) {
    redirect("/dashboard");
  }
  

  return (
    <Room
      roomId={"roomId:" + id}
      roomName={room.title}
      otherWithAccessToRoom={room.roomInvites.map((invitee) => invitee.user)}
    >
      <Canvas />
    </Room>
  );
}
