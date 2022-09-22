import { apiRequest, getApiPath } from "./api";
import { RequestRejectedError } from "./request-error";

export interface User {
  id: string;
  name: string;
  status: string;
  picture?: string;
}

export interface EditProfileChanges {
  name?: string;
  status?: string;
  picture?: string;
}

const USER_CACHE: Record<string, Promise<User>> = {};

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    const user: User = await apiRequest("users/me");
    user.picture = user.picture && getApiPath(user.picture);
    return user;
  } catch (err) {
    if (err instanceof RequestRejectedError && err.status == 401)
      return undefined;
    throw err;
  }
}

export async function getUser(id: string): Promise<User> {
  if (!USER_CACHE[id])
    USER_CACHE[id] = (async () => {
      const user: User = await apiRequest("users/" + id);
      user.picture = user.picture && getApiPath(user.picture);
      return user;
    })();
  return await USER_CACHE[id];
}

export function addToUserCache(user: User) {
  USER_CACHE[user.id] = Promise.resolve(user);
}

export function getEditProfileEndpoint(): string {
  return getApiPath("users/me");
}
