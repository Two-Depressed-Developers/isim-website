import { getGroupsData } from "@/data/loaders";
import { IGroup } from "./types";
import Group from "@/components/Group";

export default async function Staff() {
  const strapiData = await getGroupsData();
  const groups: IGroup[] = strapiData.data;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <div className="flex-grow p-8">
        <h1 className="mb-4 text-3xl font-bold">Our Staff</h1>
        {groups.map((group) => (
          <Group key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
