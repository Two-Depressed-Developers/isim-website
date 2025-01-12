import Link, { LinkProps } from "next/link";

interface CustomLinkProps extends LinkProps {
  isExternal: boolean;
  children: React.ReactNode;
  className?: string;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function CustomLink(props: CustomLinkProps) {
  const { href, isExternal, children, className, ...rest } = props;

  const sanitizedHref =
    isExternal && !isValidUrl(href.toString()) ? `https://${href}` : href;

  return (
    <Link
      href={sanitizedHref}
      className={className}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      {...rest}
    >
      {children}
    </Link>
  );
}
