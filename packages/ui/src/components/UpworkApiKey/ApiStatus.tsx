import { borderWidth, color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCheckmarkCircleFill,
  IconKeyFill,
  IconScheduleClockFill,
  IconWarningCircleFill,
  IconXCirlceRoundFill,
  type IconDef,
} from '../../icons/defs.js';
import { RemoveApiButton, type RemoveApiButtonProps } from './RemoveApiButton.js';

const { status } = component.upworkApiKey;

/** Per-instance overrides for the card's own metrics. */
export type ApiStatusStyleProps = {
  /** Padding. The empty state uses `emptyPaddingY` instead. */
  padding?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Space between the card's bands. */
  gap?: CssLength;
  /** Fill. */
  background?: string;
  /** Edge color. Overrides whatever the state supplies. */
  borderColor?: string;
};

/**
 * What the connected key is doing.
 *
 * `empty` is the only state with nothing to list, and Figma draws it as a
 * taller, centred panel rather than a detail card — there is no key, so there
 * are no rows and no remove button.
 *
 * `rented` is a key GigRadar owns on the user's behalf. It lists a created
 * date but no credentials, because they are not the user's to see, and its
 * closing action disconnects rather than removes.
 */
export type ApiKeyStatus = 'empty' | 'active' | 'expiringSoon' | 'expired' | 'error' | 'rented';

/** One labelled row in the card's detail band. */
export type ApiStatusDetail = {
  label: ReactNode;
  value: ReactNode;
  /**
   * Masks the value, showing only its last few characters.
   *
   * What a secret key needs: enough to recognise which key this is, and not
   * enough to use it.
   */
  secret?: boolean;
};

/** What the detail band gets when a caller replaces it. */
export type ApiStatusDetailsRenderProps = WithDefaultRender & {
  details: ApiStatusDetail[];
};

/** What the closing action gets when a caller replaces it. */
export type ApiStatusActionRenderProps = WithDefaultRender & {
  status: ApiKeyStatus;
  label: string;
};

export type ApiStatusProps = {
  /**
   * Which state to draw.
   *
   * @default 'empty'
   */
  status?: ApiKeyStatus;
  /** Overrides the state's headline. */
  title?: ReactNode;
  /** Overrides the line under it. */
  description?: ReactNode;
  /** The rows in the detail band — Client ID, Secret Key, Created. */
  details?: ApiStatusDetail[];
  /** A note inside the card, under the details. What `rented` explains itself with. */
  note?: ReactNode;
  /** Props forwarded to the closing remove/disconnect button. */
  removeButtonProps?: Omit<RemoveApiButtonProps, 'children'>;
  /** Hides the closing action — for a read-only view of the card. */
  hideAction?: boolean;
  /** Replaces the detail band, keeping the card's bands and spacing. */
  renderDetails?: RenderProp<ApiStatusDetailsRenderProps>;
  /** Replaces the closing action. Call `defaultRender()` to decorate it. */
  renderAction?: RenderProp<ApiStatusActionRenderProps>;
} & ApiStatusStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * The palette, glyph, and copy each state draws with.
 *
 * `rented` is the one state whose headline is not a health report — it names
 * who owns the key — so it sits on the brand blue rather than a status color.
 */
const states: Record<
  ApiKeyStatus,
  { border: string; plate: string; icon: IconDef; iconColor: string; title: string; description: string }
> = {
  empty: {
    border: color.navbar.disabledBackground,
    plate: color.main.background,
    icon: IconKeyFill,
    iconColor: color.main.brand,
    title: 'No API Key Connected',
    description: 'Connect to get started',
  },
  active: {
    border: color.status.success.main,
    plate: color.status.success.background,
    icon: IconCheckmarkCircleFill,
    iconColor: color.status.success.text,
    title: 'Active',
    description: 'API key is working fine',
  },
  expiringSoon: {
    border: color.status.warning.main,
    plate: color.status.warning.background,
    icon: IconScheduleClockFill,
    iconColor: color.status.warning.text,
    title: 'Expiring Soon',
    description: 'API key will expire soon',
  },
  expired: {
    border: color.status.error.main,
    plate: color.status.error.background,
    icon: IconScheduleClockFill,
    iconColor: color.status.error.text,
    title: 'Expired',
    description: 'API key expired',
  },
  error: {
    border: color.status.error.main,
    plate: color.status.error.background,
    icon: IconXCirlceRoundFill,
    iconColor: color.status.error.text,
    title: 'Error',
    description: 'Authentication failed',
  },
  rented: {
    border: color.main.brand,
    plate: color.badge.background,
    icon: IconCheckmarkCircleFill,
    iconColor: color.main.brand,
    title: 'Rented',
    description: 'GigRadar API key',
  },
};

/** Shows only the tail of a secret, masking the rest. */
const maskSecret = (value: ReactNode): ReactNode => {
  if (typeof value !== 'string') return value;
  const tail = value.slice(-5);
  return `${'•'.repeat(Math.max(value.length - tail.length, 0))}${tail}`;
};

/**
 * The card above the credential form — Figma's "API Status" (node 2105:32752).
 *
 * Six states on one shape. The empty state is the outlier: no key means no
 * rows and no action, so Figma pads it taller and centres the plate over two
 * lines of copy. Every other state fills the same card with a status header, a
 * divided detail band, and a closing destructive action.
 *
 * The detail rows are data rather than markup — a caller passes `details` and
 * the card draws the divider, the spacing, and the secret masking. That is
 * what stops each screen re-deriving the 16.5px row and the two greys Figma
 * separates label from value with.
 */
export const ApiStatus = forwardRef<HTMLDivElement, ApiStatusProps>(function ApiStatus(
  {
    status: state = 'empty',
    title,
    description,
    details = [],
    note,
    removeButtonProps,
    hideAction = false,
    renderDetails,
    renderAction,
    padding,
    radius,
    gap,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  const palette = states[state];
  const isEmpty = state === 'empty';
  // A rented key is GigRadar's, so it is handed back rather than deleted.
  const actionLabel = state === 'rented' ? 'Disconnect API key' : 'Remove API key';
  const showAction = !isEmpty && !hideAction;

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    gap: len(gap) ?? `${status.gap}px`,
    padding: isEmpty
      ? `${status.emptyPaddingY}px ${status.padding}px`
      : (len(padding) ?? `${status.padding}px`),
    borderRadius: len(radius) ?? `${status.radius}px`,
    border: `${status.borderWidth}px solid ${borderColor ?? palette.border}`,
    backgroundColor: background ?? color.main.white,
  };

  const plate = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: status.plateSize,
        height: status.plateSize,
        borderRadius: '50%',
        backgroundColor: palette.plate,
        color: palette.iconColor,
      }}
    >
      <Icon icon={palette.icon} size={status.plateIconSize} />
    </span>
  );

  const titleStyle: CSSProperties = {
    color: isEmpty ? color.main.black : palette.iconColor,
    fontFamily: typography.fontFamily.base,
    fontSize: `${status.titleFontSize}px`,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.m,
    lineHeight: 1.2,
  };

  const descriptionStyle: CSSProperties = {
    color: color.navbar.text,
    fontFamily: typography.fontFamily.base,
    fontSize: `${status.descriptionFontSize}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1.2,
  };

  const defaultDetails = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        gap: `${status.rows.gap}px`,
        paddingTop: `${status.rows.paddingTop}px`,
        borderTop: `${borderWidth.thin}px solid ${color.main.backgroundAlt}`,
      }}
    >
      {details.map((detail, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: status.rows.height,
            fontFamily: typography.fontFamily.base,
            fontSize: `${status.rows.fontSize}px`,
            fontWeight: typography.fontWeight.regular,
            letterSpacing: typography.letterSpacing.s,
            lineHeight: 1.2,
          }}
        >
          {/*
            KNOWN DRIFT (accepted): Figma paints these two as raw hex — #516F90
            for the label, #33475B for the value — bound to no style, so the
            extraction cannot see them. They are drawn here from the nav text
            pair (#6C82A4 / #2D323E), which is a step lighter in both cases.
            Deliberate: the design system is the authority, and a two-off pair
            does not earn tokens of its own. Do not "correct" this to the Figma
            hex without adding real tokens for them first.
          */}
          <span style={{ color: color.navbar.text }}>{detail.label}</span>
          <span style={{ color: color.navbar.text2 }}>
            {detail.secret ? maskSecret(detail.value) : detail.value}
          </span>
        </div>
      ))}

      {note != null && (
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            padding: `${status.note.padding}px`,
            borderRadius: `${status.note.radius}px`,
            backgroundColor: color.badge.background,
            color: color.main.description,
            fontFamily: typography.fontFamily.base,
            fontSize: `${status.note.fontSize}px`,
            fontWeight: typography.fontWeight.regular,
            letterSpacing: typography.letterSpacing.s,
            lineHeight: 1.4,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );

  const defaultAction = () => (
    <RemoveApiButton {...removeButtonProps}>
      {removeButtonProps?.state && removeButtonProps.state !== 'idle' ? undefined : actionLabel}
    </RemoveApiButton>
  );

  return (
    <div {...rest} ref={ref} style={cardStyle}>
      {/* The header: a plate over two lines when empty, beside them otherwise. */}
      <div
        style={{
          display: 'flex',
          flexDirection: isEmpty ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isEmpty ? 'center' : 'flex-start',
          width: isEmpty ? 'auto' : '100%',
          gap: isEmpty ? `${status.gap}px` : `${status.headGap}px`,
        }}
      >
        {plate}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isEmpty ? 'center' : 'flex-start',
            gap: `${status.headTitleGap}px`,
            textAlign: isEmpty ? 'center' : 'left',
          }}
        >
          <span style={titleStyle}>{title ?? palette.title}</span>
          <span style={descriptionStyle}>{description ?? palette.description}</span>
        </div>
      </div>

      {!isEmpty &&
        (details.length > 0 || note != null) &&
        (renderDetails
          ? renderDetails({ details, defaultRender: defaultDetails })
          : defaultDetails())}

      {showAction &&
        (renderAction
          ? renderAction({ status: state, label: actionLabel, defaultRender: defaultAction })
          : defaultAction())}
    </div>
  );
});
