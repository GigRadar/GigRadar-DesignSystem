/**
 * @uiuxjoseph/ui — the single import surface for GigRadar apps.
 *
 * Apps import every component from here. That indirection is what lets an
 * implementation be swapped without touching a line of app code.
 */

export { GigRadarProvider } from './provider/GigRadarProvider.js';
export type { GigRadarProviderProps } from './provider/GigRadarProvider.js';

export { Button } from './components/Button/Button.js';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button.js';

export { Badge } from './components/Badge/Badge.js';
export type { BadgeProps, BadgeTone, BadgeSize } from './components/Badge/Badge.js';

export { Card } from './components/Card/Card.js';
export type { CardProps, CardVariant, CardPadding } from './components/Card/Card.js';

export { Avatar, initialsFromName } from './components/Avatar/Avatar.js';
export type {
  AvatarProps,
  AvatarSize,
  AvatarToneName,
  AvatarService,
  AvatarBadge,
} from './components/Avatar/Avatar.js';

export { AvatarGroup } from './components/Avatar/AvatarGroup.js';
export type { AvatarGroupProps } from './components/Avatar/AvatarGroup.js';

/**
 * Tokens are re-exported so app code never needs a direct `@uiuxjoseph/theme`
 * dependency for ordinary use.
 */
export { tokens, color, spacing, radius, shadow, typography, textStyle, avatarTone } from '@uiuxjoseph/theme';
export type { StageName } from '@uiuxjoseph/theme';
