"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/context/BreadcrumbsContext";
import type { Page } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";
import type { Breadcumb } from "./Beadcrumb.types";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

type Props = {
  className?: string;
  pagesData?: Page[];
};

function generateBreadcrumbItems(path: string, pages: Page[]): Breadcumb[] {
  const breadcrumbs: Breadcumb[] = [];
  let currentPath = "";
  const pathSegments = path.split("/").filter((segment) => segment !== "");

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const matchedPage = pages.find((p) => p.slug === segment);

    let label = segment;
    if (matchedPage) {
      label = matchedPage.name;
    }
    const isLink = index < pathSegments.length - 1;

    breadcrumbs.push({
      label: label,
      URL: currentPath,
      isLink: isLink,
      isPageMatch: !!matchedPage,
    });
  });

  return breadcrumbs;
}

const pathWithoutBreadcrumbs = ["/", "/login"];

const Breadcrumbs = ({ className, pagesData }: Props) => {
  const t = useTranslations("Breadcrumbs");
  const { title } = useBreadcrumbs();
  const path = usePathname();

  if (
    !pagesData ||
    pagesData.length === 0 ||
    path === "" ||
    pathWithoutBreadcrumbs.includes(path)
  ) {
    return null;
  }

  const breadData = generateBreadcrumbItems(path, pagesData);

  if (breadData.length === 0) {
    return null;
  }

  return (
    <div className={cn("py-8 font-medium", className)}>
      <Breadcrumb className="mx-auto max-w-7xl px-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-primary">
                {t("home")}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadData.length > 0 && (
            <BreadcrumbSeparator className="text-light-gray-text">
              <ChevronRight size={14} />
            </BreadcrumbSeparator>
          )}

          {breadData.map((bread, index) => {
            let currentLabel = bread.label;

            if (index === breadData.length - 1) {
              if (bread.isPageMatch) {
              } else {
                if (title) {
                  currentLabel = title;
                }
              }
            }

            return (
              <React.Fragment key={bread.URL}>
                <BreadcrumbItem>
                  {!bread.isLink ? (
                    <BreadcrumbPage className="text-foreground">
                      {currentLabel}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={bread.URL} className="text-primary">
                        {currentLabel}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {index < breadData.length - 1 && (
                  <BreadcrumbSeparator className="text-light-gray-text">
                    <ChevronRight size={14} />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
