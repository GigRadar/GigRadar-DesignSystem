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
  ModalCloseRenderProps,
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
  ComponentLifecycle,
} from './components/Lifecycle/LifecycleBadge.js';

export { CreditBadge } from './components/Badge/CreditBadge.js';
export type { CreditBadgeProps, CreditBadgeStyleProps, BadgeSize } from './components/Badge/CreditBadge.js';

export { EyebrowBadge } from './components/Badge/EyebrowBadge.js';
export type { EyebrowBadgeProps, EyebrowBadgeStyleProps } from './components/Badge/EyebrowBadge.js';

export { CounterBadge } from './components/Badge/CounterBadge.js';
export type { CounterBadgeProps, CounterBadgeStyleProps } from './components/Badge/CounterBadge.js';

export { PlanBadge } from './components/Badge/PlanBadge.js';
export type { PlanBadgeProps, PlanBadgeStyleProps, PlanTone } from './components/Badge/PlanBadge.js';

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

export { Radio } from './components/Radio/Radio.js';
export type {
  RadioProps,
  RadioStyleProps,
  RadioSize,
  RadioIndicator,
} from './components/Radio/Radio.js';

export { AutoReply } from './components/AutoReply/AutoReply.js';
export type {
  AutoReplyProps,
  AutoReplyStyleProps,
  AutoReplyTab,
  AutoReplyOption,
  AutoReplyOptionRenderProps,
  AutoReplyFooterRenderProps,
  ReplyMode,
} from './components/AutoReply/AutoReply.js';

export { ModeBadge } from './components/AutoReply/ModeBadge.js';
export type { ModeBadgeProps, ModeBadgeStyleProps } from './components/AutoReply/ModeBadge.js';

export { AutoReplyButton } from './components/AutoReply/AutoReplyButton.js';
export type {
  AutoReplyButtonProps,
  AutoReplyButtonStyleProps,
  AutoReplyButtonLayout,
} from './components/AutoReply/AutoReplyButton.js';

export { AutoReplyModeTab } from './components/AutoReply/AutoReplyModeTab.js';
export type {
  AutoReplyModeTabProps,
  AutoReplyModeTabStyleProps,
} from './components/AutoReply/AutoReplyModeTab.js';

export { useScrollbar } from './components/Scrollbar/Scrollbar.js';
export type { ScrollbarStyleProps } from './components/Scrollbar/Scrollbar.js';

export { AiTool } from './components/AiTool/AiTool.js';
export type {
  AiToolProps,
  AiToolStyleProps,
  AiToolCategory,
  AiToolPalette,
  AiToolBadgeRenderProps,
  AiToolTagRenderProps,
} from './components/AiTool/AiTool.js';

export { AiToolBadge, aiToolPalette } from './components/AiTool/AiToolBadge.js';
export type {
  AiToolBadgeProps,
  AiToolBadgeStyleProps,
} from './components/AiTool/AiToolBadge.js';

export { MentionPreset } from './components/MentionPreset/MentionPreset.js';
export type {
  MentionPresetProps,
  MentionPresetStyleProps,
  MentionHandleRenderProps,
  MentionPriorityRenderProps,
  MentionActionsRenderProps,
  MentionCounterRenderProps,
} from './components/MentionPreset/MentionPreset.js';

export { MentionPresetList } from './components/MentionPreset/MentionPresetList.js';
export type {
  MentionPresetListProps,
  MentionPresetListStyleProps,
  MentionPresetItem,
  MentionPresetRenderProps,
  MentionPresetEmptyRenderProps,
  MentionPresetFooterRenderProps,
} from './components/MentionPreset/MentionPresetList.js';

export { Spinner } from './components/Spinner/Spinner.js';
export type { SpinnerProps, SpinnerStyleProps, SpinnerSize } from './components/Spinner/Spinner.js';

export { Switch } from './components/Switch/Switch.js';
export type {
  SwitchProps,
  SwitchItem,
  SwitchSegmentRenderProps,
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
  TooltipAlign,
  TooltipSize,
  TooltipCardRenderProps,
} from './components/Tooltip/Tooltip.js';

export { ConfirmTooltip } from './components/Tooltip/ConfirmTooltip.js';
export type {
  ConfirmTooltipProps,
  ConfirmTooltipStyleProps,
  ConfirmCardRenderProps,
  ConfirmTooltipAlign,
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

export { Toggle } from './components/Toggle/Toggle.js';
export type { ToggleProps, ToggleStyleProps, ToggleSize } from './components/Toggle/Toggle.js';

export { ChannelLogo, channelPalette } from './components/Notification/ChannelLogo.js';
export type {
  ChannelLogoProps,
  ChannelLogoStyleProps,
  NotificationChannel,
} from './components/Notification/ChannelLogo.js';

export { NotificationStep } from './components/Notification/NotificationStep.js';
export type {
  NotificationStepProps,
  NotificationStepStyleProps,
  NotificationStepState,
} from './components/Notification/NotificationStep.js';

export { NotificationCard } from './components/Notification/NotificationCard.js';
export type {
  NotificationCardProps,
  NotificationCardStyleProps,
  NotificationControlsRenderProps,
} from './components/Notification/NotificationCard.js';

export {
  NotificationWalkthrough,
  NotificationSettingsGroup,
} from './components/Notification/NotificationWalkthrough.js';
export type {
  NotificationWalkthroughProps,
  NotificationWalkthroughStyleProps,
  WalkthroughStep,
  WalkthroughStepRenderProps,
  NotificationSettingsGroupProps,
  NotificationSettingsStyleProps,
} from './components/Notification/NotificationWalkthrough.js';

export { CrmNotifications } from './components/Notification/CrmNotifications.js';
export type {
  CrmNotificationsProps,
  CrmNotificationsStyleProps,
  NotificationChannelConfig,
  NotificationChannelRenderProps,
} from './components/Notification/CrmNotifications.js';

export { AccountCard } from './components/UpworkAccounts/AccountCard.js';
export type {
  AccountCardProps,
  AccountCardStyleProps,
  AccountSlotVariant,
  AccountAvatarRenderProps,
  AccountStatusRenderProps,
  AccountSelectionRenderProps,
  AccountEmptyRenderProps,
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
  AuthorizationHeadRenderProps,
  AuthorizationPanelRenderProps,
  AuthorizationRowRenderProps,
  AuthorizationFooterRenderProps,
} from './components/UpworkAccounts/AuthorizationPopup.js';

export { UpworkConnectedAccounts } from './components/UpworkAccounts/UpworkConnectedAccounts.js';
export type {
  UpworkConnectedAccountsProps,
  UpworkConnectedAccountsStyleProps,
  UpworkColumns,
  UpworkAccount,
  AccountListRenderProps,
  AccountRenderProps,
  EmptySlotRenderProps,
  UpgradeSlotRenderProps,
  AccountsEmptyStateRenderProps,
  SelectionActionsRenderProps,
  ColumnHeaderRenderProps,
  AccountsSideRenderProps,
} from './components/UpworkAccounts/UpworkConnectedAccounts.js';

export { TextField } from './components/Field/TextField.js';
export type { TextFieldProps, TextFieldStyleProps } from './components/Field/TextField.js';

export { ApiStatus } from './components/UpworkApiKey/ApiStatus.js';
export type {
  ApiStatusProps,
  ApiStatusStyleProps,
  ApiKeyStatus,
  ApiStatusDetail,
  ApiStatusDetailsRenderProps,
  ApiStatusActionRenderProps,
} from './components/UpworkApiKey/ApiStatus.js';

export { RemoveApiButton } from './components/UpworkApiKey/RemoveApiButton.js';
export type {
  RemoveApiButtonProps,
  RemoveApiButtonStyleProps,
  RemoveApiButtonState,
} from './components/UpworkApiKey/RemoveApiButton.js';

export { TestStatus } from './components/UpworkApiKey/TestStatus.js';
export type {
  TestStatusProps,
  TestStatusStyleProps,
  TestStatusTone,
} from './components/UpworkApiKey/TestStatus.js';

export { ViewGuide } from './components/UpworkApiKey/ViewGuide.js';
export type { ViewGuideProps, ViewGuideStyleProps } from './components/UpworkApiKey/ViewGuide.js';

export { RentApiBanner } from './components/UpworkApiKey/RentApiBanner.js';
export type {
  RentApiBannerProps,
  RentApiBannerStyleProps,
  RentApiBannerActionRenderProps,
} from './components/UpworkApiKey/RentApiBanner.js';

export { UpworkApiKey } from './components/UpworkApiKey/UpworkApiKey.js';
export type {
  UpworkApiKeyProps,
  UpworkApiKeyStyleProps,
  ApiKeyColumns,
  SetupStep,
  ApiKeyFormRenderProps,
  ApiKeySideRenderProps,
} from './components/UpworkApiKey/UpworkApiKey.js';

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

export { DatePicker } from './components/DatePicker/DatePicker.js';
export type {
  DatePickerProps,
  DatePickerStyleProps,
  DateRange,
} from './components/DatePicker/DatePicker.js';

/**
 * The Inbox — the CRM's conversation screen.
 *
 * `InboxList` is the assembled left column; everything else is a piece of it,
 * exported because the screen composes them directly and Figma files them as
 * their own components.
 */
export { InboxList } from './components/Inbox/InboxList.js';
export type { InboxListProps, InboxListStyleProps } from './components/Inbox/InboxList.js';

/**
 * The room list's non-default states. Exported because they are what a screen
 * passes to `InboxList` as children — the column draws the frame, and what
 * fills it is the consumer's to decide.
 */
export { InboxEmpty, InboxLoading, InboxOnboarding } from './components/Inbox/InboxStates.js';
export type {
  InboxEmptyProps,
  InboxLoadingProps,
  InboxOnboardingProps,
  InboxOnboardingStep,
} from './components/Inbox/InboxStates.js';

export { InboxRoom } from './components/Inbox/InboxRoom.js';
export type { InboxRoomProps, InboxRoomStyleProps } from './components/Inbox/InboxRoom.js';

export { InboxSelector, InboxAccountRow } from './components/Inbox/InboxSelector.js';
export type {
  InboxSelectorProps,
  InboxSelectorStyleProps,
  InboxAccountRowProps,
  InboxAccount,
} from './components/Inbox/InboxSelector.js';

export {
  InboxSearchField,
  MarkAsReadButton,
  FilterChip,
} from './components/Inbox/InboxSearch.js';
export type {
  InboxSearchFieldProps,
  InboxSearchFieldStyleProps,
  MarkAsReadButtonProps,
  MarkAsReadButtonStyleProps,
  FilterChipProps,
  FilterChipStyleProps,
} from './components/Inbox/InboxSearch.js';

export { AdvancedSearch } from './components/Inbox/AdvancedSearch.js';
export type {
  AdvancedSearchProps,
  AdvancedSearchStyleProps,
  InboxFilters,
  ClientFilterOption,
  StageFilterOption,
  DatePresetOption,
  FilterRowName,
} from './components/Inbox/AdvancedSearch.js';

/**
 * The Inbox's small reusable marks and controls.
 *
 * Exported alongside the bigger pieces because screens compose them directly:
 * a stage pill appears wherever a lead's stage is shown, and the tick is the
 * mark every selectable row in the column draws.
 */
export { NotificationToggle } from './components/Inbox/NotificationToggle.js';
export type {
  NotificationToggleProps,
  NotificationToggleStyleProps,
} from './components/Inbox/NotificationToggle.js';

export { PushNotificationToggle } from './components/Inbox/PushNotificationToggle.js';
export type {
  PushNotificationToggleProps,
  PushPermission,
} from './components/Inbox/PushNotificationToggle.js';

export { HighlightedText } from './components/Inbox/HighlightedText.js';
export type {
  HighlightedTextProps,
  HighlightedTextStyleProps,
} from './components/Inbox/HighlightedText.js';

export { StagePill } from './components/Inbox/StagePill.js';
export type { StagePillProps, StagePillStyleProps } from './components/Inbox/StagePill.js';

export { SelectTick } from './components/Inbox/SelectTick.js';
export type {
  SelectTickProps,
  SelectTickStyleProps,
  SelectTickShape,
} from './components/Inbox/SelectTick.js';

export { ScheduleMark } from './components/Inbox/ScheduleMark.js';
export type { ScheduleMarkProps, ScheduleMarkStyleProps } from './components/Inbox/ScheduleMark.js';

export { ConnectionIndicator, SignalIcon } from './components/Inbox/ConnectionIndicator.js';
export type {
  ConnectionIndicatorProps,
  ConnectionIndicatorStyleProps,
  ConnectionState,
  SignalIconProps,
} from './components/Inbox/ConnectionIndicator.js';

export { SelectionBar } from './components/Inbox/SelectionBar.js';
export type { SelectionBarProps } from './components/Inbox/SelectionBar.js';

/**
 * The Middle column — the chat room itself.
 *
 * `ChatHeader` is the assembled band; everything else is a control it composes,
 * exported on its own because Figma files each as its own component and a screen
 * building its own header band should reach for these rather than redraw them.
 */
export { ChatHeader } from './components/Middle/ChatHeader.js';
export type {
  ChatHeaderProps,
  ChatHeaderStyleProps,
  ChatHeaderLayout,
} from './components/Middle/ChatHeader.js';

export { AddBmInfo } from './components/Middle/AddBmInfo.js';
export type { AddBmInfoProps, AddBmInfoStyleProps } from './components/Middle/AddBmInfo.js';

export { FilterChat, defaultChatFilters } from './components/Middle/FilterChat.js';
export type {
  FilterChatProps,
  FilterChatStyleProps,
  ChatFilter,
} from './components/Middle/FilterChat.js';

export { MenuButton } from './components/Middle/MenuButton.js';
export type { MenuButtonProps, MenuButtonStyleProps } from './components/Middle/MenuButton.js';

export { LeadStageMenu, stageOrder } from './components/Middle/LeadStageMenu.js';
export type {
  LeadStageMenuProps,
  LeadStageMenuStyleProps,
} from './components/Middle/LeadStageMenu.js';

export { LeadStageButton, stageLabels } from './components/Middle/LeadStageButton.js';
export type {
  LeadStageButtonProps,
  LeadStageButtonStyleProps,
  LeadStageSize,
} from './components/Middle/LeadStageButton.js';

export { HeaderMetaTag } from './components/Middle/HeaderMetaTag.js';
export type {
  HeaderMetaTagProps,
  HeaderMetaTagStyleProps,
  HeaderMetaTagVariant,
} from './components/Middle/HeaderMetaTag.js';

export { HeaderNavButton } from './components/Middle/HeaderNavButton.js';
export type {
  HeaderNavButtonProps,
  HeaderNavButtonStyleProps,
  HeaderNavAction,
} from './components/Middle/HeaderNavButton.js';

export { AutoCancelSwitch } from './components/Middle/AutoCancelSwitch.js';
export type {
  AutoCancelSwitchProps,
  AutoCancelSwitchStyleProps,
} from './components/Middle/AutoCancelSwitch.js';

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
