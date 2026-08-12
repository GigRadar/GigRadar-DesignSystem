import { color, component, radius as radiusToken, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconRightArrow, IconWarningTriangleFill } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';

const { upworkAccounts } = component;

/** Per-instance overrides for the notice's own metrics. */
export type AccountSafetyNoticeStyleProps = {
  /** Corner radius. */
  radius?: CssLength;
  /** Padding on all sides. */
  padding?: CssLength;
  /** Border thickness. */
  borderWidth?: CssLength;
  /** Space between the heading, the body, and the action. */
  gap?: CssLength;
  /** Body type size. */
  fontSize?: CssLength;
  /** Fill. */
  background?: string;
  /** Border color. */
  borderColor?: string;
  /** The round warning plate's fill. */
  iconBackground?: string;
  /** Heading color. */
  titleColor?: string;
  /** Body color. */
  textColor?: string;
};

export type AccountSafetyNoticeProps = {
  /** The heading. */
  title?: ReactNode;
  /** The warning itself. */
  children?: ReactNode;
  /** The trailing link's label. Omit the handler to drop the link entirely. */
  actionLabel?: ReactNode;
  /** Called when the link is pressed. */
  onAction?: () => void;
} & AccountSafetyNoticeStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

const DEFAULT_BODY =
  'For security reasons, logging into multiple Upwork accounts from the same computer is not recommended and may put those accounts at risk. If you need to connect another Upwork account, invite the account owner to this workspace and ask them to log in and connect their account directly.';

/**
 * The security warning in the right column — Figma's "Account safety notice"
 * (node 4893:16319), with its link at 4893:16266.
 *
 * White and plainly bordered rather than painted in the warning ambers: only
 * the round plate carries the warning color. The notice is permanent on this
 * screen — it is not raised by anything the user did — and a full amber card
 * standing beside the blue banner would read as an error to act on.
 */
export const AccountSafetyNotice = forwardRef<HTMLDivElement, AccountSafetyNoticeProps>(
  function AccountSafetyNotice(
    {
      title = 'Account Safety Notice',
      children = DEFAULT_BODY,
      actionLabel = 'Upwork Settings',
      onAction,
      radius,
      padding,
      borderWidth,
      gap,
      fontSize,
      background,
      borderColor,
      iconBackground,
      titleColor,
      textColor,
      ...rest
    },
    ref,
  ) {
    const { notice } = upworkAccounts;

    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: len(gap) ?? `${notice.gap}px`,
      width: '100%',
      padding: len(padding) ?? `${notice.padding}px`,
      borderRadius: len(radius) ?? `${notice.radius}px`,
      border: `${len(borderWidth) ?? `${notice.borderWidth}px`} solid ${
        borderColor ?? color.navbar.border
      }`,
      backgroundColor: background ?? color.main.white,
      fontFamily: typography.fontFamily.base,
    };

    return (
      <div {...rest} ref={ref} style={style}>
        <div style={{ display: 'flex', alignItems: 'center', gap: notice.gap, width: '100%' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: notice.iconPlateSize,
              height: notice.iconPlateSize,
              borderRadius: '50%',
              backgroundColor: iconBackground ?? color.status.warning.main,
              color: color.main.white,
            }}
          >
            <Icon icon={IconWarningTriangleFill} size={14} />
          </span>
          <span
            style={{
              ...typography.textStyle.mMedium,
              color: titleColor ?? color.main.black,
            }}
          >
            {title}
          </span>
        </div>

        <p
          style={{
            ...typography.textStyle.sRegular,
            fontSize: len(fontSize) ?? notice.fontSize,
            color: textColor ?? color.navbar.text,
            // The paragraph line height, not the 1 the rest of the system
            // draws: this is the only block of running prose on the screen and
            // it wraps to five lines.
            lineHeight: typography.lineHeight.paragraph,
            margin: 0,
          }}
        >
          {children}
        </p>

        {/*
          Figma's "Third button" (node 4893:16258) — the design system's subtle
          button on the pale badge fill, drawn as a full pill rather than the
          6px box. Radius and colors are the only divergence, so they are passed
          through rather than the button being rebuilt.
        */}
        {onAction && (
          <Button
            variant="subtle"
            onClick={onAction}
            radius={radiusToken.round}
            background={color.badge.background}
            textColor={color.badge.foreground}
            endIcon={<Icon icon={IconRightArrow} size={14} />}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    );
  },
);
