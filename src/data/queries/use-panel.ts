import { changeUsername, changePassword } from "../api/panel";
import { createMutationHook } from "./types";

export function useChangeUsername() {
  return createMutationHook(changeUsername)();
}

export function useChangePassword() {
  return createMutationHook(changePassword)();
}
