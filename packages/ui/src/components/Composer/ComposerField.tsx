import {
  borderWidth,
  color,
  component,
  fontFamily,
  radius as radiusToken,
} from '@gigradar/theme';
import {
  Children,
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { CharacterCount } from './CharacterCount.js';
import { ComposerIconButton } from './ComposerIconButton.js';
import { MarkShortcut } from './MarkShortcut.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import {
  IconAttachmentClip,
  IconBoldFormat,
  IconCodeFormat,
  IconDropdownArrowLeft,
  IconDropdownArrowRight,
  IconItalicFormat,
  IconLazizaSparkleStroke,
  IconMeetingsStroke,
  IconStrikethroughFormat,
} from '../../icons/defs.js';

const { field, iconButton } = component.middle.composer;

/** Which rich-text marks are applied to the selection. */
export type TextMark = 'bold' | 'italic' | 'strike' | 'code';

/**
 * Which of the two layouts to draw. Matches `ChatRoom` and `ChatHeader`, and is
 * passed down for the same reason: the shell knows which chrome it is drawing,
 * and the composer cannot work it out from its own width.
 */
export type ComposerLayout = 'desktop' | 'mobile';

/** Per-instance overrides for the field's own metrics. */
export type ComposerFieldStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  minHeight?: CssLength;
  background?: string;
  borderColor?: string;
};

export type ComposerFieldProps = {
  /** The draft. Controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /**
   * The ceiling on the draft's length. Passing it draws the counter.
   */
  maxLength?: number;
  /**
   * Which of the two layouts to draw.
   *
   * Mobile drops the character count and the rule beside it, and shows the
   * toolbar's two halves one at a time: a chevron swaps between the four
   * rich-text marks and the controls that act on the message. The row has seven
   * controls in roughly half the width — the count is the one thing on it that
   * reports rather than does, and the two groups are never both needed at once.
   * @default 'desktop'
   */
  layout?: ComposerLayout;
  /** Which marks are applied. Omitted, the rich-text controls are not drawn. */
  marks?: TextMark[];
  onMarkToggle?: (mark: TextMark) => void;
  /** Attachments waiting to be sent — pass `ComposerAttachment`s. */
  attachments?: ReactNode;
  /**
   * Attaching a file. Passing it draws the clip.
   *
   * Called with the files the person chose, so the composer can add them to its
   * own list — the field opens the chooser but does not keep what comes back,
   * since the draft belongs to whatever is sending it.
   */
  onAttach?: (files: FileList) => void;
  /**
   * Which file types the chooser offers. Passed straight to the input's
   * `accept`, so a screen that only takes images can say so.
   */
  accept?: string;
  /** Proposing a meeting. Passing it draws the camera. */
  onMeeting?: () => void;
  /**
   * Asking Laziza for a draft. Passing it draws the sparkle at the head of the
   * trailing controls — before the clip, because it writes the message the
   * other two attach to.
   */
  onDraftAi?: () => void;
  /**
   * The draft could not be sent. Washes the field red and drops its toolbar —
   * there is nothing to format while the message is being rejected.
   * @default false
   */
  error?: boolean;
  /** Whether anything can be typed. */
  disabled?: boolean;
} & ComposerFieldStyleProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'className' | 'style' | 'value' | 'onChange' | 'maxLength'
  > &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'defaultValue' | 'onChange'>;

const markIcons = {
  bold: IconBoldFormat,
  italic: IconItalicFormat,
  strike: IconStrikethroughFormat,
  code: IconCodeFormat,
} as const;

/**
 * How the draft is drawn while a mark is on.
 *
 * Every mark maps to one CSS property, so they compose: a bold italic draft
 * carries both.
 */
function markPreview(marks: TextMark[] | undefined): CSSProperties {
  return {
    fontFamily: marks?.includes('code') ? fontFamily.mono : 'inherit',
    fontWeight: marks?.includes('bold') ? 700 : undefined,
    fontStyle: marks?.includes('italic') ? 'italic' : undefined,
    textDecoration: marks?.includes('strike') ? 'line-through' : undefined,
  };
}

const markLabels = {
  bold: 'Bold',
  italic: 'Italic',
  strike: 'Strikethrough',
  code: 'Code',
} as const;

/**
 * The field a message is typed into.
 *
 * Figma: node 100:4641 — six states, of which four are the ordinary lifecycle of
 * a text box (empty, filled, hovered, disabled) and two are conditions the
 * composer puts it in (error, editing).
 *
 * A real `<textarea>` rather than a contenteditable div: the draft is plain text
 * with marks applied to a selection, and every accessibility and IME behaviour a
 * contenteditable would have to reimplement already works here.
 *
 * The toolbar is drawn from what is passed — no `marks`, no rich-text controls;
 * no `maxLength`, no counter — so a composer that does not offer formatting is
 * not carrying a disabled row of buttons.
 */
export const ComposerField = forwardRef<HTMLTextAreaElement, ComposerFieldProps>(
  function ComposerField(
    {
      value,
      defaultValue = '',
      onValueChange,
      placeholder = 'Write a message, paste text and files or @laziza to invoke Laziza AI here…',
      layout = 'desktop',
      maxLength,
      marks,
      onMarkToggle,
      attachments,
      onAttach,
      accept,
      onMeeting,
      onDraftAi,
      error = false,
      disabled = false,
      radius,
      padding,
      minHeight,
      background,
      borderColor,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [focused, setFocused] = useState(false);
    const [marksOpen, setMarksOpen] = useState(false);
    const draft = value ?? uncontrolled;
    const fileInput = useRef<HTMLInputElement>(null);

    // `Children.count` rather than a truthiness check: an empty array, `null`,
    // and a `false` from a caller's `&&` all have to mean "no tray", and only
    // counting the rendered children catches all three.
    const hasAttachments = Children.count(attachments) > 0;

    // Error outranks focus: a field being rejected should not also read as the
    // one being typed in.
    const edge = error
      ? color.status.error.main
      : focused
        ? color.badge.foreground
        : 'transparent';

    // Desktop shows everything at once. Mobile trades one group for the other:
    // the marks are up or the message controls are, never both.
    const mobile = layout === 'mobile';
    const showMarks = !mobile || marksOpen;
    const showTrailing = !mobile || !marksOpen;
    // The count and its rule are desktop-only.
    const countMax = mobile ? undefined : maxLength;
    const showToolbar =
      !error && (marks != null || countMax != null || onAttach || onMeeting || onDraftAi);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: field.gap,
          boxSizing: 'border-box',
          width: '100%',
          minHeight: len(minHeight) ?? field.minHeight,
          padding: len(padding) ?? field.padding,
          borderRadius: len(radius) ?? field.radius,
          border: `${borderWidth.thin}px solid ${borderColor ?? edge}`,
          backgroundColor:
            background ?? (disabled ? color.disable.background : color.main.background),
          // Figma layers a 15% red over the fill rather than replacing it, so the
          // wash composites the same way whatever the field's own colour is.
          backgroundImage: error
            ? `linear-gradient(${field.errorTint}, ${field.errorTint})`
            : undefined,
        }}
        {...rest}
      >
        <textarea
          ref={ref}
          value={draft}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          onChange={(event) => {
            if (value === undefined) setUncontrolled(event.target.value);
            onValueChange?.(event.target.value);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            fontSize: field.fontSize,
            lineHeight: `${field.lineHeight}px`,
            color: disabled ? color.disable.text : color.main.black,
            // Pressing a mark previews it on the draft.
            //
            // A `<textarea>` holds plain text, so the preview is the whole
            // field rather than a selection — which is what these controls
            // mean here anyway: nothing tracks a cursor range, so a mark is a
            // property of the message being written, and showing it on the
            // text is the only way to see that it is on. The real per-range
            // formatting belongs to whatever editor the product mounts; this
            // is the design system showing the state it was given.
            ...markPreview(marks),
          }}
        />

        {/* The tray exists only once something is in it. Gated on rendered
            children rather than on the prop, so an empty list or a `false` from
            a caller's `&&` leaves no empty strip padding the field out. */}
        {hasAttachments && (
          <div style={{ display: 'flex', gap: field.gap, flexWrap: 'wrap' }}>{attachments}</div>
        )}

        {showToolbar && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: field.toolbarGap }}>
              {/* Mobile shows one group at a time. The row has seven controls
                  and roughly half the width, so formatting and the controls
                  that act on the message take turns rather than crowding: the
                  chevron points the way the row is about to move, and points
                  back once the marks are up. */}
              {marks != null && layout === 'mobile' && (
                <ComposerIconButton
                  icon={marksOpen ? IconDropdownArrowLeft : IconDropdownArrowRight}
                  label={marksOpen ? 'Hide formatting' : 'Show formatting'}
                  iconSize={iconButton.markIconSize}
                  disabled={disabled}
                  onClick={() => setMarksOpen((open) => !open)}
                />
              )}
              {marks != null && showMarks && (
                <div style={{ display: 'flex', alignItems: 'center', gap: field.markGap }}>
                  {(Object.keys(markIcons) as TextMark[]).map((mark) => (
                    // The tooltip names the mark and gives its shortcut on both
                    // platforms — the toolbar's four glyphs are variations on a
                    // letterform, and the keystroke is what a writer is actually
                    // reaching for once they know which is which.
                    <Tooltip key={mark} content={<MarkShortcut mark={mark} />}>
                      <ComposerIconButton
                        icon={markIcons[mark]}
                        label={markLabels[mark]}
                        iconSize={iconButton.markIconSize}
                        active={marks.includes(mark)}
                        disabled={disabled}
                        onClick={() => onMarkToggle?.(mark)}
                      />
                    </Tooltip>
                  ))}
                </div>
              )}
              {/* The rule only appears with something on both sides of it. */}
              {marks != null && countMax != null && (
                <span
                  aria-hidden
                  style={{
                    width: field.dividerWidth,
                    height: field.dividerHeight,
                    borderRadius: radiusToken.round,
                    backgroundColor: color.disable.text,
                    opacity: field.dividerOpacity,
                  }}
                />
              )}
              {countMax != null && <CharacterCount value={draft.length} max={countMax} />}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: field.markGap }}>
              {showTrailing && onDraftAi && (
                <Tooltip content="Draft AI Response">
                  <ComposerIconButton
                    icon={IconLazizaSparkleStroke}
                    label="Draft AI Response"
                    disabled={disabled}
                    onClick={onDraftAi}
                  />
                </Tooltip>
              )}
              {/* A real file input, hidden and driven by the clip. The browser's
                  chooser is the only way to read a file the person picked, and
                  reimplementing the button as a styled `<input>` would lose the
                  hover and active states every other control in this row has.

                  Mounted whenever `onAttach` is passed, rather than alongside
                  the clip: on mobile the clip comes and goes with the toolbar's
                  two groups, and an input unmounted while its chooser is open
                  would drop the file the person just chose. */}
              {onAttach && (
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept={accept}
                  hidden
                  onChange={(event) => {
                    const { files } = event.target;
                    if (files && files.length > 0) onAttach(files);
                    // Cleared so choosing the same file twice in a row still
                    // fires — the input would otherwise see no change.
                    event.target.value = '';
                  }}
                />
              )}
              {showTrailing && onAttach && (
                <Tooltip content="Send Attachment">
                  <ComposerIconButton
                    icon={IconAttachmentClip}
                    label="Send Attachment"
                    disabled={disabled}
                    onClick={() => fileInput.current?.click()}
                  />
                </Tooltip>
              )}
              {showTrailing && onMeeting && (
                <Tooltip content="Propose Meeting">
                  <ComposerIconButton
                    icon={IconMeetingsStroke}
                    label="Propose Meeting"
                    disabled={disabled}
                    onClick={onMeeting}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
