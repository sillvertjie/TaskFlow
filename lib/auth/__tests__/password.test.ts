import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "../password";

describe("password utility", () => {
  it("should hash password", async () => {
    const password = "secret123";

    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should verify correct password", async () => {
    const password = "secret123";

    const hash = await hashPassword(password);

    const result = await verifyPassword(password, hash);

    expect(result).toBe(true);
  });

  it("should reject incorrect password", async () => {
    const hash = await hashPassword("secret123");

    const result = await verifyPassword("wrong-password", hash);

    expect(result).toBe(false);
  });
});
