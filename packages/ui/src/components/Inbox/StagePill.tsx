import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { stagePill } = component.inbox;

/** Per-instance overrides for the pill's own metrics. */
export type StagePillStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  radius?: CssLength;
  fontSize?: CssLength;
  /** Label color. Defaults to black, which every stage tint is chosen against. */
  textColor?: string;
};

export type StagePillProps = {
  /** The stage's name — "New", "Interested", "Booked". */
  children: ReactNode;
  /**
   * The pill's fill. Pass a value from `color.stageFlat`, keyed by the stage
   * the lead is in.
   */
  tone: string;
} & StagePillStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * A lead's position in the pipeline, as a tinted pill.
 *
 * Figma: "Lead Stage Badge - M" (node 3523:37525).
 *
 * Takes a `tone` rather than a stage name so it stays a presentation
 * component: the mapping from "interested" to a hex lives in
 * `color.stageFlat`, and a screen that has already looked one up should not
 * have to hand this a string for it to look up again.
 *
 * Deliberately not a `StatusBadge` variant. That badge's tones are semantic —
 * success, error, pending — and a pipeline stage is not a status: "Booked" is
 * not a healthier state than "New", it is a later one.
 */
export const StagePill = forwardRef<HTMLSpanElement, StagePillProps>(function StagePill(
  { children, tone, paddingX, paddingY, radius, fontSize, textColor, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      style={{
        ...textStyle.sRegular,
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        fontSize: len(fontSize) ?? stagePill.fontSize,
        padding: `${len(paddingY) ?? `${stagePill.paddingY}px`} ${
          len(paddingX) ?? `${stagePill.paddingX}px`
        }`,
        borderRadius: len(radius) ?? stagePill.radius,
        backgroundColor: tone,
        color: textColor ?? color.main.black,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      {...rest}
    >
      {children}
    </span>
  );
});
