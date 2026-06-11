const invitationAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const invitationPattern = /^[A-HJ-NP-Z2-9]{6,12}$/;

export function normalizeInvitationCode(code: string) {
  return code.trim().toUpperCase().replace(/[\s-]/g, "");
}

export function validateInvitationCode(code: string) {
  return invitationPattern.test(normalizeInvitationCode(code));
}

export function generateInvitationCode(length = 8) {
  const normalizedLength = Math.min(Math.max(length, 6), 12);
  const randomValues = new Uint32Array(normalizedLength);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(randomValues);
  } else {
    for (let index = 0; index < randomValues.length; index += 1) {
      randomValues[index] = Math.floor(Math.random() * 2 ** 32);
    }
  }

  return Array.from(randomValues)
    .map((value) => invitationAlphabet[value % invitationAlphabet.length])
    .join("");
}
