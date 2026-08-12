/**
 * @gigradar/ui — the single import surface for GigRadar apps.
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

export { IconButton } from './components/Button/IconButton.js';
export type {
  IconButtonProps,
  IconButtonStyleProps,
  IconButtonVariant,
  IconButtonSize,
} from './components/Button/IconButton.js';

export { Modal } from './components/Modal/Modal.js';
export type { ModalProps, ModalStyleProps } from './components/Modal/Modal.js';

export {
  ModalCard,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from './components/Modal/ModalBands.js';
export type {
  ModalCardProps,
  ModalCardStyleProps,
  ModalHeaderProps,
  ModalHeaderStyleProps,
  ModalContentProps,
  ModalContentStyleProps,
  ModalFooterProps,
  ModalFooterStyleProps,
} from './components/Modal/ModalBands.js';

export { Skeleton } from './components/Skeleton/Skeleton.js';
export type {
  SkeletonProps,
  SkeletonStyleProps,
  SkeletonVariant,
} from './components/Skeleton/Skeleton.js';

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

export { LifecycleBadge } from './components/Lifecycle/LifecycleBadge.js';
export type {
  LifecycleBadgeProps,
  LifecycleBadgeStyleProps,
  LifecycleBadgeVariant,
  ComponentLifecycle,
} from './components/Lifecycle/LifecycleBadge.js';

export { CreditBadge } from './components/Badge/CreditBadge.js';
export type { CreditBadgeProps, CreditBadgeStyleProps, BadgeSize } from './components/Badge/CreditBadge.js';

export { EyebrowBadge } from './components/Badge/EyebrowBadge.js';
export type { EyebrowBadgeProps, EyebrowBadgeStyleProps } from './components/Badge/EyebrowBadge.js';

export { CounterBadge } from './components/Badge/CounterBadge.js';
export type { CounterBadgeProps, CounterBadgeStyleProps } from './components/Badge/CounterBadge.js';

export { StatusBadge } from './components/Badge/StatusBadge.js';
export type {
  StatusBadgeProps,
  StatusBadgeStyleProps,
  StatusTone,
} from './components/Badge/StatusBadge.js';

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
  SwitchItemRenderContext,
  SwitchStyleProps,
  SwitchSize,
} from './components/Switch/Switch.js';

export { SwitchButton } from './components/Switch/SwitchButton.js';
export type { SwitchButtonProps, SwitchButtonStyleProps } from './components/Switch/SwitchButton.js';

export { Pagination, pageSlots } from './components/Pagination/Pagination.js';
export type {
  PaginationProps,
  PaginationStyleProps,
  PaginationSize,
  PageRenderProps,
} from './components/Pagination/Pagination.js';

export { PageNumber } from './components/Pagination/PageNumber.js';
export type { PageNumberProps, PageNumberStyleProps } from './components/Pagination/PageNumber.js';

export { PaginationDots } from './components/Pagination/PaginationDots.js';
export type {
  PaginationDotsProps,
  PaginationDotsStyleProps,
} from './components/Pagination/PaginationDots.js';

export { Tooltip } from './components/Tooltip/Tooltip.js';
export type {
  TooltipProps,
  TooltipStyleProps,
  TooltipPlacement,
  TooltipSize,
  TooltipCardRenderProps,
} from './components/Tooltip/Tooltip.js';

export { ConfirmTooltip } from './components/Tooltip/ConfirmTooltip.js';
export type {
  ConfirmTooltipProps,
  ConfirmTooltipStyleProps,
  ConfirmCardRenderProps,
} from './components/Tooltip/ConfirmTooltip.js';

export { SettingsHeader } from './components/SettingsSection/SettingsHeader.js';
export type {
  SettingsHeaderProps,
  SettingsHeaderStyleProps,
  SettingsHeaderTitleRenderProps,
} from './components/SettingsSection/SettingsHeader.js';

export { SettingsSection } from './components/SettingsSection/SettingsSection.js';
export type {
  SettingsSectionProps,
  SettingsSectionStyleProps,
  SettingsSectionTitleRenderProps,
} from './components/SettingsSection/SettingsSection.js';

export { SettingsCard } from './components/SettingsPanel/SettingsCard.js';
export type {
  SettingsCardProps,
  SettingsCardStyleProps,
  SettingsCardLevel,
} from './components/SettingsPanel/SettingsCard.js';

export { SettingsPanel } from './components/SettingsPanel/SettingsPanel.js';
export type {
  SettingsPanelProps,
  SettingsPanelStyleProps,
  SettingsItem,
  SettingsItemRenderProps,
  SettingsHeaderRenderProps,
} from './components/SettingsPanel/SettingsPanel.js';

export { AccountCard } from './components/UpworkAccounts/AccountCard.js';
export type {
  AccountCardProps,
  AccountCardStyleProps,
  AccountSlotVariant,
} from './components/UpworkAccounts/AccountCard.js';

export { AuthorizeBanner } from './components/UpworkAccounts/AuthorizeBanner.js';
export type {
  AuthorizeBannerProps,
  AuthorizeBannerStyleProps,
  AuthorizeBannerActionRenderProps,
} from './components/UpworkAccounts/AuthorizeBanner.js';

export { AccountSafetyNotice } from './components/UpworkAccounts/AccountSafetyNotice.js';
export type {
  AccountSafetyNoticeProps,
  AccountSafetyNoticeStyleProps,
} from './components/UpworkAccounts/AccountSafetyNotice.js';

export { AuthorizationSteps } from './components/UpworkAccounts/AuthorizationSteps.js';
export type {
  AuthorizationStepsProps,
  AuthorizationStepsStyleProps,
  AuthorizationStepRenderProps,
} from './components/UpworkAccounts/AuthorizationSteps.js';

export { AuthorizationPopup } from './components/UpworkAccounts/AuthorizationPopup.js';
export type {
  AuthorizationPopupProps,
  AuthorizationPopupStyleProps,
  AuthorizationState,
} from './components/UpworkAccounts/AuthorizationPopup.js';

export { UpworkConnectedAccounts } from './components/UpworkAccounts/UpworkConnectedAccounts.js';
export type {
  UpworkConnectedAccountsProps,
  UpworkConnectedAccountsStyleProps,
  UpworkAccount,
  AccountListRenderProps,
} from './components/UpworkAccounts/UpworkConnectedAccounts.js';

export { CustomPromptField } from './components/Prompt/CustomPromptField.js';
export type {
  CustomPromptFieldProps,
  CustomPromptFieldStyleProps,
  CustomPromptFieldHandle,
  CopyButtonRenderProps,
} from './components/Prompt/CustomPromptField.js';

export { PromptVariable } from './components/Prompt/PromptVariable.js';
export type { PromptVariableProps, PromptVariableStyleProps } from './components/Prompt/PromptVariable.js';

export { VersionNumber, formatVersion } from './components/Prompt/VersionNumber.js';
export type {
  VersionNumberProps,
  VersionNumberStyleProps,
  VersionItemRenderProps,
  PromptVersion,
} from './components/Prompt/VersionNumber.js';

export { AiPromptConfig } from './components/Prompt/AiPromptConfig.js';
export type {
  AiPromptConfigProps,
  AiPromptConfigStyleProps,
  PromptCardMode,
  PromptVariableDef,
  PromptFieldRenderProps,
  PromptFooterRenderProps,
  PromptVariablesRenderProps,
} from './components/Prompt/AiPromptConfig.js';

/**
 * The render-prop convention shared by the higher-level components.
 * See `internal/render.ts` for why only they take render props.
 */
export type { RenderProp, WithDefaultRender } from './internal/render.js';

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
 * Tokens are re-exported so app code never needs a direct `@gigradar/theme`
 * dependency for ordinary use.
 */
export { tokens, color, spacing, radius, shadow, typography, textStyle, avatarTone } from '@gigradar/theme';
export type { StageName } from '@gigradar/theme';
