import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

function getKey() {
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error("ENCRYPTION_KEY is not set");
  }
  const key = Buffer.from(rawKey, "hex");
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }
  return key;
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
}

export function decrypt(text: string): string {
  const [ivHex, encrypted, authTagHex] = text.split(":");
  if (!ivHex || !encrypted || !authTagHex) {
    throw new Error("Invalid encrypted payload");
  }
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function safeDecrypt(text: string | null | undefined, fallback = "[DATOS NO DISPONIBLES]"): string {
  if (!text) return fallback;
  try {
    return decrypt(text);
  } catch {
    console.error("Failed to decrypt field");
    return fallback;
  }
}
