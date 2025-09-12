import React from "react";
import IconButton from "./icon-button";
import { AiOutlineZoomOut } from "react-icons/ai";
export default function ZoomOutButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <IconButton onClick={onClick} disabled={disabled}>
      <AiOutlineZoomOut size={24} color="#888888" />
    </IconButton>
  );
}
