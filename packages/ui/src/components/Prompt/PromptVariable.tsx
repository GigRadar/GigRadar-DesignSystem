import { color, component, typography } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Tooltip } from '../Tooltip/Tooltip.js';

const { prompt } = component;

/** Per-instance overrides for the chip's own metrics. */
export type PromptVariableStyleProps = {
  /** Horizontal padding. */
  paddingX?: CssLength;
  /** Vertical padding. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Mono type size. */
  fontSize?: CssLength;
  /** Chip fill. */
  background?: string;
  /** Token color at rest. */
  textColor?: string;
  /** Token color on hover. Defaults to the brand blue. */
  hoverTextColor?: string;
};

export type PromptVariableProps = {
  /**
   * The variable's name, without braces — `agency_name`, not
   * `{{agency_name}}`.
   *
   * The braces are the component's, not the caller's. They are the notation
   * the prompt template uses, so drawing them here means an app never has to
   * agree with the field on how a variable is spelled, and `onInsert` can hand
   * back exactly the string the field expects.
   */
  name: string;
  /**
   * Wrapper drawn around the name. Change it if the prompt runtime uses a
   * different notation.
   *
   * @default ['{{', '}}']
   */
  delimiters?: [string, string];
  /**
   * Called with the full token — `{{agency_name}}` — when the chip is clicked.
   *
   * Separate from `onClick`, which still fires: `onInsert` carries the payload
   * a caller actually wants, so the common case never has to rebuild the token
   * from `name` and `delimiters`.
   */
  onInsert?: (token: string) => void;
  /**
   * What the variable means — "Your agency display name".
   *
   * Supplying it turns on the hover tooltip (Figma node 8299:60564), which is
   * the only way a user learns what a token expands to. Without it the chip
   * has no tooltip at all, since a card holding just the token the chip
   * already shows would be noise.
   */
  description?: ReactNode;
  /**
   * A sample expansion, shown in the tooltip under the description as
   * `eg. DesignPro.ltd`.
   *
   * Drawn in the chip's own mono style, so the example reads as the value
   * that will land in the prompt rather than as prose about it.
   */
  example?: ReactNode;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
} & PromptVariableStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

/**
 * A template variable chip — `{{agency_name}}` — that inserts itself into the
 * prompt when clicked.
 *
 * Figma: node 3812:23322 ("Add Variables"), with the hover variant at
 * 3812:23324. A pale blue tag holding 11px mono text; hover turns the text
 * brand blue and leaves the fill alone.
 *
 * Rendered as a `<button>` rather than a `<span>` because it does something —
 * that gets keyboard focus and Enter-to-insert for free, which the Figma frame
 * cannot show but every user of a settings form expects.
 */
export const PromptVariable = forwardRef<HTMLButtonElement, PromptVariableProps>(
  function PromptVariable(
    {
      name,
      delimiters = ['{{', '}}'],
      onInsert,
      description,
      example,
      hovered,
      paddingX,
      paddingY,
      radius,
      fontSize,
      background,
      textColor,
      hoverTextColor,
      onClick,
      onPointerEnter,
      onPointerLeave,
      disabled,
      ...rest
    },
    ref,
  ) {
    const [pointerInside, setPointerInside] = useState(false);
    const isHovered = (hovered ?? pointerInside) && !disabled;

    const token = `${delimiters[0]}${name}${delimiters[1]}`;

    const style: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      appearance: 'none',
      border: 'none',
      margin: 0,
      padding: `${len(paddingY) ?? `${prompt.variable.paddingY}px`} ${
        len(paddingX) ?? `${prompt.variable.paddingX}px`
      }`,
      borderRadius: len(radius) ?? `${prompt.variable.radius}px`,
      backgroundColor: background ?? color.main.background,
      color: isHovered
        ? (hoverTextColor ?? color.main.brand)
        : (textColor ?? color.main.description),
      fontFamily: typography.fontFamily.mono,
      fontSize: len(fontSize) ?? `${prompt.variable.fontSize}px`,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'color 120ms ease',
    };

    const chip = (
      <button
        {...rest}
        ref={ref}
        type="button"
        disabled={disabled}
        style={style}
        onPointerEnter={(event) => {
          setPointerInside(true);
          onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          setPointerInside(false);
          onPointerLeave?.(event);
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onInsert?.(token);
        }}
      >
        {token}
      </button>
    );

    if (!description && !example) return chip;

    return (
      <Tooltip
        title={token}
        placement="top"
        content={
          <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {description}
            {example !== undefined && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                eg.
                <span
                  style={{
                    padding: `${prompt.variable.paddingY}px ${prompt.variable.paddingX}px`,
                    borderRadius: prompt.variable.radius,
                    backgroundColor: color.main.background,
                    color: color.main.description,
                    fontFamily: typography.fontFamily.mono,
                    fontSize: prompt.variable.fontSize,
                    lineHeight: 1,
                  }}
                >
                  {example}
                </span>
              </span>
            )}
          </span>
        }
      >
        {chip}
      </Tooltip>
    );
  },
);
