"use server";

import { Separator } from "~/components/ui/separator";
import { CreateNewDesign } from "~/modules/dashboard/create-new-design";
import RoomsView from "~/modules/dashboard/rooms-view";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function page() {
  const session = await auth();

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: session?.user.id,
    },
    include: {
      ownedRooms: {
        orderBy: {
          createdAt: "desc",
        },
      },
      roomInvites: {
        include: {
          room: true,
        },
        orderBy: {
          created: "desc",
        },
      },
    },
  });

  return (
      <div className="space-y-4 py-2 ml-4">
        <div>
          <p className="text-xl md:text-2xl border-b-muted-foreground">
            Recents
          </p>
          <Separator />
        </div>
        <CreateNewDesign />
        <RoomsView
          ownedRooms={user.ownedRooms}
          roomInvites={user.roomInvites.map((invite) => invite.room)}
        />
      </div>
  );
}
