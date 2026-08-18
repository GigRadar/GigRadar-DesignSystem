import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconCheckmarkCircleFill, IconWarningCircleFill, IconXClose } from '../../icons/defs.js';
import { Spinner } from '../Spinner/Spinner.js';

const { testStatus } = component.upworkApiKey;

/** Per-instance overrides for the strip's own metrics. */
export type TestStatusStyleProps = {
  /** Horizontal padding. */
  paddingX?: CssLength;
  /** Vertical padding. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Message type size. */
  fontSize?: CssLength;
  /** Space between the glyph and the message. */
  gap?: CssLength;
  /** Fill. Overrides whatever the tone supplies. */
  background?: string;
  /** Edge color. Overrides the tone's. */
  borderColor?: string;
  /** Message color. Overrides the tone's. */
  textColor?: string;
};

/**
 * What the test came back with.
 *
 * `invalid` is the odd one and is drawn as bare text — no fill, no edge —
 * because it reports a problem with what was typed rather than a result from
 * the server. Nothing was tested, so nothing is being reported on.
 *
 * `warning` is a success: the key works but its permissions are narrower than
 * GigRadar needs, which is a different message from a failure and needs its
 * own palette.
 */
export type TestStatusTone = 'testing' | 'success' | 'warning' | 'failed' | 'invalid';

export type TestStatusProps = {
  /**
   * Which result to draw.
   *
   * @default 'testing'
   */
  tone?: TestStatusTone;
  /** Overrides the message. Each tone carries a default. */
  children?: ReactNode;
} & TestStatusStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** The default message each tone reports. */
const messages: Record<TestStatusTone, string> = {
  testing: 'Testing connection...',
  success: 'Connection successful!',
  warning:
    'Connection successful with limited permissions, please change your permissions in upwork.',
  failed: 'Connection failed!',
  invalid: 'Format or field is missing, try to field the correct format.',
};

/**
 * The result strip under the credential form — Figma's "Test Status"
 * (node 2105:34122).
 *
 * Five outcomes on one shape: a glyph, a message, and a tinted box. Four of
 * them fill and outline in their status color; `invalid` alone drops the box
 * entirely, because a formatting complaint about the field above is not a
 * result and should not look like one.
 *
 * Announced with `role="status"`, so the outcome of a test the user just
 * triggered reaches a screen reader without stealing focus.
 */
export const TestStatus = forwardRef<HTMLDivElement, TestStatusProps>(function TestStatus(
  {
    tone = 'testing',
    children,
    paddingX,
    paddingY,
    radius,
    fontSize,
    gap,
    background,
    borderColor,
    textColor,
    ...rest
  },
  ref,
) {
  const isInvalid = tone === 'invalid';
  const isTesting = tone === 'testing';

  /**
   * Fill, edge, and text per tone. `failed` uses the red wash over white that
   * Figma paints rather than the flat `status.error.background`, so it sits
   * level with the remove button's hover state.
   */
  const palette: Record<TestStatusTone, { background: string; border: string; text: string }> = {
    testing: {
      background: color.status.info.background,
      border: color.main.brand,
      text: color.main.brand,
    },
    success: {
      background: color.status.success.background,
      border: color.status.success.main,
      text: color.status.success.text,
    },
    warning: {
      background: color.status.warning.background,
      border: color.status.warning.main,
      text: color.status.warning.text,
    },
    failed: {
      background: testStatus.failedSurface,
      border: testStatus.failedBorder,
      text: color.status.error.text,
    },
    invalid: {
      background: 'transparent',
      border: 'transparent',
      text: color.status.error.text,
    },
  };

  const tones = palette[tone];

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    gap: len(gap) ?? `${testStatus.gap}px`,
    // The invalid state keeps the vertical rhythm but drops the horizontal
    // pad along with its box, so the text lines up with the field above it.
    paddingBlock: len(paddingY) ?? `${testStatus.paddingY}px`,
    paddingInline: isInvalid ? 0 : (len(paddingX) ?? `${testStatus.paddingX}px`),
    borderRadius: len(radius) ?? `${testStatus.radius}px`,
    border: isInvalid
      ? 'none'
      : `${testStatus.borderWidth}px solid ${borderColor ?? tones.border}`,
    background: background ?? tones.background,
    color: textColor ?? tones.text,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${testStatus.fontSize}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.m,
    lineHeight: 1.4,
  };

  const glyph =
    tone === 'success' ? IconCheckmarkCircleFill : tone === 'warning' ? IconWarningCircleFill : IconXClose;

  return (
    <div {...rest} ref={ref} role="status" aria-live="polite" style={style}>
      {!isInvalid && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: testStatus.iconSize,
            height: testStatus.iconSize,
          }}
        >
          {isTesting ? <Spinner diameter="100%" /> : <Icon icon={glyph} size="100%" />}
        </span>
      )}
      {children ?? messages[tone]}
    </div>
  );
});
