import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { badge } = component;

/**
 * Which subscription the workspace is on.
 *
 * `trial` and `pro` are separate tones rather than one "paid" tone: a trial is
 * the state that ends, and the badge is where someone checks how long is left.
 */
export type PlanTone = 'free' | 'trial' | 'basic' | 'pro' | 'unlimited';

export type PlanBadgeStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  radius?: CssLength;
  fontSize?: CssLength;
  gap?: CssLength;
  /** Fill. Overrides the tone's. */
  background?: string;
  /** Label color. Overrides the tone's. */
  textColor?: string;
};

export type PlanBadgeProps = {
  /**
   * Which plan to draw.
   * @default 'pro'
   */
  tone?: PlanTone;
  /** Overrides the label. Each tone has a default. */
  children?: ReactNode;
  /**
   * A trailing note, e.g. "(7D Remaining)". Figma models this with its
   * `remainingText` toggle, and it is the reason a trial badge is wider than
   * the others.
   */
  note?: ReactNode;
} & PlanBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * Fill, ink, and label per plan, as Figma draws them (node 4016:22047).
 *
 * Only the unpaid tones are quiet. `trial` and `free` sit on the nav wash with
 * grey text — they name a state the workspace is passing through, and a solid
 * badge for "not paying yet" would read as a plan of its own. The three paid
 * tones carry white on their plan's colour, which is the same colour that
 * plan's card is outlined in, so a badge and a card can be matched by eye.
 */
const tones: Record<PlanTone, { background: string; label: string; ink?: string }> = {
  free: { background: color.navbar.hover, ink: color.navbar.text, label: 'Free' },
  trial: { background: color.navbar.hover, ink: color.navbar.text, label: 'Trial' },
  basic: { background: color.badge.foreground, label: 'Basic' },
  pro: { background: color.accent.laziza.main, label: 'Pro' },
  unlimited: { background: color.main.ink, label: 'Unlimited' },
};

/**
 * The plan badge beside the Inbox heading.
 *
 * Figma: node 4016:22052.
 *
 * Filed with the badges rather than with the Inbox because nothing about it is
 * inbox-shaped — it names a subscription, and the header it currently sits in
 * is the only screen that happens to show one today.
 */
export const PlanBadge = forwardRef<HTMLSpanElement, PlanBadgeProps>(function PlanBadge(
  {
    tone = 'pro',
    children,
    note,
    paddingX,
    paddingY,
    radius,
    fontSize,
    gap,
    background,
    textColor,
    ...rest
  },
  ref,
) {
  const { background: fill, label, ink } = tones[tone];

  return (
    <span
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        gap: len(gap) ?? badge.plan.gap,
        paddingLeft: len(paddingX) ?? badge.plan.paddingX,
        paddingRight: len(paddingX) ?? badge.plan.paddingX,
        paddingTop: len(paddingY) ?? badge.plan.paddingY,
        paddingBottom: len(paddingY) ?? badge.plan.paddingY,
        borderRadius: len(radius) ?? badge.plan.radius,
        backgroundColor: background ?? fill,
        color: textColor ?? ink ?? color.main.white,
      }}
      {...rest}
    >
      <span style={{ ...textStyle.mMedium, fontSize: len(fontSize) ?? badge.plan.fontSize }}>
        {children ?? label}
      </span>
      {note != null && (
        <span style={{ ...textStyle.sRegular, fontSize: badge.plan.noteFontSize }}>{note}</span>
      )}
    </span>
  );
});
