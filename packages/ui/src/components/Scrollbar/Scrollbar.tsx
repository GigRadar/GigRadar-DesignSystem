import { color, component } from '@gigradar/theme';
import { useRef, type CSSProperties } from 'react';

const { scrollbar } = component;

/** Per-instance overrides for the bar's own metrics. */
export type ScrollbarStyleProps = {
  /** Thumb thickness. */
  size?: number;
  /** Track padding around the thumb. */
  trackInset?: number;
  /** Thumb corner radius. */
  radius?: number;
  /** Thumb color. */
  thumbColor?: string;
  /** Track color. Transparent by default, so the surface below shows through. */
  trackColor?: string;
};

/**
 * The design system's scrollbar, as a hook.
 *
 * Figma: node 2583:25060, thumb at 43:4122 — an 8px bar with a 4px radius,
 * inset 2px from the track's long edges.
 *
 * A hook rather than a component because a scrollbar is not an element you
 * render: it belongs to whichever box actually scrolls, and the only way to
 * style it is CSS on that box. So this returns the two pieces a scrolling
 * element needs — inline style for Firefox, and a `<style>` string for the
 * WebKit pseudo-elements, which cannot be expressed inline at all.
 *
 *     const bar = useScrollbar();
 *     <div {...bar.props} style={{ overflowY: 'auto', ...bar.style }}>
 *       {bar.styleTag}
 *       …
 *     </div>
 *
 * The rules are scoped to one instance by a generated data attribute, so two
 * scrolling boxes on a page cannot style each other.
 */
export function useScrollbar(overrides: ScrollbarStyleProps = {}) {
  const scopeId = useRef(`gr-scroll-${Math.random().toString(36).slice(2, 9)}`).current;

  const size = overrides.size ?? scrollbar.size;
  const trackInset = overrides.trackInset ?? scrollbar.trackInset;
  const radius = overrides.radius ?? scrollbar.radius;
  const thumb = overrides.thumbColor ?? color.main.scrollbar;
  const track = overrides.trackColor ?? 'transparent';

  const selector = `[data-gr-scrollbar="${scopeId}"]`;

  /**
   * Firefox reads these two standard properties and ignores the pseudo-element
   * rules below; every other engine does the reverse. Both are always emitted,
   * so the bar looks the same either way.
   */
  const style: CSSProperties = {
    scrollbarWidth: 'thin',
    scrollbarColor: `${thumb} ${track}`,
  };

  const css = `
${selector}::-webkit-scrollbar { width: ${size + trackInset * 2}px; height: ${size + trackInset * 2}px; }
${selector}::-webkit-scrollbar-track { background: ${track}; }
${selector}::-webkit-scrollbar-thumb {
  background-color: ${thumb};
  border-radius: ${radius}px;
  border: ${trackInset}px solid transparent;
  background-clip: padding-box;
}
`.trim();

  return {
    /** Spread onto the scrolling element — carries the scoping attribute. */
    props: { 'data-gr-scrollbar': scopeId } as const,
    /** Merge into the scrolling element's `style`. */
    style,
    /** Render inside the scrolling element. */
    styleTag: <style>{css}</style>,
  };
}
