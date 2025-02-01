import { getFooterData } from "@/data/loaders";
import { FooterData } from "@/lib/types";
import FooterSection from "./custom/footer/FooterSection";
import FooterUniversityLogo from "./custom/footer/FooterUniversityLogo";
import FooterCopyright from "./custom/footer/FooterCopyright";

const Footer = async () => {
  const footerData: FooterData = await getFooterData();

  return (
    <footer className="bg-[#F0F0F0]">
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
