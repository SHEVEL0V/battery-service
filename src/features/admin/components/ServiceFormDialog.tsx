"use client";

import { useState } from "react";
import { FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { MutationDialog } from "@/components/ui/MutationDialog";
import type { ActionResult, FieldErrors } from "@/lib/actions/types";
import type { Service } from "@/types";
import type { ServiceInput } from "../schema";

export type ServiceFormResult = ActionResult<ServiceInput>;

const EMPTY_FORM: ServiceInput = {
  slug: "",
  titleUk: "",
  titleEn: "",
  descUk: "",
  descEn: "",
  price: 0,
  duration: "",
  order: 0,
  isActive: true,
};

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

export type ServiceFormTarget = Service | "new" | null;

function formStateFor(target: ServiceFormTarget): ServiceInput | null {
  if (!target) return null;
  return target === "new" ? EMPTY_FORM : toFormState(target);
}

interface ServiceFormDialogProps {
  target: ServiceFormTarget;
  errorText: string;
  onClose: () => void;
  onSave: (target: Service | "new", input: ServiceInput) => Promise<ServiceFormResult>;
}

export function ServiceFormDialog({ target, errorText, onClose, onSave }: ServiceFormDialogProps) {
  const [prevTarget, setPrevTarget] = useState(target);
  const [form, setForm] = useState<ServiceInput | null>(formStateFor(target));
  const [errors, setErrors] = useState<FieldErrors<ServiceInput>>({});

  if (target !== prevTarget) {
    setPrevTarget(target);
    setForm(formStateFor(target));
    setErrors({});
  }

  const handleChange = <K extends keyof ServiceInput>(key: K, value: ServiceInput[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <MutationDialog
      open={!!target}
      title={target === "new" ? "Add service" : "Edit service"}
      onClose={onClose}
      onSubmit={() => onSave(target!, form!)}
      onResult={(result) => setErrors(!result.ok ? result.fieldErrors ?? {} : {})}
      errorText={errorText}
      disableSubmit={!target || !form}
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
