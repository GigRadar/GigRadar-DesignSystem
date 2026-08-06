import type { CSSProperties } from 'react';
import type { IconDef } from './defs.js';

export type IconProps = {
  /** Which icon to draw — import from the icon set, e.g. `IconLockFill`. */
  icon: IconDef;
  /**
   * Rendered size in px. Icons are drawn on a 24×24 grid; other sizes scale.
   * @default 24
   */
  size?: number;
  /**
   * Icon color. Defaults to inheriting the surrounding text color, which is
   * usually what you want — a label's icon should match its text.
   */
  color?: string;
  /**
   * Accessible name. Omit for decorative icons (the default) — they are
   * hidden from screen readers; text beside them carries the meaning.
   */
  label?: string;
};

/**
 * Draws one icon from the GigRadar set.
 *
 *   <Icon icon={IconLockFill} />
 *   <Icon icon={IconSearch} size={16} color={color.main.description} />
 *
 * Icons are monochrome and follow `currentColor`, so they take the color of
 * the text around them unless `color` is set.
 *
 * The bodies are generated at build time from the Figma icon set; rendering
 * via innerHTML is safe because the markup never includes user input.
 */
export function Icon({ icon, size = 24, color, label }: IconProps) {
  const style: CSSProperties | undefined = color ? { color } : undefined;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
