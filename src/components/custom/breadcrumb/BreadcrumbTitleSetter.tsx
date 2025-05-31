"use client";

import { useEffect } from "react";
import { useBreadcrumbs } from "@/context/BreadcrumbsContext";

interface BreadcrumbTitleSetterProps {
  title: string;
}

export function BreadcrumbTitleSetter({ title }: BreadcrumbTitleSetterProps) {
  const { setTitle } = useBreadcrumbs();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]); 

  return null;
}