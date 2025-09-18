import type { User } from "@prisma/client";
import { Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { deleteInvite, shareRoom } from "~/app/actions/room";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
export default function ShareRoom({
  roomId,
  otherWithAccessToRoom,
}: {
  roomId: string;
  otherWithAccessToRoom: User[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleInvite = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      return;
    }

    const errorMessage = await shareRoom({
      roomId: roomId.replace("roomId:", ""),
      inviteEmail: email,
    });

    if (errorMessage) setError(errorMessage);
    setEmail("");
  };

  useEffect(() => {
    setError("");
  }, [openDialog]);

  return (
    <>
      <Button size="sm" onClick={() => setOpenDialog(true)}>
        <Share2 className="size-4" />
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a user</DialogTitle>
            <DialogDescription>
              Enter the email address of the user you want to invite.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!email.trim()}>
              Invite
            </Button>
          </div>
          {otherWithAccessToRoom.length > 0 && (
            <p className="text-neutral-500">Who has access</p>
          )}
          <ul>
            {otherWithAccessToRoom.map((user, index) => (
              <li
                className="flex items-center justify-between py-1"
                key={index}
              >
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage alt={user.name || "User avatar"} />
                    <AvatarFallback className="size-8 bg-primary text-white flex items-center justify-center">
                      {" "}
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px]">{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] text-gray-500">Full access</span>
                  <IoClose
                    onClick={() =>
                      deleteInvite(roomId.replace("roomId:", ""), user.email)
                    }
                    className="h-4 w-4 cursor-pointer text-gray-500"
                  />
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
