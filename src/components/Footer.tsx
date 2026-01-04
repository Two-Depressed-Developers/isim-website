import { FooterData } from "@/types";
import FooterSection from "./custom/footer/FooterSection";
import FooterUniversityLogo from "./custom/footer/FooterUniversityLogo";
import FooterCopyright from "./custom/footer/FooterCopyright";
import { getFooterData } from "@/data/layoutLoaders";

type Props = {
  locale: string;
};

const Footer = async ({ locale }: Props) => {
  const footerData: FooterData = await getFooterData(locale);

  return (
    <footer className="bg-light-gray">
      <div className="mx-auto flex max-w-7xl flex-row justify-between p-8">
        <div className="flex space-x-16">
          {footerData.sections.map((section) => (
            <FooterSection key={section.id} section={section} />
          ))}
        </div>
        <FooterUniversityLogo logo={footerData.universityLogo} />
      </div>
      <FooterCopyright copyrightText={footerData.copyrightText} />
    </footer>
  );
};

export default Footer;
