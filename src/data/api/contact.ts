import { baseAPIUrl, fetchData } from "./base";
import qs from "qs";
import { ContactPageData } from "@/types/contact";

export const getContactPage = async (locale: string) => {
  const url = new URL(`/api/contact-page`, baseAPIUrl);

  url.search = qs.stringify({
    locale,
  });

  return await fetchData<ContactPageData>(url.href);
};
