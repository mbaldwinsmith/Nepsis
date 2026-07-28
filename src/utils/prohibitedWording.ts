/**
 * Nepsis never diagnoses, labels a mental state, or claims a causal link to
 * medication. Every surface that generates or displays text — rule engine
 * output, pattern cards, and (via e2e) every rendered page — is checked
 * against this list.
 */
export const BANNED_PHRASES = [
  'manic',
  'hypomanic',
  'akathisia',
  'you are manic',
  'you are becoming hypomanic',
  'this is akathisia',
  'your medication is causing',
  'addicted',
]

export function assertNoBannedPhrase(text: string, label: string): void {
  const lower = text.toLowerCase()
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      throw new Error(`${label} contains prohibited wording: "${phrase}"`)
    }
  }
}
