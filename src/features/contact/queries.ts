import "server-only";
import prisma from "@/lib/db/prisma";

export const getContacts = () =>
  prisma.contact.findMany({ orderBy: { createdAt: "desc" } });

export const countContacts = () => prisma.contact.count();
