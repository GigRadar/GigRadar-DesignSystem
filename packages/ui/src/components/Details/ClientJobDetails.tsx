import {
  borderWidth as borderWidthToken,
  color,
  component,
  radius as radiusToken,
  textStyle,
} from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconGoToExternal, IconSelectTimeClockFill } from '../../icons/defs.js';
import { Avatar } from '../Avatar/Avatar.js';
import { Button } from '../Button/Button.js';

const { client, emptyGap } = component.details;

/**
 * What the card has to show.
 *
 * `external` is not a failure: the room is about a job posted outside Upwork,
 * so there is no client record to load and never will be. It reads differently
 * from `error`, which is a load that can be retried.
 */
export type ClientJobState = 'default' | 'loading' | 'error' | 'external';

/** One counter in the five-up strip — how many proposals reached this stage. */
export type ClientStat = {
  label: ReactNode;
  value: ReactNode;
};

/** One row of the rate table. */
export type ClientDetailRow = {
  label: ReactNode;
  value: ReactNode;
};

/** Per-instance overrides for the card's own metrics. */
export type ClientJobDetailsStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  gap?: CssLength;
  borderWidth?: CssLength;
  avatarSize?: CssLength;
  background?: string;
  borderColor?: string;
};

export type ClientJobDetailsProps = {
  /**
   * @default 'default'
   */
  state?: ClientJobState;
  /** The client's name, and what they are to this room. */
  name?: ReactNode;
  /** The line under it — "Client". */
  role?: ReactNode;
  /** A photo. Falls back to initials taken from `name`. */
  avatarSrc?: string;
  /** The client's local time, and the offsets beside it. */
  clientTime?: ReactNode;
  /** The reader's own local time, for the comparison the row exists to make. */
  yourTime?: ReactNode;
  /** The client's UTC offset — "UTC +1". */
  utcOffset?: ReactNode;
  /** The reader's, drawn in the quieter grey — "GMT +1". */
  gmtOffset?: ReactNode;
  /** The five counters. Any number is accepted; Figma draws five. */
  stats?: ClientStat[];
  /**
   * The contract type, drawn as the table's head row — "Hourly Rate".
   * Omitted, the table starts at its first row.
   */
  contractType?: ReactNode;
  /** The label beside it. Defaults to "Contract Type". */
  contractLabel?: ReactNode;
  /** The rate rows under the head. */
  rows?: ClientDetailRow[];
  /** The error state's heading and explanation. */
  errorTitle?: ReactNode;
  errorDescription?: ReactNode;
  /** Retries the load. Only the error state draws it. */
  onRetry?: () => void;
  /** The retry button's label. Defaults to "Try Again". */
  retryLabel?: ReactNode;
} & ClientJobDetailsStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** A grey bar standing in for a value that has not arrived yet. */
function Bar({ width = '100%' }: { width?: CssLength }) {
  return (
    <span
      style={{
        display: 'block',
        width: len(width),
        height: `${client.skeletonHeight}px`,
        borderRadius: `${client.skeletonRadius}px`,
        backgroundColor: color.disable.background,
      }}
    />
  );
}

/** One row of the rate table — a label on the left, its value on the right. */
function TableRow({
  label,
  value,
  head = false,
  last = false,
}: {
  label: ReactNode;
  value: ReactNode;
  head?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: `${client.gap}px`,
        padding: head
          ? `${client.headPaddingTop}px ${client.tablePaddingX}px ${client.headPaddingBottom}px`
          : `${client.rowPaddingTop}px ${client.tablePaddingX}px ${client.rowPaddingBottom}px`,
        backgroundColor: head ? color.main.background : undefined,
        borderBottom: last ? undefined : `${borderWidthToken.thin}px solid ${color.main.backgroundAlt}`,
      }}
    >
      <span style={{ ...(head ? textStyle.mMedium : textStyle.mRegular), color: color.navbar.text }}>
        {label}
      </span>
      <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>{value}</span>
    </div>
  );
}

/**
 * Who the client is, what they have hired for, and what they pay.
 *
 * Figma: node 4408:31380, in its Default, Loading, Error, and External states.
 *
 * The card answers one question — is this lead worth the next hour — and it
 * answers it top to bottom: who they are, whether they are awake, how many
 * people they have already talked to, and what the money looks like. The stat
 * strip is the part that decides it, which is why it sits above the table
 * rather than inside it.
 *
 * `external` carries no stats and no table, because a job posted outside
 * Upwork has no hiring history to read. It is a state rather than a separate
 * component so the pane does not have to choose which card to render.
 */
export const ClientJobDetails = forwardRef<HTMLDivElement, ClientJobDetailsProps>(
  function ClientJobDetails(
    {
      state = 'default',
      name,
      role,
      avatarSrc,
      clientTime,
      yourTime,
      utcOffset,
      gmtOffset,
      stats = [],
      contractType,
      contractLabel = 'Contract Type',
      rows = [],
      errorTitle = "Couldn't load client and job details",
      errorDescription = 'Something wrong while loading the client and job details.',
      onRetry,
      retryLabel = 'Try Again',
      radius,
      padding,
      gap,
      borderWidth,
      avatarSize,
      background,
      borderColor,
      ...rest
    },
    ref,
  ) {
    const loading = state === 'loading';
    const error = state === 'error';
    const external = state === 'external';

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: error ? 'center' : 'stretch',
          gap: len(gap) ?? `${client.gap}px`,
          padding: len(padding) ?? `${client.padding}px`,
          borderRadius: len(radius) ?? `${client.radius}px`,
          border: `${len(borderWidth) ?? `${client.borderWidth}px`} solid ${
            borderColor ?? color.main.border
          }`,
          backgroundColor: background ?? color.main.white,
          overflow: 'hidden',
        }}
        {...rest}
      >
        {/* Who this is. `external` draws the job post itself, which has no
            person behind it; `error` draws nothing here, because a card that
            failed to load has no name to show. */}
        {!error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: `${client.headerGap}px`,
          }}
        >
          {external ? (
            /*
             * Drawn here rather than as an `Avatar`: the avatar's content is
             * initials, a photo, or a service mark, and this slot holds a
             * glyph. Same diameter and the same badge palette, so it sits on
             * the row exactly where a client's face would.
             */
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: len(avatarSize) ?? `${client.avatarSize}px`,
                height: len(avatarSize) ?? `${client.avatarSize}px`,
                borderRadius: `${radiusToken.round}px`,
                backgroundColor: color.badge.background,
                border: `${client.externalBorderWidth}px solid ${color.badge.foreground}`,
                color: color.badge.foreground,
              }}
            >
              <Icon icon={IconGoToExternal} size={client.externalIconSize} />
            </span>
          ) : (
            <Avatar
              size="large"
              diameter={len(avatarSize) ?? client.avatarSize}
              name={typeof name === 'string' ? name : undefined}
              src={avatarSrc}
              type={loading ? 'placeholder' : undefined}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: `${client.nameGap}px`, minWidth: 0 }}>
            {loading ? (
              <Bar width={96} />
            ) : (
              <>
                <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
                  {external ? (name ?? 'External') : name}
                </span>
                <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>
                  {external ? (role ?? 'Outside job post') : role}
                </span>
              </>
            )}
          </div>
        </div>
        )}

        {/* The two clocks. The card's reason for carrying them is the gap
            between them — whether a reply now would land while they are awake. */}
        {!error && !external && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${client.timeGap}px` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${client.timeGap}px` }}>
              {loading ? (
                <Bar />
              ) : (
                <>
                  <Icon
                    icon={IconSelectTimeClockFill}
                    size={client.timeIconSize}
                    color={color.badge.foreground}
                  />
                  <span style={{ ...textStyle.mMedium, color: color.navbar.text2, flex: '1 0 0' }}>
                    Client time: {clientTime}
                  </span>
                  {utcOffset != null && <OffsetPill tone="brand">{utcOffset}</OffsetPill>}
                  {gmtOffset != null && <OffsetPill tone="quiet">{gmtOffset}</OffsetPill>}
                </>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${client.timeGap}px` }}>
              {loading ? (
                <Bar />
              ) : (
                <>
                  <Icon
                    icon={IconSelectTimeClockFill}
                    size={client.timeIconSize}
                    color={color.navbar.text}
                  />
                  <span style={{ ...textStyle.mRegular, color: color.navbar.text }}>
                    Your time: {yourTime}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* The five counters. */}
        {!error && !external && stats.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: `${client.statGap}px` }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flex: '1 0 0',
                  minWidth: 0,
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: `${client.statGapY}px`,
                  padding: `${client.statPaddingY}px ${client.statPaddingX}px`,
                  borderRadius: `${client.statRadius}px`,
                  backgroundColor: loading ? color.disable.background : color.main.background,
                  border: `${borderWidthToken.thin}px solid ${loading ? color.disable.background : color.main.backgroundAlt}`,
                }}
              >
                <span
                  style={{
                    ...textStyle.mSemibold,
                    color: color.navbar.text2,
                    visibility: loading ? 'hidden' : undefined,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    ...textStyle.sRegular,
                    fontSize: `${client.statLabelSize}px`,
                    color: color.navbar.text,
                    textAlign: 'center',
                    visibility: loading ? 'hidden' : undefined,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* The rate table. */}
        {!error && !external && (rows.length > 0 || contractType != null) && (
          <div
            style={{
              borderRadius: `${client.tableRadius}px`,
              border: `${borderWidthToken.thin}px solid ${loading ? color.disable.background : color.main.backgroundAlt}`,
              backgroundColor: loading ? color.disable.background : color.main.white,
              overflow: 'hidden',
              visibility: loading ? 'hidden' : undefined,
            }}
          >
            {contractType != null && (
              <TableRow
                head
                label={contractLabel}
                value={
                  <span
                    style={{
                      ...textStyle.sMedium,
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: `${client.pillPaddingY}px ${client.pillPaddingX}px`,
                      borderRadius: `${radiusToken.round}px`,
                      color: color.badge.foreground,
                      backgroundColor: color.badge.background,
                      border: `${borderWidthToken.thin}px solid ${color.badge.foreground}`,
                    }}
                  >
                    {contractType}
                  </span>
                }
              />
            )}
            {rows.map((row, index) => (
              <TableRow
                key={index}
                label={row.label}
                value={row.value}
                last={index === rows.length - 1}
              />
            ))}
          </div>
        )}

        {/* The load failed, and can be tried again. */}
        {error && (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: `${emptyGap}px`,
                textAlign: 'center',
              }}
            >
              <span style={{ ...textStyle.mMedium, color: color.main.black }}>{errorTitle}</span>
              <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>
                {errorDescription}
              </span>
            </div>
            {onRetry && (
              <Button variant="secondary" size="small" onClick={onRetry}>
                {retryLabel}
              </Button>
            )}
          </>
        )}
      </div>
    );
  },
);

/** The small offset pill beside the client's clock. */
function OffsetPill({ children, tone }: { children: ReactNode; tone: 'brand' | 'quiet' }) {
  return (
    <span
      style={{
        ...textStyle.sMedium,
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        padding: `${client.pillPaddingY}px ${client.pillPaddingX}px`,
        borderRadius: `${radiusToken.round}px`,
        color: tone === 'brand' ? color.badge.foreground : color.navbar.text,
        backgroundColor: tone === 'brand' ? color.badge.background : color.navbar.hover,
      }}
    >
      {children}
    </span>
  );
}
