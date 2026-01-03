import { AxiosError } from "axios";

export type ApiErrorResponse = {
  error?: string | { message?: string };
  message?: string;
  code?: string;
};

export type AxiosApiError = AxiosError<ApiErrorResponse>;

export function getErrorMessage(
  error: unknown,
  fallback = "Wystąpił błąd",
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (typeof data?.error === "string") return data.error;
    if (typeof data?.error?.message === "string") return data.error.message;
    if (typeof data?.message === "string") return data.message;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}

export function isAxiosError(error: unknown): error is AxiosApiError {
  return error instanceof AxiosError;
}
