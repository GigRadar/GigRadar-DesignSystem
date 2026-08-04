import { color, component, textStyle, typography, type StageName } from '@uiuxjoseph/theme';
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

const { badge } = component;

const sizeStyles: Record<BadgeSize, CSSProperties> = {
  small: {
    ...textStyle.sMedium,
    height: `var(--gr-badge-height-small, ${badge.height.small}px)`,
    padding: `0 var(--gr-badge-padding-x-small, ${badge.paddingX.small}px)`,
    gap: `var(--gr-badge-gap-small, ${badge.gap.small}px)`,
  },
  medium: {
    ...textStyle.mMedium,
    height: `var(--gr-badge-height-medium, ${badge.height.medium}px)`,
    padding: `0 var(--gr-badge-padding-x-medium, ${badge.paddingX.medium}px)`,
    gap: `var(--gr-badge-gap-medium, ${badge.gap.medium}px)`,
  },
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
    borderRadius: `var(--gr-badge-radius, ${badge.radius}px)`,
    borderWidth: `var(--gr-badge-border-width, ${badge.borderWidth}px)`,
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
            width: `var(--gr-badge-dot-size, ${badge.dotSize}px)`,
            height: `var(--gr-badge-dot-size, ${badge.dotSize}px)`,
            borderRadius: '9999px',
            backgroundColor: palette.color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
});
