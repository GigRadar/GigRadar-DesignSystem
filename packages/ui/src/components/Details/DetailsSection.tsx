import { color, component, textStyle } from '@gigradar/theme';
import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown, type IconDef } from '../../icons/defs.js';

const { section } = component.details;

/** Per-instance overrides for the section's own metrics. */
export type DetailsSectionStyleProps = {
  /** Space between the header and the body it opens. */
  gap?: CssLength;
  /** Space between the header's glyph and its label. */
  titleGap?: CssLength;
  titleIconSize?: CssLength;
  chevronSize?: CssLength;
  /** Label color. */
  textColor?: string;
};

export type DetailsSectionProps = {
  /** The section's name — "Client & Job Details", "Not in this room". */
  title: ReactNode;
  /**
   * A glyph before the label. Only the AI section has one, which is what makes
   * it read as the pane's one loud section rather than another list.
   */
  icon?: IconDef;
  /** The glyph's color. Defaults to the label's. */
  iconColor?: string;
  /** What the section opens to. */
  children: ReactNode;
  /**
   * Whether the section is open, when the caller is driving it. Leave unset to
   * let the section keep its own state.
   */
  open?: boolean;
  /**
   * Which way an uncontrolled section starts.
   * @default true
   */
  defaultOpen?: boolean;
  /**
   * Called with the state the section is moving to.
   *
   * Fires for controlled and uncontrolled sections alike, so an app that only
   * wants to remember the fold does not also have to own it.
   */
  onToggle?: (open: boolean) => void;
  /** A control on the header's trailing edge, before the chevron. */
  action?: ReactNode;
} & DetailsSectionStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'title' | 'onToggle'>;

/**
 * One foldable block of the details pane.
 *
 * Figma: the header row at 4502:33170, repeated once per section of node
 * 82:8753.
 *
 * Every section of the pane is this: a label, a chevron, and a body that folds
 * away. It is a component rather than a prop on each section because the fold
 * is the same gesture everywhere, and a pane where "Relevance" closes
 * differently from "Participant in this room" would be a pane the reader has
 * to learn twice.
 *
 * The whole header is the hit target, not just the chevron — the label is the
 * larger thing to aim at, and a reader who has decided to close a section is
 * aiming at its name.
 *
 * Controlled and uncontrolled both work. The pane ships no persistence: where
 * the fold is remembered is the app's question, and a design system that wrote
 * to `localStorage` would be answering it for every consumer at once.
 */
export const DetailsSection = forwardRef<HTMLElement, DetailsSectionProps>(
  function DetailsSection(
    {
      title,
      icon,
      iconColor,
      children,
      open,
      defaultOpen = true,
      onToggle,
      action,
      gap,
      titleGap,
      titleIconSize,
      chevronSize,
      textColor,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState(defaultOpen);
    const isOpen = open ?? uncontrolled;
    const bodyId = useId();

    function toggle() {
      if (open == null) setUncontrolled(!isOpen);
      onToggle?.(!isOpen);
    }

    return (
      <section
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: len(gap) ?? `${section.gap}px`,
        }}
        {...rest}
      >
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          style={{
            ...textStyle.mMedium,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: len(titleGap) ?? `${section.titleGap}px`,
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'none',
            color: textColor ?? color.navbar.text2,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: len(titleGap) ?? `${section.titleGap}px`,
              minWidth: 0,
            }}
          >
            {icon && (
              <Icon
                icon={icon}
                size={len(titleIconSize) ?? section.titleIconSize}
                color={iconColor ?? color.accent.laziza.main}
              />
            )}
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: `${section.titleGap}px` }}>
            {/*
             * The action sits inside the header button, so a click on it would
             * also fold the section. Stopping the event here rather than asking
             * every caller to remember it.
             */}
            {action != null && (
              <span
                onClick={(event: MouseEvent) => event.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {action}
              </span>
            )}
            {/*
             * Rotated rather than swapped for the up chevron: the turn is what
             * says the header did something, and two glyphs trading places
             * reads as a flicker.
             */}
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                transform: isOpen ? undefined : 'rotate(-90deg)',
                transition: `transform ${section.duration}ms ease`,
              }}
            >
              <Icon
                icon={IconDropdownArrowDown}
                size={len(chevronSize) ?? section.chevronSize}
                color={color.navbar.text}
              />
            </span>
          </span>
        </button>

        {/*
         * The body is unmounted when closed rather than hidden. A hidden body
         * keeps its scroll position and its focusable controls alive — on this
         * pane that means a closed "Not in this room" list still catches the
         * Tab key on four Add buttons.
         */}
        {isOpen && <div id={bodyId}>{children}</div>}
      </section>
    );
  },
);
