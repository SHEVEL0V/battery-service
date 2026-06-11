"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/lib/db/prisma";
import { CACHE_TAGS } from "@/lib/cache/cache-tags";
import { reviewSchema, type ReviewInput } from "./schema";

export interface ReviewState {
  success?: boolean;
  errors?: Partial<Record<keyof ReviewInput, string[]>>;
}

export async function submitReview(_prevState: ReviewState, formData: FormData): Promise<ReviewState> {
  const validated = reviewSchema.safeParse({
    author: formData.get("author"),
    carModel: formData.get("carModel"),
    rating: formData.get("rating"),
    text: formData.get("text"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { author, carModel, rating, text } = validated.data;

  // Submitted reviews go through one text field, used for both locales until reviewed
  await prisma.review.create({
    data: {
      author,
      carModel,
      rating,
      textUk: text,
      textEn: text,
      isVisible: false,
    },
  });

  revalidateTag(CACHE_TAGS.reviews, "default");
  return { success: true };
}
