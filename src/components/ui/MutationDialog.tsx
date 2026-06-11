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

export interface MutationResult {
  success?: boolean;
  error?: string;
}

interface MutationDialogProps<R extends MutationResult> {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => Promise<R>;
  onResult?: (result: R) => void;
  submitLabel?: string;
  pendingLabel?: string;
  cancelLabel?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  disableSubmit?: boolean;
}

export function MutationDialog<R extends MutationResult>({
  open,
  title,
  children,
  onClose,
  onSubmit,
  onResult,
  submitLabel = "Save",
  pendingLabel = "Saving...",
  cancelLabel = "Cancel",
  maxWidth = "sm",
  disableSubmit,
}: MutationDialogProps<R>) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);
    const result = await onSubmit();
    setIsPending(false);

    onResult?.(result);
    if (result.success) {
      onClose();
      return;
    }
    if (result.error) setError(result.error);
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
