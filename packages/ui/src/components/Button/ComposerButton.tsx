import { color, radius, spacing, typography } from '@uiuxjoseph/theme';
import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

/**
 * A composer tab — the Message / Note toggle above a message box.
 *
 * Mirrors the Figma components at nodes 100:4694 and 100:4695. Separate from
 * `Button` because the shape genuinely differs rather than just the color: it
 * has no border, is transparent until hovered or selected, uses 12px semibold
 * rather than 14px medium, and its states are `selected` / not — there is no
 * disabled or loading state drawn.
 *
 * Both Figma components are this one control with a different label and
 * trailing marks, so they are usage rather than variants.
 */
export type ComposerButtonProps = {
  /** The label. */
  children?: ReactNode;
  /**
   * Whether this tab is the active one. Selected fills brand blue with a white
   * label; otherwise the button is transparent and tints only on hover.
   */
  selected?: boolean;
  /**
   * The Laziza spark drawn on the Note tab (node 3448:34933) — the mark for an
   * AI-assisted composer. Laziza orange at rest, white when selected.
   */
  laziza?: boolean;
  /**
   * The circled-i badge Figma draws after the label. Outlined at rest;
   * selected inverts it to a filled white circle with a brand-blue glyph.
   */
  info?: boolean;
  /**
   * Arbitrary trailing content, after the built-in marks. For anything the
   * two drawn marks do not cover.
   */
  endIcon?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

export const ComposerButton = forwardRef<HTMLButtonElement, ComposerButtonProps>(
  function ComposerButton(
    { children, selected = false, laziza = false, info = false, endIcon, type = 'button', ...rest },
    ref,
  ) {
    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xxs,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: spacing.xs,
      paddingBottom: spacing.xs,
      borderRadius: radius.xs,
      border: 'none',
      // Transparent when resting, so the tabs read as text until one is
      // chosen. The radius is still set, so the hover fill lands rounded.
      backgroundColor: selected ? color.main.brand : 'transparent',
      color: selected ? color.main.white : color.main.description,
      fontFamily: typography.fontFamily.base,
      fontSize: typography.fontSize.s,
      fontWeight: typography.fontWeight.semibold,
      letterSpacing: typography.letterSpacing.s,
      // Figma's "leading normal" — a ~14px line box on the 12px label, which
      // is what makes the tab 26px tall. A 1.0 ratio would render it 24px.
      lineHeight: 'normal',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      userSelect: 'none',
      appearance: 'none',
    };

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        // The tabs are a single choice, so the selected one is announced as
        // pressed rather than just looking filled.
        aria-pressed={selected}
        style={style}
        onMouseEnter={(event) => {
          if (!selected) event.currentTarget.style.backgroundColor = color.navbar.hover;
          rest.onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          if (!selected) event.currentTarget.style.backgroundColor = 'transparent';
          rest.onMouseLeave?.(event);
        }}
      >
        {children}
        {laziza && <SparkMark selected={selected} />}
        {info && <InfoMark selected={selected} />}
        {endIcon != null && (
          <span aria-hidden style={{ ...markSlot, width: 12, height: 12 }}>
            {endIcon}
          </span>
        )}
      </button>
    );
  },
);

const markSlot: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

/**
 * The Laziza spark.
 *
 * Figma draws it as the SF Symbols glyph 􀫸, which is an Apple-only font — on
 * the web it would render as a missing-glyph box. The path here is Figma's own
 * SVG export of that text layer (node 3448:34933), so the geometry is exact;
 * `currentColor` lets the one asset serve both the orange resting state and
 * the white selected one.
 *
 * The glyph draws ~11.4px inside its 14px line box, hence the smaller SVG
 * centred in a 14px slot.
 */
function SparkMark({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        ...markSlot,
        width: 14,
        height: 14,
        color: selected ? color.main.white : color.accent.laziza.main,
      }}
    >
      <svg viewBox="0 0 11.415 11.403" width="11.415" height="11.403" fill="none">
        <path
          d="M5.70703 11.4023C5.49023 11.4023 5.31445 11.2441 5.2793 11.0098C4.74023 7.11328 4.22461 6.63281 0.410156 6.12891C0.169922 6.10547 0 5.92969 0 5.70117C0 5.47266 0.169922 5.29688 0.410156 5.26758C4.22461 4.85156 4.77539 4.29492 5.2793 0.386719C5.31445 0.152344 5.49023 0 5.70703 0C5.92383 0 6.09961 0.152344 6.13477 0.386719C6.63867 4.29492 7.18945 4.85156 11.0039 5.26758C11.2441 5.29688 11.4141 5.47266 11.4141 5.70117C11.4141 5.92969 11.2441 6.10547 11.0039 6.12891C7.18945 6.55078 6.63867 7.10742 6.13477 11.0098C6.09961 11.2441 5.92383 11.4023 5.70703 11.4023Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

/**
 * The circled-i badge.
 *
 * The circle is a styled frame in Figma too — a 12px round container with a
 * 0.5px border — so it is drawn in CSS, and only the glyph inside (SF Symbols
 * 􀅳, node 100:4700) is the exported path.
 *
 * At rest both circle and glyph run in the label color; selected inverts the
 * badge to a filled white circle with the glyph in brand blue.
 */
function InfoMark({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        ...markSlot,
        boxSizing: 'border-box',
        width: 12,
        height: 12,
        borderRadius: radius.round,
        border: `0.5px solid ${selected ? color.main.white : 'currentColor'}`,
        backgroundColor: selected ? color.main.white : 'transparent',
        color: selected ? color.main.brand : 'currentColor',
      }}
    >
      <svg viewBox="0 0 2.617 4.709" width="2.617" height="4.709" fill="none">
        <path
          d="M0.767578 0.506836C0.767578 0.222656 0.990234 0 1.27148 0C1.55859 0 1.77539 0.222656 1.77832 0.506836C1.77832 0.788086 1.55859 1.01367 1.27148 1.01367C0.990234 1.01367 0.767578 0.788086 0.767578 0.506836ZM0.00292969 4.34473C0 4.12207 0.155273 3.97852 0.395508 3.97852H0.993164V2.34375H0.477539C0.237305 2.34375 0.0849609 2.20312 0.0820312 1.9834C0.0820312 1.75781 0.234375 1.61426 0.477539 1.61426H1.3916C1.61719 1.61426 1.7666 1.75781 1.7666 1.98926V3.97852H2.2207C2.46387 3.97852 2.61621 4.12207 2.61328 4.34473C2.61035 4.56738 2.45801 4.70801 2.2207 4.70801H0.395508C0.158203 4.70801 0.00585938 4.56738 0.00292969 4.34473Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
