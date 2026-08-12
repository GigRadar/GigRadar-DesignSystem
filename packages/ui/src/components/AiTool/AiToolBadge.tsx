import { color, component } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconBubbleMessageStroke,
  IconMeetingsStroke,
  IconNotesDocumentStroke,
  IconScheduleClockStroke,
} from '../../icons/defs.js';
import type { IconDef } from '../../icons/defs.js';

const { aiTool } = component;

/**
 * What a capability does, and therefore how it is coloured.
 *
 * Each category owns an accent pair already in the theme — the badge, the tag
 * beside the function name, and any future surface for that category all read
 * the same two values, so a capability keeps its identity across screens.
 */
export type AiToolCategory = 'message' | 'notes' | 'schedule' | 'meeting';

/** Per-instance overrides for the badge's own metrics. */
export type AiToolBadgeStyleProps = {
  size?: CssLength;
  radius?: CssLength;
  iconSize?: CssLength;
  /** Badge fill. Overrides the category's own. */
  background?: string;
  /** Glyph color. Overrides the category's own. */
  iconColor?: string;
};

export type AiToolBadgeProps = {
  /**
   * Which category the capability belongs to.
   *
   * @default 'message'
   */
  category?: AiToolCategory;
  /** Overrides the glyph. Each category has its own. */
  icon?: IconDef;
  /**
   * Draws a diagonal slash through the glyph — Figma's `crossIcon`.
   *
   * Marks a capability the agent cannot currently call. The slash rather than
   * a grey-out because the category still matters when it is off: you need to
   * see *which* capability is unavailable, not just that one is.
   */
  crossed?: boolean;
} & AiToolBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/** The palette and glyph per category — Figma node 3777:9826. */
const categories: Record<
  AiToolCategory,
  { background: string; accent: string; icon: IconDef }
> = {
  message: {
    background: color.badge.background,
    accent: color.badge.foreground,
    icon: IconBubbleMessageStroke,
  },
  notes: {
    background: color.accent.laziza.background,
    accent: color.accent.laziza.main,
    icon: IconNotesDocumentStroke,
  },
  schedule: {
    background: color.accent.schedule.background,
    accent: color.accent.schedule.main,
    icon: IconScheduleClockStroke,
  },
  meeting: {
    background: color.accent.meetings.background,
    accent: color.accent.meetings.main,
    icon: IconMeetingsStroke,
  },
};

/**
 * Returns the palette for a category, so a row can tint its tag to match.
 *
 * Exported because the tag beside the function name has to agree with the
 * badge, and reading the same table is what keeps them from drifting.
 */
export function aiToolPalette(category: AiToolCategory) {
  return categories[category];
}

/**
 * The square category marker at the head of an agent-tool row.
 *
 * Figma: node 3777:9826, with four categories and a `crossIcon` toggle.
 *
 * Not a step of the badge family: those carry a label, and this carries a
 * glyph in a fixed 33px square — the same square as the version pill and the
 * auto-reply marker, which is what makes the three read as one idea across
 * screens.
 */
export const AiToolBadge = forwardRef<HTMLSpanElement, AiToolBadgeProps>(
  function AiToolBadge(
    { category = 'message', icon, crossed = false, size, radius, iconSize, background, iconColor, ...rest },
    ref,
  ) {
    const palette = categories[category];
    const accent = iconColor ?? palette.accent;

    const style: CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxSizing: 'border-box',
      width: len(size) ?? aiTool.badge.size,
      height: len(size) ?? aiTool.badge.size,
      borderRadius: len(radius) ?? `${aiTool.badge.radius}px`,
      backgroundColor: background ?? palette.background,
      color: accent,
      overflow: 'hidden',
    };

    return (
      <span {...rest} ref={ref} style={style}>
        <Icon icon={icon ?? palette.icon} size={len(iconSize) ?? aiTool.badge.iconSize} />
        {crossed && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              // Centred, then rotated about its own middle, so the slash runs
              // corner to corner regardless of the badge's size.
              top: '50%',
              left: '50%',
              width: aiTool.badge.crossWidth,
              height: '86%',
              transform: `translate(-50%, -50%) rotate(${aiTool.badge.crossAngle}deg)`,
              borderRadius: aiTool.badge.crossWidth,
              backgroundColor: accent,
              // The white outline is what keeps the slash readable where it
              // crosses the glyph rather than the background.
              boxShadow: `0 0 0 ${aiTool.badge.crossOutlineWidth}px ${color.main.white}`,
            }}
          />
        )}
      </span>
    );
  },
);
