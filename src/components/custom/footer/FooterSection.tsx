import { StrapiImage } from "@/components/StrapiImage";
import { SimpleSection } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FooterSectionProps {
  section: SimpleSection;
}

const FooterSection = ({ section }: FooterSectionProps) => {
  return (
    <div className="flex flex-col space-y-2 text-[#666]">
      {section.title && <h4 className="text-lg font-bold">{section.title}</h4>}
      {section.text && (
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm">
          {section.text}
        </ReactMarkdown>
      )}
      {section.images && section.images.length > 0 && (
        <div className="flex space-x-2">
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
                />
              ) : (
                <StrapiImage
                  src={image.image.url}
                  alt={image.alt}
                  width={24}
                  height={24}
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
