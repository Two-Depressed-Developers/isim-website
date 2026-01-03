import { Link as LinkType } from "@/types";
import Link from "next/link";
import path from "path";

interface subLinksDropdownProps {
  subLinks: LinkType[];
  baseUrl: string;
}

const SubLinksDropdown = ({ subLinks, baseUrl }: subLinksDropdownProps) => {
  return (
    <div className="pointer-events-none invisible absolute left-1/2 flex w-fit -translate-x-1/2 translate-y-2 flex-col overflow-hidden rounded-lg bg-white opacity-0 shadow-md transition-all duration-100 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      {subLinks.map((subLink) => {
        const subUrl = path.join(
          "/",
          baseUrl.replace(/^\//, ""),
          subLink.page?.slug ?? subLink.URL,
        );

        return (
          <Link
            key={subLink.id}
            href={subUrl}
            className="hover:bg-primary/5 px-4 py-2 transition-colors"
          >
            <span className="text-[18px] font-normal whitespace-nowrap">
              {subLink.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default SubLinksDropdown;
