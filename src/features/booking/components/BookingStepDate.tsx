"use client";

import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary } from "@/i18n/config";
import type { BookingDateData } from "../types";

interface Props {
  dict: Dictionary["booking"];
  errorsDict: Dictionary["errors"];
  defaultValues: Partial<BookingDateData>;
  onNext: (data: BookingDateData) => void;
  onPrev: () => void;
}

export function BookingStepDate({ dict, errorsDict, defaultValues, onNext, onPrev }: Props) {
  const [date, setDate] = useState(defaultValues.date ?? "");
  const [error, setError] = useState<string>();

  const today = new Date().toISOString().split("T")[0];

  const handleNext = () => {
    if (!date) {
      setError(errorsDict.required);
      return;
    }
    setError(undefined);
    onNext({ date });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">{dict.step2}</Typography>

      <TextField
        label={dict.date}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={!!error}
        helperText={error}
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }}
        fullWidth
        required
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onPrev}>
          {dict.prev}
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {dict.next}
        </Button>
      </Box>
    </Stack>
  );
}
