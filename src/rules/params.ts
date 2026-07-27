import type { RuleParamSpec } from './types'

/** Fills in any param missing from a stored rule with its type's default. */
export function resolveParams(
  spec: RuleParamSpec[],
  params: Record<string, number>,
): Record<string, number> {
  const resolved: Record<string, number> = {}
  for (const p of spec) {
    resolved[p.key] = params[p.key] ?? p.default
  }
  return resolved
}

export function defaultParams(spec: RuleParamSpec[]): Record<string, number> {
  return resolveParams(spec, {})
}
