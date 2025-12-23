import type { AxiosInstance } from "axios";
import { getStrapiClient } from "@/lib/strapi-client";
import { auth } from "@/lib/auth";

export async function getServerStrapiClient(): Promise<AxiosInstance> {
  const session = await auth();
  const token = session?.accessToken as string | undefined;
  return getStrapiClient(token);
}
