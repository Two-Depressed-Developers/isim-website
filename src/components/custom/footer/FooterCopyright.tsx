interface FooterCopyrightProps {
  copyrightText: string;
}

const FooterCopyright = ({ copyrightText }: FooterCopyrightProps) => {
  return (
    <div className="flex h-11 items-center justify-center border-t border-light-gray-border">
      <span className="text-base font-normal text-gray-text">
        {copyrightText.replace(
          "{currentYear}",
          new Date().getFullYear().toString(),
        )}
      </span>
    </div>
  );
};

export default FooterCopyright;
