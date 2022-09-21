import { apiRequest } from "./api";
import { RequestRejectedError } from "./request-error";

export async function login(email: string, password: string): Promise<void> {
  try {
    await apiRequest("auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    if (err instanceof RequestRejectedError && err.status == 401)
      throw new InvalidCredentialsError();
    throw err;
  }
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<void> {
  await apiRequest("auth/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  await login(email, password);
}

export async function logout(): Promise<void> {
  await apiRequest("auth/logout", { method: "POST" });
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("The user doesn't exist or the password is incorrect");
    this.name = "InvalidCredentialsError";
  }
}
