"use server";

import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
} from "~/components/ui/sidebar";
import { CreateNewDesign } from "~/modules/dashboard/create-new-design";
import DashboardSidebar from "~/modules/dashboard/dashboard-sidebar";
import RoomsView from "~/modules/dashboard/rooms-view";
import UserButton from "~/modules/dashboard/user-button";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function page() {
  const session = await auth();

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: session?.user.id,
    },
    include: {
      ownedRooms: true,
      roomInvites: {
        include: {
          room: true,
        },
      },
    },
  });

  return (
    <div>
      <Sidebar>
        <SidebarHeader>
          <UserButton />
        </SidebarHeader>
      </Sidebar>{" "}
      <div className="space-y-4 ml-68 w-[calc(100vw-290px)] py-2">
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
    </div>
  );
}
