import { apiRequest } from "./api";

export interface Room {
  id: string;
  name: string;
}

export enum Role {
  Member = 1,
  Moderator,
  Admin,
  Owner,
}

export interface RoomMember {
  userId: string;
  role: Role;
}

export function getAllRooms(): Promise<Room[]> {
  return apiRequest("rooms");
}

export function getRoomMembers(roomId: string): Promise<RoomMember[]> {
  return apiRequest(`rooms/${roomId}/members`);
}

export function createRoom(name: string): Promise<Room> {
  return apiRequest("rooms", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
}

export function editRoom(
  roomId: string,
  changes: Pick<Partial<Room>, "name">
): Promise<void> {
  return apiRequest("rooms/" + roomId, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(changes),
  });
}

export function kickMember(roomId: string, memberId: string): Promise<void> {
  return apiRequest(`rooms/${roomId}/members/${memberId}`, {
    method: "DELETE",
  });
}

export function editMember(
  roomId: string,
  memberId: string,
  changes: Pick<Partial<RoomMember>, "role">
): Promise<void> {
  return apiRequest(`rooms/${roomId}/members/${memberId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(changes),
  });
}
