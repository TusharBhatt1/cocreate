"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function createRoom() {
  const session = await auth();

  if (!session?.user.id) throw new Error("User not authenticated");

  const room = await db.room.create({
    data: {
      owner: {
        connect: {
          id: session.user.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  redirect(`/dashboard/${room.id}`);
}

export async function updateRoomTitle({
  title,
  roomId,
}: {
  title: string;
  roomId: string;
}) {
  const session = await auth();

  if (!session?.user.id) throw new Error("User not authenticated");

  await db.room.findUniqueOrThrow({
    where: {
      id: roomId,
      ownerId: session.user.id,
    },
  });

  await db.room.update({
    where: {
      id: roomId,
    },
    data: {
      title: title,
    },
  });

  revalidatePath("dashboard");
}

export async function deleteRoom(roomId: string) {
  const session = await auth();

  if (!session?.user.id) throw new Error("User not authenticated");

  await db.room.findUniqueOrThrow({
    where: {
      id: roomId,
      ownerId: session.user.id,
    },
  });

  await db.room.delete({
    where: {
      id: roomId,
    },
  });

  revalidatePath("dashboard");
}

export async function shareRoom({
  roomId,
  inviteEmail,
}: {
  roomId: string;
  inviteEmail: string;
}) {
  const session = await auth();

  if (!session?.user.id) throw new Error("User not authenticated");

  await db.room.findUniqueOrThrow({
    where: {
      id: roomId,
      ownerId: session.user.id,
    },
  });

  const invitedUser = await db.user.findUnique({
    where: {
      email: inviteEmail,
    },
    select: { id: true },
  });

  if (!invitedUser) return "User not found";

  await db.roomInvite.create({
    data: {
      roomId,
      userId: invitedUser.id,
    },
  });

  revalidatePath("dashboard");
}

export async function deleteInvite(roomId: string, inviteEmail: string) {
  const session = await auth();

  if (!session?.user.id) throw new Error("User not authenticated");

  await db.room.findUniqueOrThrow({
    where: {
      id: roomId,
      ownerId: session.user.id,
    },
  });

  await db.roomInvite.deleteMany({
    where: {
      roomId,
      user: {
        email: inviteEmail,
      },
    },
  });

  revalidatePath("dashboard");
}
