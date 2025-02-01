import { Link as LinkType } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import SubLinksDropdown from "./SubLinksDropdown";

interface NavLinkProps {
  link: LinkType;
}

const NavLink = ({ link }: NavLinkProps) => {
  const baseUrl = link.page?.slug ?? link.URL;

  return (
    <li key={link.id} className="group relative">
      <Link
        href={baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`}
        className="mb-2 flex items-center gap-x-2 rounded-md px-3 py-1 transition-colors hover:bg-primary/5"
      >
        <span className="text-[18px] font-semibold">{link.label}</span>
        {link.subLinks && link.subLinks.length > 0 && <ChevronDown size={20} />}
      </Link>
      {link.subLinks && link.subLinks.length > 0 && (
        <SubLinksDropdown subLinks={link.subLinks} baseUrl={baseUrl} />
      )}
    </li>
  );
};

export default NavLink;
