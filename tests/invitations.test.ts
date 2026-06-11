import { describe, expect, it } from "vitest";
import {
  generateInvitationCode,
  normalizeInvitationCode,
  validateInvitationCode,
} from "@/lib/calculations";

describe("invitation code logic", () => {
  it("generates valid uppercase codes", () => {
    const code = generateInvitationCode();

    expect(code).toHaveLength(8);
    expect(validateInvitationCode(code)).toBe(true);
  });

  it("normalizes whitespace and hyphens", () => {
    expect(normalizeInvitationCode(" abcd-2345 ")).toBe("ABCD2345");
  });

  it("rejects ambiguous or too short codes", () => {
    expect(validateInvitationCode("IO01")).toBe(false);
    expect(validateInvitationCode("ABC")).toBe(false);
  });
});
