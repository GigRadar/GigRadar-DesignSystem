import { color, component } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';

const { counter } = component.middle.composer;

/** Per-instance overrides for the counter's own metrics. */
export type CharacterCountStyleProps = {
  background?: string;
  textColor?: string;
};

export type CharacterCountProps = {
  /** How many characters have been typed. */
  value: number;
  /**
   * The ceiling. Upwork's own limit is 5000, which is why it is the default.
   * @default 5000
   */
  max?: number;
} & CharacterCountStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The character counter under the composer.
 *
 * Figma: node 3696:29930.
 *
 * Drawn as a pill rather than bare text so it holds its shape as the number
 * grows — a count that shifted the toolbar every thousand characters would be
 * worse than no count at all.
 *
 * At the limit the text goes black and drops its dimming. That is the only
 * state change: the count is ambient information until it becomes the reason a
 * message cannot be sent, and turning it red before then would report a problem
 * that has not happened.
 */
export const CharacterCount = forwardRef<HTMLSpanElement, CharacterCountProps>(
  function CharacterCount({ value, max = 5000, background, textColor, ...rest }, ref) {
    const atLimit = value >= max;

    return (
      <span
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          paddingLeft: counter.paddingX,
          paddingRight: counter.paddingX,
          paddingTop: counter.paddingY,
          paddingBottom: counter.paddingY,
          borderRadius: counter.radius,
          backgroundColor: background ?? counter.background,
          fontSize: counter.fontSize,
          color: textColor ?? (atLimit ? color.main.black : color.disable.text),
          opacity: atLimit ? 1 : counter.opacity,
          whiteSpace: 'nowrap',
        }}
        {...rest}
      >
        {value}/{max}
      </span>
    );
  },
);
