import { apiRequest } from "./api";

export interface TextMessageSection {
  type: "text";
  content: string;
  format?: string;
}

export interface ImageMessageSection {
  type: "image";
  url: string;
}

export interface EventMessageSection {
  type: "event";
  event: "join" | "leave";
}

export type MessageSection =
  | TextMessageSection
  | ImageMessageSection
  | EventMessageSection;

export interface Message {
  id: string;
  room: string;
  author: string;
  date: number;
  content: MessageSection[];
}

export interface GetMessagesResp {
  messages: Message[];
  noOlder: boolean;
}

export function getMessages(
  room_id: string,
  before?: string
): Promise<GetMessagesResp> {
  const query = new URLSearchParams();
  if (before) query.append("before", before);
  return apiRequest("messages/" + room_id + "?" + query);
}

export async function sendMessage(
  room_id: string,
  content: MessageSection[]
): Promise<void> {
  await apiRequest("messages/" + room_id, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content }),
  });
}
