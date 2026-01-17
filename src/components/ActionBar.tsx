"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
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
  const tStaff = useTranslations("Staff");
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
    <div className="flex flex-col items-start gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-80">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="focus-visible:ring-primary pl-10"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      <div className="self-end sm:ml-auto sm:self-center">
        <Button
          onClick={() => {
            setSortingType("position");
            handleChangeSortingType("position");
          }}
          className="border-gray-accent border-y border-l"
          size="sm"
          variant={sortingType === "position" ? "default" : "ghost"}
          aria-label={tStaff("sortByPosition")}
        >
          <GraduationCap size="16" />
        </Button>
        <Button
          onClick={() => {
            setSortingType("team");
            handleChangeSortingType("team");
          }}
          variant={sortingType === "team" ? "default" : "ghost"}
          size="sm"
          className="border-gray-accent border-y border-r"
          aria-label={tStaff("sortByTeam")}
        >
          <UsersRound size="16" />
        </Button>
        <Button
          onClick={() => {
            setLayoutType("grid");
            handleChangeLayout("grid");
          }}
          variant={layoutType === "grid" ? "default" : "ghost"}
          size="sm"
          className="border-gray-accent ml-2 border-y border-l"
          aria-label={tStaff("gridLayout")}
        >
          <LayoutGrid size="16" />
        </Button>
        <Button
          onClick={() => {
            setLayoutType("details");
            handleChangeLayout("details");
          }}
          size="sm"
          variant={layoutType === "details" ? "default" : "ghost"}
          className="border-gray-accent border"
          aria-label={tStaff("detailsLayout")}
        >
          <LayoutPanelTop size="16" />
        </Button>

        <Button
          onClick={() => {
            setLayoutType("list");
            handleChangeLayout("list");
          }}
          size="sm"
          variant={layoutType === "list" ? "default" : "ghost"}
          className="border-gray-accent border-y border-r"
          aria-label={tStaff("listLayout")}
        >
          <List size="16" />
        </Button>
      </div>
    </div>
  );
}
