import { StrapiImage } from "@/components/StrapiImage";
import { ImageLink } from "@/types/strapi";
import Image from "next/image";
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
      {!logo.image.url.startsWith("/upload") ? (
        <Image
          src={`/images/${logo.image.url}`}
          alt={logo.alt}
          width={60}
          height={120}
          className="h-auto w-auto"
        />
      ) : (
        <StrapiImage
          src={logo.image.url}
          alt={logo.alt}
          width={60}
          height={120}
        />
      )}
    </Link>
  );
};

export default FooterUniversityLogo;
