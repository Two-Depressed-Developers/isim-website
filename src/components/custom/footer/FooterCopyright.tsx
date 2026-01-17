import Link from "next/link";

type Props = {
  copyrightText: string;
};

const FooterCopyright = ({ copyrightText }: Props) => {
  return (
    <div className="border-gray-accent mx-auto mb-12 flex min-h-12 max-w-7xl justify-center border-t">
      <div className="relative flex w-full max-w-7xl items-center justify-center text-center">
        <span className="mx-20 text-base font-normal text-white/80">
          {copyrightText.replace(
            "{currentYear}",
            new Date().getFullYear().toString(),
          )}
        </span>
        <Link
          href="/panel"
          className="absolute right-2 ml-2 rounded-md px-2 py-1 text-white/75 underline-offset-2 hover:underline sm:right-6"
        >
          Panel
        </Link>
      </div>
    </div>
  );
};

export default FooterCopyright;
