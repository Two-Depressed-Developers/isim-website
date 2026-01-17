import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import CustomLink from "../CustomLink";

const markdownComponents: Components = {
  a: ({ href, children, ...props }) => {
    const isSpecial = href?.startsWith("mailto:") || href?.startsWith("tel:");
    const isExternal = href?.startsWith("http") ?? false;

    return (
      <CustomLink
        href={href ?? "#"}
        isExternal={isExternal && !isSpecial}
        className="hover:text-primary inline-flex items-baseline font-medium text-slate-400 no-underline transition-colors duration-200"
        {...props}
      >
        {children}
      </CustomLink>
    );
  },
};

export const MarkdownRenderer = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={markdownComponents}
    className={cn(
      "prose prose-sm prose-a:no-underline max-w-none",
      "prose-p:text-inherit prose-headings:text-inherit prose-li:text-inherit",
      className,
    )}
  >
    {content}
  </ReactMarkdown>
);
