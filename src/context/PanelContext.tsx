"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PanelContextType = {
  pageTitle: string;
  setPageTitle: (title: string) => void;
};

const PanelContext = createContext<PanelContextType | null>(null);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState("Panel");

  return (
    <PanelContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanelContext() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanelContext must be used within PanelProvider");
  }
  return context;
}
