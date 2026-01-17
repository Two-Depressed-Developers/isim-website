import { getHeaderData } from "@/data/layoutLoaders";
import { HeaderData } from "@/types";
import { MobileMenu } from "./custom/header/MobileMenu";
import NavLink from "./custom/header/NavLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getLocale } from "next-intl/server";
import HeaderLogo from "./custom/header/HeaderLogo";

const Header = async () => {
  const locale = await getLocale();
  const headerData: HeaderData = await getHeaderData(locale);

  return (
    <header className="border-gray-accent/50 border-b bg-white px-8 py-6 2xl:px-4">
      <nav className="max-w-fhd mx-auto flex items-center justify-between">
        <HeaderLogo headerData={headerData} />
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
