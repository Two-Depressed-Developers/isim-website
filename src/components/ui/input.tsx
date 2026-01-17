import * as React from "react";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex items-center h-10 w-full px-3 py-2 text-sm bg-transparent file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border border-transparent focus-within:outline-none aria-invalid:ring-1 aria-invalid:ring-destructive aria-invalid:focus-within:ring-2 aria-invalid:focus-within:ring-destructive",
  {
    variants: {
      rounded: {
        none: "rounded-none",
        md: "rounded-md",
      },
      variant: {
        outline:
          "border-border focus-within:border-primary focus-within:shadow-[0_0px_0px_1px_hsl(var(--primary))] aria-invalid:border-transparent",
        filled:
          "border-2 bg-background focus-within:border-primary focus-within:bg-transparent",
        underlined:
          "rounded-none border-b-border focus-within:border-b-primary focus-within:shadow-[0_1px_0px_0px_hsl(var(--primary))]",
        unstyled: "",
      },
    },
    defaultVariants: {
      rounded: "none",
      variant: "outline",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, rounded, variant, startContent, endContent, ...props },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    return (
      <div
        className={cn(inputVariants({ variant, rounded }), className)}
        onMouseDown={handleMouseDown}
        aria-invalid={props["aria-invalid"]}
      >
        {startContent && (
          <span className="text-muted-foreground pointer-events-none flex items-center">
            {startContent}
          </span>
        )}
        <input
          ref={inputRef}
          {...props}
          className={cn(
            "w-full bg-transparent outline-none focus-visible:outline-none",
            {
              "pl-1.5": !!startContent,
              "pr-1.5": !!endContent,
            },
          )}
        />
        {endContent && (
          <span className="text-muted-foreground pointer-events-none flex items-center">
            {endContent}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
