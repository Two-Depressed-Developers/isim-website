import { Link as LinkType } from "@/types";
import { ChevronDown } from "lucide-react";
import SubLinksDropdown from "./SubLinksDropdown";
import { Link } from "@/i18n/navigation";

type Props = {
  link: LinkType;
};

const NavLink = ({ link }: Props) => {
  const baseUrl = link.page?.slug ?? link.URL;

  return (
    <li key={link.id} className="group relative">
      <Link
        href={baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`}
        className="hover:bg-primary/5 my-2 flex items-center gap-x-1 px-2 py-1 text-gray-600 transition-colors"
      >
        <span className="line-clamp-2 text-center text-base leading-4 font-semibold">
          {link.label}
        </span>
        {link.subLinks && link.subLinks.length > 0 && <ChevronDown size={20} />}
      </Link>
      {link.subLinks && link.subLinks.length > 0 && (
        <SubLinksDropdown subLinks={link.subLinks} />
      )}
    </li>
  );
};

export default NavLink;
