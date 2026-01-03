import { getPagesData } from "@/data/layoutLoaders";
import type { Page } from "@/types";
import Breadcrumbs from "./Breadcrumbs";

interface BreadcrumbsDataLoaderProps {
  className?: string;
}

export default async function BreadcrumbsDataLoader({
  className,
}: BreadcrumbsDataLoaderProps) {
  const pagesData: Page[] = await getPagesData();

  return <Breadcrumbs className={className} pagesData={pagesData} />;
}
