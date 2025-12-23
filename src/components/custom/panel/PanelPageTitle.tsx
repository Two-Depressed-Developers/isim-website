"use client";

import { useEffect } from "react";
import { usePanelContext } from "@/context/PanelContext";

export function PanelPageTitle({ title }: { title: string }) {
  const { setPageTitle } = usePanelContext();

  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);

  return null;
}