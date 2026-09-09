import { borderWidth, color, component, textStyle, type StageName } from '@gigradar/theme';
import { forwardRef, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Avatar, type AvatarToneName } from '../Avatar/Avatar.js';
import {
  IconAssignedPeopleStroke,
  IconBubbleMessageStroke,
  IconFilterChatStroke,
  IconInfoLetter,
  IconJobPostingArrowUpRight,
  IconSearch,
} from '../../icons/defs.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { AddBmInfo, type AddBmInfoProps } from './AddBmInfo.js';
import { FilterChat, type ChatFilter } from './FilterChat.js';
import { LeadStageMenu } from './LeadStageMenu.js';
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
   * Called with the stage picked from the menu. Passing it makes the pill open
   * the menu itself; without it the pill only reports its click.
   */
  onStageChange?: (stage: StageName) => void;
  /**
   * @default 'desktop'
   */
  layout?: ChatHeaderLayout;
  /**
   * Draws the scheduled-messages header instead: a back chevron, the
   * "Scheduled Messages" title over the room's own, and the auto-cancel switch.
   * The room's controls have no role there — the surface is a queue, not a
   * conversation.
   * @default false
   */
  scheduled?: boolean;
  /** The auto-cancel switch on the scheduled header. */
  autoCancel?: boolean;
  onAutoCancelChange?: (on: boolean) => void;
  /**
   * The message kinds the filter popover offers. Passing them makes the filter
   * button open the popover itself; without them the button only reports its
   * click, for a screen that wants to place the panel somewhere else.
   */
  filters?: ChatFilter[];
  /** Which kinds are showing. Also what the button's count reports. */
  shownFilters?: string[];
  onFiltersChange?: (shown: string[]) => void;
  /**
   * Overrides the filter button's count. Defaults to how many kinds are
   * showing, so the badge follows the popover without being wired up twice.
   */
  filterCount?: number;
  /** Whether the filter-chat popover is showing. */
  filterOpen?: boolean;
  onFilterClick?: () => void;
  /** How many messages the unread-view button has to show. */
  messageCount?: number;
  onMessagesClick?: () => void;
  onJobPostingClick?: () => void;
  /** The back chevron — drawn on mobile, and on the scheduled queue. */
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
    onStageChange,
    layout = 'desktop',
    scheduled = false,
    autoCancel = false,
    onAutoCancelChange,
    filters,
    shownFilters,
    onFiltersChange,
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
  const controlsRef = useRef<HTMLDivElement>(null);
  // Both popovers are anchored inside the controls row, so one outside-click
  // listener closes whichever is open. Bound only while one is, so a header at
  // rest costs nothing.
  const anyOpen = filterOpen || stageOpen;
  useEffect(() => {
    if (!anyOpen) return;
    const onDown = (event: MouseEvent) => {
      if (controlsRef.current?.contains(event.target as Node)) return;
      if (filterOpen) onFilterClick?.();
      if (stageOpen) onStageClick?.();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [anyOpen, filterOpen, stageOpen, onFilterClick, onStageClick]);

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
        // Not `hidden`, despite Figma drawing the band clipped: the filter and
        // stage popovers hang below it, and clipping would cut them at the rule.
        // The title's own ellipsis is what actually needs the clip, and it has
        // its own `overflow` for that.
        overflow: 'visible',
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
        {/* The leading chevron — one glyph wherever it appears. Figma draws the
            desktop queue with a double-chevron, as though it closed a sidebar,
            but the control does the same thing on every surface it is on: leave
            here and go back. Two marks for one action is a distinction the
            person using it has to learn for nothing. */}
        {(scheduled || mobile) && <HeaderNavButton action="back" onClick={onBack} />}

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
              Schedule Message Room
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
                {/* Both tags carry a tooltip naming what the value is. On mobile
                    the label is dropped and only the glyph remains, so without
                    one there is nothing to say whether a mark means the scanner
                    or the person assigned. */}
                {preset != null && (
                  <Tooltip content="Scanner Name">
                    <HeaderMetaTag
                      icon={IconSearch}
                      variant="brand"
                      label="Scanner Name"
                      onClick={onPresetClick}
                    >
                      {mobile ? undefined : preset}
                    </HeaderMetaTag>
                  </Tooltip>
                )}
                {assignee != null && (
                  <Tooltip content="Freelancer Profile">
                    <HeaderMetaTag
                      icon={IconAssignedPeopleStroke}
                      label="Freelancer Profile"
                      onClick={onAssigneeClick}
                    >
                      {mobile ? undefined : assignee}
                    </HeaderMetaTag>
                  </Tooltip>
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
            compact={mobile}
          />
        ) : mobile ? (
          // The bare letterform rather than the circled glyph: the button draws
          // its own ring, and a circled "i" inside it reads as two rings.
          <MenuButton icon={IconInfoLetter} label="Room information" muted onClick={onInfoClick} />
        ) : (
          <div
            ref={controlsRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              gap: header.metaGap,
            }}
          >
            {/* Each control that opens a surface is wrapped in a positioned
                span, so its popover hangs off the button itself rather than off
                the header — the header clips its overflow, and an absolutely
                positioned child of it would be cut at the band's edge. */}
            {/* Every control here is a glyph in a circle, so each carries a
                tooltip naming what it does. The `label` matches it word for
                word: a screen reader and a hover should not describe the same
                button differently. */}
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Tooltip content="Show/Hide Room event">
                <MenuButton
                  icon={IconFilterChatStroke}
                  label="Show/Hide Room event"
                  count={filterCount ?? shownFilters?.length}
                  selected={filterOpen}
                  onClick={onFilterClick}
                />
              </Tooltip>
              {filters && filterOpen && (
                <span style={{ position: 'absolute', top: '100%', right: 0, marginTop: header.popoverOffset, zIndex: 1 }}>
                  <FilterChat
                    filters={filters}
                    value={shownFilters}
                    onChange={onFiltersChange}
                  />
                </span>
              )}
            </span>
            <Tooltip content="View Chat on Upwork">
              <MenuButton
                icon={IconBubbleMessageStroke}
                label="View Chat on Upwork"
                count={messageCount}
                onClick={onMessagesClick}
              />
            </Tooltip>
            <Tooltip content="View Job Post on Upwork">
              <MenuButton
                icon={IconJobPostingArrowUpRight}
                label="View Job Post on Upwork"
                onClick={onJobPostingClick}
              />
            </Tooltip>
            {stage && (
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <Tooltip content="Change Leads Stage">
                  <LeadStageButton stage={stage} open={stageOpen} onClick={onStageClick} />
                </Tooltip>
                {/* Centred on the pill rather than pinned to an edge: the menu
                    hugs its own content, so it is narrower than the header and
                    reads as belonging to the control it hangs from. */}
                {onStageChange && stageOpen && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: header.popoverOffset,
                      zIndex: 1,
                    }}
                  >
                    <LeadStageMenu
                      value={stage}
                      onSelect={(next) => {
                        onStageChange(next);
                        onStageClick?.();
                      }}
                    />
                  </span>
                )}
              </span>
            )}
          </div>
        )}
      </div>

      {/* The Business Manager band. Its own row under the header rather than a
          component the screen stacks separately: Figma draws it inside the
          header frame, sharing its inset and picking up its own top rule. */}
      {addBusinessManager && (
        <div style={{ borderTop: rule }}>
          <AddBmInfo compact={mobile} {...addBusinessManager} paddingX={insetX} />
        </div>
      )}
    </header>
  );
});
