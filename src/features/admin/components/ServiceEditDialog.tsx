"use client";

import { useState } from "react";
import { FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { MutationDialog } from "@/components/ui/MutationDialog";
import type { Service } from "@/types";
import type { UpdateServiceState } from "../actions";
import type { ServiceInput } from "../schema";

function toFormState(service: Service): ServiceInput {
  return {
    slug: service.slug,
    titleUk: service.titleUk,
    titleEn: service.titleEn,
    descUk: service.descUk,
    descEn: service.descEn,
    price: service.price,
    duration: service.duration,
    order: service.order,
    isActive: service.isActive,
  };
}

type TextFieldKey = Exclude<keyof ServiceInput, "isActive">;

const TEXT_FIELDS: Array<{
  key: TextFieldKey;
  label: string;
  size: { xs: number; sm?: number };
  multiline?: boolean;
  number?: boolean;
}> = [
  { key: "titleUk", label: "Title (UK)", size: { xs: 12, sm: 6 } },
  { key: "titleEn", label: "Title (EN)", size: { xs: 12, sm: 6 } },
  { key: "descUk", label: "Description (UK)", size: { xs: 12 }, multiline: true },
  { key: "descEn", label: "Description (EN)", size: { xs: 12 }, multiline: true },
  { key: "slug", label: "Slug", size: { xs: 12, sm: 6 } },
  { key: "price", label: "Price (₴)", size: { xs: 6, sm: 3 }, number: true },
  { key: "order", label: "Order", size: { xs: 6, sm: 3 }, number: true },
  { key: "duration", label: "Duration", size: { xs: 12, sm: 6 } },
];

interface ServiceEditDialogProps {
  service: Service | null;
  onClose: () => void;
  onSave: (id: string, input: ServiceInput) => Promise<UpdateServiceState>;
}

export function ServiceEditDialog({ service, onClose, onSave }: ServiceEditDialogProps) {
  const [prevService, setPrevService] = useState(service);
  const [form, setForm] = useState<ServiceInput | null>(service ? toFormState(service) : null);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceInput, string[]>>>({});

  if (service !== prevService) {
    setPrevService(service);
    setForm(service ? toFormState(service) : null);
    setErrors({});
  }

  const handleChange = <K extends keyof ServiceInput>(key: K, value: ServiceInput[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <MutationDialog
      open={!!service}
      title="Edit service"
      onClose={onClose}
      onSubmit={() => onSave(service!.id, form!)}
      onResult={(result) => setErrors(result.errors ?? {})}
      disableSubmit={!service || !form}
    >
      {form && (
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {TEXT_FIELDS.map(({ key, label, size, multiline, number }) => (
            <Grid key={key} size={size}>
              <TextField
                label={label}
                fullWidth
                type={number ? "number" : undefined}
                multiline={multiline}
                minRows={multiline ? 2 : undefined}
                value={form[key]}
                onChange={(e) =>
                  handleChange(
                    key,
                    (number ? Number(e.target.value) : e.target.value) as ServiceInput[typeof key],
                  )
                }
                error={!!errors[key]}
                helperText={errors[key]?.[0]}
              />
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      )}
    </MutationDialog>
  );
}
