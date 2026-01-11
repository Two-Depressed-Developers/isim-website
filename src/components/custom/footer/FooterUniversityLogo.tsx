import { StrapiImage } from "@/components/StrapiImage";
import { Link } from "@/i18n/navigation";
import { ImageLink } from "@/types";
import Image from "next/image";

type Props = {
  logo: ImageLink;
};

const FooterUniversityLogo = ({ logo }: Props) => {
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
          className="h-24 w-12"
          preload={true}
        />
      ) : (
        <StrapiImage
          src={logo.image.url}
          alt={logo.alt}
          width={60}
          height={120}
          className="h-24 w-12"
          preload={true}
        />
      )}
    </Link>
  );
};

export default FooterUniversityLogo;
