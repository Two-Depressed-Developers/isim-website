"use client"
import { getGroupsData } from "@/data/loaders";
import { Member, type Group as GroupType } from "@/lib/types";
import Group from "@/components/Group";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

enum GroupsSortingTypes {
  Teams,
  Position,
}

const transformGroupsData = (groups: GroupType[], sortingType: GroupsSortingTypes) : GroupType[] => {
  if (sortingType === GroupsSortingTypes.Teams) {
    return groups;
  } else if (sortingType === GroupsSortingTypes.Position) {
    const groupedByPosition: Record<string, GroupType> = {};
  
    groups.forEach((group) => {
      group.members.forEach((member) => {
        if (!groupedByPosition[member.position]) {
          // TODO: Do poprawy
          groupedByPosition[member.position] = {
            id: member.id,
            documentId: `${member.position}`, 
            name: member.position,
            members: [],
          };
        }
        groupedByPosition[member.position].members?.push(member);
      });
    });

    return Object.values(groupedByPosition);
  }

  return groups;
}

export default function Staff() {
  const [sortingType, setSortingType] = useState<GroupsSortingTypes>(GroupsSortingTypes.Teams);
  const [groups, setGroups] = useState<GroupType[] | null>(null);
  const [sortedGroups, setSortedGroups] = useState<GroupType[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const strapiData = await getGroupsData();

      if(strapiData.data.supervisor && Array.isArray(strapiData.data.members))
        strapiData.data.members = 
        [strapiData.data.supervisor, ...strapiData.data.members.filter((member : Member) => 
          member.id !== strapiData.data.supervisor.id)
        ].filter(Boolean);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleChangeSorting = (type: GroupsSortingTypes) => {
    if (sortingType === type) return;
    setSortingType(type);
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredGroups = sortedGroups?.map((group) => {
    const query = debouncedQuery.toLowerCase();
    const filteredMembers = group.members.filter((member) =>
      member.firstName.toLowerCase().includes(query) || member.lastName.toLowerCase().includes(query)
    );

    if (filteredMembers.length > 0) {
      return {
        ...group,
        members: filteredMembers,
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="mx-auto flex max-w-7xl flex-col ">
      <div className="flex-grow p-8 flex flex-col gap-y-4">
        <h1 className="text-3xl font-bold">Our Staff</h1>
        <div className="flex flex-row justify-between gap-x-4">
          <div className="flex flex-row gap-4">
            <Button 
              className={`hover:opacity-90 shadow-sm ${sortingType === GroupsSortingTypes.Teams ? "bg-primary" : "bg-gray-500"}`}
              onClick={() => handleChangeSorting(GroupsSortingTypes.Teams)}
            >
              Teams
            </Button>
            <Button 
              className={`hover:opacity-90 shadow-sm ${sortingType === GroupsSortingTypes.Position ? "bg-primary" : "bg-gray-500"}`}
              onClick={() => handleChangeSorting(GroupsSortingTypes.Position)}
            >
              Position
            </Button>
          </div>
          <Input 
            placeholder="Search" 
            className="max-w-64 bg-white shadow-sm"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>
        <div className="flex flex-col gap-4">
          {(filteredGroups && filteredGroups.length > 0) ? filteredGroups.map((group) => (
            group && <Group key={group.id} group={group} />
          )) : (
            <div className="flex items-center justify-center h-16">
              <p>No results found</p>
            </div>
          )
        }
        </div>
      </div>
    </div>
  );
}
