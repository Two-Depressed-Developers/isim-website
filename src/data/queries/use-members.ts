import type { MemberData } from "@/types";
import { getMemberData, getMemberSchema, updateMember } from "../api/members";
import { queryKeys } from "../query-keys";
import {
  createSuspenseQueryHook,
  createSuspenseQueryHookWithParams,
  createMutationHookWithInvalidation,
} from "./types";

export const useMemberData = createSuspenseQueryHookWithParams(
  (slug: string) => queryKeys.members.bySlug(slug),
  getMemberData,
);

export const useMemberSchema = createSuspenseQueryHook(
  queryKeys.members.schema,
  getMemberSchema,
);

export function useUpdateMember(slug: string) {
  return createMutationHookWithInvalidation<
    MemberData,
    {
      documentId: string;
      data: Partial<MemberData>;
      accessToken: string;
    }
  >(
    ({ documentId, data, accessToken }) =>
      updateMember(documentId, data, accessToken),
    queryKeys.members.bySlug(slug),
  )();
}
