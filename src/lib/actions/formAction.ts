import "server-only";
import type { z } from "zod";
import type { CacheTag } from "@/lib/cache/cache-tags";
import { runAction, zodParse } from "./runAction";
import type { ActionResult } from "./types";

// Порожній рядок з FormData означає "не заповнено" — не валідне значення для required-поля
function formDataToObject(formData: FormData): Record<string, FormDataEntryValue> {
  const result: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (value === "") continue;
    result[key] = value;
  }
  return result;
}

interface FormActionConfig<S extends z.ZodType> {
  schema: S;
  requireAuth?: boolean;
  revalidate?: CacheTag[];
  handler: (data: z.infer<S>, formData: FormData) => Promise<ActionResult<z.infer<S>> | void>;
}

// Form-фабрика поверх runAction: повертає (prevState, formData)-редюсер для useActionState
export function formAction<S extends z.ZodType>({
  schema,
  requireAuth,
  revalidate,
  handler,
}: FormActionConfig<S>) {
  return (
    // null — useActionState ще не отримав результат жодного сабміту
    _prevState: ActionResult<z.infer<S>> | null,
    formData: FormData,
  ): Promise<ActionResult<z.infer<S>>> =>
    runAction({
      requireAuth,
      parse: () => zodParse(schema, formDataToObject(formData)),
      handler: (data) => handler(data, formData),
      revalidate,
      logLabel: "[formAction]",
    });
}
