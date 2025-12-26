import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

export const verifySession = cache(async (): Promise<Session> => {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return session;
});

export const getUser = cache(async () => {
  const session = await verifySession();
  return session.user;
});

export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getUser();
  return user.role === "PanelAdmin";
});

export const requireAdmin = cache(async () => {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/panel");
  }
});
