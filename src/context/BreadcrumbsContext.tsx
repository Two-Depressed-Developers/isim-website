"use client";
import { createContext, useState, useContext } from "react";

type BreadcrumbsContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const BreadcrumbsContext = createContext<BreadcrumbsContextType | undefined>(
  undefined,
);

export function BreadcrumbsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState("");

  return (
    <BreadcrumbsContext.Provider value={{ title, setTitle }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbsProvider");
  }
  return context;
}
