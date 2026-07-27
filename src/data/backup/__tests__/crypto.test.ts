import { describe, expect, it } from 'vitest'
import { encryptText, decryptText, IncorrectPassphraseError } from '../crypto'

describe('crypto', () => {
  it('round-trips plaintext through encrypt and decrypt', async () => {
    const payload = await encryptText('hello nepsis', 'correct horse battery staple')
    const plaintext = await decryptText(payload, 'correct horse battery staple')
    expect(plaintext).toBe('hello nepsis')
  })

  it('rejects the wrong passphrase', async () => {
    const payload = await encryptText('hello nepsis', 'right passphrase')
    await expect(decryptText(payload, 'wrong passphrase')).rejects.toThrow(
      IncorrectPassphraseError,
    )
  })

  it('rejects tampered ciphertext', async () => {
    const payload = await encryptText('hello nepsis', 'a passphrase')
    const tampered = {
      ...payload,
      ciphertextBase64: payload.ciphertextBase64.slice(0, -4) + 'abcd',
    }
    await expect(decryptText(tampered, 'a passphrase')).rejects.toThrow(
      IncorrectPassphraseError,
    )
  })
})
