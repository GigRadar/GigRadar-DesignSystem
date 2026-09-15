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
import { IconEditPencilArrow, IconLazizaCrossSparkleFill } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { IconButton } from '../Button/IconButton.js';

const { aiConfig, emptyGap } = component.details;

/**
 * What the card has to say.
 *
 * `off` is the configuration existing but switched off, which is a different
 * thing from it failing to load — the badges stay, greyed, so the reader can
 * see what would happen if they turned it back on.
 */
export type CrmAiConfigState = 'default' | 'off' | 'error';

/**
 * One message-type badge — which kind of message, and how the AI handles it.
 *
 * Drawn as two halves around a dot ("First • Full Auto") because the pair is
 * one fact: the mode only means anything against the message type it applies
 * to.
 */
export type AiMessageMode = {
  /** Which messages — "First", "Other". */
  type: ReactNode;
  /** What the AI does with them — "Full Auto", "Co-pilot". */
  mode: ReactNode;
  /**
   * The badge's fill. Defaults to the Laziza orange for the first badge and
   * its lighter partner for the rest. Ignored while the card is `off`, which
   * greys every badge.
   */
  tone?: string;
};

/** Per-instance overrides for the card's own metrics. */
export type CrmAiConfigurationStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  gap?: CssLength;
  borderWidth?: CssLength;
  background?: string;
  borderColor?: string;
};

export type CrmAiConfigurationProps = {
  /**
   * @default 'default'
   */
  state?: CrmAiConfigState;
  /** The label above the version field. Defaults to "Prompt version". */
  versionLabel?: ReactNode;
  /** Which revision of the prompt this room runs on. */
  version?: ReactNode;
  /** Opens the prompt for editing. Draws the pencil when set. */
  onEdit?: () => void;
  /** The label above the badges. Defaults to "Message type". */
  modeLabel?: ReactNode;
  /** The badges. */
  modes?: AiMessageMode[];
  /** The error state's heading and explanation. */
  errorTitle?: ReactNode;
  errorDescription?: ReactNode;
  /** Retries the load. Only the error state draws it. */
  onRetry?: () => void;
  /** The retry button's label. Defaults to "Try Again". */
  retryLabel?: ReactNode;
} & CrmAiConfigurationStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * What the AI is doing in this room, and on which prompt.
 *
 * Figma: node 4285:25258, in its Default, OFF, and Error states.
 *
 * The one card on the pane drawn in the Laziza orange with a 1.5px border.
 * That is deliberate: everything else on the pane is something the reader
 * looks up, and this is the only thing acting on the conversation on its own.
 * A reader scrolling the pane should be able to find it without reading.
 *
 * The prompt version is shown, not chosen. Which revision a room runs on is
 * decided in the AI settings screen; this card says which one won and offers
 * the way back there.
 */
export const CrmAiConfiguration = forwardRef<HTMLDivElement, CrmAiConfigurationProps>(
  function CrmAiConfiguration(
    {
      state = 'default',
      versionLabel = 'Prompt version',
      version,
      onEdit,
      modeLabel = 'Message type',
      modes = [],
      errorTitle = "Couldn't load CRM AI configuration",
      errorDescription = 'Something wrong while loading the configuration.',
      onRetry,
      retryLabel = 'Try Again',
      radius,
      padding,
      gap,
      borderWidth,
      background,
      borderColor,
      ...rest
    },
    ref,
  ) {
    const off = state === 'off';
    const error = state === 'error';

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: error ? 'center' : 'stretch',
          justifyContent: error ? 'center' : undefined,
          gap: len(gap) ?? `${aiConfig.gap}px`,
          padding: len(padding) ?? `${aiConfig.padding}px`,
          borderRadius: len(radius) ?? `${aiConfig.radius}px`,
          border: `${len(borderWidth) ?? `${aiConfig.borderWidth}px`} solid ${
            borderColor ?? color.accent.laziza.main
          }`,
          backgroundColor: background ?? color.main.white,
        }}
        {...rest}
      >
        {!error && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${aiConfig.rowGap}px` }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: `${aiConfig.rowGap}px`,
                }}
              >
                <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
                  {versionLabel}
                </span>
                {onEdit && (
                  <IconButton
                    icon={IconEditPencilArrow}
                    variant="ghost"
                    size="small"
                    aria-label="Edit prompt"
                    onClick={onEdit}
                  />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: `${aiConfig.fieldPadding}px`,
                  borderRadius: `${aiConfig.fieldRadius}px`,
                  backgroundColor: color.main.background,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    ...textStyle.mRegular,
                    color: color.navbar.text,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {version}
                </span>
              </div>
            </div>

            {/* The hairline between the two rows. A 1px background rather than
                a border, so it spans the card's full padded width. */}
            <div style={{ height: `${borderWidthToken.thin}px`, backgroundColor: color.main.background }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: `${aiConfig.rowGap}px` }}>
              <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>{modeLabel}</span>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: `${aiConfig.badgeGap}px`,
                }}
              >
                {modes.map((entry, index) => (
                  <ModeBadge key={index} entry={entry} index={index} off={off} />
                ))}
              </div>
            </div>
          </>
        )}

        {error && (
          <>
            {/* The sparkle with a stroke through it — the AI is the thing that
                did not load, so the glyph says so rather than a generic warning. */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${aiConfig.errorMarkSize}px`,
                height: `${aiConfig.errorMarkSize}px`,
                borderRadius: `${radiusToken.round}px`,
                backgroundColor: color.accent.laziza.background,
              }}
            >
              <Icon
                icon={IconLazizaCrossSparkleFill}
                size={20}
                color={color.accent.laziza.main}
              />
            </div>
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

/**
 * One "First • Full Auto" badge.
 *
 * The default tones run orange then amber, which is the order Figma draws
 * them: the first message is the one that goes out unattended, so it carries
 * the stronger colour.
 */
function ModeBadge({
  entry,
  index,
  off,
}: {
  entry: AiMessageMode;
  index: number;
  off: boolean;
}) {
  const fill = off
    ? color.navbar.hover
    : (entry.tone ?? (index === 0 ? color.accent.laziza.main : color.accent.laziza.backgroundAlt));
  const ink = off ? color.navbar.text : color.main.white;

  return (
    <span
      style={{
        ...textStyle.mRegular,
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${aiConfig.badgeGap}px`,
        padding: `${aiConfig.badgePaddingY}px ${aiConfig.badgePaddingX}px`,
        borderRadius: `${aiConfig.badgeRadius}px`,
        backgroundColor: fill,
        color: ink,
      }}
    >
      {entry.type}
      <span
        aria-hidden
        style={{
          width: `${aiConfig.badgeDotSize}px`,
          height: `${aiConfig.badgeDotSize}px`,
          borderRadius: `${radiusToken.round}px`,
          backgroundColor: ink,
        }}
      />
      {off ? 'OFF' : entry.mode}
    </span>
  );
}
