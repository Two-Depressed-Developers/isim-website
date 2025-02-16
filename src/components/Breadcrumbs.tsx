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
import { getHeaderData } from "@/data/layoutLoaders";
import { HeaderData, Link } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface BreadcrumbsProps {
  className?: string;
}

function matchPathToTitle(path: string, headerData: HeaderData): Link[] {
  const flatLinks: Link[] = headerData.links.flatMap((link) =>
    link.subLinks ? link.subLinks : [link],
  );

  const pathArray = path.split("/");
  const linkArray = flatLinks.filter((link) =>
    pathArray.includes(link.URL.replace("/", "")),
  );
  return linkArray;
}

const Breadcrumbs = async ({ className }: BreadcrumbsProps) => {
  const headerData = await getHeaderData();
  const { title } = useBreadcrumbs();
  const path = usePathname();

  const linksArray = matchPathToTitle(path, headerData);

  return (
    <div className={cn("bg-[#F0F0F0] py-4", className)}>
      <Breadcrumb className="mx-auto max-w-7xl px-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-primary">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-light-gray-text">
            /
          </BreadcrumbSeparator>
          {linksArray.map((link, index) => (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={link.URL} className="text-primary">
                  {link.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < linksArray.length - 1 && (
                <BreadcrumbSeparator className="text-light-gray-text">
                  /
                </BreadcrumbSeparator>
              )}
            </>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
          {/* <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-primary">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-light-gray-text">
            /
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/components" className="text-primary">
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-light-gray-text">
            /
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
