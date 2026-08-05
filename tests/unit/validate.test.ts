import { describe, expect, test } from "vitest";
import { Validate } from "@/lib/validate";

describe("Validate", () => {
  test("accepts a well-formed email and a long-enough password", () => {
    expect(Validate("someone@example.com", "hunter2!")).toBeNull();
  });

  test.each([
    ["", "", "both missing"],
    ["someone@example.com", "", "password missing"],
    ["", "hunter2!", "email missing"],
  ])("requires both fields (%s, %s — %s)", (email, password) => {
    expect(Validate(email, password)).toBe("Email and password are required");
  });

  test.each([
    ["plainstring"],
    ["missing@domain"],
    ["@example.com"],
    ["spaces in@example.com"],
    ["two@@example.com"],
  ])("rejects the malformed email %s", (email) => {
    expect(Validate(email, "hunter2!")).toBe("Invalid email format");
  });

  test("rejects passwords shorter than six characters", () => {
    expect(Validate("someone@example.com", "12345")).toBe(
      "Password must be at least 6 characters",
    );
  });

  test("accepts a password of exactly six characters", () => {
    expect(Validate("someone@example.com", "123456")).toBeNull();
  });

  test("checks presence before format", () => {
    // An empty email is reported as missing, not as malformed.
    expect(Validate("", "12345")).toBe("Email and password are required");
  });
});
