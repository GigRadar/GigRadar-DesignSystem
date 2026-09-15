import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { IconLazizaSparkleFill } from '../../icons/defs.js';
import { MeetingBubble, type MeetingBubbleProps } from '../Middle/MeetingBubble.js';
import { ClientJobDetails, type ClientJobDetailsProps } from './ClientJobDetails.js';
import { CrmAiConfiguration, type CrmAiConfigurationProps } from './CrmAiConfiguration.js';
import { DetailsPane, type DetailsPaneProps } from './DetailsPane.js';
import { DetailsSection } from './DetailsSection.js';
import { ParticipantList, ParticipantRow } from './ParticipantRow.js';
import { RelevanceButtons, type RelevanceVerdict } from './RelevanceButton.js';
import type { AvatarBadge } from '../Avatar/Avatar.js';

/** One person in the pane's two lists. */
export type DetailsParticipant = {
  /** React key, and what `onAddParticipant` reports. */
  id: string;
  name: ReactNode;
  /** What they are to this room — "Client", "Business Manager". */
  role?: ReactNode;
  avatarSrc?: string;
  /** The mark in the avatar's corner — how this BM was reached. */
  badge?: AvatarBadge;
};

/** Which sections the pane draws, in the order it stacks them. */
export type DetailsSectionName =
  | 'client'
  | 'meetings'
  | 'ai'
  | 'relevance'
  | 'participants'
  | 'notInRoom';

/** What a section's render prop receives. */
export type DetailsSectionRenderProps = WithDefaultRender & {
  /** Which section this is. */
  name: DetailsSectionName;
  /** The heading it was given. */
  title: ReactNode;
};

export type InboxDetailsProps = {
  /**
   * Which sections to draw, in order.
   *
   * Defaults to every section that has data. Pass it to fix the order or to
   * drop a section the product does not show — a workspace without the AI
   * add-on has no configuration to describe.
   */
  sections?: DetailsSectionName[];

  /** The client and job card. Omit to drop the section. */
  client?: ClientJobDetailsProps;
  /** Its heading. */
  clientTitle?: ReactNode;

  /**
   * The meetings the room has booked, newest first.
   *
   * `MeetingBubble` props rather than a shape of this component's own: the
   * card is the same one the thread draws, and a meeting shown in two places
   * should not be described two ways.
   */
  meetings?: MeetingBubbleProps[];
  /** Its heading. */
  meetingsTitle?: ReactNode;

  /** The AI configuration card. Omit to drop the section. */
  ai?: CrmAiConfigurationProps;
  /** Its heading. */
  aiTitle?: ReactNode;

  /** The recorded verdict, if any. Omit `onRelevanceChange` to drop the section. */
  relevance?: RelevanceVerdict;
  /** Called with the verdict the reader picked. */
  onRelevanceChange?: (verdict: RelevanceVerdict) => void;
  /** Its heading. */
  relevanceTitle?: ReactNode;

  /** Who is in the room. */
  participants?: DetailsParticipant[];
  /** Its heading. */
  participantsTitle?: ReactNode;

  /** Who could be added to it. */
  notInRoom?: DetailsParticipant[];
  /** Called with the person the reader added. */
  onAddParticipant?: (participant: DetailsParticipant) => void;
  /** Its heading. */
  notInRoomTitle?: ReactNode;

  /**
   * Draws the empty state instead of the sections — no room is open, so there
   * is nothing to describe.
   */
  empty?: boolean;

  /**
   * Which sections start folded.
   *
   * The pane keeps the fold itself from here; pass `onSectionToggle` to hear
   * about it, or drive a section from the outside by composing `DetailsPane`
   * and `DetailsSection` directly.
   */
  collapsed?: DetailsSectionName[];
  /** Called when a section is folded or unfolded. */
  onSectionToggle?: (name: DetailsSectionName, open: boolean) => void;

  /**
   * Replaces one section's body, keeping its header and fold.
   *
   * The usual reason is a card that has to carry more than the design
   * system's — a meeting with a per-room action, a client card with a link out
   * to the CRM. Call `defaultRender()` to wrap rather than replace.
   */
  renderSection?: RenderProp<DetailsSectionRenderProps>;
} & Omit<DetailsPaneProps, 'children' | 'empty'> &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style'>;

/**
 * The Inbox's right column, assembled.
 *
 * Figma: node 82:8753.
 *
 * The screen-level component: it takes the room's data and draws the whole
 * pane, where `DetailsPane` and `DetailsSection` take composed children and
 * leave the arrangement to the caller. Most apps want this one — the order the
 * sections stack in, which of them fold, and which are dropped when they have
 * no data are decisions the design system has already made, and remaking them
 * per app is how two screens drift apart.
 *
 * Reach past it to `DetailsPane` when a screen genuinely differs: a pane with
 * a section this does not know about, or one whose folds are driven from
 * outside. `renderSection` covers the common case in between, where a section
 * needs decorating rather than replacing.
 */
export const InboxDetails = forwardRef<HTMLElement, InboxDetailsProps>(function InboxDetails(
  {
    sections,
    client,
    clientTitle = 'Client & Job Details',
    meetings,
    meetingsTitle = 'Upcoming Meetings',
    ai,
    aiTitle = 'CRM AI Configuration',
    relevance,
    onRelevanceChange,
    relevanceTitle = 'Relevance',
    participants,
    participantsTitle = 'Participant in this room',
    notInRoom,
    onAddParticipant,
    notInRoomTitle = 'Not in this room',
    empty = false,
    collapsed,
    onSectionToggle,
    renderSection,
    ...rest
  },
  ref,
) {
  /*
   * A section is drawn when it has something to say. Relevance is the one
   * exception: it has no data of its own, so the handler is what says the
   * product collects a verdict at all.
   */
  const present: Record<DetailsSectionName, boolean> = {
    client: client != null,
    meetings: (meetings?.length ?? 0) > 0,
    ai: ai != null,
    relevance: onRelevanceChange != null,
    participants: (participants?.length ?? 0) > 0,
    notInRoom: (notInRoom?.length ?? 0) > 0,
  };

  const order =
    sections ?? (['client', 'meetings', 'ai', 'relevance', 'participants', 'notInRoom'] as const);

  const bodies: Record<DetailsSectionName, () => ReactNode> = {
    client: () => <ClientJobDetails {...client} />,
    meetings: () => (
      <>
        {meetings?.map((meeting, index) => (
          <MeetingBubble key={index} {...meeting} />
        ))}
      </>
    ),
    ai: () => <CrmAiConfiguration {...ai} />,
    relevance: () => <RelevanceButtons value={relevance} onChange={onRelevanceChange} />,
    participants: () => (
      <ParticipantList>
        {participants?.map((person) => (
          <ParticipantRow
            key={person.id}
            name={person.name}
            role={person.role}
            avatarSrc={person.avatarSrc}
            badge={person.badge}
          />
        ))}
      </ParticipantList>
    ),
    notInRoom: () => (
      <ParticipantList>
        {notInRoom?.map((person) => (
          <ParticipantRow
            key={person.id}
            state="notInRoom"
            name={person.name}
            role={person.role}
            avatarSrc={person.avatarSrc}
            badge={person.badge}
            onAdd={onAddParticipant && (() => onAddParticipant(person))}
          />
        ))}
      </ParticipantList>
    ),
  };

  const titles: Record<DetailsSectionName, ReactNode> = {
    client: clientTitle,
    meetings: meetingsTitle,
    ai: aiTitle,
    relevance: relevanceTitle,
    participants: participantsTitle,
    notInRoom: notInRoomTitle,
  };

  return (
    <DetailsPane ref={ref} empty={empty} {...rest}>
      {order
        .filter((name) => present[name])
        .map((name) => {
          const body = bodies[name];
          return (
            <DetailsSection
              key={name}
              title={titles[name]}
              /* Only the AI section carries a glyph — that is what makes it
                 read as the pane's one loud section rather than another list. */
              icon={name === 'ai' ? IconLazizaSparkleFill : undefined}
              defaultOpen={!collapsed?.includes(name)}
              onToggle={onSectionToggle && ((open) => onSectionToggle(name, open))}
            >
              {renderSection
                ? renderSection({ name, title: titles[name], defaultRender: body })
                : body()}
            </DetailsSection>
          );
        })}
    </DetailsPane>
  );
});
