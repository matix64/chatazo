import { apiRequest } from "./api";
import { Room } from "./rooms";

export class Invite {
  constructor(private id: string) {}

  getUrl(): string {
    return window.location.origin + "/invite/" + this.id;
  }
}

interface InviteDto {
  id: string;
  creator: string;
  room: string;
}

export interface InvitePreview {
  room: {
    id: string;
    name: string;
    members: number;
  };
}

export async function createInvite(room_id: string): Promise<Invite> {
  const invite: InviteDto = await apiRequest("invites/create/" + room_id, {
    method: "POST",
  });
  return new Invite(invite.id);
}

export async function viewInvite(id: string): Promise<InvitePreview> {
  return apiRequest("invites/" + id);
}

export async function useInvite(id: string): Promise<Room> {
  return apiRequest("invites/" + id, { method: "POST" });
}
