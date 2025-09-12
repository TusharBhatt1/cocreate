import React from 'react'
import IconButton from './icon-button';
import { Pencil } from 'lucide-react';

export default function PencilButton({
    onClick,
    isActive,
  }: {
    onClick: () => void;
    isActive: boolean;
  })  {
  return (
    <IconButton onClick={onClick} isActive={isActive}>
    <Pencil size={24} color="#888888" />
  </IconButton>
  )
}
