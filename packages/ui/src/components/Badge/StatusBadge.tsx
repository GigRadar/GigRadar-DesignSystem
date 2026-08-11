import { color, component, typography, type BadgeSize } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { badge } = component;

/**
 * The states a connected account can be in.
 *
 * `active` is the healthy one. `suspended` and `error` are both failures but
 * read differently to a user — a suspension comes from the provider's side and
 * needs an action there, while an error is ours and may clear on a retry — so
 * they are separate values even though Figma paints them the same red.
 * `pending` and `inactive` are the two quiet states: authorized but not yet
 * confirmed, and confirmed but switched off.
 *
 * A closed list: an account is always exactly one of these.
 */
export type StatusTone = 'active' | 'suspended' | 'error' | 'pending' | 'inactive';

export type StatusBadgeStyleProps = {
  /** Horizontal padding. Overrides the `size` step. */
  paddingX?: CssLength;
  /** Vertical padding. Overrides the `size` step. */
  paddingY?: CssLength;
  /** Corner radius. Figma draws a 4px box, not a pill. */
  radius?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Fill. Overrides whatever the tone supplies. */
  background?: string;
  /** Label color. Overrides the tone's. */
  textColor?: string;
};

export type StatusBadgeProps = {
  /**
   * Which state to draw.
   *
   * @default 'active'
   */
  tone?: StatusTone;
  /**
   * Overrides the label. Each tone has a default, so most callers pass only
   * `tone` — but the error state in particular carries a specific message on
   * some screens.
   */
  children?: ReactNode;
  size?: BadgeSize;
} & StatusBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The palette and default label per tone.
 *
 * Figma draws Active and Suspended as its own variants (nodes 2113:1929 and
 * 2113:1931); the other three appear on the Upwork account list at 2116:2950,
 * and their colors are taken from there — pending on the warning ambers,
 * inactive on the disabled greys, and error sharing suspended's red.
 */
const tones: Record<StatusTone, { background: string; color: string; label: string }> = {
  active: {
    background: color.status.success.background,
    color: color.status.success.text,
    label: 'Active',
  },
  suspended: {
    background: color.deprecated.errorAlt.background,
    color: color.deprecated.errorAlt.text,
    label: 'Suspended',
  },
  error: {
    background: color.deprecated.errorAlt.background,
    color: color.deprecated.errorAlt.text,
    label: 'Unknown Error',
  },
  pending: {
    background: color.status.warning.background,
    color: color.status.warning.text,
    label: 'Pending',
  },
  inactive: {
    background: color.disable.background,
    color: color.disable.text,
    label: 'Inactive',
  },
};

/**
 * A status tag — Figma's "Account Status" (node 2113:1929).
 *
 * The one badge in the family drawn as a soft-cornered box rather than a round
 * pill, because it sits tucked under a name as a property of the thing above
 * it. The other four badges stand alone in a row, which is what earns them
 * their full radius.
 *
 * Its tones are named for account states rather than for severity (`success`,
 * `error`) because that is what a caller has in hand: an account's status
 * comes off the API as "suspended", and a mapping table at every call site is
 * exactly what a design system should absorb.
 */
export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(function StatusBadge(
  {
    tone = 'active',
    children,
    size = 'medium',
    paddingX,
    paddingY,
    radius,
    fontSize,
    background,
    textColor,
    ...rest
  },
  ref,
) {
  const palette = tones[tone];

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: `${len(paddingY) ?? `${badge.status.paddingY[size]}px`} ${
      len(paddingX) ?? `${badge.status.paddingX[size]}px`
    }`,
    borderRadius: len(radius) ?? `${badge.status.radius}px`,
    backgroundColor: background ?? palette.background,
    color: textColor ?? palette.color,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${badge.status.fontSize[size]}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  return (
    <span {...rest} ref={ref} style={style}>
      {children ?? palette.label}
    </span>
  );
});
