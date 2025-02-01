import { StrapiImage } from "@/components/StrapiImage";
import { ImageLink } from "@/lib/types";
import Link from "next/link";

interface FooterUniversityLogoProps {
  logo: ImageLink;
}

const FooterUniversityLogo = ({ logo }: FooterUniversityLogoProps) => {
  return (
    <Link
      href={logo.link?.URL ?? "#"}
      target={logo.link?.openInNewWindow ? "_blank" : "_self"}
    >
      <StrapiImage
        src={logo.image.url}
        alt={logo.alt}
        width={60}
        height={120}
      />
    </Link>
  );
};

export default FooterUniversityLogo;
