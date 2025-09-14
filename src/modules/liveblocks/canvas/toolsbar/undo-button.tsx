import React from "react";
import IconButton from "./icon-button";
import { CiUndo } from "react-icons/ci";
export default function UndoButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <IconButton onClick={onClick} disabled={disabled}>
      <CiUndo size={24} color="#888888" />
    </IconButton>
  );
}
