import Link from "next/link";

interface FooterCopyrightProps {
  copyrightText: string;
}

const FooterCopyright = ({ copyrightText }: FooterCopyrightProps) => {
  return (
    <div className="flex min-h-11 justify-center border-t border-light-gray-border">
      <div className="relative flex w-full max-w-7xl items-center justify-center text-center">
        <span className="mx-20 text-base font-normal text-gray-text">
          {copyrightText.replace(
            "{currentYear}",
            new Date().getFullYear().toString(),
          )}
        </span>
        <Link
          href="/panel"
          className="absolute right-2 ml-2 rounded-md px-2 py-1 text-gray-text underline-offset-2 hover:underline sm:right-6"
        >
          Panel
        </Link>
      </div>
    </div>
  );
};

export default FooterCopyright;
