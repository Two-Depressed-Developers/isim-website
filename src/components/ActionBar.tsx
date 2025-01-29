"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  LayoutGrid,
  LayoutPanelTop,
  List,
  UsersRound,
} from "lucide-react";

import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function ActionBar() {
  const [sortingType, setSortingType] = useState<"position" | "team">("team");
  const [layoutType, setLayoutType] = useState<"grid" | "details" | "list">(
    "grid",
  );

  return (
    <div className="flex gap-2 rounded-2xl bg-white p-4 shadow-sm">
      <Button
        onClick={() => setSortingType("position")}
        className={cn("h-10 w-10", {
          "bg-primary": sortingType === "position",
          "bg-inactive": sortingType !== "position",
          "text-gray-text": sortingType !== "position",
        })}
      >
        <GraduationCap size="20" />
      </Button>
      <Button
        onClick={() => setSortingType("team")}
        className={cn("h-10 w-10", {
          "bg-primary": sortingType === "team",
          "bg-inactive": sortingType !== "team",
          "text-gray-text": sortingType !== "team",
        })}
      >
        <UsersRound size="20" />
      </Button>
      <Input
        placeholder="Search"
        className="mx-2 rounded-2xl border-none bg-light-gray-text"
        // value={searchQuery}
        // onChange={handleSearchQueryChange}
      />
      <Button
        onClick={() => setLayoutType("grid")}
        className={cn("h-10 w-10", {
          "bg-primary": layoutType === "grid",
          "bg-inactive": layoutType !== "grid",
          "text-gray-text": layoutType !== "grid",
        })}
      >
        <LayoutGrid size="20" />
      </Button>
      <Button
        onClick={() => setLayoutType("details")}
        className={cn("h-10 w-10", {
          "bg-primary": layoutType === "details",
          "bg-inactive": layoutType !== "details",
          "text-gray-text": layoutType !== "details",
        })}
      >
        <LayoutPanelTop size="20" />
      </Button>

      <Button
        onClick={() => setLayoutType("list")}
        className={cn("h-10 w-10", {
          "bg-primary": layoutType === "list",
          "bg-inactive": layoutType !== "list",
          "text-gray-text": layoutType !== "list",
        })}
      >
        <List size="20" />
      </Button>
    </div>
  );
}
