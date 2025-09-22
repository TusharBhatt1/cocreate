"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LogOut, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { signOutUser } from "~/app/actions/auth";
import { useSession } from "next-auth/react";

export default function UserButton() {
  const { data } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-0 p-5 text-left"
        >
          {/* Left side: Avatar + info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage alt={data?.user.name || "User avatar"} />
              <AvatarFallback className="bg-blue-500 text-white font-medium">
                {data?.user.email
                  ? data?.user?.email
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  :"U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {data?.user.name}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[160px]">
                {data?.user.email}
              </span>
            </div>
          </div>

          {/* Right side: Chevron */}
          <ChevronDown
            size={16}
            className="text-neutral-500 dark:text-neutral-400"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem
          onClick={() => signOutUser()}
          className="cursor-pointer text-red-600 flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
