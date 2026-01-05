import { LinkProps } from "next/link";
import { Link } from "@/i18n/navigation";

type Props = LinkProps & {
  isExternal: boolean;
  children: React.ReactNode;
  className?: string;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function CustomLink(props: Props) {
  const { href, isExternal, className, locale, ...rest } = props;

  const sanitizedHref =
    isExternal && !isValidUrl(href.toString()) ? `https://${href}` : href;

  return (
    <Link
      href={sanitizedHref}
      className={className}
      {...(locale !== false && { locale })}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      {...rest}
    />
  );
}
