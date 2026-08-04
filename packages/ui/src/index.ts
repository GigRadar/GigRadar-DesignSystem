/**
 * @uiuxjoseph/ui — the single import surface for GigRadar apps.
 *
 * Apps import every component from here. That indirection is what lets an
 * implementation be swapped without touching a line of app code.
 */

export { GigRadarProvider } from './provider/GigRadarProvider.js';
export type { GigRadarProviderProps } from './provider/GigRadarProvider.js';

export { Box, HStack, VStack } from './components/Box/Box.js';
export type { BoxProps, SpaceValue, SizeValue, RadiusValue } from './components/Box/Box.js';

export { Button } from './components/Button/Button.js';
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  ButtonTone,
  ButtonStyleProps,
} from './components/Button/Button.js';

export { ComposerButton } from './components/Button/ComposerButton.js';
export type { ComposerButtonProps } from './components/Button/ComposerButton.js';

export { Avatar, initialsFromName } from './components/Avatar/Avatar.js';
export type {
  AvatarProps,
  AvatarSize,
  AvatarToneName,
  AvatarService,
  AvatarType,
  AvatarBadge,
  AvatarStyleProps,
  CssLength,
} from './components/Avatar/Avatar.js';

export { AvatarGroup } from './components/Avatar/AvatarGroup.js';
export type { AvatarGroupProps, AvatarGroupGap } from './components/Avatar/AvatarGroup.js';

/**
 * Tokens are re-exported so app code never needs a direct `@uiuxjoseph/theme`
 * dependency for ordinary use.
 */
export { tokens, color, spacing, radius, shadow, typography, textStyle, avatarTone } from '@uiuxjoseph/theme';
export type { StageName } from '@uiuxjoseph/theme';
