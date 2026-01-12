import { baseAPIUrl, fetchData } from "./base";
import qs from "qs";
import { AccessibilityPageData } from "@/types/accessibility";

export const getAccessibilityPage = async (locale: string) => {
  const url = new URL(`/api/accessibility-page`, baseAPIUrl);

  url.search = qs.stringify({
    locale,
    populate: ["feedbackPersonContact", "appealPersonContact"],
  });

  try {
    return await fetchData<AccessibilityPageData>(url.href);
  } catch (error) {
    console.error("Error fetching accessibility page:", error);
    return null;
  }
};
