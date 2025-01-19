import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { ButtonHTMLAttributes, Ref } from "react";

interface CustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ref?: Ref<HTMLButtonElement>;
}

const buttonVariants = cva("flex items-center hover:opacity-90", {
  variants: {
    variant: {
      default: "bg-gradient-to-r from-[#383556] to-[#444160] text-white",
      outline: "bg-white text-black border border-black",
    },
    size: {
      default: "",
      sm: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const CustomButton = ({
  ref,
  className,
  size,
  variant,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { CustomButton, buttonVariants };
