"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import MemberGroup from "@/components/custom/member/MemberGroup";
import { useGroupsData } from "@/data/queries/use-groups";
import { useDebounce } from "@/lib/hooks";
import type { MemberData, Group as GroupType } from "@/types";

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
          shortDescription: "",
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

export default function StaffContent() {
  const t = useTranslations("Staff");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const sortingType = (searchParams.get("sort") as SortingType) || "team";
  const layout = (searchParams.get("layout") as LayoutType) || "grid";
  const search = searchParams.get("search") || "";

  const debouncedQuery = useDebounce(search, 600);

  const { data: groups } = useGroupsData(locale, { cache: true });

  const sortedGroups = useMemo(() => {
    if (!groups) return null;
    return transformGroupsData(groups, sortingType);
  }, [groups, sortingType]);

  const filteredGroups = useMemo(() => {
    if (!sortedGroups) return [];

    const query = debouncedQuery.toLowerCase();

    return sortedGroups
      .map((group) => {
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
  }, [sortedGroups, debouncedQuery]);

  return (
    <div className="flex flex-col gap-16">
      {filteredGroups && filteredGroups.length > 0 ? (
        filteredGroups.map(
          (group) =>
            group && (
              <MemberGroup key={group.id} group={group} layout={layout} />
            ),
        )
      ) : (
        <div className="flex h-16 items-center justify-center">
          <p>{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}
