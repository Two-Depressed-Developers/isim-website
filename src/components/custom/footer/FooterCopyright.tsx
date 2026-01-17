import Link from "next/link";

type Props = {
  copyrightText: string;
};

const FooterCopyright = ({ copyrightText }: Props) => {
  return (
    <div className="mx-auto mb-6 flex min-h-12 max-w-7xl justify-between gap-4 border-t border-white/15 py-6">
      <span className="text-sm font-semibold text-white/50">
        {copyrightText.replace(
          "{currentYear}",
          new Date().getFullYear().toString(),
        )}
      </span>
      <Link
        href="/panel"
        className="px-2 py-1 text-sm font-semibold text-white/50 underline-offset-2 hover:underline"
      >
        Panel
      </Link>
    </div>
  );
};

export default FooterCopyright;
