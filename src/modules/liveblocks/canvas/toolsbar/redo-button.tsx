import React from "react";
import IconButton from "./icon-button";
import { CiRedo } from "react-icons/ci";
export default function RedoButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <IconButton onClick={onClick} disabled={disabled}>
      <CiRedo size={24} color="#888888" />
    </IconButton>
  );
}
