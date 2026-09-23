import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon.js';
import {
  IconBubbleFill,
  IconHeartFill,
  IconNosign,
  IconPhoneFill,
  IconRaiseHandFill,
} from '../../icons/defs.js';
import { len, type CssLength } from '../../internal/length.js';

const { stageIcon } = component.taskFeed;

/**
 * Which kind of task the card carries.
 *
 * `fallback` is the stage for a task with no stage of its own — a reminder to
 * update a call's outcome, say. It is not an error state.
 */
export type TaskStage =
  | 'new'
  | 'interested'
  | 'notInterested'
  | 'objection'
  | 'closed'
  | 'mentioned'
  | 'fallback';

/** Per-instance overrides for the marker's own metrics. */
export type StageIconStyleProps = {
  size?: CssLength;
  iconSize?: CssLength;
};

export type StageIconProps = {
  /** @default 'fallback' */
  stage?: TaskStage;
} & StageIconStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * Each stage's mark: its color, and what it draws.
 *
 * `closed` and `mentioned` set a character rather than an icon, because that
 * is what they are — a currency sign and an at-sign are already the symbols
 * for a deal's value and for being named in a thread, and an icon of either
 * would be a picture of a letterform.
 *
 * Figma: node 431:11969.
 */
const STAGES: Record<TaskStage, { tone: string; icon?: typeof IconHeartFill; glyph?: string }> = {
  new: { tone: stageIcon.tone.new, icon: IconBubbleFill },
  interested: { tone: stageIcon.tone.interested, icon: IconHeartFill },
  notInterested: { tone: stageIcon.tone.notInterested, icon: IconNosign },
  objection: { tone: stageIcon.tone.objection, icon: IconRaiseHandFill },
  closed: { tone: stageIcon.tone.closed, glyph: '$' },
  mentioned: { tone: stageIcon.tone.mentioned, glyph: '@' },
  fallback: { tone: color.badge.foreground, icon: IconPhoneFill },
};

/**
 * Turns a stage's color into the disc behind its glyph.
 *
 * The disc is the same hue at a fifth strength, so the pair reads as one mark
 * rather than an icon dropped on a swatch. Mixed against white rather than set
 * as an alpha, because the marker sits on the card's own tint and a
 * transparent disc would pick that up and shift per state.
 */
function tint(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const mix = (channel: number) => Math.round(channel * alpha + 255 * (1 - alpha));

  // Computed from a stage token, not a literal — the channels come from
  // `stageIcon.tone`, mixed toward white.
  // eslint-disable-next-line @gigradar/no-hardcoded-values
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/**
 * The disc at the head of a task card, saying which stage the task came from.
 *
 * Figma: node 431:11969 ("Stage Icon").
 *
 * `fallback` is the one stage drawn on white rather than a tint: it stands for
 * a task with no stage, and giving it a color would invent one. It keeps the
 * brand blue for its glyph so it still reads as a mark and not as a hole.
 */
export const StageIcon = forwardRef<HTMLSpanElement, StageIconProps>(function StageIcon(
  { stage = 'fallback', size, iconSize, ...rest },
  ref,
) {
  const { tone, icon, glyph } = STAGES[stage];
  const plain = stage === 'fallback';

  return (
    <span
      ref={ref}
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: len(size ?? stageIcon.size),
        height: len(size ?? stageIcon.size),
        borderRadius: '50%',
        backgroundColor: plain ? color.main.white : tint(tone, stageIcon.backgroundAlpha),
        overflow: 'hidden',
      }}
      {...rest}
    >
      {icon ? (
        <Icon icon={icon} size={len(iconSize ?? stageIcon.iconSize)} color={tone} />
      ) : (
        <span style={{ ...textStyle.lMedium, fontSize: stageIcon.glyphFontSize, color: tone }}>
          {glyph}
        </span>
      )}
    </span>
  );
});
