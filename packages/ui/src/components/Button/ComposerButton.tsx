import { color, component, radius, spacing, typography } from '@gigradar/theme';
import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconInfoLetter, IconLazizaSparkleFill } from '../../icons/defs.js';

const { tab } = component.middle.composer;

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
        {/* The set's own sparkle rather than an inlined path: Laziza is drawn
            with one glyph everywhere it appears, and a second copy here would
            drift the moment the icon set is regenerated. */}
        {laziza && (
          <span aria-hidden style={{ ...markSlot, width: 14, height: 14 }}>
            <Icon
              icon={IconLazizaSparkleFill}
              size={12}
              color={selected ? color.main.white : color.accent.laziza.main}
            />
          </span>
        )}
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
 * The circled-i badge.
 *
 * The circle is a styled frame in Figma too — a round container with a 0.5px
 * border — so it is drawn in CSS, and the glyph inside is the icon set's own
 * `info-letter` rather than an inlined path, so it tracks the set.
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
        width: tab.infoSize,
        height: tab.infoSize,
        borderRadius: radius.round,
        border: `${tab.infoBorderWidth}px solid ${selected ? color.main.white : 'currentColor'}`,
        backgroundColor: selected ? color.main.white : 'transparent',
        color: selected ? color.main.brand : 'currentColor',
      }}
    >
      <Icon icon={IconInfoLetter} size={tab.infoGlyphSize} />
    </span>
  );
}
