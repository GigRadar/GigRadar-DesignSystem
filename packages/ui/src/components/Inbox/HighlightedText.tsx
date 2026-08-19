import { color, radius } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';

export type HighlightedTextStyleProps = {
  /** The fill behind a match. */
  background?: string;
  /** The matched text's color. */
  textColor?: string;
};

export type HighlightedTextProps = {
  /** The full string to draw. */
  children: string;
  /**
   * What to highlight inside it. Matching is case-insensitive and finds every
   * occurrence; an empty or absent query draws the text untouched.
   */
  query?: string;
} & HighlightedTextStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children'>;

/** Escapes a user's query so regex metacharacters match literally. */
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Text with the search query marked inside it.
 *
 * Figma highlights matches with "Highlight-Search"; the solid token is used
 * here rather than the translucent one, because these matches sit on room
 * cards whose own fill changes — white, hover grey, brand blue when selected —
 * and a translucent wash would come out a different color on each.
 *
 * Rendered with `<mark>`, which carries the meaning to a screen reader instead
 * of leaving the highlight as decoration only sighted users can act on.
 *
 * Only whole occurrences are marked, and the query is escaped before matching:
 * a search for "C++" or "(remote)" would otherwise throw rather than find
 * anything.
 */
export const HighlightedText = forwardRef<HTMLSpanElement, HighlightedTextProps>(
  function HighlightedText({ children, query, background, textColor, ...rest }, ref) {
    const term = query?.trim();

    if (!term) {
      return (
        <span ref={ref} {...rest}>
          {children}
        </span>
      );
    }

    // Split on the query rather than scanning: the capture group keeps the
    // matched text in the result, so the pieces reassemble into the original
    // string with the matches at odd indices.
    const pieces = children.split(new RegExp(`(${escapeRegExp(term)})`, 'gi'));

    return (
      <span ref={ref} {...rest}>
        {pieces.map((piece, index) =>
          index % 2 === 1 ? (
            <mark
              key={index}
              style={{
                backgroundColor: background ?? color.main.highlightSolid,
                color: textColor ?? color.main.black,
                // A mark is inline by default and inherits nothing; without
                // this it would reset the weight and size it sits inside.
                font: 'inherit',
                borderRadius: radius.xxs,
                padding: 0,
              }}
            >
              {piece}
            </mark>
          ) : (
            piece
          ),
        )}
      </span>
    );
  },
);
