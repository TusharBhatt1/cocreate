import { useOthers, useSelf } from "@liveblocks/react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { connectionIdToColor } from "~/utils";

export default function ActiveUsers() {
  const me = useSelf();
  const others = useOthers();
  return (
    <div className="flex flex-row gap-2">
      <TooltipProvider>
        {me && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage alt={me.info?.name || "User avatar"} />
                <AvatarFallback
                  className="size-8 text-neutral-100 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: connectionIdToColor(me.connectionId),
                  }}
                >
                  {me.info?.name
                    ? me.info.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{me.info?.name || "Unknown"}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {others?.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage alt={user.info?.name || "User avatar"} />
                <AvatarFallback
                  className="size-8 text-neutral-100 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: connectionIdToColor(user.connectionId),
                  }}
                >
                  {user.info?.name
                    ? user.info.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.info.name || "Unknown"}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
