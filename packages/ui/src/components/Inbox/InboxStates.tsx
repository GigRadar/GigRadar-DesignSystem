import { color, component, spacing, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconBubbleCrossStroke, IconCheck, IconInboxStroke } from '../../icons/defs.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { Spinner } from '../Spinner/Spinner.js';
import { InboxRoom } from './InboxRoom.js';

const { inbox } = component;
const { list, room } = inbox;

export type InboxEmptyProps = {
  /** @default 'No Conversations' */
  title?: ReactNode;
  /**
   * The line under the title.
   * @default a "start one or adjust your search" hint
   */
  description?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * What the room list shows when it has nothing to list.
 *
 * Figma: node 381:12525 ("Empty or Not Found").
 *
 * One component for both "you have no conversations" and "your search matched
 * none", because the card is identical and only the words differ — which is
 * what `title` and `description` are for. Splitting them would be two
 * components that render the same thing.
 */
export const InboxEmpty = forwardRef<HTMLDivElement, InboxEmptyProps>(function InboxEmpty(
  {
    title = 'No Conversations',
    description = 'There are no chats to display. Start a conversation or adjust your search to see results.',
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.s,
        // Centred in whatever height the list has, rather than pinned to the
        // top: an empty state hugging the search field reads as a result.
        flex: 1,
        padding: spacing.l,
        textAlign: 'center',
      }}
      {...rest}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: list.emptyMarkSize,
          height: list.emptyMarkSize,
          borderRadius: '50%',
          backgroundColor: color.badge.background,
        }}
      >
        <Icon icon={IconBubbleCrossStroke} size={list.emptyIconSize} color={color.badge.foreground} />
      </span>
      <span style={{ ...textStyle.lMedium, color: color.main.black }}>{title}</span>
      <span style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: list.emptyWidth }}>
        {description}
      </span>
    </div>
  );
});

export type InboxLoadingProps = {
  /**
   * How many placeholder rows to draw.
   * @default 6
   */
  count?: number;
  /**
   * Draws placeholders for the header and search band too — the very first
   * load, before the account picker has anything to show.
   * @default false
   */
  includeControls?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The list's first load.
 *
 * Figma: node 382:4827 ("1st Loading"), which greys out the whole column —
 * controls included — because on a cold start there is no account name or
 * unread count to put in them yet.
 *
 * Rows reuse `InboxRoom`'s own `loading` state rather than drawing their own
 * boxes, so the placeholder and the real card cannot drift in height. That is
 * the whole point of a skeleton: the list must not reflow when content lands.
 */
export const InboxLoading = forwardRef<HTMLDivElement, InboxLoadingProps>(function InboxLoading(
  { count = 6, includeControls = false, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-busy
      aria-label="Loading conversations"
      style={{ display: 'flex', flexDirection: 'column', gap: list.chatGap, width: '100%' }}
      {...rest}
    >
      {includeControls && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: list.controlsGap }}>
          <Skeleton variant="block" height={room.height - spacing.l} radius={inbox.selector.radius} />
          <Skeleton variant="block" height={inbox.search.height} radius={inbox.search.radius} />
        </div>
      )}
      {Array.from({ length: count }, (_, index) => (
        <InboxRoom key={index} title="" loading />
      ))}
    </div>
  );
});

/** One step in the onboarding run. */
export type InboxOnboardingStep = {
  /** The step's short name — "Prepare", "Import", "Done". */
  label: string;
  /**
   * Where this step is. `active` draws the spinner-side accent; `done` ticks.
   * @default 'pending'
   */
  state?: 'pending' | 'active' | 'done';
};

export type InboxOnboardingProps = {
  /** @default 'Preparing your inbox' */
  title?: ReactNode;
  /** @default 'Setting up your CRM workspace' */
  description?: ReactNode;
  /** The run's steps, left to right. */
  steps?: InboxOnboardingStep[];
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

const DEFAULT_STEPS: InboxOnboardingStep[] = [
  { label: 'Prepare', state: 'active' },
  { label: 'Import' },
  { label: 'Done' },
];

/**
 * The first-run state, while the workspace is still being built.
 *
 * Figma: node 2959:16844 ("Onboarding").
 *
 * Distinct from `InboxLoading`: that one is waiting on a request that will
 * return in a moment, this one is waiting on a job that takes long enough to
 * need naming its stages. Showing skeleton rows here would promise rooms that
 * are not coming yet.
 */
export const InboxOnboarding = forwardRef<HTMLDivElement, InboxOnboardingProps>(
  function InboxOnboarding(
    {
      title = 'Preparing your inbox',
      description = 'Setting up your CRM workspace',
      steps = DEFAULT_STEPS,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-live="polite"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.m,
          width: '100%',
          padding: spacing.s,
        }}
        {...rest}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.s }}>
          <Spinner size="small" />
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ ...textStyle.mMedium, color: color.main.black }}>{title}</span>
            <span style={{ ...textStyle.sRegular, color: color.main.description }}>
              {description}
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {steps.map((step, index) => {
            const state = step.state ?? 'pending';
            const done = state === 'done';
            const active = state === 'active';

            return (
              <div
                key={step.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.xxs,
                  // Every step takes an equal share, so the connectors between
                  // them stay the same length whatever the labels say.
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span
                    aria-hidden
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: index === 0 ? 'transparent' : color.navbar.border,
                    }}
                  />
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: list.stepSize,
                      height: list.stepSize,
                      borderRadius: '50%',
                      backgroundColor: active ? color.badge.foreground : 'transparent',
                      color: active ? color.main.white : color.navbar.text,
                    }}
                  >
                    <Icon
                      icon={done ? IconCheck : IconInboxStroke}
                      size={list.stepIconSize}
                      color={active ? color.main.white : color.navbar.text}
                    />
                  </span>
                  <span
                    aria-hidden
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor:
                        index === steps.length - 1 ? 'transparent' : color.navbar.border,
                    }}
                  />
                </span>
                <span
                  style={{
                    ...textStyle.sRegular,
                    color: active ? color.navbar.text2 : color.navbar.text,
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
