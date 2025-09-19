"use client";

import React from "react";
import { useMemo, useState } from "react";
import ConfirmationModal from "./confirmation-modal";
import type { Room } from "@prisma/client";
import { deleteRoom, updateRoomTitle } from "~/app/actions/room";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

const PASTEL_COLORS = [
  "rgb(255, 182, 193)", // pink
  "rgb(176, 224, 230)", // powder blue
  "rgb(221, 160, 221)", // plum
  "rgb(188, 143, 143)", // rosy brown
  "rgb(152, 251, 152)", // pale green
  "rgb(238, 232, 170)", // pale goldenrod
  "rgb(230, 230, 250)", // lavender
  "rgb(255, 218, 185)", // peach
];

export default function RoomsView({
  ownedRooms,
  roomInvites,
}: {
  ownedRooms: Room[];
  roomInvites: Room[];
}) {
  const [viewMode, setViewMode] = useState("owns");

  const filteredRooms = useMemo(() => {
    if (viewMode === "owns") {
      return ownedRooms;
    } else if (viewMode === "shared") {
      return roomInvites;
    }
    return [];
  }, [viewMode, ownedRooms, roomInvites]);

  const roomColors = useMemo(() => {
    return filteredRooms.map((room, index) => ({
      id: room.id,
      color: PASTEL_COLORS[index % PASTEL_COLORS.length],
    }));
  }, [filteredRooms]);

  return (
    <div className="flex flex-col gap-5 mt-7">
      <div className="flex gap-1 w-full">
        <ViewModeButton
          onSelect={() => setViewMode("owns")}
          active={viewMode === "owns"}
          text="My project"
          count={ownedRooms.length}
        />
        <ViewModeButton
          onSelect={() => setViewMode("shared")}
          active={viewMode === "shared"}
          text="Shared files"
          count={roomInvites.length}
        />
      </div>
      {filteredRooms.length > 0 && (
        <div className="flex flex-wrap gap-4 max-h-[450px] overflow-scroll p-2">
          {filteredRooms.map((room) => {
            const roomColor =
              roomColors.find((rc) => rc.id === room.id)?.color ??
              PASTEL_COLORS[0]!;

            return (
              <React.Fragment key={room.id}>
                <SingleRoom
                  id={room.id}
                  title={room.title}
                  description={`Created ${room.createdAt.toDateString()}`}
                  color={roomColor}
                  href={`/dashboard/${room.id}`}
                  canEdit={viewMode === "owns"}
                />
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SingleRoom({
  id,
  title,
  description,
  color,
  href,
  canEdit,
}: {
  id: string;
  title: string;
  description: string;
  color: string;
  href: string;
  canEdit: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsEditing(false);
      if (!editedTitle) return;
      await updateRoomTitle({ title: editedTitle, roomId: id });
    }
  };

  const handleBlur = async () => {
    setIsEditing(false);
    if (!editedTitle) return;
    await updateRoomTitle({ title: editedTitle, roomId: id });
  };

  const confirmDelete = async () => {
    await deleteRoom(id);
    setShowConfirmationModal(false);
  };
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => router.push(href)}
        style={{ backgroundColor: color }}
        className="size-40 m-auto cursor-pointer rounded-xl flex justify-center items-center hover:border-2"
      >
        <p className="text-md select-none font-medium">{title}</p>
      </div>
      {isEditing && canEdit ? (
        <Input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          autoFocus
          className="w-full border hover:border-red-100"
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className="mt-2 select-none text-3 font-medium cursor-pointer"
        >
          {title}
        </p>
      )}
      <p className="select-none text-gray-400 text-xs">{description}</p>

      <div className="flex  gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1"
        >
          <Pencil size={10} />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowConfirmationModal(true)}
          className="flex items-center gap-1"
        >
          <Trash2 size={10} />
        </Button>
      </div>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this room?"
      />
    </div>
  );
}

function ViewModeButton({
  onSelect,
  active,
  text,
  count,
}: {
  onSelect: () => void;
  active: boolean;
  text: string;
  count: number;
}) {
  return (
    <Button
      onClick={onSelect}
      variant={"outline"}
      className={`select-none rounded-md p-1 px-2 text-[11px] hover:bg-gray-100 ${
        active ? "bg-gray-100" : ""
      }`}
    >
      {`${text} (${count})`}
    </Button>
  );
}
