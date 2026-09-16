import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconEditPencilArrow, IconSendPlaneFill, IconTryAgain } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { CustomPromptField } from '../Prompt/CustomPromptField.js';

const { laziza } = component;

/**
 * What the card is showing.
 *
 * `drafting` is Laziza working — three dots and nothing to act on. `draft` is
 * the reply it came back with, and the only state that carries controls.
 *
 * Two states rather than a boolean, because a third is already visible on the
 * horizon: Figma's flow draws a failure, and `state` has room for it where
 * `loading` would not.
 */
export type DraftCardState = 'drafting' | 'draft';

/** Per-instance overrides for the card's own metrics. */
export type DraftCardStyleProps = {
  width?: CssLength;
  padding?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  background?: string;
  borderColor?: string;
};

export type DraftCardProps = {
  /**
   * @default 'draft'
   */
  state?: DraftCardState;
  /**
   * The line above the draft — what this card is, before it is read.
   *
   * Figma writes "Suggested reply to the client - Draft". Passed rather than
   * fixed, since the same card carries a summary and a set of key actions, and
   * those are not replies.
   */
  label?: ReactNode;
  /** The drafted text. Ignored while `drafting`. */
  children?: ReactNode;
  /**
   * Shows the custom-instruction field above the controls.
   *
   * @default true
   */
  instruction?: boolean;
  instructionValue?: string;
  onInstructionChange?: (value: string) => void;
  instructionPlaceholder?: string;
  /**
   * Asks for another draft. Omitted, the control is not drawn.
   */
  onRegenerate?: () => void;
  /** Puts the draft in the composer, unsent. */
  onEdit?: () => void;
  /** Sends the draft to the client as it stands. */
  onSend?: () => void;
  /** Overrides the button labels, for a card that is not a reply. */
  regenerateLabel?: ReactNode;
  editLabel?: ReactNode;
  sendLabel?: ReactNode;
} & DraftCardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

/**
 * Laziza's suggested reply — Figma node 3451:37876.
 *
 * A draft the AI has written and nobody has sent. It is deliberately not a
 * `BubbleChat`: a bubble is a message that happened, and this is a proposal
 * about one. The dashed edge is the whole distinction, and it is why the card
 * cannot simply be a bubble with buttons in it.
 *
 * The controls live inside the card rather than under it because the draft and
 * the things you do to it are one object — dismissing the card dismisses them
 * together, and a row of buttons orphaned below a bubble has to answer which
 * bubble it belongs to.
 */
export const DraftCard = forwardRef<HTMLDivElement, DraftCardProps>(function DraftCard(
  {
    state = 'draft',
    label,
    children,
    instruction = true,
    instructionValue,
    onInstructionChange,
    instructionPlaceholder = 'Enter a custom instruction to re-generate.',
    onRegenerate,
    onEdit,
    onSend,
    regenerateLabel = 'Re-generate',
    editLabel = 'Edit & Send',
    sendLabel = 'Send now',
    width,
    padding,
    gap,
    radius: radiusProp,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  const drafting = state === 'drafting';
  const hasControls = Boolean(onRegenerate || onEdit || onSend);

  return (
    <div
      ref={ref}
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: len(gap) ?? laziza.draft.gap,
        width: len(width) ?? laziza.draft.width,
        maxWidth: '100%',
        padding: len(padding) ?? laziza.draft.padding,
        borderRadius: len(radiusProp) ?? laziza.draft.radius,
        border: `${borderWidth.thin}px ${laziza.draft.borderStyle} ${
          borderColor ?? color.accent.laziza.backgroundAlt
        }`,
        backgroundColor: background ?? color.accent.laziza.background,
      }}
      {...rest}
    >
      {label != null && (
        <span style={{ ...textStyle.sRegular, color: color.accent.laziza.main }}>{label}</span>
      )}

      {drafting ? (
        <DraftingDots />
      ) : (
        <span style={{ ...textStyle.mRegular, color: color.main.black }}>{children}</span>
      )}

      {!drafting && instruction && (
        <CustomPromptField
          value={instructionValue}
          onChange={onInstructionChange}
          placeholder={instructionPlaceholder}
          minHeight={0}
          resizable={false}
        />
      )}

      {!drafting && hasControls && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: laziza.draft.gap,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', gap: laziza.menu.row.gap }}>
            {onRegenerate && (
              <Button size="small" variant="secondary" onClick={onRegenerate}>
                <Icon icon={IconTryAgain} size={14} />
                {regenerateLabel}
              </Button>
            )}
            {onEdit && (
              <Button size="small" variant="secondary" onClick={onEdit}>
                <Icon icon={IconEditPencilArrow} size={14} />
                {editLabel}
              </Button>
            )}
          </span>
          {onSend && (
            <Button size="small" onClick={onSend}>
              <Icon icon={IconSendPlaneFill} size={14} />
              {sendLabel}
            </Button>
          )}
        </span>
      )}
    </div>
  );
});

/**
 * The three dots Laziza shows while it works.
 *
 * Each dot is fainter than the one before it rather than animated in sequence:
 * the thread is a static surface in a screenshot, a test, and a print, and a
 * shape that only reads as "working" while it moves reads as nothing in all
 * three.
 */
function DraftingDots() {
  return (
    <span
      style={{ display: 'flex', alignItems: 'center', gap: laziza.draft.dotGap }}
      role="status"
      aria-label="Laziza is drafting"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          style={{
            width: laziza.draft.dotSize,
            height: laziza.draft.dotSize,
            borderRadius: '50%',
            backgroundColor: color.accent.laziza.main,
            opacity: 1 - index * laziza.draft.dotFadeStep,
          }}
        />
      ))}
    </span>
  );
}
