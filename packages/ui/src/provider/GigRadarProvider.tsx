import { renderCssVars } from '@gigradar/theme';
import { useEffect, type ReactNode } from 'react';

const STYLE_ELEMENT_ID = 'gigradar-tokens';

export type GigRadarProviderProps = {
  children: ReactNode;
  /**
   * Inject the token CSS custom properties into the document head.
   *
   * Set to `false` if the app already includes the token stylesheet at build
   * time (preferred for production — it avoids a flash of unstyled content).
   *
   * @default true
   */
  injectCssVars?: boolean;
};

/**
 * Wraps a GigRadar app and makes design tokens available.
 *
 * Apps mount this once at the root. Because the provider owns token delivery,
 * a token change ships as a `@gigradar/ui` version bump rather than a code
 * change in each of the four app repos.
 */
export function GigRadarProvider({ children, injectCssVars = true }: GigRadarProviderProps) {
  useEffect(() => {
    if (!injectCssVars) return;
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ELEMENT_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = renderCssVars();
    document.head.appendChild(style);

    return () => {
      document.getElementById(STYLE_ELEMENT_ID)?.remove();
    };
  }, [injectCssVars]);

  return <>{children}</>;
}
