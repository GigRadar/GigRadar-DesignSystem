import { color, component, radius, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconCheck, IconWarning, type IconDef } from '../../icons/defs.js';

const { sync } = component.inbox;

/**
 * Where one step of the import has got to.
 *
 * `pending` is a step not reached yet, `active` the one running, `done` one
 * finished, and `warning` one that stopped and needs the person to do
 * something. Warning is distinct from an error because the import has not
 * failed — it is waiting, and it will carry on once the block is cleared.
 */
export type SyncStepState = 'pending' | 'active' | 'done' | 'warning';

/** One step, as `SyncTrack` takes them. */
export type SyncStepItem = {
  label: ReactNode;
  state?: SyncStepState;
  /**
   * The glyph inside the mark.
   *
   * Each step draws its own — an envelope for preparing, a download arrow for
   * the import — because the state colours the mark while the glyph says which
   * step it is. A `warning` overrides it: once a step has stopped, that matters
   * more than what it was doing.
   */
  icon?: IconDef;
};

/** Mark fill and glyph colour per state. */
function markFor(state: SyncStepState) {
  switch (state) {
    case 'done':
      return { fill: color.status.success.main, glyph: color.main.white };
    case 'active':
      return { fill: color.badge.foreground, glyph: color.main.white };
    case 'warning':
      return { fill: color.status.warning.background, glyph: color.status.warning.text };
    default:
      return { fill: color.main.backgroundAlt, glyph: color.navbar.text };
  }
}

/**
 * The colour of the rail leaving a step.
 *
 * The rail carries the colour of the step it leaves, so the line changes hue
 * at each mark: green out of a finished step, blue out of the running one,
 * grey out of anything not reached yet.
 */
function railFor(state: SyncStepState) {
  switch (state) {
    case 'done':
      return color.status.success.main;
    case 'active':
      return color.badge.foreground;
    default:
      return color.main.backgroundAlt;
  }
}

export type SyncStepProps = {
  label: ReactNode;
  state?: SyncStepState;
  icon?: IconDef;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One step's mark and label, without any rail.
 *
 * Exported for the rare screen that wants a single step on its own. A row of
 * them belongs in `SyncTrack`, which is what draws the rails between them —
 * a step cannot draw its own rail and still have it meet the next mark,
 * because each step is laid out independently of its neighbours.
 */
export const SyncStep = forwardRef<HTMLDivElement, SyncStepProps>(function SyncStep(
  { label, state = 'pending', icon, ...rest },
  ref,
) {
  const mark = markFor(state);

  return (
    <div
      ref={ref}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: sync.stepStackGap,
      }}
      {...rest}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: sync.stepMarkSize,
          height: sync.stepMarkSize,
          borderRadius: '50%',
          backgroundColor: mark.fill,
        }}
      >
        <Icon
          icon={state === 'warning' ? IconWarning : icon ?? IconCheck}
          size={sync.stepIconSize}
          color={mark.glyph}
        />
      </span>

      <span
        style={{
          ...textStyle.sRegular,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          color: state === 'pending' ? color.navbar.text : color.navbar.text2,
        }}
      >
        {label}
      </span>
    </div>
  );
});

export type SyncTrackProps = {
  /** The steps, left to right. */
  steps: SyncStepItem[];
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The step tracker — marks joined by rails.
 *
 * Figma: node 2965:18056.
 *
 * Built as one row that alternates mark, rail, mark rather than as steps that
 * each carry their own rail. A rail has to end exactly where the next mark
 * begins, and a step laid out on its own cannot know where that is: the rails
 * belong to the track, not to the steps either side of them.
 *
 * The labels sit in a second row beneath, positioned by the same flex rule as
 * the marks above, so each label stays centred under its own mark however long
 * the words are.
 */
export const SyncTrack = forwardRef<HTMLDivElement, SyncTrackProps>(function SyncTrack(
  { steps, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{ display: 'flex', flexDirection: 'column', gap: sync.stepStackGap, width: '100%' }}
      {...rest}
    >
      {/* Marks and rails. The rails flex, the marks do not, so the marks land
          at the ends and the spare width is shared evenly between them. */}
      <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {steps.map((step, index) => {
          const state = step.state ?? 'pending';
          const mark = markFor(state);

          return (
            <span key={index} style={{ display: 'contents' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: sync.stepMarkSize,
                  height: sync.stepMarkSize,
                  borderRadius: '50%',
                  backgroundColor: mark.fill,
                }}
              >
                <Icon
                  icon={state === 'warning' ? IconWarning : step.icon ?? IconCheck}
                  size={sync.stepIconSize}
                  color={mark.glyph}
                />
              </span>

              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: sync.railHeight,
                    borderRadius: radius.round,
                    backgroundColor: railFor(state),
                  }}
                />
              )}
            </span>
          );
        })}
      </span>

      {/* Labels, laid out on the same rule: a fixed-width box under each mark,
          flexible spacers between. Matching the row above is what keeps every
          label centred on its own mark. */}
      <span style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        {steps.map((step, index) => {
          const state = step.state ?? 'pending';

          return (
            <span key={index} style={{ display: 'contents' }}>
              {/* Centred over the mark's own width, so a label wider than 32px
                  overhangs evenly instead of pushing the marks apart. The
                  inner span is absolutely placed, so the outer one is given an
                  explicit height — otherwise the row collapses to nothing and
                  whatever sits below rides up against the labels. */}
              <span
                style={{
                  ...textStyle.sRegular,
                  position: 'relative',
                  flexShrink: 0,
                  width: sync.stepMarkSize,
                  height: sync.stepLabelHeight,
                  textAlign: 'center',
                  color: state === 'pending' ? color.navbar.text : color.navbar.text2,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </span>
              </span>
              {index < steps.length - 1 && <span style={{ flex: 1, minWidth: 0 }} />}
            </span>
          );
        })}
      </span>
    </div>
  );
});
