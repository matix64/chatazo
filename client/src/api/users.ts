import { apiRequest } from "./api";
import { RequestRejectedError } from "./request-error";

export interface User {
  id: string;
  name: string;
  status?: string;
  picture?: string;
}

const USER_CACHE: Record<string, Promise<User>> = {};

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    const user: User = await apiRequest("users/me");
    return user;
  } catch (err) {
    if (err instanceof RequestRejectedError && err.status == 401)
      return undefined;
    throw err;
  }
}

export async function getUser(id: string): Promise<User> {
  if (!USER_CACHE[id]) USER_CACHE[id] = apiRequest("users/" + id);
  return await USER_CACHE[id];
}
