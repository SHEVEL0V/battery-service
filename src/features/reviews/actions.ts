"use server";

import prisma from "@/lib/db/prisma";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import { formAction } from "@/lib/actions/formAction";
import type { ActionResult } from "@/lib/actions/types";
import { reviewSchema, type ReviewInput } from "./schema";

// null — форму ще не надсилали
export type ReviewState = ActionResult<ReviewInput> | null;

export const submitReview = formAction({
  schema: reviewSchema,
  revalidate: [CACHE_TAGS.reviews],
  handler: async ({ author, carModel, rating, text }) => {
    // Submitted reviews go through one text field, used for both locales until reviewed
    await prisma.review.create({
      data: { author, carModel, rating, textUk: text, textEn: text, isVisible: false },
    });
  },
});
