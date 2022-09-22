import { RequestRejectedError } from "./request-error";

const API_ROOT = "/api/";

export function getApiPath(path: string): string {
  return API_ROOT + path;
}

export async function apiRequest(
  path: string,
  config: RequestInit | undefined = undefined
): Promise<any> {
  const resp = await fetch(getApiPath(path), config);
  if (!resp.ok) throw new RequestRejectedError(resp);
  try {
    return await resp.json();
  } catch {
    return undefined;
  }
}
