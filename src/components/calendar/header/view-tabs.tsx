import { AnimatePresence, motion } from "motion/react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { CalendarRange, Columns, Grid3X3, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { useCalendar } from "../contexts/calendar-context";
import { TCalendarView } from "../types";

function Views() {
  const { view, setView } = useCalendar();
  const t = useTranslations("Calendar");

  const tabs = [
    {
      name: t("views.agenda"),
      value: "agenda",
      icon: () => <CalendarRange className="h-4 w-4" />,
    },
    {
      name: t("views.day"),
      value: "day",
      icon: () => <List className="h-4 w-4" />,
    },
    {
      name: t("views.week"),
      value: "week",
      icon: () => <Columns className="h-4 w-4" />,
    },
    {
      name: t("views.month"),
      value: "month",
      icon: () => <Grid3X3 className="h-4 w-4" />,
    },
    // {
    //   name: "Rok",
    //   value: "year",
    //   icon: () => <Grid2X2 className="h-4 w-4" />,
    // },
  ];

  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(value as TCalendarView)}
      className="w-full gap-4 sm:w-auto"
    >
      <TabsList className="h-auto w-full gap-2 rounded-xl p-1">
        {tabs.map(({ icon: Icon, name, value }) => {
          const isActive = view === value;

          return (
            <motion.div
              key={value}
              layout
              className={cn(
                "flex h-8 items-center justify-center overflow-hidden rounded-md",
                isActive ? "flex-1" : "flex-none",
              )}
              onClick={() => setView(value as TCalendarView)}
              initial={false}
              animate={{
                width: isActive ? 120 : 32,
              }}
              transition={{
                type: "tween",
                stiffness: 400,
                damping: 25,
              }}
            >
              <TabsTrigger value={value} asChild>
                <motion.div className="flex h-8 w-full cursor-pointer items-center justify-center gap-2">
                  <div className="shrink-0">
                    <Icon />
                  </div>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        className="font-medium"
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      >
                        {name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </TabsTrigger>
            </motion.div>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export default memo(Views);
