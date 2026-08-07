/**
 * A CSS length. Numbers are treated as px, so `radius={8}` and `radius="8px"`
 * are the same; any other unit passes through verbatim (`"50%"`, `"2rem"`).
 */
export type CssLength = number | string;

/**
 * Formats a length prop for CSS. A bare number means px — the unit every
 * component metric is expressed in — while a string is passed through so
 * `"50%"` or `"2rem"` still work.
 */
export function len(value: CssLength | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}
