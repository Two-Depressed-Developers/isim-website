import { getHeaderData } from "@/data/layoutLoaders";
import { HeaderData } from "@/lib/types";
import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import NavLink from "./custom/header/NavLink";
import { MobileMenu } from "./custom/header/MobileMenu";
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
              className="h-20 w-40"
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
        <ul className="hidden items-center space-x-4 lg:flex">
          {headerData.links.map((link) => (
            <NavLink key={link.id} link={link} />
          ))}
        </ul>
        <MobileMenu links={headerData.links} />
      </nav>
    </header>
  );
};

export default Header;
