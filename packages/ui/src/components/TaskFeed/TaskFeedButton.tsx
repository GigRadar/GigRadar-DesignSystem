import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { button } = component.taskFeed;

/** Per-instance overrides for a button's own metrics. */
export type TaskFeedButtonStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  radius?: CssLength;
};

export type TaskFeedButtonProps = {
  children: ReactNode;
} & TaskFeedButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * One of the two actions along a task card's foot.
 *
 * Figma: node 476:4785 ("Task Feed - Button").
 *
 * Not the design system's own `Button`: that one is sized and weighted to be
 * the thing you came to the screen to press. These two sit at the bottom of
 * every card in a scrolling column, so they are quiet by default and only
 * darken under the pointer — a rail of ordinary buttons would read as a rail
 * of calls to action.
 *
 * Hover is tracked here rather than left to CSS because the design system
 * writes its styles inline, with no stylesheet to carry a `:hover` rule.
 */
export const TaskFeedButton = forwardRef<HTMLButtonElement, TaskFeedButtonProps>(
  function TaskFeedButton({ children, paddingX, paddingY, radius, disabled, ...rest }, ref) {
    const [hovered, setHovered] = useState(false);
    const active = hovered && !disabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Each button takes an equal share of the card's foot, so a pair
          // stays symmetrical whichever words they carry.
          flex: 1,
          minWidth: 0,
          padding: `${len(paddingY ?? button.paddingY)} ${len(paddingX ?? button.paddingX)}`,
          borderRadius: len(radius ?? button.radius),
          border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
          backgroundColor: active ? color.navbar.hover : color.main.white,
          color: active ? color.navbar.text2 : color.navbar.text,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          ...textStyle.sMedium,
          whiteSpace: 'nowrap',
        }}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
