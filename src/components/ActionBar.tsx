"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  LayoutGrid,
  LayoutPanelTop,
  List,
  Search,
  UsersRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type SortingType = "position" | "team";
type LayoutType = "grid" | "details" | "list";

export default function ActionBar() {
  const t = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSortingType =
    (searchParams.get("sort") as SortingType) || "team";
  const initialLayout = (searchParams.get("layout") as LayoutType) || "grid";
  const initialSearch = searchParams.get("search") || "";

  const [sortingType, setSortingType] =
    useState<SortingType>(initialSortingType);
  const [layoutType, setLayoutType] = useState<LayoutType>(initialLayout);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  const handleChangeSortingType = (type: SortingType) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("sort", type);
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleChangeLayout = (type: LayoutType) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("layout", type);
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("search", e.target.value);
    router.push(`${pathname}?${current.toString()}`);
  };

  return (
    <div className="flex flex-wrap justify-between gap-2 rounded-2xl bg-white p-4 shadow-xs">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setSortingType("position");
            handleChangeSortingType("position");
          }}
          className={cn("h-10 w-10", {
            "bg-primary": sortingType === "position",
            "bg-inactive": sortingType !== "position",
            "text-gray-text": sortingType !== "position",
            "hover:bg-inactive/70": sortingType !== "position",
          })}
          aria-label="Sort by position"
        >
          <GraduationCap size="20" />
        </Button>
        <Button
          onClick={() => {
            setSortingType("team");
            handleChangeSortingType("team");
          }}
          className={cn("h-10 w-10", {
            "bg-primary": sortingType === "team",
            "bg-inactive": sortingType !== "team",
            "text-gray-text": sortingType !== "team",
            "hover:bg-inactive/70": sortingType !== "team",
          })}
          aria-label="Sort by team"
        >
          <UsersRound size="20" />
        </Button>
      </div>
      <div className="relative hidden grow items-center sm:flex">
        <Search
          size="16"
          className="text-light-gray-text pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        />
        <Input
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="bg-inactive placeholder:text-light-gray-text focus-visible:ring-primary mx-2 rounded-2xl border-none pr-10 pl-8 placeholder:font-semibold"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setLayoutType("grid");
            handleChangeLayout("grid");
          }}
          className={cn("h-10 w-10", {
            "bg-primary": layoutType === "grid",
            "bg-inactive": layoutType !== "grid",
            "text-gray-text": layoutType !== "grid",
            "hover:bg-inactive/70": layoutType !== "grid",
          })}
          aria-label="Grid layout"
        >
          <LayoutGrid size="20" />
        </Button>
        <Button
          onClick={() => {
            setLayoutType("details");
            handleChangeLayout("details");
          }}
          className={cn("h-10 w-10", {
            "bg-primary": layoutType === "details",
            "bg-inactive": layoutType !== "details",
            "text-gray-text": layoutType !== "details",
            "hover:bg-inactive/70": layoutType !== "details",
          })}
          aria-label="Details layout"
        >
          <LayoutPanelTop size="20" />
        </Button>

        <Button
          onClick={() => {
            setLayoutType("list");
            handleChangeLayout("list");
          }}
          className={cn("h-10 w-10", {
            "bg-primary": layoutType === "list",
            "bg-inactive": layoutType !== "list",
            "text-gray-text": layoutType !== "list",
            "hover:bg-inactive/70": layoutType !== "list",
          })}
          aria-label="List layout"
        >
          <List size="20" />
        </Button>
      </div>
      <div className="relative flex w-full grow items-center sm:hidden">
        <Search
          size="16"
          className="text-light-gray-text pointer-events-none absolute top-1/2 left-2 -translate-y-1/2"
        />
        <Input
          placeholder={t("searchPlaceholder")}
          className="bg-inactive placeholder:text-light-gray-text focus-visible:ring-primary rounded-2xl border-none pr-10 pl-8 placeholder:font-semibold"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
    </div>
  );
}
