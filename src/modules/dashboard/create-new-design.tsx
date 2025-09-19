"use client";
import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { createRoom } from "~/app/actions/room";
import { useRouter } from "nextjs-toploader/app";

export function CreateNewDesign() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");

  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!roomName.trim() || loading) return;

    try {
      setLoading(true);
      const id = await createRoom(roomName);
      setModalOpen(false);
      setRoomName("");
      router.push(`/dashboard/${id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        onClick={() => setModalOpen(true)}
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
            <span className="text-xs text-neutral-500">
              Create a new design
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Design</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Input
              placeholder="Enter file name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
            />
            <Button
              onClick={handleCreateRoom}
              disabled={loading || !roomName.trim()}
              className="mt-2"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
