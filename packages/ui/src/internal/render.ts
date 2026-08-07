import type { ReactNode } from 'react';

/**
 * The render-prop convention for higher-level components.
 *
 * Low-level components — Button, Badge, Avatar, Checkbox — do not take render
 * props. Their markup is the component: there is one right way to draw a
 * button, and a caller who needs a different one needs a different component,
 * not a hook into this one's internals. Adding a render prop there would turn
 * a settled decision back into a question at every call site.
 *
 * Higher-level components are different. A tooltip, a popover, a paginator
 * compose *other* things — a card holding arbitrary content, a row of page
 * buttons — and the composition is where products genuinely differ. Those take
 * a render prop so an app can replace the composed part while keeping the
 * behaviour that is hard to get right: the positioning, the focus and hover
 * wiring, the keyboard handling, the ARIA relationships.
 *
 * The shape is always the same, so learning one teaches the rest:
 *
 *   render<Part>?: (props: <Part>RenderProps) => ReactNode
 *
 * and the props object always carries:
 *
 *   - the resolved data the default renderer would have drawn
 *   - `defaultRender()`, so a caller can wrap rather than replace
 *
 * `defaultRender()` matters more than it looks. Without it, "add one icon to
 * the tooltip card" means reimplementing the whole card, and the reimplementation
 * silently stops tracking the design system. With it, the common case is a
 * wrapper around the default.
 */
export type RenderProp<TProps> = (props: TProps) => ReactNode;

/**
 * Every render-prop payload extends this, so `defaultRender` is always
 * available under the same name.
 */
export type WithDefaultRender = {
  /**
   * Draws what the component would have drawn on its own.
   *
   * Call it to decorate rather than replace:
   *
   *     renderCard={({ defaultRender }) => (
   *       <Highlight>{defaultRender()}</Highlight>
   *     )}
   */
  defaultRender: () => ReactNode;
};
