import React from "react";
import IconButton from "./icon-button";
import { MdOutlineTextFields } from "react-icons/md";

export default function TextButton({
  onClick,
  isActive,
}: {
  onClick: () => void;
  isActive: boolean;
}) {
  return ( 
    <IconButton onClick={onClick} isActive={isActive}>
      <MdOutlineTextFields size={24} color="#888888" />
    </IconButton>
  );
}
