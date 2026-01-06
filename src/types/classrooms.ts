export type ClassroomResource = {
  id?: number;
  documentId?: string;
  building: string;
  roomNumber: string;
  fullRoomCode: string;
  resources: string[];
  createdAt?: string;
  updatedAt?: string;
};
