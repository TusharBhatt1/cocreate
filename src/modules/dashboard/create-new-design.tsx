"use client"
import { Card, CardContent } from "~/components/ui/card";
import { Pencil } from "lucide-react";
import { createRoom } from "~/app/actions/room";

export function CreateNewDesign() {
  return (
    <Card
      onClick={() => createRoom()}
      className="w-64 rounded-xl cursor-pointer hover:bg-neutral-50"
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-blue-600">
          <Pencil className="size-5 text-white" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900">
            New design file
          </span>
          <span className="text-xs text-neutral-500">Create a new design</span>
        </div>
      </CardContent>
    </Card>
  );
}
