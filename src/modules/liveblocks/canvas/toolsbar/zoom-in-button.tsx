import React from "react";
import IconButton from "./icon-button";
import { AiOutlineZoomIn } from "react-icons/ai";
export default function ZoomInButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <IconButton onClick={onClick} disabled={disabled}>
      <AiOutlineZoomIn size={24} color="#888888" />
    </IconButton>
  );
}
