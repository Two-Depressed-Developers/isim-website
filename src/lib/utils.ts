import { env } from "@ryankshaw/next-runtime-env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStrapiURL() {
  return env("NEXT_PUBLIC_STRAPI_API_URL") || "http://localhost:1337";
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${getStrapiURL()}${url}`;
}

export function flattenAttributes<T = unknown>(data: unknown): T {
  if (
    typeof data !== "object" ||
    data === null ||
    data instanceof Date ||
    typeof data === "function"
  ) {
    return data as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => flattenAttributes(item)) as T;
  }

  const obj = data as Record<string, unknown>;
  const flattened: Record<string, unknown> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (
      (key === "attributes" || key === "data") &&
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(flattened, flattenAttributes(obj[key]));
    } else {
      flattened[key] = flattenAttributes(obj[key]);
    }
  }

  return flattened as T;
}

export function getEmailForDev(email: string): string {
  if (process.env.NODE_ENV === "development" && process.env.RESEND_DEV_EMAIL) {
    return process.env.RESEND_DEV_EMAIL;
  }
  return email;
}
