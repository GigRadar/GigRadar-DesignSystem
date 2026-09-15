import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconThumbsDownFill, IconThumbsUpFill } from '../../icons/defs.js';

const { relevance } = component.details;

/** Which of the pair this is — the thumb decides, and so does the colour. */
export type RelevanceVerdict = 'relevant' | 'notRelevant';

/** Per-instance overrides for the button's own metrics. */
export type RelevanceButtonStyleProps = {
  height?: CssLength;
  radius?: CssLength;
  paddingX?: CssLength;
  borderWidth?: CssLength;
  iconSize?: CssLength;
};

export type RelevanceButtonProps = {
  /**
   * @default 'relevant'
   */
  verdict?: RelevanceVerdict;
  /** The label. Defaults to what the verdict means. */
  children?: ReactNode;
  /**
   * Whether this is the verdict currently recorded.
   * @default false
   */
  selected?: boolean;
} & RelevanceButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * One half of the relevance verdict — was this lead worth surfacing.
 *
 * Figma: "Relevance Button" at 588:16397 and "Not Relevance Button" at
 * 588:16398, each in Default, Hover, and Selected.
 *
 * At rest the label is drawn in the border grey rather than in black. That is
 * unusual and deliberate: the pair is feedback the product asks for, not work
 * the reader came to do, so it stays quiet until pointed at and only commits
 * to a colour once it holds the answer.
 *
 * The two are one component with a `verdict` rather than two, because they are
 * the same control: same height, same padding, same states — a thumb pointing
 * the other way and, once chosen, a different tint.
 */
export const RelevanceButton = forwardRef<HTMLButtonElement, RelevanceButtonProps>(
  function RelevanceButton(
    {
      verdict = 'relevant',
      children,
      selected = false,
      height,
      radius,
      paddingX,
      borderWidth,
      iconSize,
      onMouseEnter,
      onMouseLeave,
      disabled,
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);
    const up = verdict === 'relevant';
    const active = hovered && !disabled;

    /*
     * Selected wins over hover: once a verdict is recorded the button holds
     * its tint, so pointing at the one already chosen does not make it look
     * like a fresh choice.
     */
    const ink = selected ? color.badge.foreground : active ? color.main.black : color.main.border;

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        disabled={disabled}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          ...textStyle.mRegular,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: '1 0 0',
          minWidth: 0,
          height: len(height) ?? `${relevance.height}px`,
          padding: `0 ${len(paddingX) ?? `${relevance.paddingX}px`}`,
          borderRadius: len(radius) ?? `${relevance.radius}px`,
          backgroundColor: selected ? color.navbar.disabledBackground : color.main.white,
          /*
           * The selected state has no border at all — the fill is what carries
           * it. Kept as a transparent border rather than none so the button
           * does not change size when the verdict is recorded.
           */
          border: `${len(borderWidth) ?? `${relevance.borderWidth}px`} solid ${
            selected ? 'transparent' : active ? color.badge.foreground : color.main.border
          }`,
          color: ink,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : undefined,
        }}
        {...rest}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {children ?? (up ? 'Relevant' : 'Not Relevant')}
        </span>
        <Icon
          icon={up ? IconThumbsUpFill : IconThumbsDownFill}
          size={len(iconSize) ?? relevance.iconSize}
          color={ink}
        />
      </button>
    );
  },
);

export type RelevanceButtonsProps = {
  /** Which verdict is recorded, if any. */
  value?: RelevanceVerdict;
  /** Called with the verdict the reader picked. */
  onChange?: (verdict: RelevanceVerdict) => void;
  /** Turns both buttons inert. */
  disabled?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onChange'>;

/**
 * The pair, side by side and equally wide.
 *
 * Equal widths rather than hugging their labels: the two are a choice between
 * equals, and a wider "Not Relevant" would read as the recommended answer.
 */
export const RelevanceButtons = forwardRef<HTMLDivElement, RelevanceButtonsProps>(
  function RelevanceButtons({ value, onChange, disabled, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        style={{ display: 'flex', alignItems: 'center', gap: `${relevance.gap}px` }}
        {...rest}
      >
        <RelevanceButton
          verdict="relevant"
          selected={value === 'relevant'}
          disabled={disabled}
          onClick={() => onChange?.('relevant')}
        />
        <RelevanceButton
          verdict="notRelevant"
          selected={value === 'notRelevant'}
          disabled={disabled}
          onClick={() => onChange?.('notRelevant')}
        />
      </div>
    );
  },
);
