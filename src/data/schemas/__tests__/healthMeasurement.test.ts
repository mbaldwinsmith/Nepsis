import { describe, expect, it } from 'vitest'
import { isOutsideReferenceRange } from '../healthMeasurement'

describe('isOutsideReferenceRange', () => {
  it('returns false when no reference range is supplied', () => {
    expect(isOutsideReferenceRange({ value: 100 })).toBe(false)
  })

  it('returns false when the value is within range', () => {
    expect(isOutsideReferenceRange({ value: 5, referenceMin: 4, referenceMax: 6 })).toBe(
      false,
    )
  })

  it('returns true when the value is below the reference minimum', () => {
    expect(isOutsideReferenceRange({ value: 3, referenceMin: 4, referenceMax: 6 })).toBe(
      true,
    )
  })

  it('returns true when the value is above the reference maximum', () => {
    expect(isOutsideReferenceRange({ value: 7, referenceMin: 4, referenceMax: 6 })).toBe(
      true,
    )
  })

  it('never interprets the result beyond the supplied range', () => {
    // A value can be "outside range" without the helper claiming clinical meaning —
    // callers must pair this with the "discuss with your clinician" wording only.
    expect(isOutsideReferenceRange({ value: 100, referenceMax: 6 })).toBe(true)
  })
})
