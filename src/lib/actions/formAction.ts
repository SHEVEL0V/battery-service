import "server-only";
import { unstable_rethrow } from "next/navigation";
import type { z } from "zod";
import { verifySession } from "@/lib/auth/dal";
import type { CacheTag } from "@/lib/cache/cache-tags";
import { revalidateTags } from "./revalidate";
import { ACTION_ERROR, fail, ok, type ActionResult } from "./types";

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

// Конвенція: 1. (опційно) auth, 2. Zod-валідація, 3. handler (БД), 4. інвалідація кешу,
// 5. стабільний код помилки замість тексту — локалізує клієнт
export function formAction<S extends z.ZodType>({
  schema,
  requireAuth,
  revalidate,
  handler,
}: FormActionConfig<S>) {
  return async (
    // null — useActionState ще не отримав результат жодного сабміту
    _prevState: ActionResult<z.infer<S>> | null,
    formData: FormData,
  ): Promise<ActionResult<z.infer<S>>> => {
    if (requireAuth) await verifySession();

    const validated = schema.safeParse(formDataToObject(formData));
    if (!validated.success) {
      return fail(ACTION_ERROR.validation, validated.error.flatten().fieldErrors);
    }

    try {
      const result = await handler(validated.data, formData);
      // Інвалідація лише на успіху — handler може повернути fail (напр. invalidCredentials)
      if (!result || result.ok) revalidateTags(revalidate);
      return result ?? ok();
    } catch (error) {
      unstable_rethrow(error);
      console.error("[formAction]", error);
      return fail(ACTION_ERROR.serverError);
    }
  };
}
