import { borderWidth, color, component, textStyle, type StageName } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Avatar, type AvatarToneName } from '../Avatar/Avatar.js';
import {
  IconAssignedPeopleStroke,
  IconBubbleMessageStroke,
  IconFilterChatStroke,
  IconInfoStroke,
  IconJobPostingArrowUpRight,
  IconSearch,
} from '../../icons/defs.js';
import { AddBmInfo, type AddBmInfoProps } from './AddBmInfo.js';
import { AutoCancelSwitch } from './AutoCancelSwitch.js';
import { HeaderMetaTag } from './HeaderMetaTag.js';
import { HeaderNavButton } from './HeaderNavButton.js';
import { LeadStageButton } from './LeadStageButton.js';
import { MenuButton } from './MenuButton.js';

const { header } = component.middle;

/**
 * Which of the two layouts to draw.
 *
 * Not a breakpoint the component measures: the CRM's own shell already knows
 * whether it is drawing the mobile or the desktop chrome, and the two differ by
 * more than width — mobile swaps the controls for a back chevron and an info
 * button rather than shrinking them.
 */
export type ChatHeaderLayout = 'desktop' | 'mobile';

/** Per-instance overrides for the header's own metrics. */
export type ChatHeaderStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  gap?: CssLength;
  background?: string;
  /** The rule along the bottom edge, and above the Business Manager band. */
  borderColor?: string;
};

export type ChatHeaderProps = {
  /** The room's title — the job the conversation is about. */
  title: ReactNode;
  /** The line under the title: who is in the room. Figma draws "Team". */
  topic?: ReactNode;
  /** The client's photo, and the name its initials fall back to. */
  clientName?: string;
  clientAvatar?: string;
  /**
   * Pins the initials' palette. Left off, a tone is derived from `clientName`,
   * so one person looks the same on every screen — which is what you want
   * outside of matching a specific Figma frame.
   */
  clientTone?: AvatarToneName;
  /** Whether the client's avatar carries the GigRadar mark. */
  clientBadge?: boolean;
  /** The preset the room replies with — the blue tag beside the topic. */
  preset?: ReactNode;
  /** Opens the preset picker. Without it the preset tag is a label. */
  onPresetClick?: () => void;
  /** Who the room is assigned to — the outlined tag beside the preset. */
  assignee?: ReactNode;
  /** Opens the assignee picker. */
  onAssigneeClick?: () => void;
  /** The lead's stage. Omitted, the stage pill is not drawn. */
  stage?: StageName;
  /** Whether the stage menu is open, and what opens it. */
  stageOpen?: boolean;
  onStageClick?: () => void;
  /**
   * @default 'desktop'
   */
  layout?: ChatHeaderLayout;
  /**
   * Draws the scheduled-messages header instead: a sidebar toggle, the
   * "Scheduled Messages" title over the room's own, and the auto-cancel switch.
   * The room's controls have no role there — the surface is a queue, not a
   * conversation.
   * @default false
   */
  scheduled?: boolean;
  /** The auto-cancel switch on the scheduled header. */
  autoCancel?: boolean;
  onAutoCancelChange?: (on: boolean) => void;
  /** How many filters the filter-chat popover has applied. */
  filterCount?: number;
  /** Whether the filter-chat popover is showing. */
  filterOpen?: boolean;
  onFilterClick?: () => void;
  /** How many messages the unread-view button has to show. */
  messageCount?: number;
  onMessagesClick?: () => void;
  onJobPostingClick?: () => void;
  /** The back chevron on mobile, and the sidebar toggle when scheduled. */
  onBack?: () => void;
  /** Mobile's single info control. */
  onInfoClick?: () => void;
  /**
   * The Business Manager band under the header — Figma's "BM not in this room".
   * Pass the manager's details to draw it; omit it and the header is one band.
   */
  addBusinessManager?: Omit<AddBmInfoProps, 'paddingX' | 'paddingY' | 'background'>;
} & ChatHeaderStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'title'>;

/**
 * The band across the top of the chat room.
 *
 * Figma: node 3523:37230 — four variants across two axes, desktop/mobile ×
 * default/scheduled, plus the "BM not in this room" band that can hang under
 * any of them.
 *
 * Built as two props rather than four variants: `layout` and `scheduled` are
 * independent — the shell decides the first and the surface decides the second,
 * and a single `variant` string would make callers reassemble it from both.
 *
 * Every interactive part is composed, not redrawn: `HeaderNavButton`,
 * `HeaderMetaTag`, `MenuButton`, `LeadStageButton`, `AutoCancelSwitch`, and
 * `AddBmInfo` are each exported on their own, so a screen that builds its own
 * header band reaches for the same controls rather than a second copy of them.
 */
export const ChatHeader = forwardRef<HTMLElement, ChatHeaderProps>(function ChatHeader(
  {
    title,
    topic,
    clientName,
    clientAvatar,
    clientTone,
    clientBadge = false,
    preset,
    onPresetClick,
    assignee,
    onAssigneeClick,
    stage,
    stageOpen = false,
    onStageClick,
    layout = 'desktop',
    scheduled = false,
    autoCancel = false,
    onAutoCancelChange,
    filterCount,
    filterOpen = false,
    onFilterClick,
    messageCount,
    onMessagesClick,
    onJobPostingClick,
    onBack,
    onInfoClick,
    addBusinessManager,
    paddingX,
    paddingY,
    gap,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  const mobile = layout === 'mobile';
  const insetX = len(paddingX) ?? (mobile ? header.mobilePaddingX : header.desktopPaddingX);
  const rule = `${borderWidth.thin}px solid ${borderColor ?? color.navbar.hover}`;

  return (
    <header
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: background ?? color.main.white,
        borderBottom: rule,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: len(gap) ?? (mobile ? header.mobileGap : header.desktopGap),
          boxSizing: 'border-box',
          paddingLeft: insetX,
          paddingRight: insetX,
          paddingTop: len(paddingY) ?? header.paddingY,
          paddingBottom: len(paddingY) ?? header.paddingY,
        }}
      >
        {/* The leading chevron. Scheduled it collapses the sidebar; on mobile it
            goes back to the room list. Both are "leave this surface", which is
            why one control serves both. */}
        {(scheduled || mobile) && (
          <HeaderNavButton action={scheduled ? 'collapse' : 'back'} onClick={onBack} />
        )}

        {scheduled ? (
          // The queue's own heading, with the room it belongs to underneath.
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: 0,
              gap: header.stackGap,
            }}
          >
            <span
              style={{
                ...textStyle.lSemibold,
                lineHeight: `${header.titleLineHeight}px`,
                color: color.main.black,
              }}
            >
              Scheduled Messages
            </span>
            <span
              style={{
                ...textStyle.mMedium,
                color: color.main.description,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
              gap: header.identityGap,
            }}
          >
            <Avatar
              size="large"
              diameter={header.avatarSize}
              name={clientName}
              src={clientAvatar}
              tone={clientTone}
              badge={clientBadge ? 'gigradar' : undefined}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
                gap: header.stackGap,
              }}
            >
              <span
                style={{
                  ...textStyle.lSemibold,
                  display: 'block',
                  lineHeight: `${header.titleLineHeight}px`,
                  color: color.main.black,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: header.metaGap,
                  minWidth: 0,
                }}
              >
                {topic != null && (
                  <span
                    style={{
                      ...textStyle.mMedium,
                      color: color.main.description,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {topic}
                  </span>
                )}
                {/* On mobile the tags keep their glyph and drop their label —
                    there is room for the mark but not for the name. */}
                {preset != null && (
                  <HeaderMetaTag
                    icon={IconSearch}
                    variant="brand"
                    label="Reply preset"
                    onClick={onPresetClick}
                  >
                    {mobile ? undefined : preset}
                  </HeaderMetaTag>
                )}
                {assignee != null && (
                  <HeaderMetaTag
                    icon={IconAssignedPeopleStroke}
                    label="Assigned to"
                    onClick={onAssigneeClick}
                  >
                    {mobile ? undefined : assignee}
                  </HeaderMetaTag>
                )}
              </div>
            </div>
          </div>
        )}

        {/* The trailing controls. Three sets, one per surface: the scheduled
            queue's auto-cancel switch, mobile's single info button, and
            desktop's full row. */}
        {scheduled ? (
          <AutoCancelSwitch
            checked={autoCancel}
            onCheckedChange={onAutoCancelChange}
            label={mobile ? null : undefined}
          />
        ) : mobile ? (
          <MenuButton icon={IconInfoStroke} label="Room information" muted onClick={onInfoClick} />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              gap: header.metaGap,
            }}
          >
            <MenuButton
              icon={IconFilterChatStroke}
              label="Filter chat"
              count={filterCount}
              selected={filterOpen}
              onClick={onFilterClick}
            />
            <MenuButton
              icon={IconBubbleMessageStroke}
              label="View messages"
              count={messageCount}
              onClick={onMessagesClick}
            />
            <MenuButton
              icon={IconJobPostingArrowUpRight}
              label="View job posting"
              onClick={onJobPostingClick}
            />
            {stage && <LeadStageButton stage={stage} open={stageOpen} onClick={onStageClick} />}
          </div>
        )}
      </div>

      {/* The Business Manager band. Its own row under the header rather than a
          component the screen stacks separately: Figma draws it inside the
          header frame, sharing its inset and picking up its own top rule. */}
      {addBusinessManager && (
        <div style={{ borderTop: rule }}>
          <AddBmInfo {...addBusinessManager} paddingX={insetX} />
        </div>
      )}
    </header>
  );
});
