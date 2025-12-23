"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePanelContext } from "@/context/PanelContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function PanelNav() {
  const { pageTitle } = usePanelContext();
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 flex h-15 shrink-0 items-center gap-4 border-b px-6 shadow-sm">
      <SidebarTrigger className={isMobile ? "block" : "hidden"} />
      <Separator
        orientation="vertical"
        className={cn("h-6", isMobile ? "block" : "hidden")}
      />

      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-muted-foreground">Panel</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-bold tracking-tight">
          {pageTitle}
        </span>
      </div>
    </nav>
  );
}
