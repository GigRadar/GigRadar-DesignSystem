import { borderWidth, color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type CSSProperties, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';
import { Radio } from '../Radio/Radio.js';

const { autoReply } = component;

/**
 * How much of the row is drawn.
 *
 * `desktop` is the wide row Figma draws at 450px (node 3866:3252) — marker,
 * title, description, and indicator all on one line. `mobile` is the 168px
 * card (node 3957:5107), which drops the description and shrinks the marker,
 * because at that width the description would wrap to three lines and the row
 * would stop reading as one choice.
 */
export type AutoReplyButtonLayout = 'desktop' | 'mobile';

/** Per-instance overrides for the row's own metrics. */
export type AutoReplyButtonStyleProps = {
  padding?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  fontSize?: CssLength;
  /** The square marker's edge length. */
  markerSize?: CssLength;
  /** The accent — border, title, marker, and indicator when selected. */
  accentColor?: string;
  /** Fill when selected. */
  selectedBackground?: string;
  /** Border when neither selected nor hovered. */
  borderColor?: string;
};

export type AutoReplyButtonProps = {
  /** The choice's name — "Full Auto", "All messages". */
  title: ReactNode;
  /** The line under it. Dropped in the `mobile` layout. */
  description?: ReactNode;
  /** The short label inside the square marker — "Auto", "50%". */
  markerLabel?: string;
  /** An icon marker, for a choice with no natural abbreviation. */
  markerIcon?: IconDef;
  /** Whether this option is the chosen one. */
  selected?: boolean;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
  /**
   * How much of the row to draw.
   *
   * @default 'desktop'
   */
  layout?: AutoReplyButtonLayout;
  /** The radio group this option belongs to. */
  name?: string;
  onSelect?: () => void;
  disabled?: boolean;
  /**
   * Content below the row — the extra-prompt field in Figma's `[CUSTOM]`
   * variants. Its presence is what turns the row from one line into a stack.
   */
  children?: ReactNode;
} & AutoReplyButtonStyleProps;

/**
 * One selectable mode in the Auto Reply card.
 *
 * Figma: node 3866:3252 (desktop) and 3957:5107 (mobile), each with Default,
 * Hover, and Selected states plus the `[CUSTOM]` variants that carry a prompt
 * field below the row.
 *
 * Three states, and they are not the same axis: Default is white on the
 * neutral edge, Hover keeps the white fill but takes the accent border, and
 * Selected takes both the accent border and the pale accent fill and turns its
 * title the accent color. So hover previews the commitment without making it —
 * which is why the border moves first and the fill only follows on selection.
 *
 * The indicator is a `Radio` with the `check` mark: exactly one mode applies,
 * so the group gets radio semantics and arrow-key movement, while the filled
 * circle with its white tick is what Figma draws.
 */
export const AutoReplyButton = forwardRef<HTMLLabelElement, AutoReplyButtonProps>(
  function AutoReplyButton(
    {
      title,
      description,
      markerLabel,
      markerIcon,
      selected = false,
      hovered,
      layout = 'desktop',
      name,
      onSelect,
      disabled = false,
      children,
      padding,
      gap,
      radius,
      fontSize,
      markerSize,
      accentColor,
      selectedBackground,
      borderColor,
    },
    ref,
  ) {
    const [pointerInside, setPointerInside] = useState(false);
    const isHovered = (hovered ?? pointerInside) && !disabled && !selected;

    const accent = accentColor ?? color.accent.laziza.main;
    const isMobile = layout === 'mobile';
    // Figma shrinks the marker from 33px to 24px on mobile, where the row is
    // 168px wide and the full square would crowd the label off the line.
    const marker = len(markerSize) ?? (isMobile ? 24 : autoReply.option.markerSize);
    // A row carrying a prompt field stacks; a bare one stays on one line.
    const stacked = children !== undefined;

    const style: CSSProperties = {
      display: 'flex',
      flexDirection: stacked ? 'column' : 'row',
      alignItems: stacked ? 'flex-start' : 'center',
      justifyContent: 'center',
      gap: len(gap) ?? `${autoReply.option.gap}px`,
      boxSizing: 'border-box',
      width: '100%',
      padding: len(padding) ?? autoReply.option.padding,
      borderRadius: len(radius) ?? `${autoReply.option.radius}px`,
      border: `${borderWidth.thin}px solid ${
        selected || isHovered ? accent : (borderColor ?? color.navbar.hover)
      }`,
      backgroundColor: selected
        ? (selectedBackground ?? color.accent.laziza.background)
        : color.main.white,
      fontFamily: typography.fontFamily.base,
      cursor: disabled ? 'not-allowed' : 'pointer',
      overflow: 'hidden',
      transition: 'background-color 120ms ease, border-color 120ms ease',
    };

    return (
      <label
        ref={ref}
        style={style}
        onPointerEnter={() => setPointerInside(true)}
        onPointerLeave={() => setPointerInside(false)}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: autoReply.option.gap, width: '100%' }}>
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxSizing: 'border-box',
              width: marker,
              height: marker,
              borderRadius: autoReply.option.markerRadius,
              backgroundColor: accent,
              color: color.main.white,
              fontSize: autoReply.option.markerFontSize,
              fontWeight: typography.fontWeight.semibold,
              letterSpacing: typography.letterSpacing.s,
              lineHeight: 1,
              overflow: 'hidden',
            }}
          >
            {markerIcon ? <Icon icon={markerIcon} size={isMobile ? 12 : 16} /> : markerLabel}
          </span>

          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              flex: '1 1 auto',
              minWidth: 0,
            }}
          >
            <span
              style={{
                ...typography.textStyle.mMedium,
                fontSize: len(fontSize) ?? autoReply.option.fontSize,
                // The title takes the accent only once chosen — on hover the
                // border alone moves, so a pointer sweeping the row does not
                // read as three selections in a row.
                color: selected ? accent : color.navbar.text2,
              }}
            >
              {title}
            </span>
            {description && !isMobile && (
              <span
                style={{
                  ...typography.textStyle.mRegular,
                  color: color.navbar.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {description}
              </span>
            )}
          </span>

          <Radio
            name={name}
            checked={selected}
            disabled={disabled}
            indicator="check"
            controlSize={16}
            selectedColor={accent}
            borderColor={accent}
            label={typeof title === 'string' ? title : undefined}
            onSelectedChange={() => onSelect?.()}
          />
        </span>
        {children}
      </label>
    );
  },
);
