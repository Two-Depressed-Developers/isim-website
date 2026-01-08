import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { env } from "@ryankshaw/next-runtime-env";

const baseURL = env("NEXT_PUBLIC_STRAPI_API_URL");

export function getStrapiClient(token?: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return instance;
}

export function useStrapiClient(): AxiosInstance {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  return useMemo(() => getStrapiClient(token), [token]);
}
