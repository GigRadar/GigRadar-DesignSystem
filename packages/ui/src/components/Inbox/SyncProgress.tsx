import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import {
  IconCheck,
  IconDownloadArrow,
  IconInboxFill,
  IconWarning,
  type IconDef,
} from '../../icons/defs.js';
import { Spinner } from '../Spinner/Spinner.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { SyncBanner } from './SyncBanner.js';
import { SyncTrack, type SyncStepState } from './SyncStep.js';

const { sync } = component.inbox;

/**
 * Which phase the import is in.
 *
 * `blocked` is deliberately not called "error": the import has not failed, it
 * has stopped and is waiting on the person — reauthorising an account, most
 * often — and it resumes once that is done.
 */
export type SyncPhase = 'preparing' | 'importing' | 'blocked' | 'done';

/** What a `renderBanner` function receives — the note under the tracker. */
export type SyncBannerRenderProps = WithDefaultRender & {
  /** Which phase the import is in. */
  phase: SyncPhase;
};

export type SyncProgressProps = {
  /**
   * Which phase to draw.
   * @default 'preparing'
   */
  phase?: SyncPhase;
  /** Overrides the headline. Each phase has its own. */
  title?: ReactNode;
  /** Overrides the line under the headline. */
  description?: ReactNode;
  /**
   * How many conversations have arrived, and how many there are.
   *
   * Drawn into the default `importing` description, which is where a count
   * belongs — "98 of 110" is the only thing that makes a long import feel like
   * it is moving.
   */
  imported?: number;
  total?: number;
  /**
   * The note under the tracker. Pass `null` to draw none.
   *
   * Defaulted per phase, because each phase has exactly one thing worth
   * saying, and every default carries a link the caller has to own.
   */
  banner?: ReactNode;
  /** The three step names, left to right. */
  steps?: [string, string, string];
  /**
   * Replaces the note under the tracker.
   *
   * Every default carries a link the caller has to own — "contact our team",
   * "dismiss it now" — so a screen wiring those up replaces the note while
   * keeping the tracker above it. Call `defaultRender()` to decorate.
   */
  renderBanner?: RenderProp<SyncBannerRenderProps>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

const DEFAULT_STEPS: [string, string, string] = ['Prepare', 'Import', 'Done'];

/**
 * The glyph each step draws.
 *
 * One per step rather than a tick everywhere: the envelope says "setting up
 * the inbox" and the arrow says "pulling history in", so the tracker reads
 * even with its labels ignored.
 */
const STEP_ICONS: [IconDef, IconDef, IconDef] = [IconInboxFill, IconDownloadArrow, IconCheck];

/** Headline and supporting line per phase. */
function copyFor(phase: SyncPhase, imported?: number, total?: number) {
  switch (phase) {
    case 'importing':
      return {
        title: 'Importing past 90 days of your conversations',
        description:
          imported != null && total != null
            ? `Syncing ${imported} of ${total} conversations...`
            : 'Syncing your conversations...',
      };
    case 'blocked':
      return {
        title: 'Action required',
        description: 'Complete the action on your device to continue',
      };
    case 'done':
      return { title: 'Inbox ready', description: 'All conversations imported' };
    default:
      return { title: 'Preparing your inbox', description: 'Setting up your CRM workspace' };
  }
}

/**
 * How far each of the three steps has got, in each phase.
 *
 * Held as a table rather than worked out inline: the tracker's whole job is to
 * say where the import is, and a reader checking that should see all four rows
 * at once rather than tracing conditionals.
 */
const STEP_STATES: Record<SyncPhase, [SyncStepState, SyncStepState, SyncStepState]> = {
  preparing: ['active', 'pending', 'pending'],
  importing: ['done', 'active', 'pending'],
  blocked: ['done', 'warning', 'pending'],
  done: ['done', 'done', 'done'],
};

/**
 * The import's progress, as the room list shows it.
 *
 * Figma: node 2966:18086.
 *
 * Two readings of the same thing stacked: a headline saying what is happening
 * right now, and a three-step tracker saying where that sits in the whole run.
 * The headline answers "what is it doing", the tracker answers "how much is
 * left" — a long import needs both, and neither alone is enough.
 */
export const SyncProgress = forwardRef<HTMLDivElement, SyncProgressProps>(function SyncProgress(
  {
    phase = 'preparing',
    title,
    description,
    imported,
    total,
    banner,
    steps = DEFAULT_STEPS,
    renderBanner,
    ...rest
  },
  ref,
) {
  const copy = copyFor(phase, imported, total);
  const states = STEP_STATES[phase];
  const blocked = phase === 'blocked';

  // Each phase has one thing worth saying; `null` turns the note off.
  const defaultBanner =
    phase === 'blocked' ? (
      <>Please authorise your Upwork account through Settings › Upwork API › Connect account.</>
    ) : phase === 'done' ? (
      <>All conversations have been imported. This note disappears on its own after a day.</>
    ) : (
      <>
        By default, CRM imports the past 90 days of your chat history. If an older conversation
        receives a new message, it is still synced automatically.
      </>
    );

  const note = banner === undefined ? defaultBanner : banner;

  return (
    <div
      ref={ref}
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: sync.gap,
        boxSizing: 'border-box',
        width: '100%',
      }}
      {...rest}
    >
      {/* The headline drops away once the import is done: at that point the
          tracker's three ticks say everything, and a "finished" line above
          them would just repeat it. */}
      {phase !== 'done' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: sync.headGap }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: sync.headMarkSize,
              height: sync.headMarkSize,
              borderRadius: '50%',
              backgroundColor: blocked
                ? color.status.warning.background
                : color.main.backgroundAlt,
            }}
          >
            {blocked ? (
              <Icon
                icon={IconWarning}
                size={sync.headIconSize}
                color={color.status.warning.text}
              />
            ) : (
              <Spinner size="medium" />
            )}
          </span>

          <span style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span
              style={{
                ...textStyle.mMedium,
                color: color.navbar.text2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title ?? copy.title}
            </span>
            <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>
              {description ?? copy.description}
            </span>
          </span>
        </div>
      )}

      <SyncTrack
        steps={steps.map((label, index) => ({
          label,
          state: states[index],
          icon: STEP_ICONS[index],
        }))}
      />

      {note != null &&
        (() => {
          const defaultRender = () => (
            <SyncBanner tone={blocked ? 'warning' : 'info'}>{note}</SyncBanner>
          );
          return renderBanner ? renderBanner({ phase, defaultRender }) : defaultRender();
        })()}
    </div>
  );
});
