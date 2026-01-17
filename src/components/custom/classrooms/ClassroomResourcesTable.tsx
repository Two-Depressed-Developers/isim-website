"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ClassroomResource } from "@/types";

type Props = {
  classrooms: ClassroomResource[];
};

export function ClassroomResourcesTable({ classrooms }: Props) {
  const t = useTranslations("Classrooms");
  const [searchTerm, setSearchTerm] = useState("");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState("");

  const buildings = useMemo(() => {
    const uniqueBuildings = new Set(classrooms.map((c) => c.building));
    return Array.from(uniqueBuildings).sort();
  }, [classrooms]);

  const allResources = useMemo(() => {
    const resources = new Set<string>();
    classrooms.forEach((c) => c.resources.forEach((r) => resources.add(r)));
    return Array.from(resources).sort();
  }, [classrooms]);

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((classroom) => {
      const matchesSearch =
        searchTerm === "" ||
        classroom.fullRoomCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        classroom.resources.some((r) =>
          r.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesBuilding =
        buildingFilter === "all" || classroom.building === buildingFilter;

      const matchesResource =
        resourceFilter === "" ||
        classroom.resources.some((r) =>
          r.toLowerCase().includes(resourceFilter.toLowerCase()),
        );

      return matchesSearch && matchesBuilding && matchesResource;
    });
  }, [classrooms, searchTerm, buildingFilter, resourceFilter]);

  const handleReset = () => {
    setSearchTerm("");
    setBuildingFilter("all");
    setResourceFilter("");
  };

  if (classrooms.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-8 text-center">
          {t("noData")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("filters.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="search-filter">
                {t("filters.search")}
              </label>
              <Input
                id="search-filter"
                placeholder={t("filters.searchPlaceholder")}
                rounded={"none"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="building-filter">
                {t("filters.building")}
              </label>
              <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                <SelectTrigger id="building-filter">
                  <SelectValue placeholder={t("filters.allBuildings")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filters.allBuildings")}
                  </SelectItem>
                  {buildings.map((building) => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="resource-filter">
                {t("filters.resource")}
              </label>
              <Input
                id="resource-filter"
                placeholder={t("filters.resourcePlaceholder")}
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                list="resources-list"
                rounded={"none"}
              />
              <datalist id="resources-list">
                {allResources.map((resource) => (
                  <option key={resource} value={resource} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {t("filters.found", {
                found: filteredClassrooms.length,
                total: classrooms.length,
              })}
            </p>
            <button
              onClick={handleReset}
              className="text-primary text-sm hover:underline"
            >
              {t("filters.clear")}
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-second-background">
                <TableRow>
                  <TableHead className="w-[150px] font-bold text-black">
                    {t("table.room")}
                  </TableHead>
                  <TableHead className="w-[100px] font-bold text-black">
                    {t("table.building")}
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    {t("table.resources")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassrooms.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-muted-foreground text-center"
                    >
                      {t("table.noResults")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClassrooms.map((classroom) => (
                    <TableRow key={classroom.id || classroom.fullRoomCode}>
                      <TableCell className="text-primary font-medium">
                        {classroom.fullRoomCode}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{classroom.building}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {classroom.resources.map((resource, idx) => (
                            <Badge key={idx} variant="secondary">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
