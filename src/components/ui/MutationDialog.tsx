"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ActionResult } from "@/lib/actions/types";

interface MutationDialogProps<T> {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => Promise<ActionResult<T>>;
  onResult?: (result: ActionResult<T>) => void;
  // Локалізований текст для будь-якого коду помилки, окрім "validation" (поля показують свої помилки самі)
  errorText?: string;
  submitLabel?: string;
  pendingLabel?: string;
  cancelLabel?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  disableSubmit?: boolean;
}

export function MutationDialog<T>({
  open,
  title,
  children,
  onClose,
  onSubmit,
  onResult,
  errorText,
  submitLabel = "Save",
  pendingLabel = "Saving...",
  cancelLabel = "Cancel",
  maxWidth = "sm",
  disableSubmit,
}: MutationDialogProps<T>) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);
    const result = await onSubmit();
    setIsPending(false);

    onResult?.(result);
    if (result.ok) {
      onClose();
      return;
    }
    if (result.code !== "validation") setError(errorText ?? result.code);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          onClick={handleClose}
          disabled={isPending}
          sx={{ position: "absolute", right: 8, top: 8, color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isPending || disableSubmit}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
