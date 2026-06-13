import "server-only";
import type { z } from "zod";
import { verifySession } from "@/lib/auth/dal";
import type { CacheTag } from "@/lib/cache/cache-tags";
import { revalidateTags } from "./revalidate";
import { ACTION_ERROR, fail, ok, type ActionResult } from "./types";

// Для імперативних admin-мутацій без форми: auth + try/catch + стабільний код помилки
export async function mutate(
  fn: () => Promise<unknown>,
  revalidate?: CacheTag[],
): Promise<ActionResult> {
  await verifySession();

  try {
    await fn();
  } catch (error) {
    console.error("[mutate]", error);
    return fail(ACTION_ERROR.serverError);
  }

  revalidateTags(revalidate);
  return ok();
}

// Як mutate, але з типізованим input: auth + Zod-валідація + try/catch + інвалідація
export async function mutateWith<S extends z.ZodType>(
  schema: S,
  input: unknown,
  fn: (data: z.infer<S>) => Promise<unknown>,
  revalidate?: CacheTag[],
): Promise<ActionResult<z.infer<S>>> {
  await verifySession();

  const validated = schema.safeParse(input);
  if (!validated.success) {
    return fail(ACTION_ERROR.validation, validated.error.flatten().fieldErrors);
  }

  try {
    await fn(validated.data);
  } catch (error) {
    console.error("[mutateWith]", error);
    return fail(ACTION_ERROR.serverError);
  }

  revalidateTags(revalidate);
  return ok();
}
