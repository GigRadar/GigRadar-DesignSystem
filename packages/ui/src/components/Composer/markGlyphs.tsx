/* eslint-disable @gigradar/no-hardcoded-values */
import { color, component, textStyle } from '@gigradar/theme';
import type { CSSProperties, ReactNode } from 'react';

const { markTooltip } = component.middle.composer;

/**
 * The three marks the rich-text shortcut tooltip draws: the two platform logos
 * that head its rows, and the ⌘ that sits in a keycap.
 *
 * Kept here rather than in the icon set because they are not GigRadar icons.
 * `icons/defs.ts` is generated from the Figma icon page and says so at the top;
 * these came off the tooltip nodes themselves (7843:662917 and siblings), are
 * not on a 24×24 grid, and appear nowhere else in the product. Adding them to a
 * generated file would put them one regeneration away from disappearing.
 *
 * Each is the exported Figma path verbatim, re-pointed at `currentColor` so it
 * takes the tooltip's own text colour.
 */

type GlyphProps = {
  size: number;
  style?: CSSProperties;
};

/** The Apple mark, heading the macOS row. Figma draws it 10×12. */
export function AppleGlyph({ size, style }: GlyphProps) {
  return (
    <svg
      width={(size * 10) / 12}
      height={size}
      viewBox="0 0 10 12"
      fill="none"
      aria-hidden
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path
        d="M9.65831 4.0392C8.69156 4.6056 8.25541 5.4444 8.34987 6.5556C8.44433 7.668 8.99476 8.4192 10 8.8092C9.7726 9.2976 9.51604 9.7752 9.2315 10.2444C8.49214 11.4144 7.81926 12 7.21169 12C6.98429 12 6.68108 11.9124 6.30208 11.736C5.92307 11.5608 5.5534 11.4732 5.19305 11.4732C4.83271 11.4732 4.4677 11.5608 4.09802 11.736C3.72834 11.9124 3.4298 12 3.20124 12C2.55634 12 1.88346 11.454 1.18143 10.3608C0.519047 9.3072 0.134211 8.1996 0.0304223 7.0392C-0.0745329 5.8788 0.0922293 4.9752 0.528376 4.332C1.15344 3.318 1.9686 2.8092 2.97383 2.8092C3.2957 2.8092 3.68986 2.8968 4.154 3.072C4.61813 3.2472 4.96448 3.336 5.19189 3.336C5.41929 3.336 5.75165 3.2484 6.18779 3.072C6.62394 2.898 7.0321 2.8092 7.41111 2.8092C8.26474 2.8092 9.01342 3.2196 9.65831 4.0392ZM6.61461 1.9608C6.12132 2.6244 5.52424 2.9364 4.82221 2.8968C4.72775 2.2536 4.92717 1.62 5.42046 0.9948C5.91374 0.3912 6.50149 0.0588 7.1837 0C7.27816 0.6636 7.08924 1.3176 6.61461 1.9608Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** The Windows mark, heading the Windows row. Figma draws it 10×10. */
export function WindowsGlyph({ size, style }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path
        d="M4.72222 0V4.72222H0V0H4.72222ZM4.72222 10H0V5.27778H4.72222V10ZM5.27778 0H10V4.72222H5.27778V0ZM10 5.27778V10H5.27778V5.27778H10Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** The ⌘ key. Figma draws it 8×8 inside a 14px keycap. */
export function CommandGlyph({ size, style }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path
        d="M6.33332 8C5.41432 8 4.66663 7.25231 4.66663 6.33332V5.33326H3.33337V6.33332C3.33337 7.25231 2.58567 8 1.66668 8C0.747693 8 0 7.25231 0 6.33332C0 5.41432 0.747693 4.66663 1.66668 4.66663H2.66674V3.33337H1.66668C0.747693 3.33337 0 2.58568 0 1.66668C0 0.747693 0.747693 0 1.66668 0C2.58567 0 3.33337 0.747693 3.33337 1.66668V2.66674H4.66663V1.66668C4.66663 0.747693 5.41432 0 6.33332 0C7.25231 0 8 0.747693 8 1.66668C8 2.58568 7.25231 3.33337 6.33332 3.33337H5.33326V4.66663H6.33332C7.25231 4.66663 8 5.41432 8 6.33332C8 7.25231 7.25231 8 6.33332 8ZM5.33326 5.33348V6.33353C5.33326 6.88497 5.78188 7.33358 6.33332 7.33358C6.88475 7.33358 7.33337 6.88497 7.33337 6.33353C7.33337 5.78209 6.88475 5.33348 6.33332 5.33348H5.33326ZM1.6669 5.33348C1.11546 5.33348 0.666844 5.78209 0.666844 6.33353C0.666844 6.88497 1.11546 7.33358 1.6669 7.33358C2.21833 7.33358 2.66695 6.88497 2.66695 6.33353V5.33348H1.6669ZM3.33337 4.66684H4.66663V3.33358H3.33337V4.66684ZM5.33326 2.66695H6.33332C6.88475 2.66695 7.33337 2.21833 7.33337 1.6669C7.33337 1.11546 6.88475 0.666844 6.33332 0.666844C5.78188 0.666844 5.33326 1.11546 5.33326 1.6669V2.66695ZM1.6669 0.667058C1.11546 0.667058 0.666844 1.11567 0.666844 1.66711C0.666844 2.21855 1.11546 2.66716 1.6669 2.66716H2.66695V1.66711C2.66695 1.11567 2.21833 0.667058 1.6669 0.667058Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The ring around one key's name, and the `+` between two of them.
 *
 * Shared by the mark tooltips and the send tooltip: both draw the same keycaps,
 * and two copies would drift the first time the ring changed. `square` is for a
 * glyph rather than a word — ⌘ gets a fixed box, `Ctrl` hugs its text.
 */
export function Key({ children, square }: { children: ReactNode; square?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: square ? markTooltip.commandKeyWidth : undefined,
        paddingLeft: square ? markTooltip.commandKeyPadding : markTooltip.keyPaddingX,
        paddingRight: square ? markTooltip.commandKeyPadding : markTooltip.keyPaddingX,
        paddingTop: square ? markTooltip.commandKeyPadding : markTooltip.keyPaddingY,
        paddingBottom: square ? markTooltip.commandKeyPadding : markTooltip.keyPaddingY,
        border: `${markTooltip.keyBorderWidth}px solid ${color.main.description}`,
        borderRadius: markTooltip.keyRadius,
        ...textStyle.sRegular,
        fontSize: markTooltip.keyFontSize,
        color: color.main.description,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** ⌘ in its own square cap. */
export function CommandKey() {
  return (
    <Key square>
      <CommandGlyph size={markTooltip.commandGlyphSize} />
    </Key>
  );
}

/** The separator between two keys, a step above the keycap text. */
export function Plus() {
  return (
    <span
      style={{
        ...textStyle.sRegular,
        fontSize: markTooltip.plusFontSize,
        color: color.main.description,
      }}
    >
      +
    </span>
  );
}

/** The platform mark heading a shortcut row. */
export function PlatformMark({ platform }: { platform: 'mac' | 'windows' }) {
  return (
    <span
      style={{
        display: 'flex',
        color: color.main.description,
        opacity: markTooltip.platformOpacity,
      }}
    >
      {platform === 'mac' ? (
        // Figma draws the Apple mark a touch taller than the Windows squares,
        // which are the same height as their own row.
        <AppleGlyph size={markTooltip.platformSize + 2} />
      ) : (
        <WindowsGlyph size={markTooltip.platformSize} />
      )}
    </span>
  );
}
