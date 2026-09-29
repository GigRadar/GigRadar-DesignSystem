import { borderWidth, color, component, typography } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconLockFill, IconNosign } from '../../icons/defs.js';

const { stopRule } = component.autoReply;

/** One thing the AI never does by itself. */
export type StopRule = {
  /** Stable identity. */
  id: string;
  /** What the client message does — "Talks about price". */
  title: ReactNode;
  /** What the AI never does about it — "Never quotes, discounts or agrees to a rate." */
  detail: ReactNode;
};

/**
 * The three rules every team gets, fixed.
 *
 * Exported because they are a platform constant rather than a team setting —
 * BF-4113 decided the rules cannot be switched off or edited, so the copy
 * lives with the component instead of being retyped at each call site.
 */
export const defaultStopRules: StopRule[] = [
  {
    id: 'price',
    title: 'Talks about price',
    detail: 'Never quotes, discounts or agrees to a rate.',
  },
  {
    id: 'scope',
    title: 'Asks to confirm scope',
    detail: 'Never agrees to deliverables, deadlines or extra work.',
  },
  {
    id: 'negative',
    title: 'Sounds unhappy',
    detail: 'Never answers a complaint, a refusal or a frustrated message.',
  },
];

export type StopRuleListProps = {
  /** The rules, in order. Defaults to the fixed three. */
  rules?: StopRule[];
  /** The heading. Pass `null` to drop it. */
  title?: ReactNode;
  /** The line under the heading, leading into the list. */
  description?: ReactNode;
  /** The line under the list — where a handed-over thread ends up. */
  footnote?: ReactNode;
  /** The word beside each lock. */
  lockLabel?: ReactNode;
  /**
   * Drops the lock's label and keeps the glyph — for a phone, where the label
   * takes room the rule's own detail needs.
   */
  compact?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title' | 'children'>;

/**
 * The stop rules on the Auto Reply card — BF-4113, proposal 1.
 *
 * The things the AI never does on its own: talk price, confirm scope, answer a
 * negative message. Each hands the thread to a person instead. They are fixed
 * and read-only — a lock and "Always on" in place of a control — because they
 * are the floor that makes Full Auto safe to turn on, and a floor a team could
 * switch off would not be one.
 *
 * Pass it in `AutoReply`'s `details` slot on the all-other-replies tab.
 */
export const StopRuleList = forwardRef<HTMLDivElement, StopRuleListProps>(function StopRuleList(
  {
    rules = defaultStopRules,
    title = 'Stop rules',
    description = 'Laziza stops and passes the thread to you when a client message…',
    footnote = 'A passed thread waits in the Inbox with a note saying which rule stopped it.',
    lockLabel = 'Always on',
    compact = false,
    ...rest
  },
  ref,
) {
  const edge = color.navbar.hover;

  return (
    <div
      {...rest}
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: stopRule.blockGap,
        width: '100%',
        fontFamily: typography.fontFamily.base,
      }}
    >
      {title !== null && (
        <span style={{ ...typography.textStyle.mMedium, color: color.main.black }}>{title}</span>
      )}
      {description && (
        <span style={{ ...typography.textStyle.mRegular, color: color.main.description }}>
          {description}
        </span>
      )}

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          borderRadius: stopRule.radius,
          border: `${borderWidth.thin}px solid ${edge}`,
          backgroundColor: color.main.white,
          overflow: 'hidden',
        }}
      >
        {rules.map((rule, index) => (
          <li
            key={rule.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: stopRule.gap,
              padding: stopRule.padding,
              borderBottom:
                index === rules.length - 1 ? 'none' : `${borderWidth.thin}px solid ${edge}`,
            }}
          >
            <span aria-hidden style={{ display: 'inline-flex', flexShrink: 0, color: color.status.error.main }}>
              <Icon icon={IconNosign} size={stopRule.iconSize} />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: stopRule.textGap,
                flex: '1 1 auto',
                minWidth: 0,
              }}
            >
              <span style={{ ...typography.textStyle.mMedium, color: color.navbar.text2 }}>
                {rule.title}
              </span>
              <span style={{ ...typography.textStyle.sRegular, color: color.navbar.text }}>
                {rule.detail}
              </span>
            </span>
            <span
              title={typeof lockLabel === 'string' ? lockLabel : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
                gap: stopRule.lockGap,
                ...typography.textStyle.sMedium,
                color: color.navbar.text,
              }}
            >
              <Icon icon={IconLockFill} size={stopRule.lockSize} />
              {compact ? (
                // Still read out — the glyph alone says nothing to a screen reader.
                <span style={visuallyHidden}>{lockLabel}</span>
              ) : (
                lockLabel
              )}
            </span>
          </li>
        ))}
      </ul>

      {footnote && (
        <span style={{ ...typography.textStyle.sRegular, color: color.navbar.text }}>{footnote}</span>
      )}
    </div>
  );
});

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;
