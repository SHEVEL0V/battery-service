'use client'

import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material'

interface BadgeProps extends Omit<MuiChipProps, "children"> {
  children: React.ReactNode;
}

export function Badge({ children, ...props }: BadgeProps) {
  return <MuiChip {...props} label={children} />
}
