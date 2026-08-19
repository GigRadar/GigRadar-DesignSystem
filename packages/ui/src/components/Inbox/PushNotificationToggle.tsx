import { color, component, textStyle } from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '../Button/Button.js';
import { Tooltip, type TooltipAlign } from '../Tooltip/Tooltip.js';
import { NotificationToggle, type NotificationToggleProps } from './NotificationToggle.js';

const { inbox } = component;

/**
 * Whether the browser will actually deliver a notification.
 *
 * Mirrors `NotificationPermission` rather than inventing names, plus
 * `unsupported` for the browsers that have no Notification API at all — which
 * is a real state the UI has to handle and not one the spec provides.
 */
export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

export type PushNotificationToggleProps = {
  /**
   * Whether push notifications are on. Controlled.
   *
   * Distinct from the browser permission: someone can grant permission and
   * still switch the feature off. Permission is what the browser allows, this
   * is what the person wants.
   */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Called after the browser prompt resolves, with what it decided. Use it to
   * persist the outcome, or to surface a "you blocked us" explainer.
   */
  onPermissionChange?: (permission: PushPermission) => void;
  /**
   * Sends a sample notification when permission is newly granted, so the
   * person sees the thing they just enabled.
   *
   * Pass an object to change the wording, or `false` to stay silent — a screen
   * that immediately shows a real notification of its own should not also fire
   * this one.
   *
   * @default a "Notifications are on" confirmation
   */
  confirmation?: { title: string; body?: string } | false;
  /** The tooltip's heading. */
  tooltipTitle?: ReactNode;
  /** The tooltip's body copy. */
  tooltipContent?: ReactNode;
  /**
   * The help link under the body. Omit the href and it renders as plain text;
   * omit `helpLabel` and the line disappears.
   */
  helpLabel?: ReactNode;
  helpHref?: string;
  /** The dismiss button's label. @default 'Later' */
  dismissLabel?: ReactNode;
  /**
   * Suppresses the tooltip — for someone who has already granted permission,
   * or already said "Later" this session.
   *
   * @default false
   */
  hideTooltip?: boolean;
  /**
   * Which edge of the explainer lines up with the toggle's.
   *
   * The card is far wider than the switch, so a centred one hangs half its
   * width off each side. In the Inbox header the toggle sits hard against the
   * column's right edge, which is why that is the default — set `start` where
   * the toggle sits against a left edge instead.
   *
   * @default 'end'
   */
  tooltipAlign?: TooltipAlign;
} & Omit<NotificationToggleProps, 'checked' | 'onCheckedChange'>;

/** Reads the browser's current permission without prompting. */
function readPermission(): PushPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission as PushPermission;
}

/**
 * The Inbox header's push-notification switch, with its explainer.
 *
 * Figma: the toggle at node 1135:16742, the tooltip at 2426:155901 in the CRM
 * file.
 *
 * Wraps `NotificationToggle` rather than replacing it: the bare switch is still
 * the right component wherever permission is already settled and no
 * explanation is owed. This adds the two behaviours that only make sense
 * together — the hover explainer, and asking the browser on the way on.
 *
 * The tooltip is dismissible because it appears over the control it describes.
 * Hovering the toggle to reach something else should not leave a card sitting
 * there, and "Later" is what says *stop offering this* rather than merely
 * moving the pointer away.
 */
export const PushNotificationToggle = forwardRef<HTMLButtonElement, PushNotificationToggleProps>(
  function PushNotificationToggle(
    {
      checked = false,
      onCheckedChange,
      onPermissionChange,
      confirmation,
      tooltipTitle = 'Turn On Push Notifications',
      tooltipContent = 'Stay updated instantly with real-time alerts. Enable push notifications to never miss new messages, comments, or lead updates.',
      helpLabel = 'Why am I still not getting notifications?',
      helpHref,
      dismissLabel = 'Later',
      hideTooltip = false,
      tooltipAlign = 'end',
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    /**
     * Held in state rather than read at render: `Notification.permission` is
     * not reactive, so a component that read it inline would keep showing the
     * pre-prompt copy after the prompt resolved.
     */
    const [permission, setPermission] = useState<PushPermission>('default');
    const wrapper = useRef<HTMLSpanElement>(null);

    useEffect(() => setPermission(readPermission()), []);

    // Once permission is granted there is nothing left to explain, so the
    // explainer retires itself rather than nagging someone already opted in.
    const showTooltip = !hideTooltip && !dismissed && permission !== 'granted';

    const requestPermission = useCallback(async () => {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        onPermissionChange?.('unsupported');
        return 'unsupported' as const;
      }

      // A second request against a settled permission resolves instantly to
      // the same answer, so ask only when the browser might still prompt.
      const next =
        Notification.permission === 'default'
          ? ((await Notification.requestPermission()) as PushPermission)
          : (Notification.permission as PushPermission);

      setPermission(next);
      onPermissionChange?.(next);
      return next;
    }, [onPermissionChange]);

    const handleChange = useCallback(
      async (next: boolean) => {
        // Switching off never prompts — turning something off should not put a
        // permission dialog in the way.
        if (!next) {
          onCheckedChange?.(false);
          return;
        }

        const granted = await requestPermission();

        // Blocked means the switch cannot honestly read as on: the browser
        // will deliver nothing, so leaving it lit would be a lie.
        if (granted !== 'granted') {
          onCheckedChange?.(false);
          return;
        }

        onCheckedChange?.(true);
        setDismissed(true);

        if (confirmation !== false) {
          const { title, body } = confirmation ?? {
            title: 'Notifications are on',
            body: "You'll hear about new messages, comments, and lead updates.",
          };
          // Fires only on a fresh grant, so an already-permitted person
          // toggling the feature back on is not re-shown the sample.
          new Notification(title, { body });
        }
      },
      [confirmation, onCheckedChange, requestPermission],
    );

    const toggle = (
      <NotificationToggle
        ref={ref}
        checked={checked}
        onCheckedChange={handleChange}
        {...rest}
      />
    );

    if (!showTooltip) return toggle;

    return (
      <span
        ref={wrapper}
        // The card overlaps the toggle, so hover is tracked on a wrapper that
        // spans both. Tracking it on the toggle alone would close the card the
        // moment the pointer moved onto it, putting "Later" out of reach.
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'inline-flex' }}
      >
        <Tooltip
          open={hovered}
          // `click` rather than `hover`, despite opening on hover: a hover
          // tooltip sets `pointer-events: none` on its card so that moving onto
          // it does not read as leaving the anchor. This card has a link and a
          // button in it, so it has to accept the pointer. Opening is driven by
          // the wrapper's hover instead, which spans the toggle and the card
          // both, so there is no gap to fall through.
          trigger="click"
          placement="bottom"
          align={tooltipAlign}
          title={tooltipTitle}
          maxWidth={inbox.pushTooltip.maxWidth}
          content={
            <span style={{ display: 'flex', flexDirection: 'column', gap: inbox.pushTooltip.helpGap }}>
              <span>{tooltipContent}</span>
              {helpLabel != null &&
                (helpHref ? (
                  <a
                    href={helpHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...textStyle.sMedium, color: color.badge.foreground }}
                  >
                    {helpLabel}
                  </a>
                ) : (
                  <span style={{ ...textStyle.sMedium, color: color.badge.foreground }}>
                    {helpLabel}
                  </span>
                ))}
            </span>
          }
          actions={
            <Button variant="secondary" size="small" fullWidth onClick={() => setDismissed(true)}>
              {dismissLabel}
            </Button>
          }
        >
          {toggle}
        </Tooltip>
      </span>
    );
  },
);
