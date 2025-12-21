export interface ClassroomResource {
  building: string;
  roomNumber: string;
  fullRoomCode: string;
  resources: string[];
}

export function parseRoomNumbers(roomString: string): string[] {
  const rooms: string[] = [];
  const parts = roomString.split(/[,;]/).map((s) => s.trim());

  for (const part of parts) {
    if (!part) continue;

    const slashMatch = part.match(/^([A-Z]\d+)\s+(\d+)\/(\d+)$/);
    if (slashMatch) {
      const [, building, room1, room2] = slashMatch;
      rooms.push(`${building} ${room1}`, `${building} ${room2}`);
      continue;
    }

    const multiSlashMatch = part.match(/^([A-Z]\d+)\s+([\d/]+)$/);
    if (multiSlashMatch) {
      const [, building, roomNumbers] = multiSlashMatch;
      const nums = roomNumbers.split("/");
      rooms.push(...nums.map((num) => `${building} ${num}`));
      continue;
    }

    const standardMatch = part.match(/^([A-Z]\d+)\s+(\d+)$/);
    if (standardMatch) {
      rooms.push(part);
      continue;
    }

    if (/^[A-Z]\d+/.test(part)) {
      rooms.push(part);
    }
  }

  return [...new Set(rooms)];
}

export function parseResources(resourceString: string): string[] {
  return resourceString
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function parseClassroomData(
  roomColumn: string[],
  resourceColumn: string[],
): ClassroomResource[] {
  const classroomMap = new Map<string, Set<string>>();

  roomColumn.forEach((roomCell, index) => {
    const rooms = parseRoomNumbers(roomCell);
    const resources = parseResources(resourceColumn[index] || "");

    rooms.forEach((room) => {
      if (!classroomMap.has(room)) {
        classroomMap.set(room, new Set());
      }
      resources.forEach((resource) => {
        classroomMap.get(room)!.add(resource);
      });
    });
  });

  const results: ClassroomResource[] = [];
  classroomMap.forEach((resources, fullRoomCode) => {
    const match = fullRoomCode.match(/^([A-Z]\d+)\s+(\d+)$/);
    if (match) {
      results.push({
        building: match[1],
        roomNumber: match[2],
        fullRoomCode,
        resources: Array.from(resources).sort(),
      });
    }
  });

  return results.sort((a, b) => {
    const buildingCompare = a.building.localeCompare(b.building);
    if (buildingCompare !== 0) return buildingCompare;
    return parseInt(a.roomNumber) - parseInt(b.roomNumber);
  });
}
