import { Liveblocks } from "@liveblocks/node";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const liveBlocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

export async function POST(req: Request) {
  const userSession = await auth();

  if (!userSession) throw Error("User not logged in");

  //Get users room and invitations to rooms
  const user = await db.user.findUniqueOrThrow({
    where: {
      id: userSession.user.id,
    },
  });

  if (!user) throw Error("User not found");

  const session = liveBlocks.prepareSession(user.id, {
    userInfo: {
      name: user.email ?? "Anonymous",
    },
  });

  session.allow(`roomId:${"test"}`, session.FULL_ACCESS);

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
