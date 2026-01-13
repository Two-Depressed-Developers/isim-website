import { FooterData } from "@/types";
import FooterSection from "./custom/footer/FooterSection";
import FooterUniversityLogo from "./custom/footer/FooterUniversityLogo";
import FooterCopyright from "./custom/footer/FooterCopyright";
import { getFooterData } from "@/data/layoutLoaders";
import { getLocale } from "next-intl/server";
import FooterNavigation from "./custom/footer/FooterNavigation";

const Footer = async () => {
  const locale = await getLocale();
  const footerData: FooterData = await getFooterData(locale);

  return (
    <footer className="bg-light-gray">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 p-8 text-center sm:items-start sm:text-start lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-16">
          {footerData.sections.map((section) => (
            <FooterSection key={section.id} section={section} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-16">
          {footerData.navigation && (
            <FooterNavigation navigation={footerData.navigation} />
          )}
          <FooterUniversityLogo logo={footerData.universityLogo} />
        </div>
      </div>
      <FooterCopyright copyrightText={footerData.copyrightText} />
    </footer>
  );
};

export default Footer;
