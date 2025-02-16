"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Group from "@/components/Group";
import ActionBar from "@/components/ActionBar";

import { getGroupsData } from "@/data/loaders";
import { useDebounce } from "@/lib/hooks";
import type { MemberData, Group as GroupType } from "@/lib/types";
import { useBreadcrumbs } from "@/context/BreadcrumbsContext";

type SortingType = "position" | "team";
type LayoutType = "grid" | "details" | "list";

const sortMembersWithSupervisorFirst = (
  members: MemberData[] | undefined,
  supervisorId: number | null,
): MemberData[] => {
  if (!members) return [];
  if (!supervisorId) return members;

  return members.sort((a, b) =>
    a.id === supervisorId ? -1 : b.id === supervisorId ? 1 : 0,
  );
};

const transformGroupsData = (
  groups: GroupType[],
  sortingType: SortingType,
): GroupType[] => {
  if (sortingType === "team") {
    return groups.map((group) => ({
      ...group,
      members: sortMembersWithSupervisorFirst(
        group.members || [],
        group.supervisor?.id || null,
      ),
    }));
  }

  const groupedByPosition: Record<string, GroupType> = {};

  groups.forEach((group) => {
    if (!group.members) return;

    group.members.forEach((member) => {
      if (!member.position) return;
      if (!groupedByPosition[member.position]) {
        // TODO: Do poprawy
        groupedByPosition[member.position] = {
          id: member.id,
          documentId: `${member.position}`,
          name: member.position,
          description: "",
          members: [],
        };
      }
      groupedByPosition[member.position].members?.push(member);
    });
  });

  return Object.values(groupedByPosition).map((group) => ({
    ...group,
    members: sortMembersWithSupervisorFirst(group.members, group.id),
  }));
};

export default function Staff() {
  const searchParams = useSearchParams();
  const { setTitle } = useBreadcrumbs();
  setTitle("Our Staff");

  const sortingType = (searchParams.get("sort") as SortingType) || "team";
  const layout = (searchParams.get("layout") as LayoutType) || "grid";
  const search = searchParams.get("search") || "";

  const [groups, setGroups] = useState<GroupType[] | null>(null);
  const [sortedGroups, setSortedGroups] = useState<GroupType[] | null>(null);

  const debouncedQuery = useDebounce(search, 600);

  useEffect(() => {
    const fetchData = async () => {
      const strapiData = await getGroupsData();

      setGroups(strapiData.data);
      setSortedGroups(strapiData.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (groups) {
      const transformedData = transformGroupsData(groups, sortingType);
      setSortedGroups(transformedData);
    }
  }, [groups, sortingType]);

  const filteredGroups = sortedGroups
    ?.map((group) => {
      const query = debouncedQuery.toLowerCase();
      if (!group.members) return null;

      const filteredMembers = group.members.filter((member) =>
        member.fullName.toLowerCase().includes(query),
      );

      if (filteredMembers.length > 0) {
        return {
          ...group,
          members: sortMembersWithSupervisorFirst(
            filteredMembers,
            group.supervisor?.id || null,
          ),
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col space-y-8 p-8">
        <div>
          <h1 className="mb-2 text-6xl font-semibold leading-[48px]">
            Our Staff
          </h1>
          <div className="h-1 w-28 rounded-full bg-primary" />
        </div>
        <ActionBar />
        <div className="flex flex-col gap-16">
          {filteredGroups && filteredGroups.length > 0 ? (
            filteredGroups.map(
              (group) =>
                group && <Group key={group.id} group={group} layout={layout} />,
            )
          ) : (
            <div className="flex h-16 items-center justify-center">
              <p>No results found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
