import { forgotPassword, resetPassword, setupAccount } from "../api/auth";
import { createMutationHook } from "./types";

export function useForgotPassword() {
  return createMutationHook(forgotPassword)();
}

export function useResetPassword() {
  return createMutationHook(resetPassword)();
}

export function useSetupAccount() {
  return createMutationHook(setupAccount)();
}
