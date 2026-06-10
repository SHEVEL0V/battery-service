"use client";

import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { Dictionary } from "@/dictionaries";
import type { BookingCarData } from "../types";

interface Props {
  dict: Dictionary["booking"];
  errorsDict: Dictionary["errors"];
  defaultValues: Partial<BookingCarData>;
  onNext: (data: BookingCarData) => void;
}

export function BookingStepCar({ dict, errorsDict, defaultValues, onNext }: Props) {
  const [carModel, setCarModel] = useState(defaultValues.carModel ?? "");
  const [year, setYear] = useState(defaultValues.year ?? "");
  const [errors, setErrors] = useState<{ carModel?: string; year?: string }>({});

  const handleNext = () => {
    const nextErrors: typeof errors = {};
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();

    if (!carModel.trim()) nextErrors.carModel = errorsDict.required;
    if (!year || Number.isNaN(yearNum) || yearNum < 2012 || yearNum > currentYear + 1) {
      nextErrors.year = errorsDict.required;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onNext({ carModel, year });
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">{dict.step1}</Typography>

      <TextField
        label={dict.carModel}
        value={carModel}
        onChange={(e) => setCarModel(e.target.value)}
        error={!!errors.carModel}
        helperText={errors.carModel}
        fullWidth
        required
      />

      <TextField
        label={dict.year}
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        error={!!errors.year}
        helperText={errors.year}
        slotProps={{ htmlInput: { min: 2012, max: new Date().getFullYear() + 1 } }}
        fullWidth
        required
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleNext}>
          {dict.next}
        </Button>
      </Box>
    </Stack>
  );
}
