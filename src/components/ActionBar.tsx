"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  LayoutGrid,
  LayoutPanelTop,
  List,
  Search,
  UsersRound,
} from "lucide-react";

import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type SortingType = "position" | "team";
type LayoutType = "grid" | "details" | "list";

export default function ActionBar() {
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
    <div className="flex gap-2 rounded-2xl bg-white p-4 shadow-sm">
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
      >
        <UsersRound size="20" />
      </Button>
      <div className="relative flex grow items-center">
        <Search
          size="16"
          className="absolute left-5 top-3 text-light-gray-text"
        />
        <Input
          placeholder="Search..."
          className="mx-2 rounded-2xl border-none bg-inactive px-10 placeholder:font-semibold placeholder:text-light-gray-text focus-visible:ring-primary"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
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
      >
        <List size="20" />
      </Button>
    </div>
  );
}
