/**
 * @gigradar/ui — the single import surface for GigRadar apps.
 *
 * Apps import components from here, never from antd directly. That indirection
 * is what lets an implementation be swapped — antd today, our own tomorrow —
 * without touching a line of app code.
 */

export { GigRadarProvider } from './provider/GigRadarProvider';
export type { GigRadarProviderProps } from './provider/GigRadarProvider';

export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';

export { Badge } from './components/Badge/Badge';
export type { BadgeProps, BadgeTone, BadgeSize } from './components/Badge/Badge';

export { Card } from './components/Card/Card';
export type { CardProps, CardVariant, CardPadding } from './components/Card/Card';

/**
 * Tokens are re-exported so app code never needs a direct `@gigradar/theme`
 * dependency for ordinary use.
 */
export { tokens, color, spacing, radius, shadow, typography, textStyle } from '@gigradar/theme';
export type { StageName } from '@gigradar/theme';
