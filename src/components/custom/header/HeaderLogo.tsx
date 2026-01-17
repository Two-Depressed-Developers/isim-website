import { HeaderData } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { StrapiImage } from "@/components/StrapiImage";

type Props = {
  headerData: HeaderData;
};

export default function HeaderLogo({ headerData }: Props) {
  return (
    <Link href="/" className="flex gap-x-2">
      {!headerData.logo.image.url.startsWith("/uploads") ? (
        <Image
          src={`/images/${headerData.logo.image.url}`}
          alt={headerData.logo.alt}
          width={90}
          height={45}
          className="h-12 w-24"
          preload
        />
      ) : (
        <StrapiImage
          imageLink={headerData.logo.image.url}
          alt={headerData.logo.alt}
          width={90}
          height={45}
          className="h-12 w-24"
          preload
        />
      )}
      {(headerData.title || headerData.subtitle) && (
        <div className="hidden flex-col justify-center md:flex">
          {headerData.title && (
            <span className="text-lg leading-tight font-semibold">
              {headerData.title}
            </span>
          )}
          {headerData.subtitle && (
            <span className="text-xs leading-tight text-gray-500">
              {headerData.subtitle}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
