import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

type Role = "PanelAdmin" | "StaffMember" | "Helpdesk";

export const verifySession = cache(async (): Promise<Session> => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
});

export const getUser = cache(async () => {
  const session = await verifySession();
  return session.user;
});

const hasRole = async (role: Role): Promise<boolean> => {
  const user = await getUser();
  return user.roles.includes(role);
};

export const isAdmin = cache(() => hasRole("PanelAdmin"));
export const isStaffMember = cache(() => hasRole("StaffMember"));
export const isHelpdeskMember = cache(() => hasRole("Helpdesk"));

const requireRole = cache(async (role: Role) => {
  const isAuthorized = (await hasRole(role)) || (await isAdmin());

  if (!isAuthorized) {
    redirect("/panel");
  }
});

export const requireAdmin = () => requireRole("PanelAdmin");
export const requireStaffMember = () => requireRole("StaffMember");
export const requireHelpdeskMember = () => requireRole("Helpdesk");
