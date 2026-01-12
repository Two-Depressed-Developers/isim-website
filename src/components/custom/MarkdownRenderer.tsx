import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import CustomLink from "../CustomLink";

const markdownComponents = {
  a: ({ href, children, ...props }: any) => {
    const isSpecial = href?.startsWith("mailto:") || href?.startsWith("tel:");
    const isExternal = href?.startsWith("http");

    return (
      <CustomLink
        href={href}
        isExternal={isExternal && !isSpecial}
        className="text-foreground hover:text-primary inline-flex items-baseline font-medium no-underline transition-colors duration-200"
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
    className={cn("prose prose-sm prose-a:no-underline max-w-none", className)}
  >
    {content}
  </ReactMarkdown>
);
