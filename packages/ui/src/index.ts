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

export { CreditBadge } from './components/Badge/CreditBadge.js';
export type { CreditBadgeProps, CreditBadgeStyleProps, BadgeSize } from './components/Badge/CreditBadge.js';

export { EyebrowBadge } from './components/Badge/EyebrowBadge.js';
export type { EyebrowBadgeProps, EyebrowBadgeStyleProps } from './components/Badge/EyebrowBadge.js';

export { CounterBadge } from './components/Badge/CounterBadge.js';
export type { CounterBadgeProps, CounterBadgeStyleProps } from './components/Badge/CounterBadge.js';

export { RankBadge } from './components/Badge/RankBadge.js';
export type { RankBadgeProps, RankBadgeStyleProps, RankState } from './components/Badge/RankBadge.js';

export { Checkbox } from './components/Checkbox/Checkbox.js';
export type { CheckboxProps, CheckboxStyleProps, CheckboxSize } from './components/Checkbox/Checkbox.js';

export { Spinner } from './components/Spinner/Spinner.js';
export type { SpinnerProps, SpinnerStyleProps, SpinnerSize } from './components/Spinner/Spinner.js';

export { Switch } from './components/Switch/Switch.js';
export type {
  SwitchProps,
  SwitchItem,
  SwitchStyleProps,
  SwitchSize,
} from './components/Switch/Switch.js';

export { SwitchButton } from './components/Switch/SwitchButton.js';
export type { SwitchButtonProps, SwitchButtonStyleProps } from './components/Switch/SwitchButton.js';

export { AvatarGroup } from './components/Avatar/AvatarGroup.js';
export type { AvatarGroupProps, AvatarGroupGap } from './components/Avatar/AvatarGroup.js';

/**
 * The icon set — `Icon` plus one `IconDef` per glyph (`IconLockFill`,
 * `IconSearch`, …). The full-set registry is deliberately NOT exported here;
 * the gallery imports it from the package internals so product bundles only
 * carry the icons they name.
 */
export * from './icons/index.js';

/**
 * Tokens are re-exported so app code never needs a direct `@uiuxjoseph/theme`
 * dependency for ordinary use.
 */
export { tokens, color, spacing, radius, shadow, typography, textStyle, avatarTone } from '@uiuxjoseph/theme';
export type { StageName } from '@uiuxjoseph/theme';
