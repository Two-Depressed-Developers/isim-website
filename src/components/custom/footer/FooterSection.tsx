import { StrapiImage } from "@/components/StrapiImage";
import { SimpleSection } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { MarkdownRenderer } from "../MarkdownRenderer";

type Props = {
  section: SimpleSection;
};

const FooterSection = ({ section }: Props) => {
  return (
    <div className="flex h-full flex-col space-y-2 text-white/75">
      {section.title && <h4 className="text-lg font-bold">{section.title}</h4>}
      {section.text && (
        <MarkdownRenderer
          content={section.text}
          className="prose-invert text-slate-400"
        />
      )}
      {section.images && section.images.length > 0 && (
        <div className="flex justify-center space-x-2 sm:justify-start">
          {section.images.map((image) => (
            <Link
              key={image.id}
              href={image.link?.URL ?? "#"}
              target={image.link?.openInNewWindow ? "_blank" : "_self"}
            >
              {!image.image.url.startsWith("/upload") ? (
                <Image
                  src={`/images/${image.image.url}`}
                  alt={image.alt}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              ) : (
                <StrapiImage
                  imageLink={image.image.url}
                  alt={image.alt}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FooterSection;
