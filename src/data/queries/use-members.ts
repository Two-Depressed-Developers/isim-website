import type { MemberData } from "@/lib/types";
import { getMemberData, getMemberSchema, updateMember } from "../api/members";
import { queryKeys } from "../query-keys";
import {
  createQueryHook,
  createQueryHookWithParams,
  createMutationHookWithInvalidation,
} from "./types";

export const useMemberData = createQueryHookWithParams(
  (slug: string) => queryKeys.members.bySlug(slug),
  getMemberData,
  (slug: string) => ({ enabled: !!slug }),
);

export const useMemberSchema = createQueryHook(
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
