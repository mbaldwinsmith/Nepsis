/**
 * Word labels for ScaleInput scales, keyed to match specific min/max/endpoint-label
 * combinations used across the app. Each array's length must equal (max - min + 1).
 */

export const NONE_TO_SEVERE = ['none', 'slight', 'mild', 'marked', 'severe']

/** Same none-to-severe scale, but for a 0-3 range (4 values) rather than 0-4. */
export const NONE_TO_SEVERE_SHORT = ['none', 'mild', 'moderate', 'severe']

export const NONE_TO_CONSTANT = [
  'none',
  'occasional',
  'frequent',
  'near-constant',
  'constant',
]

export const NOT_AT_ALL_TO_SEVERE = ['not at all', 'slight', 'mild', 'marked', 'severe']

export const NOT_AT_ALL_TO_VERY_POROUS = [
  'not at all',
  'a little',
  'somewhat',
  'quite a lot',
  'very porous',
]

export const VERY_LOW_TO_VERY_HIGH = ['very low', 'low', 'moderate', 'high', 'very high']

export const MUCH_SLOWER_TO_MUCH_FASTER = [
  'much slower',
  'slower',
  'usual pace',
  'faster',
  'much faster',
]

export const VERY_POOR_TO_VERY_GOOD = ['very poor', 'poor', 'okay', 'good', 'very good']

export const NOT_AT_ALL_TO_MARKEDLY = ['not at all', 'somewhat', 'markedly']

export const NO_NEED_TO_STRONG_NEED = [
  'no need',
  'slight need',
  'moderate need',
  'strong need',
]

export const NONE_TO_A_GREAT_DEAL = [
  'none',
  'a little',
  'some',
  'quite a lot',
  'a great deal',
]

export const MUCH_LESS_TO_MUCH_MORE_DRIVEN = [
  'much less driven',
  'less driven',
  'usual',
  'more driven',
  'much more driven',
]

export const NOT_SATISFIED_TO_FULLY_SATISFIED = [
  'not satisfied',
  'slightly satisfied',
  'moderately satisfied',
  'mostly satisfied',
  'fully satisfied',
]
