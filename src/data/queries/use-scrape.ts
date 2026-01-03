import { createMutationHook } from "./types";
import { requestScrape, ScrapeRequestPayload } from "../api/scrape";

export function useScrapeRequest() {
  return createMutationHook<unknown, ScrapeRequestPayload>(requestScrape)();
}
