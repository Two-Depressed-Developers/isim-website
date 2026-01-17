"use client";

import { useTranslations } from "next-intl";
import { PropsWithChildren, useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import IconWithBackground from "../IconWithBackground";

type Props = {
  title: string;
  icon: LucideIcon;
  count?: number;
  defaultOpen?: boolean;
};

export function StaffDetailsTile({
  title,
  icon,
  count,
  children,
  defaultOpen = true,
}: PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const t = useTranslations("MemberDetails");

  return (
    <div className="border-gray-accent w-full border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <IconWithBackground icon={icon} />
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {count !== undefined && (
              <p className="text-xs text-slate-500">
                {count + " " + t("items", { count })}
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size="20" className="text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
