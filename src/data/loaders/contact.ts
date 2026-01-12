import { ContactPageData } from "@/types/contact";
import { getLocale } from "next-intl/server";
import { getContactPage } from "../api/contact";

export async function loadContactData(): Promise<ContactPageData | null> {
  try {
    const locale = await getLocale();
    const data = await getContactPage(locale);

    return await getContactPage(locale);
  } catch (error) {
    console.warn("Błąd podczas ładowania danych strony głównej:", error);
    return null;
  }
}
