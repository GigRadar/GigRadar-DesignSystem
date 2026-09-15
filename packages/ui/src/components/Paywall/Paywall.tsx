import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconLockFill } from '../../icons/defs.js';
import { RentApiBanner } from '../UpworkApiKey/RentApiBanner.js';
import { PlanCard, type PlanCardProps, type PlanCardTone } from './PlanCard.js';
import { PaywallSwitchButton, SubscriptionSwitch } from './SubscriptionSwitch.js';

const { paywall } = component;

/**
 * Where the workspace stands with its subscription.
 *
 * `new` has never paid — the modal is locked and every plan is on offer.
 * `current` is paying, so one card is theirs and the rest are upgrades.
 * `trialEnded` has run out, which is `new` with the reason said out loud.
 */
export type PaywallPeriod = 'new' | 'current' | 'trialEnded';

/** One billing cycle in the switch. */
export type BillingCycle = {
  /** React key, and what `onCycleChange` reports. */
  id: string;
  label: ReactNode;
  /** A trailing pill — "Save 20%". Only the cycle that saves money has one. */
  saving?: ReactNode;
};

/** One plan on offer. */
export type PaywallPlan = {
  /** React key, and what `onChoosePlan` reports. */
  id: string;
  tone: PlanCardTone;
} & Omit<PlanCardProps, 'tone' | 'state' | 'onAction' | 'onTrial'>;

/** What the plan row's render prop receives. */
export type PlanRowRenderProps = WithDefaultRender & {
  plans: PaywallPlan[];
  currentPlan?: string;
};

/** What one card's render prop receives. */
export type PaywallPlanRenderProps = WithDefaultRender & {
  plan: PaywallPlan;
  /** Whether this is the plan the workspace already pays for. */
  current: boolean;
};

export type PaywallProps = {
  /**
   * @default 'new'
   */
  period?: PaywallPeriod;

  /** The headline. Its highlighted span is the caller's to mark up. */
  title?: ReactNode;
  /** The paragraph under it. */
  description?: ReactNode;

  /** The cycles in the switch. Omit to drop it. */
  cycles?: BillingCycle[];
  /** Which cycle is chosen, by id. */
  cycle?: string;
  /** Called with the cycle the reader picked. */
  onCycleChange?: (id: string) => void;

  /** The plans, left to right. */
  plans?: PaywallPlan[];
  /** Which plan the workspace pays for, by id. Draws its card as `current`. */
  currentPlan?: string;
  /** Called with the plan the reader chose. */
  onChoosePlan?: (plan: PaywallPlan) => void;
  /** Called when a card's trial button is pressed. */
  onStartTrial?: (plan: PaywallPlan) => void;

  /**
   * The badge on the left of the top bar.
   *
   * Defaults to what the period means: a lock while the workspace cannot get
   * in, and the days left while it still can.
   */
  status?: ReactNode;
  /** The days left on a trial — drawn in place of the lock while `current`. */
  daysRemaining?: number;
  /** The plan pill on the right of the top bar. Omit to drop it. */
  planBadge?: ReactNode;

  /** Offers a rented API key under the cards. Omit to drop the banner. */
  onRentApiKey?: () => void;

  /** Replaces the whole plan row. Prefer `renderPlan` when one card changes. */
  renderPlans?: RenderProp<PlanRowRenderProps>;
  /** Replaces one card, keeping the row around it. */
  renderPlan?: RenderProp<PaywallPlanRenderProps>;
} & PaywallStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/** Per-instance overrides for the modal's own metrics. */
export type PaywallStyleProps = {
  width?: CssLength;
  padding?: CssLength;
  radius?: CssLength;
  sectionGap?: CssLength;
  background?: string;
};

/**
 * The CRM paywall — the locked modal that sells the plans.
 *
 * Figma: node 1360:9925, in its New, Current, and Trial End periods.
 *
 * The screen-level component: give it the plans and where the workspace
 * stands, and it draws the whole modal. The three periods are one layout with
 * three answers to the same question — what is this workspace allowed to do
 * right now — so they are a prop rather than three screens: a `current`
 * workspace gets its own card marked and the rest turned into upgrades, and
 * the others get a locked badge and a row of offers.
 *
 * `PlanCard` and `SubscriptionSwitch` are exported beside it for screens that
 * show a plan outside this modal — a settings page naming the current plan, an
 * upgrade prompt inline in a feature.
 */
export const Paywall = forwardRef<HTMLDivElement, PaywallProps>(function Paywall(
  {
    period = 'new',
    title,
    description,
    cycles = [],
    cycle,
    onCycleChange,
    plans = [],
    currentPlan,
    onChoosePlan,
    onStartTrial,
    status,
    daysRemaining,
    planBadge,
    onRentApiKey,
    renderPlans,
    renderPlan,
    width,
    padding,
    radius,
    sectionGap,
    background,
    ...rest
  },
  ref,
) {
  const locked = period !== 'current';

  const defaultPlans = () => (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: `${paywall.sectionGap / 4}px` }}>
      {plans.map((plan) => {
        const isCurrent = currentPlan != null && plan.id === currentPlan;
        const { id, tone, ...cardProps } = plan;

        const card = () => (
          <PlanCard
            {...cardProps}
            tone={tone}
            /*
             * A paying workspace sees its own plan marked and the others as
             * upgrades; everyone else sees the row as Figma flags it, which is
             * Pro as the one being pushed.
             */
            state={
              isCurrent ? 'current' : tone === 'pro' && currentPlan == null ? 'popular' : 'default'
            }
            actionLabel={
              cardProps.actionLabel ??
              (currentPlan != null && !isCurrent ? `Upgrade to ${cardProps.name ?? tone} Plan` : undefined)
            }
            onAction={() => onChoosePlan?.(plan)}
            onTrial={onStartTrial && (() => onStartTrial(plan))}
          />
        );

        return (
          <div key={id} style={{ display: 'flex' }}>
            {renderPlan ? renderPlan({ plan, current: isCurrent, defaultRender: card }) : card()}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: len(sectionGap) ?? `${paywall.sectionGap}px`,
        width: len(width) ?? `${paywall.width}px`,
        maxWidth: '100%',
        padding: len(padding) ?? `${paywall.padding}px`,
        borderRadius: len(radius) ?? `${paywall.radius}px`,
        backgroundColor: background ?? color.main.background,
      }}
      {...rest}
    >
      {/* The top bar — where the workspace stands, the cycle, and its plan. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: `${paywall.titleGap}px`,
          minHeight: `${paywall.headerHeight}px`,
        }}
      >
        <span
          style={{
            ...textStyle.sRegular,
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
            gap: `${paywall.periodBadge.gap}px`,
            padding: `${paywall.periodBadge.paddingY}px ${paywall.periodBadge.paddingX}px`,
            borderRadius: `${paywall.periodBadge.radius}px`,
            backgroundColor: color.navbar.hover,
            color: color.navbar.text,
            fontSize: paywall.periodBadge.fontSize,
          }}
        >
          {status ?? (
            <>
              {locked && <Icon icon={IconLockFill} size={paywall.periodBadge.iconSize} />}
              {locked
                ? 'Locked'
                : `${daysRemaining ?? 0} Days remaining`}
            </>
          )}
        </span>

        {cycles.length > 0 && (
          <SubscriptionSwitch>
            {cycles.map((entry) => (
              <PaywallSwitchButton
                key={entry.id}
                selected={entry.id === cycle}
                saving={entry.saving}
                onClick={() => onCycleChange?.(entry.id)}
              >
                {entry.label}
              </PaywallSwitchButton>
            ))}
          </SubscriptionSwitch>
        )}

        {/* Balances the badge on the left so the switch stays centred. An
            empty span rather than nothing: without it the switch drifts. */}
        <span style={{ flexShrink: 0 }}>{planBadge}</span>
      </div>

      {/* The pitch. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${paywall.titleGap}px`,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: `${paywall.titleFontSize}px`,
            fontWeight: 600,
            letterSpacing: `${paywall.titleTracking}px`,
            color: color.main.black,
          }}
        >
          {title}
        </h2>
        {description != null && (
          <p
            style={{
              ...textStyle.mRegular,
              margin: 0,
              maxWidth: `${paywall.descriptionWidth}px`,
              color: color.main.description,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* The plans. */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderPlans
          ? renderPlans({ plans, currentPlan, defaultRender: defaultPlans })
          : defaultPlans()}
      </div>

      {/*
       * The rented-key offer. Only a paying workspace is shown it — someone who
       * has not chosen a plan has a more immediate decision in front of them,
       * and Figma hides the banner in both locked periods for that reason.
       */}
      {onRentApiKey && period === 'current' && (
        <RentApiBanner onAction={onRentApiKey} />
      )}
    </div>
  );
});
