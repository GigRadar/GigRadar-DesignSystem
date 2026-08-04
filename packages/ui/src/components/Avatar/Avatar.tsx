import {
  color,
  component,
  typography,
  type AvatarSize,
  type AvatarToneName,
} from '@uiuxjoseph/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import {
  gigRadarAvatarImage,
  gigRadarBadgeImage,
  upworkAvatarImage,
  zoomAvatarImage,
} from './assets.js';

export type { AvatarSize, AvatarToneName };

/**
 * The built-in service avatars from Figma. Each renders that service's mark in
 * place of initials — used when the "person" is an integration rather than a
 * human.
 */
export type AvatarService = 'gigradar' | 'upwork' | 'zoom';

/**
 * The badge pinned to the avatar's bottom-right corner.
 *
 * `gigradar` is the GigRadar mark, `upworkApi` the blue "API" pill — both are
 * drawn in the Figma component. Passing a node instead renders arbitrary
 * content in the same slot (a presence dot, a count, an icon).
 */
export type AvatarBadge = 'gigradar' | 'upworkApi' | ReactNode;

export type AvatarProps = {
  size?: AvatarSize;
  /**
   * Background/border/text palette for the initials. Ignored when `src` or
   * `service` is set, since neither shows initials.
   *
   * Omit it and a tone is derived from `name` — the same name always gets the
   * same color, so one person looks consistent across every screen.
   */
  tone?: AvatarToneName;
  /**
   * The person's full name. Initials are derived from it, and it becomes the
   * image's alt text.
   */
  name?: string;
  /**
   * Overrides the initials derived from `name`. Rendered uppercase, and
   * truncated to two characters.
   */
  initials?: string;
  /** Photo URL. Takes precedence over initials. */
  src?: string;
  /** Renders a built-in service mark. Takes precedence over `src`. */
  service?: AvatarService;
  /** The bottom-right corner badge. */
  badge?: AvatarBadge;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

const { avatar } = component;

/**
 * The GigRadar mark's own navy field, sampled from the exported asset. Backing
 * the badge with it means any sub-pixel gap between the scaled artwork and the
 * circular clip reads as part of the logo rather than as a white sliver.
 */
const gigRadarBadgeBackground = '#191D28';

const serviceImages: Record<AvatarService, string> = {
  gigradar: gigRadarAvatarImage,
  upwork: upworkAvatarImage,
  zoom: zoomAvatarImage,
};

/**
 * The tone order used when hashing a name. `default` is excluded — it is the
 * empty-state grey, not a color anyone should be assigned.
 */
const hashableTones: AvatarToneName[] = [
  'cyan',
  'magenta',
  'purple',
  'orange',
  'red',
  'volcano',
  'green',
  'gold',
  'lime',
  'geekBlue',
  'blue',
];

/**
 * Picks a stable tone from a name.
 *
 * A plain sum of char codes would collide on anagrams and cluster short names;
 * multiplying by 31 per character (the classic string hash) spreads them across
 * the palette instead. `|0` keeps it in int32 range.
 */
function toneFromName(name: string): AvatarToneName {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return hashableTones[Math.abs(hash) % hashableTones.length]!;
}

/**
 * Derives up to two initials from a name.
 *
 * Takes the first letter of the first and last words, so "Ada Lovelace" reads
 * "AL" and "Ada" reads "A". Single-word names do not repeat their letter.
 */
export function initialsFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0]!.slice(0, 1).toUpperCase();
  return (words[0]!.slice(0, 1) + words[words.length - 1]!.slice(0, 1)).toUpperCase();
}

/**
 * A user, company, or service avatar.
 *
 * Mirrors the Figma component (node 456:8607): a round 32px surface showing a
 * photo, a service mark, or tinted initials, with an optional badge pinned to
 * the bottom-right corner.
 *
 * Content resolves in one order — `service`, then `src`, then initials — so a
 * photo always wins over a letter and a service mark always wins over a photo.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size = 'medium', tone, name, initials, src, service, badge, ...rest },
  ref,
) {
  const diameter = `var(--gr-avatar-size-${size}, ${avatar.size[size]}px)`;
  const text = (initials ?? (name ? initialsFromName(name) : '')).slice(0, 2);

  // No tone given: derive one from the name so a person keeps their color.
  // With neither, fall back to Figma's grey placeholder variant.
  const resolvedTone = tone ?? (name ? toneFromName(name) : 'default');
  const palette = color.avatarTone[resolvedTone];

  const hasImage = service != null || src != null;
  const imageSrc = service != null ? serviceImages[service] : src;

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    width: diameter,
    height: diameter,
    verticalAlign: 'middle',
  };

  const surfaceStyle: CSSProperties = {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: `var(--gr-avatar-radius, ${avatar.radius}px)`,
    fontFamily: typography.fontFamily.base,
    // An image covers the surface edge to edge, so a border would read as a
    // ring drawn on top of the photo rather than as the avatar's own edge.
    ...(hasImage
      ? { backgroundColor: color.main.backgroundAlt }
      : {
          backgroundColor: palette.background,
          border: `var(--gr-avatar-border-width, ${avatar.borderWidth}px) solid ${palette.border}`,
          color: palette.text,
          fontSize: `var(--gr-avatar-font-size-${size}, ${avatar.fontSize[size]}px)`,
          fontWeight: typography.fontWeight.medium,
          letterSpacing: typography.letterSpacing.m,
          textTransform: 'uppercase',
          lineHeight: 1,
          userSelect: 'none',
        }),
  };

  return (
    <span {...rest} ref={ref} style={rootStyle}>
      <span style={surfaceStyle}>
        {hasImage ? (
          <img
            src={imageSrc}
            alt={name ?? ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          text
        )}
      </span>
      {badge != null && badge !== false && <AvatarBadgeSlot size={size} badge={badge} />}
    </span>
  );
});

/**
 * The bottom-right badge.
 *
 * Anchored to the corner of the square bounding box rather than to the circle's
 * edge — that is what Figma draws, and it keeps the badge in the same place
 * regardless of what the avatar contains.
 */
function AvatarBadgeSlot({ size, badge }: { size: AvatarSize; badge: AvatarBadge }) {
  const badgeSize = `var(--gr-avatar-badge-size-${size}, ${avatar.badgeSize[size]}px)`;
  const ring = `var(--gr-avatar-badge-ring-width, ${avatar.badgeRingWidth}px)`;

  const base: CSSProperties = {
    position: 'absolute',
    right: 0,
    bottom: 0,
    boxSizing: 'border-box',
    width: badgeSize,
    height: badgeSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: `var(--gr-avatar-radius, ${avatar.radius}px)`,
    // The white ring is what separates the badge from the avatar beneath it.
    // Without it the two circles merge at any tone with a light background.
    border: `${ring} solid ${color.main.white}`,
    backgroundColor: color.main.white,
  };

  if (badge === 'gigradar') {
    return (
      <span style={{ ...base, backgroundColor: gigRadarBadgeBackground }} aria-hidden>
        {/*
          The exported mark is a rounded square on a white field. Figma scales
          it to 118% inside the circular clip so the artwork's own corners fall
          outside the circle — at 100% the white would show as four notches
          around the edge.
        */}
        <img
          src={gigRadarBadgeImage}
          alt=""
          style={{
            width: '118%',
            height: '118%',
            objectFit: 'cover',
            display: 'block',
            flexShrink: 0,
          }}
        />
      </span>
    );
  }

  if (badge === 'upworkApi') {
    return (
      <span
        style={{
          ...base,
          backgroundColor: color.main.brand,
          fontFamily: typography.fontFamily.base,
          // Figma sets 7.5px at the 16px badge. Scaled off the badge size so
          // the label stays proportional at every avatar size.
          fontSize: `calc(${badgeSize} * 0.47)`,
          fontWeight: typography.fontWeight.medium,
          letterSpacing: -0.2,
          lineHeight: 1,
          color: color.main.white,
        }}
      >
        API
      </span>
    );
  }

  return <span style={base}>{badge}</span>;
}
