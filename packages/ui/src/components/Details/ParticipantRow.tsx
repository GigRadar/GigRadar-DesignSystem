import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconPlus } from '../../icons/defs.js';
import { Avatar, type AvatarBadge } from '../Avatar/Avatar.js';

const { participant } = component.details;

/**
 * Whether this person is in the conversation.
 *
 * `notInRoom` is not an absence — it is a teammate who could be pulled in, and
 * the row carries the button that does it.
 */
export type ParticipantState = 'inRoom' | 'notInRoom' | 'loading';

/** Per-instance overrides for the row's own metrics. */
export type ParticipantRowStyleProps = {
  gap?: CssLength;
  avatarSize?: CssLength;
  addRadius?: CssLength;
  addIconSize?: CssLength;
};

export type ParticipantRowProps = {
  /**
   * @default 'inRoom'
   */
  state?: ParticipantState;
  /** Their name. */
  name?: ReactNode;
  /** What they are to this room — "Client", "Business Manager", "Freelancer". */
  role?: ReactNode;
  /** A photo. Falls back to initials taken from `name`. */
  avatarSrc?: string;
  /**
   * The mark in the avatar's corner — the GigRadar logo for a BM the product
   * assigned, the blue "API" pill for one reached through the Upwork API.
   */
  badge?: AvatarBadge;
  /** Pulls them into the room. Only `notInRoom` draws it. */
  onAdd?: () => void;
  /** The button's label. Defaults to "Add". */
  addLabel?: ReactNode;
} & ParticipantRowStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One person, with their role under their name.
 *
 * Figma: node 3600:24728, in its In Room, Not In Room, and Loading states.
 *
 * The role is the reason the row exists. A name alone does not tell a reader
 * whether the person typing is the client, their own BM, or a freelancer
 * they have never met, and on a shared room that is the first thing worth
 * knowing.
 *
 * One component across both lists rather than two. "Participant in this room"
 * and "Not in this room" draw the same row; what differs is whether it ends in
 * an Add button, which is the state.
 */
export const ParticipantRow = forwardRef<HTMLDivElement, ParticipantRowProps>(
  function ParticipantRow(
    {
      state = 'inRoom',
      name,
      role,
      avatarSrc,
      badge,
      onAdd,
      addLabel = 'Add',
      gap,
      avatarSize,
      addRadius,
      addIconSize,
      ...rest
    },
    ref,
  ) {
    const loading = state === 'loading';
    const notInRoom = state === 'notInRoom';

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: notInRoom ? 'space-between' : undefined,
          gap: len(gap) ?? `${participant.gap}px`,
          minHeight: `${participant.height}px`,
          /*
           * Full width so `space-between` has something to push against — the
           * Add button belongs on the list's right edge, not tucked against
           * the name, whose length varies from "Samuel" to "Maria Ovcharenko".
           */
          width: '100%',
        }}
        {...rest}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: len(gap) ?? `${participant.gap}px`,
            minWidth: 0,
          }}
        >
          <Avatar
            size="medium"
            diameter={len(avatarSize) ?? participant.avatarSize}
            name={typeof name === 'string' ? name : undefined}
            src={avatarSrc}
            badge={badge}
            type={loading ? 'placeholder' : undefined}
          />

          {loading ? (
            <span
              style={{
                display: 'block',
                width: `${participant.skeletonWidth}px`,
                height: `${participant.skeletonHeight}px`,
                borderRadius: `${participant.skeletonRadius}px`,
                backgroundColor: color.disable.background,
              }}
            />
          ) : (
            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  ...textStyle.mRegular,
                  color: color.main.black,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </span>
              <span
                style={{
                  ...textStyle.sRegular,
                  color: color.main.description,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {role}
              </span>
            </span>
          )}
        </div>

        {/*
         * Not the shipped `Button`: Figma draws this one at 6px/12px with a
         * 16px glyph, which is tighter than the small step, and it sits on a
         * 32px row that the button's own min-height would push taller.
         */}
        {notInRoom && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            style={{
              ...textStyle.sMedium,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              gap: `${participant.addGap}px`,
              padding: `${participant.addPaddingY}px ${participant.addPaddingRight}px ${participant.addPaddingY}px ${participant.addPaddingLeft}px`,
              borderRadius: len(addRadius) ?? `${participant.addRadius}px`,
              border: 'none',
              backgroundColor: color.main.brand,
              color: color.main.white,
              cursor: 'pointer',
            }}
          >
            <Icon icon={IconPlus} size={len(addIconSize) ?? participant.addIconSize} />
            {addLabel}
          </button>
        )}
      </div>
    );
  },
);

export type ParticipantListProps = {
  /** The rows. */
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** The rows, stacked at the spacing Figma draws between them. */
export const ParticipantList = forwardRef<HTMLDivElement, ParticipantListProps>(
  function ParticipantList({ children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        style={{ display: 'flex', flexDirection: 'column', gap: `${participant.rowGap}px` }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
