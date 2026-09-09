import { color, component, shadow, spacing } from '@gigradar/theme';
import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ComposerButton } from '../Button/ComposerButton.js';
import { ChooseBmButton, type ChooseBmButtonProps } from './ChooseBmButton.js';
import {
  ComposerField,
  type ComposerFieldProps,
  type ComposerLayout,
} from './ComposerField.js';
import { ComposerStatus, type ComposerMode } from './ComposerStatus.js';
import { SendButton } from './SendButton.js';
import { ComposerModeHint, SendShortcut } from './ComposerHints.js';
import { Tooltip } from '../Tooltip/Tooltip.js';

const { frame, markTooltip } = component.middle.composer;

// The mode tooltips carry a paragraph rather than a phrase, so they get a wider
// card than the tooltip's default — at that width the note's copy is a narrow
// ribbon of four-word lines.
const tabHintWidth = markTooltip.hintWidth;

/** Per-instance overrides for the composer's own metrics. */
export type ComposerStyleProps = {
  background?: string;
  boxShadow?: string;
};

export type ComposerProps = {
  /**
   * Which mode is chosen. `message` reaches the room; `note` is private to the
   * team. `schedule` and `edit` are conditions the screen puts the composer in
   * rather than tabs — they are reported by the status badge but not offered.
   * @default 'message'
   */
  mode?: ComposerMode;
  onModeChange?: (mode: 'message' | 'note') => void;
  /**
   * Which of the two layouts to draw. Passed to the field, which drops its
   * character count and rule on mobile.
   * @default 'desktop'
   */
  layout?: ComposerLayout;
  /** The field's own props, passed through. */
  field?: ComposerFieldProps;
  /** The Business Manager picker. Omitted, the control is not drawn. */
  chooseBm?: ChooseBmButtonProps;
  /** Sending, and scheduling. Passing `onSchedule` draws the second button. */
  onSend?: () => void;
  onSchedule?: () => void;
  /**
   * Whether there is anything to send — what fills the send button. Passed
   * rather than derived from the field's text, because a draft can be nothing
   * but an attachment.
   * @default false
   */
  hasDraft?: boolean;
  /** Whether the message can be sent at all. */
  disabled?: boolean;
  /**
   * A band above the field — the "add a Business Manager" prompt, a trial
   * notice, the message being replied to.
   */
  banner?: ReactNode;
} & ComposerStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The box a message is written in.
 *
 * Figma: node 1081:12890 — eight states.
 *
 * Those eight are two things Figma had to enumerate together: which mode the
 * composer is in, and what the room happens to be doing (loading, erroring,
 * missing a Business Manager). Built as `mode` plus the field's own state plus
 * an optional `banner`, they compose — so "a scheduled note that failed to send"
 * is a combination rather than a ninth variant nobody drew.
 *
 * The tabs are the same everywhere the composer can be written in, the queue
 * included: it is the same box writing the same two kinds of thing, and what
 * makes it a queue is that `onSend` is not passed. Only `edit` drops them —
 * editing one message is not a mode you switch out of by picking a tab.
 */
export const Composer = forwardRef<HTMLDivElement, ComposerProps>(function Composer(
  {
    mode = 'message',
    onModeChange,
    layout = 'desktop',
    field,
    chooseBm,
    onSend,
    onSchedule,
    hasDraft = false,
    disabled = false,
    banner,
    background,
    boxShadow,
    ...rest
  },
  ref,
) {
  // The queue draws the tabs too: it is the same composer, writing the same two
  // kinds of thing, and the only difference is that everything written there is
  // queued rather than sent — which the status badge says and the missing send
  // button enforces. Only `edit` drops them, because editing one message is not
  // a mode you can switch out of by picking a tab.
  const switchable = mode !== 'edit';
  // Which tab reads as chosen. `schedule` and `edit` are conditions rather than
  // kinds, and a message is what is being written in both unless the screen says
  // it is a note — so the pair still shows one filled tab rather than neither.
  const kind = mode === 'note' ? 'note' : 'message';
  // A note never leaves the team, so the two controls that act on the client
  // have nothing to act on: there is no one to meet, and nothing to queue for
  // sending. Dropping them is clearer than disabling them, which would imply
  // the note could be scheduled once something else was true.
  const note = mode === 'note';
  // Whether any button stands beside the field. A note can only be sent, never
  // scheduled, so its schedule button is dropped.
  const hasButtons = Boolean(onSend) || Boolean(onSchedule && !note);

  // The buttons are circles that fill the field's height, so their size has to
  // come from a measurement: CSS can stretch a flex child's height, but nothing
  // pulls the width after it, and a square that big cannot be expressed in a
  // rule. Measured here and passed down as a concrete `size`.
  //
  // Sized against a pair whether or not there is one, so the button a queue
  // shows is the same size as the one a room shows.
  const fieldRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState<number | undefined>();

  useLayoutEffect(() => {
    const node = fieldRef.current;
    if (!node || !hasButtons) {
      setButtonSize(undefined);
      return;
    }
    const measure = () => {
      const height = node.getBoundingClientRect().height;
      // A pair divides the field between them; a lone button takes the same
      // size rather than the whole height. Matching the pair is the point — a
      // room and its queue should show the same button, and one circle as tall
      // as the field would dwarf the glyph inside it.
      const gaps = spacing.xxs;
      setButtonSize(Math.max(0, (height - gaps) / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasButtons]);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.s,
        boxSizing: 'border-box',
        width: '100%',
        paddingLeft: frame.paddingX,
        paddingRight: frame.paddingX,
        paddingTop: frame.paddingY,
        paddingBottom: frame.paddingY,
        borderRadius: frame.radius,
        backgroundColor: background ?? color.main.white,
        boxShadow: boxShadow ?? shadow.base,
      }}
      {...rest}
    >
      {banner}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.xs,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xxs }}>
          {switchable && (
            <>
              {/* Each tab explains where its text ends up. The labels have room
                  for one word, and the difference that matters — whether the
                  client sees this — is not in either of them. */}
              <Tooltip content={<ComposerModeHint mode="message" />} maxWidth={tabHintWidth}>
                <ComposerButton
                  info
                  selected={kind === 'message'}
                  onClick={() => onModeChange?.('message')}
                >
                  Message
                </ComposerButton>
              </Tooltip>
              <Tooltip content={<ComposerModeHint mode="note" />} maxWidth={tabHintWidth}>
                <ComposerButton
                  laziza
                  info
                  selected={kind === 'note'}
                  onClick={() => onModeChange?.('note')}
                >
                  Note
                </ComposerButton>
              </Tooltip>
            </>
          )}
        </div>
        {/* The badge states the consequence — who ends up reading this — which
            is the one thing the tab names do not say. */}
        <ComposerStatus mode={mode} compact={layout === 'mobile'} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.xs }}>
        {chooseBm && <ChooseBmButton {...chooseBm} disabled={disabled || chooseBm.disabled} />}
        <div ref={fieldRef} style={{ flex: 1, minWidth: 0 }}>
          <ComposerField
            {...field}
            layout={field?.layout ?? layout}
            // A note has no client to meet, so the field drops the control
            // rather than showing one that cannot do anything.
            onMeeting={note ? undefined : field?.onMeeting}
            disabled={disabled || field?.disabled}
          />
        </div>
        {/* Stacked rather than in a row: schedule is the lesser of the two, and
            side by side they would read as an equal choice.

            The column stretches to the field's height and the pair divides it,
            each growing square so the two stay circles rather than lozenges.
            That means the column widens as the field does — the price of
            circles that genuinely fill the height. A lone button has nothing to
            divide with, so it keeps its resting size at the foot. */}
        <div
          style={{
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: spacing.xxs,
          }}
        >
          {onSchedule && !note && (
            <Tooltip content="Schedule Message">
              <SendButton
                action="schedule"
                // Fills on a draft, the same as send. It used to also require
                // `mode === 'schedule'`, which no draft ever reaches — that
                // mode is a condition the screen puts the composer in after a
                // message is queued, so the button sat empty however much you
                // typed. The purple already says which of the two this is.
                filled={hasDraft}
                disabled={disabled}
                onClick={onSchedule}
                size={buttonSize}
              />
            </Tooltip>
          )}
          {onSend && (
            <Tooltip content={<SendShortcut />}>
              <SendButton
                filled={hasDraft}
                disabled={disabled}
                onClick={onSend}
                size={buttonSize}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
});
