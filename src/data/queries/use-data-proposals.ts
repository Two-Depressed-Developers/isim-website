import { DataProposal, ScrapedDataItem } from "@/types";
import { getDataProposals, updateDataProposal } from "../api/data-proposals";
import { queryKeys } from "../query-keys";
import {
  createQueryHookWithParams,
  createMutationHookWithInvalidation,
} from "./types";

export const useDataProposals = createQueryHookWithParams(
  (memberDocumentId: string) =>
    queryKeys.dataProposals.byMember(memberDocumentId),
  getDataProposals,
  (memberDocumentId: string) => ({ enabled: !!memberDocumentId }),
);

export function useUpdateDataProposal(memberDocumentId: string) {
  return createMutationHookWithInvalidation<
    DataProposal,
    {
      documentId: string;
      data: { scrapedData: ScrapedDataItem[] };
      accessToken: string;
    }
  >(
    ({ documentId, data, accessToken }) =>
      updateDataProposal(documentId, data, accessToken),
    queryKeys.dataProposals.byMember(memberDocumentId),
  )();
}
