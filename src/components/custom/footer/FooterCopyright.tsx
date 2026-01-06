import { Link } from "@/i18n/navigation";

type Props = {
  copyrightText: string;
};

const FooterCopyright = ({ copyrightText }: Props) => {
  return (
    <div className="border-light-gray-border flex min-h-11 justify-center border-t">
      <div className="relative flex w-full max-w-7xl items-center justify-center text-center">
        <span className="text-gray-text mx-20 text-base font-normal">
          {copyrightText.replace(
            "{currentYear}",
            new Date().getFullYear().toString(),
          )}
        </span>
        <Link
          href="/panel"
          className="text-gray-text absolute right-2 ml-2 rounded-md px-2 py-1 underline-offset-2 hover:underline sm:right-6"
        >
          Panel
        </Link>
      </div>
    </div>
  );
};

export default FooterCopyright;
