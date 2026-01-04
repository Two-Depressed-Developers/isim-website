import { getPagesData } from "@/data/layoutLoaders";
import type { Page } from "@/types";
import Breadcrumbs from "./Breadcrumbs";
import { useLocale } from "next-intl";

type Props = {
  locale: string;
  className?: string;
};

export default async function BreadcrumbsDataLoader({
  locale,
  className,
}: Props) {
  const pagesData: Page[] = await getPagesData(locale);

  return <Breadcrumbs className={className} pagesData={pagesData} />;
}
