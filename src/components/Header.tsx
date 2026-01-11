import { getHeaderData } from "@/data/layoutLoaders";
import { Link } from "@/i18n/navigation";
import { HeaderData } from "@/types";
import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import { MobileMenu } from "./custom/header/MobileMenu";
import NavLink from "./custom/header/NavLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getLocale } from "next-intl/server";

const Header = async () => {
  const locale = await getLocale();
  const headerData: HeaderData = await getHeaderData(locale);

  return (
    <header className="bg-white p-6">
      <nav className="max-w-fhd mx-auto flex items-center justify-between">
        <Link href="/">
          {!headerData.logo.image.url.startsWith("/uploads") ? (
            <Image
              src={`/images/${headerData.logo.image.url}`}
              alt={headerData.logo.alt}
              width={160}
              height={80}
              className="h-20 w-40"
              preload={true}
            />
          ) : (
            <StrapiImage
              imageLink={headerData.logo.image.url}
              alt={headerData.logo.alt}
              width={160}
              height={80}
              className="h-20 w-40"
              preload={true}
            />
          )}
        </Link>
        <div className="flex flex-1 items-center justify-end gap-6">
          <ul className="hidden items-center space-x-3 xl:flex">
            {headerData.links.map((link) => (
              <NavLink key={link.id} link={link} />
            ))}
          </ul>
          <div className="hidden xl:block">
            <LanguageSwitcher />
          </div>
          <MobileMenu links={headerData.links} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
