import "server-only";
import { revalidateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import type { z } from "zod";
import { verifySession } from "@/lib/auth/dal";
import type { CacheTag } from "@/lib/cache/cache-tags";
import { ACTION_ERROR, fail, ok, type ActionResult, type FieldErrors } from "./types";

// Декларативна інвалідація: actions передають теги, виклик revalidateTag — централізовано тут
function revalidateTags(tags?: CacheTag[]): void {
  tags?.forEach((tag) => revalidateTag(tag, "default"));
}

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: FieldErrors<T> };

export function zodParse<S extends z.ZodType>(
  schema: S,
  input: unknown,
): ParseResult<z.infer<S>> {
  const result = schema.safeParse(input);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, fieldErrors: result.error.flatten().fieldErrors };
}

interface RunActionConfig<T> {
  requireAuth?: boolean;
  // Лінива валідація — викликається після auth, щоб неавторизований запит відсікався першим
  parse?: () => ParseResult<T>;
  handler: (data: T) => Promise<ActionResult<T> | void>;
  revalidate?: CacheTag[];
  logLabel: string;
}

// Єдиний пайплайн усіх мутацій: 1. auth → 2. валідація → 3. handler →
// 4. інвалідація кешу (лише на успіху) → 5. стабільний код помилки (локалізує клієнт)
export async function runAction<T = void>({
  requireAuth = false,
  parse,
  handler,
  revalidate,
  logLabel,
}: RunActionConfig<T>): Promise<ActionResult<T>> {
  if (requireAuth) await verifySession();

  let data = undefined as T;
  if (parse) {
    const parsed = parse();
    if (!parsed.success) return fail(ACTION_ERROR.validation, parsed.fieldErrors);
    data = parsed.data;
  }

  try {
    const result = await handler(data);
    if (!result || result.ok) revalidateTags(revalidate);
    return result ?? ok();
  } catch (error) {
    unstable_rethrow(error);
    console.error(logLabel, error);
    return fail(ACTION_ERROR.serverError);
  }
}
