import { color, radius, spacing, textStyle, typography, type StageName } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export type BadgeTone = 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'schedule' | 'meetings';
export type BadgeSize = 'small' | 'medium';

export type BadgeProps = {
  /** Semantic color. Ignored when `stage` is set. */
  tone?: BadgeTone;
  size?: BadgeSize;
  /**
   * Renders a CRM pipeline stage badge, using that stage's palette.
   * Takes precedence over `tone`.
   */
  stage?: StageName;
  /** Renders a filled dot before the label. */
  dot?: boolean;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

type TonePalette = { background: string; color: string; border: string };

const tonePalettes: Record<BadgeTone, TonePalette> = {
  brand: { background: color.badge.background, color: color.badge.hover, border: color.badge.border },
  success: { background: color.status.success.background, color: color.status.success.text, border: color.status.success.main },
  warning: { background: color.status.warning.background, color: color.status.warning.textStrong, border: color.status.warning.main },
  error: { background: color.status.error.background, color: color.status.error.text, border: color.status.error.main },
  neutral: { background: color.main.backgroundAlt, color: color.main.description, border: color.main.border },
  schedule: { background: color.accent.schedule.background, color: color.accent.schedule.hover, border: color.accent.schedule.main },
  meetings: { background: color.accent.meetings.background, color: color.accent.meetings.hover, border: color.accent.meetings.main },
};

/**
 * Stage badges use the stage fill as the background and a dark neutral for the
 * label — the stage palette in Figma defines fills only, with no paired
 * foreground.
 */
const stagePalette = (stage: StageName): TonePalette => ({
  background: color.stageFlat[stage],
  color: color.navbar.textActive,
  border: 'transparent',
});

const sizeStyles: Record<BadgeSize, CSSProperties> = {
  small: { ...textStyle.sMedium, height: 20, padding: `0 ${spacing.xs}px`, gap: spacing.xxs },
  medium: { ...textStyle.mMedium, height: 24, padding: `0 ${spacing.s}px`, gap: spacing.xxs },
};

/**
 * A status or category label.
 *
 * The `stage` prop covers the nine CRM pipeline states from the Figma
 * guidebook, so pipeline UI does not hand-roll its own colors.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', size = 'medium', stage, dot = false, children, ...rest },
  ref,
) {
  const palette = stage ? stagePalette(stage) : tonePalettes[tone];

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    fontFamily: typography.fontFamily.base,
    borderRadius: radius.round,
    borderWidth: 1,
    borderStyle: 'solid',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    backgroundColor: palette.background,
    color: palette.color,
    borderColor: palette.border,
  };

  return (
    <span {...rest} ref={ref} style={style}>
      {dot && (
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: radius.round,
            backgroundColor: palette.color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
});
