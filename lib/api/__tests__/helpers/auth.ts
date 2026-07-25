import { ApiClient } from "./api-client";

const register = async () =>
  (await import("@/app/api/auth/register/route")).POST;

const login = async () => (await import("@/app/api/auth/login/route")).POST;

export async function createTestUser(client: ApiClient) {
  const credentials = {
    email: `test-${Date.now()}@example.com`,
    password: "password123",
  };

  const registerResponse = await client.request(await register(), {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (!registerResponse.ok) {
    throw new Error("Failed creating test user");
  }

  await loginTestUser(client, credentials);

  return credentials;
}

export async function loginTestUser(
  client: ApiClient,
  credentials: {
    email: string;
    password: string;
  },
) {
  const response = await client.request(await login(), {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Failed login test user");
  }

  client.setCookies(response);
}
