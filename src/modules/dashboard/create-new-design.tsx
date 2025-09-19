"use client";
import { Card, CardContent } from "~/components/ui/card";
import { Loader2, Pencil } from "lucide-react";
import { createRoom } from "~/app/actions/room";
import { useState } from "react";

export function CreateNewDesign() {
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await createRoom();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      onClick={handleCreateRoom}
      className={`w-64 rounded-xl cursor-pointer hover:bg-neutral-50 ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-blue-600">
          {loading ? (
            <Loader2 className="size-5 text-white animate-spin" />
          ) : (
            <Pencil className="size-5 text-white" />
          )}
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
