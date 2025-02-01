interface FooterCopyrightProps {
  copyrightText: string;
}

const FooterCopyright = ({ copyrightText }: FooterCopyrightProps) => {
  return (
    <div className="flex h-11 items-center justify-center border-t border-[#B3B3B3]">
      <span className="text-base font-normal text-[#666]">
        {copyrightText.replace(
          "{currentYear}",
          new Date().getFullYear().toString(),
        )}
      </span>
    </div>
  );
};

export default FooterCopyright;
