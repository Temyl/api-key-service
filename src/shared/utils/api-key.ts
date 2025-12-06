import crypto from 'crypto';

export function genApiKeyHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex'); // e.g. 64 chars for 32 bytes
}
