import axios from "axios";

export interface ScrapeRequestPayload {
  first_name: string;
  last_name: string;
  current_institution: string;
  field_of_study: string;
  member_document_id: string;
}

export async function requestScrape(payload: ScrapeRequestPayload) {
  const response = await axios.post("/api/scrape/teacher", payload);
  return response.data;
}
