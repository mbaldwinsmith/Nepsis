/**
 * Thin Web Crypto wrapper for the encrypted backup format. AES-GCM's own
 * authentication tag (appended to the ciphertext by crypto.subtle.encrypt)
 * is the "authentication metadata" required by TASKS.md 10.2 — there is no
 * separate tag field to store.
 */

export const PBKDF2_ITERATIONS = 300_000
const SALT_LENGTH_BYTES = 16
const IV_LENGTH_BYTES = 12

export class IncorrectPassphraseError extends Error {
  constructor() {
    super('Incorrect passphrase, or this file is corrupted.')
    this.name = 'IncorrectPassphraseError'
  }
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export interface EncryptedPayload {
  saltBase64: string
  ivBase64: string
  ciphertextBase64: string
}

export async function encryptText(
  plaintext: string,
  passphrase: string,
): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES))
  const key = await deriveKey(passphrase, salt)
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext),
  )
  return {
    saltBase64: toBase64(salt),
    ivBase64: toBase64(iv),
    ciphertextBase64: toBase64(new Uint8Array(ciphertext)),
  }
}

/** Throws IncorrectPassphraseError if the passphrase is wrong or the data has been tampered with. */
export async function decryptText(
  payload: EncryptedPayload,
  passphrase: string,
): Promise<string> {
  const salt = fromBase64(payload.saltBase64)
  const iv = fromBase64(payload.ivBase64)
  const key = await deriveKey(passphrase, salt)
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      fromBase64(payload.ciphertextBase64) as BufferSource,
    )
    return new TextDecoder().decode(plaintext)
  } catch {
    throw new IncorrectPassphraseError()
  }
}
