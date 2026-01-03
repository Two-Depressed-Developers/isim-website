"use client";

import { useEffect } from "react";
import { useBreadcrumbs } from "@/context/BreadcrumbsContext";

type Props = {
  title: string;
};

export function BreadcrumbTitleSetter({ title }: Props) {
  const { setTitle } = useBreadcrumbs();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return null;
}
