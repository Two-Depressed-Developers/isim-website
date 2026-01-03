import { getPagesData } from "@/data/layoutLoaders";
import type { Page } from "@/types";
import Breadcrumbs from "./Breadcrumbs";

type Props = {
  className?: string;
};

export default async function BreadcrumbsDataLoader({ className }: Props) {
  const pagesData: Page[] = await getPagesData();

  return <Breadcrumbs className={className} pagesData={pagesData} />;
}
