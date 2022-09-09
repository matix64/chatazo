import { RequestRejectedError } from "./request-error";

const API_ROOT = "/api/";

export async function apiRequest(
  path: string,
  config: RequestInit | undefined = undefined
): Promise<any> {
  const resp = await fetch(API_ROOT + path, config);
  if (!resp.ok) throw new RequestRejectedError(resp);
  try {
    return await resp.json();
  } catch {
    return undefined;
  }
}
