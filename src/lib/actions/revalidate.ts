import "server-only";
import { revalidateTag } from "next/cache";
import type { CacheTag } from "@/lib/cache/cache-tags";

// Декларативна інвалідація: actions передають теги, виклик revalidateTag — централізовано
export function revalidateTags(tags?: CacheTag[]): void {
  tags?.forEach((tag) => revalidateTag(tag, "default"));
}
