import { getHeaderData } from "@/data/layoutLoaders";
import { HeaderData } from "@/lib/types";
import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import NavLink from "./custom/header/NavLink";
import Image from "next/image";

const Header = async () => {
  const headerData: HeaderData = await getHeaderData();

  return (
    <header className="bg-white p-6">
      <nav className="flex items-center justify-between">
        <Link href="/">
          {!headerData.logo.image.url.startsWith("/uploads") ? (
            <Image
              src={`/images/${headerData.logo.image.url}`}
              alt={headerData.logo.alt}
              width={160}
              height={80}
              className="h-auto w-auto"
            />
          ) : (
            <StrapiImage
              src={headerData.logo.image.url}
              alt={headerData.logo.alt}
              width={160}
              height={80}
            />
          )}
        </Link>
        <ul className="flex items-center space-x-4">
          {headerData.links.map((link) => (
            <NavLink key={link.id} link={link} />
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
