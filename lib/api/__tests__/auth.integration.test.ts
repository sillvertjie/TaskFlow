import { describe, expect, it } from "vitest";

import { GET as me } from "@/app/api/me/route";

import { createTestUser, loginTestUser } from "./helpers/auth";

import { ApiClient } from "./helpers/api-client";

describe("Auth API Integration", () => {
  it("should register and authenticate user", async () => {
    const client = new ApiClient();

    const credentials = await createTestUser(client);

    expect(credentials.email).toContain("@example.com");

    await loginTestUser(client, credentials);

    const response = await me(
      new Request("http://localhost/api/me", {
        headers: {
          cookie: client.getCookies(),
        },
      }),
    );

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.user.email).toBe(credentials.email);
  });

  it("should reject request without token", async () => {
    const response = await me(new Request("http://localhost/api/me"));

    expect(response.status).toBe(401);
  });
});
