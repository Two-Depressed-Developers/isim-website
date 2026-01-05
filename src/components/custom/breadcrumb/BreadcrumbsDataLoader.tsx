import { getPagesData } from "@/data/layoutLoaders";
import type { Page } from "@/types";
import Breadcrumbs from "./Breadcrumbs";
import { getLocale } from "next-intl/server";

type Props = {
  className?: string;
};

export default async function BreadcrumbsDataLoader({ className }: Props) {
  const locale = await getLocale();
  const pagesData: Page[] = await getPagesData(locale);

  return <Breadcrumbs className={className} pagesData={pagesData} />;
}
