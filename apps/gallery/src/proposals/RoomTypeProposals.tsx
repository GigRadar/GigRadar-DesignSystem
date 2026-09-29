import { borderWidth, color, component, radius, spacing, textStyle } from '@gigradar/theme';
import {
  Button,
  HeaderMetaTag,
  Icon,
  IconConnectedPeopleStroke,
  IconPlus,
  IconRoom2peopleClientStroke,
  InboxDetails,
  ModalCard,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RoomMessage,
  RoomNotice,
  RoomDivider,
  BubbleChat,
  Sender,
  Skeleton,
  type AddBmInfoProps,
  type ChatHeaderProps,
  type DetailsParticipant,
  type InboxPane,
  type RelevanceVerdict,
} from '@gigradar/ui';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AssembledInbox } from '../demos/inboxScreen';
import {
  aiConfiguration,
  chatRoom,
  clientDetails,
  participants,
  rooms,
  type Room,
} from '../fixtures/inbox';

/**
 * BF-3481 — Create a Business Manager room from a one-to-one, and say which
 * kind of room this is.
 *
 * The question the three disagree on: **where does the room say what kind it
 * is, and how loudly does a one-to-one room offer to become a Business Manager
 * room?** Always, in a band under the header; only when asked, from a tag in
 * the header; or off the header entirely, in the Details pane. Each carries its
 * own confirmation, in-progress and result state, because where the action
 * starts decides what those can look like.
 *
 * What is already settled and not re-proposed:
 *
 * - A room that has a Business Manager, or can have one added, already has its
 *   band: `AddBmInfo` under the header ("BM not in this room"). A one-to-one
 *   room is the case it cannot handle — Upwork will not add a third person to
 *   a one-to-one, so the only way to a meeting is a new room. That is what
 *   "Create BM room" means here: a new room with the client, the freelancer
 *   and the manager, while the one-to-one stays where it is.
 * - The new room appears in the list and opens, using the list and thread as
 *   they ship. Nothing here redraws either.
 *
 * All three share one fixture below — the same client (Floyd Miles), the same
 * thread, the same manager (Maria Ovcharenko) — so the comparison is between
 * placements, not between datasets. Nothing new below the proposals: every
 * part is a shipped component (`HeaderMetaTag`, `AddBmInfo` through
 * `ChatHeader`, `InboxDetails`, `Modal*` bands, `Button`, `Skeleton`).
 */

/** Every state a proposal is drawn in, in the order the flow passes through them. */
export type RoomTypeStep = 'loading' | 'oneToOne' | 'noBm' | 'confirm' | 'creating' | 'bm';

export const STEPS: { step: RoomTypeStep; name: string; trigger: string }[] = [
  {
    step: 'loading',
    name: 'Loading',
    trigger:
      'The room is open but its participants have not arrived yet, so its type is not known. Nothing is offered until it is — a create action that turns out to be wrong for the room is worse than a beat of grey.',
  },
  {
    step: 'oneToOne',
    name: 'One-to-one room',
    trigger:
      'Only the freelancer and the client are in the room. The type is shown and the create action is available.',
  },
  {
    step: 'noBm',
    name: 'One-to-one, no manager to add',
    trigger:
      'The team has no Business Manager connected, so there is nobody to create the room with. The type is still shown; the action says why it cannot run rather than disappearing.',
  },
  {
    step: 'confirm',
    name: 'Confirming',
    trigger:
      'The reader asked to create the room. It is a new Upwork room the client will see, and it cannot be undone, so the flow says who will be in it and that this one stays before anything happens.',
  },
  {
    step: 'creating',
    name: 'Creating',
    trigger:
      'The request is in flight. The control that started it holds its place and stops accepting clicks; nothing else on the screen moves yet.',
  },
  {
    step: 'bm',
    name: 'Landed in the Business Manager room',
    trigger:
      'The room exists and is open. It leads the list, its type reads Business Manager, the composer has its meeting and attachment controls back, and the create action is gone — the same thing any Business Manager room draws.',
  },
];

/* ------------------------------------------------------------------------- */
/* The shared fixture                                                         */
/* ------------------------------------------------------------------------- */

const floyd = participants.find((p) => p.id === 'floyd')!;
const maria = participants.find((p) => p.id === 'maria')!;
const jane = participants.find((p) => p.id === 'jane')!;

/** Who each kind of room holds. The freelancer is the reader, Jane. */
const ONE_TO_ONE_PEOPLE: DetailsParticipant[] = [floyd, jane];
const BM_PEOPLE: DetailsParticipant[] = [floyd, maria, jane];

/** The copy all three use, so the proposals differ in placement only. */
export const COPY = {
  oneToOne: 'One-to-one',
  bm: 'Business Manager',
  oneToOneWho: `Only you and ${clientDetails.name}.`,
  bmWho: `${clientDetails.name}, ${chatRoom.managerName} and you.`,
  why: 'Meetings and attachments need a Business Manager in the room.',
  action: 'Create BM room',
  confirmTitle: 'Create a Business Manager room?',
  confirmBody: `Starts a new Upwork room with ${clientDetails.name} and ${chatRoom.managerName}, so you can book meetings and send files. ${clientDetails.name} is notified. This one-to-one stays in your list.`,
  confirmAction: 'Create room',
  creating: 'Creating room',
  noBm: 'Connect a Business Manager in Settings to create one.',
  created: `Business Manager room created from your one-to-one with ${clientDetails.name}. ${chatRoom.managerName} joined as Business Manager.`,
};

/** The room the flow ends in — the one-to-one's twin, at the top of the list. */
const BM_ROOM: Room = {
  ...rooms[0]!,
  id: 'r1-bm',
  sender: 'You',
  preview: 'Business Manager room created',
  timestamp: 'Now',
  unread: undefined,
};

/** The one-to-one's thread: the usual one, minus the meeting it could not book. */
const ONE_TO_ONE_THREAD = (
  <>
    <RoomNotice>
      Chat started on April 25, 2025, at 18:20. {clientDetails.name} opened a one-to-one with you.
    </RoomNotice>
    <RoomDivider>Today</RoomDivider>
    <RoomMessage
      sender={<Sender name={clientDetails.name} avatar={{ src: clientDetails.avatarSrc }} />}
    >
      <BubbleChat time="08:30">
        We were really impressed with your portfolio and how your expertise in Product UI/UX will
        be a great fit for our project.
      </BubbleChat>
    </RoomMessage>
    <RoomMessage side="own" sender={<Sender side="own" name="Jane Cooper" avatar={{}} />}>
      <BubbleChat side="own" time="08:52">
        Thank you! I&rsquo;d be glad to walk you through the flows I have in mind — is Wednesday
        still good for a call?
      </BubbleChat>
    </RoomMessage>
  </>
);

/** A room created a moment ago has one line in it, and it says where it came from. */
const BM_THREAD = (
  <>
    <RoomDivider>Today</RoomDivider>
    <RoomNotice>{COPY.created}</RoomNotice>
  </>
);

/* ------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* ------------------------------------------------------------------------- */

type Layout = 'desktop' | 'mobile';
type Go = (step: RoomTypeStep) => void;

/**
 * The room's type as a header tag. `HeaderMetaTag` as it ships, in the outline
 * treatment; the Business Manager room takes the meetings green, because
 * meetings are what the type unlocks and the tag should say so at a glance.
 */
function TypeTag({
  step,
  onClick,
}: {
  step: RoomTypeStep;
  onClick?: () => void;
}) {
  if (step === 'loading') return <Skeleton variant="block" width={96} height={20} radius={radius.round} />;
  const bm = step === 'bm';
  return (
    <HeaderMetaTag
      icon={bm ? IconConnectedPeopleStroke : IconRoom2peopleClientStroke}
      label={bm ? COPY.bm : COPY.oneToOne}
      onClick={onClick}
      {...(bm
        ? {
            textColor: color.accent.meetings.hover,
            borderColor: color.accent.meetings.main,
            background: color.accent.meetings.background,
          }
        : null)}
    >
      {bm ? COPY.bm : COPY.oneToOne}
    </HeaderMetaTag>
  );
}

/** The details pane for one kind of room. Same sections as the Inbox draws. */
function RoomDetails({
  bm,
  loading,
  sections,
  participantsTitle,
  top,
}: {
  bm: boolean;
  loading?: boolean;
  sections?: ('client' | 'ai' | 'relevance' | 'participants')[];
  participantsTitle?: ReactNode;
  /** Drawn at the top of the participants section, above the people. */
  top?: ReactNode;
}) {
  const [verdict, setVerdict] = useState<RelevanceVerdict | undefined>('relevant');
  return (
    <InboxDetails
      sections={sections}
      client={clientDetails}
      ai={{ ...aiConfiguration, onEdit: () => undefined }}
      relevance={verdict}
      onRelevanceChange={setVerdict}
      // Until the room loads its people are not known, and a list of the wrong
      // people is worse than none.
      participants={loading ? [] : bm ? BM_PEOPLE : ONE_TO_ONE_PEOPLE}
      participantsTitle={participantsTitle}
      renderSection={
        top
          ? ({ name, defaultRender }) =>
              name === 'participants' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s }}>
                  {top}
                  {defaultRender()}
                </div>
              ) : (
                defaultRender()
              )
          : undefined
      }
    />
  );
}

/** A dimmed layer over the whole screen with a card in the middle — `Modal`'s look, kept in the frame. */
function ScreenModal({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: component.modal.viewportPadding,
        backgroundColor: component.modal.backdrop,
        zIndex: 20,
      }}
    >
      {children}
    </div>
  );
}

/** The confirmation's three bands — used by the modal and by the tag's popover. */
function ConfirmBands({
  go,
  creating,
  width,
}: {
  go: Go;
  creating: boolean;
  width?: number | string;
}) {
  return (
    <ModalCard width={width}>
      <ModalHeader onClose={creating ? undefined : () => go('oneToOne')} divided={false}>
        {COPY.confirmTitle}
      </ModalHeader>
      <ModalContent>
        <span style={{ ...textStyle.mRegular, color: color.main.description }}>
          {COPY.confirmBody}
        </span>
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary" disabled={creating} onClick={() => go('oneToOne')}>
          Cancel
        </Button>
        <Button loading={creating} onClick={() => go('creating')}>
          {creating ? COPY.creating : COPY.confirmAction}
        </Button>
      </ModalFooter>
    </ModalCard>
  );
}

/** What each proposal hands the assembled screen for one state. */
type Slots = {
  headerProps?: Partial<ChatHeaderProps>;
  wrapHeader?: (header: ReactNode) => ReactNode;
  details?: ReactNode;
  overlay?: ReactNode;
  /** Which pane a phone opens on — the one the state is about. */
  phonePane: InboxPane;
};

/** The band's props for `ChatHeader.addBusinessManager`, in each state it is drawn in. */
function band(step: RoomTypeStep, go: Go): Omit<AddBmInfoProps, 'paddingX' | 'paddingY' | 'background'> | undefined {
  if (step === 'loading' || step === 'bm') return undefined;
  if (step === 'noBm')
    return {
      managerName: 'Business Manager',
      children: COPY.noBm,
      actionLabel: COPY.action,
      disabled: true,
    };
  return {
    managerName: maria.name as string,
    managerAvatar: maria.avatarSrc,
    children: `${COPY.oneToOne} room. ${COPY.why}`,
    actionLabel: COPY.action,
    adding: step === 'creating',
    onAdd: () => go('confirm'),
  };
}

/* ------------------------------------------------------------------------- */
/* Proposal 2's card — the room, described in the Details pane                */
/* ------------------------------------------------------------------------- */

function RoomTypeCard({ step, go }: { step: RoomTypeStep; go: Go }) {
  if (step === 'loading')
    return <Skeleton variant="block" height={72} radius={radius.s} />;
  const bm = step === 'bm';
  const asking = step === 'confirm' || step === 'creating';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.s,
        padding: spacing.s,
        borderRadius: radius.s,
        border: `${borderWidth.thin}px solid ${bm ? color.accent.meetings.main : color.navbar.hover}`,
        backgroundColor: bm ? color.accent.meetings.background : color.main.white,
      }}
    >
      <div style={{ display: 'flex', gap: spacing.xs + 2, alignItems: 'flex-start' }}>
        <span style={{ display: 'inline-flex', paddingTop: 2 }}>
          <Icon
            icon={bm ? IconConnectedPeopleStroke : IconRoom2peopleClientStroke}
            size={16}
            color={bm ? color.accent.meetings.hover : color.navbar.text}
          />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
            {bm ? COPY.bm : COPY.oneToOne} room
          </span>
          <span style={{ ...textStyle.sRegular, color: color.main.description }}>
            {bm ? `${COPY.bmWho} Meetings and attachments are on.` : `${COPY.oneToOneWho} ${COPY.why}`}
          </span>
        </div>
      </div>
      {step === 'noBm' && (
        <>
          <Button variant="secondary" fullWidth disabled startIcon={<Icon icon={IconPlus} size={16} />}>
            {COPY.action}
          </Button>
          <span style={{ ...textStyle.sRegular, color: color.main.description }}>{COPY.noBm}</span>
        </>
      )}
      {step === 'oneToOne' && (
        <Button
          variant="secondary"
          fullWidth
          startIcon={<Icon icon={IconPlus} size={16} />}
          onClick={() => go('confirm')}
        >
          {COPY.action}
        </Button>
      )}
      {/* The confirmation opens in the card rather than over the screen: the
          pane is already where the reader is looking, and a modal would cover
          the thread they are deciding about. */}
      {asking && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.s,
            paddingTop: spacing.s,
            borderTop: `${borderWidth.thin}px solid ${color.navbar.hover}`,
          }}
        >
          <span style={{ ...textStyle.sRegular, color: color.main.description }}>
            {COPY.confirmBody}
          </span>
          <div style={{ display: 'flex', gap: spacing.xs, justifyContent: 'flex-end' }}>
            <Button variant="secondary" disabled={step === 'creating'} onClick={() => go('oneToOne')}>
              Cancel
            </Button>
            <Button loading={step === 'creating'} onClick={() => go('creating')}>
              {step === 'creating' ? COPY.creating : COPY.confirmAction}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* The three proposals                                                        */
/* ------------------------------------------------------------------------- */

const header = component.middle.header;

/** Where the tag starts, so the popover hangs from it rather than from the header's edge. */
function tagInset(layout: Layout) {
  return layout === 'mobile'
    ? header.mobilePaddingX + header.backSize + header.mobileGap + header.avatarSize + header.identityGap
    : header.desktopPaddingX + header.avatarSize + header.identityGap;
}

export type RoomTypeProposal = {
  number: number;
  approach: string;
  rationale: string;
  slots: (step: RoomTypeStep, layout: Layout, go: Go) => Slots;
  render: () => ReactNode;
};

const PROPOSAL_SLOTS: RoomTypeProposal['slots'][] = [
  // 1 · Tag in the header, band under it, modal to confirm.
  (step, _layout, go) => ({
    headerProps: {
      topic: <TypeTag step={step === 'confirm' || step === 'creating' || step === 'noBm' ? 'oneToOne' : step} />,
      addBusinessManager: band(step, go),
    },
    overlay:
      step === 'confirm' ? (
        <ScreenModal>
          <ConfirmBands go={go} creating={false} width={440} />
        </ScreenModal>
      ) : undefined,
    phonePane: 'room',
  }),
  // 2 · Nothing in the header; the Details pane says it and offers it.
  (step, _layout, go) => ({
    details: (
      <RoomDetails
        bm={step === 'bm'}
        loading={step === 'loading'}
        sections={['participants', 'client', 'ai', 'relevance']}
        participantsTitle="This room"
        top={<RoomTypeCard step={step} go={go} />}
      />
    ),
    phonePane: 'details',
  }),
  // 3 · The tag is the entry point; it opens a popover that is the confirmation.
  (step, layout, go) => {
    const asking = step === 'confirm' || step === 'creating';
    const oneToOne = step !== 'loading' && step !== 'bm';
    return {
      headerProps: {
        topic: (
          <TypeTag
            step={oneToOne ? 'oneToOne' : step}
            onClick={oneToOne ? () => go(asking ? 'oneToOne' : 'confirm') : undefined}
          />
        ),
      },
      wrapHeader: (node) => (
        <div style={{ position: 'relative' }}>
          {node}
          {(asking || step === 'noBm') && (
            <div
              style={{
                position: 'absolute',
                top: `calc(100% - ${spacing.s}px)`,
                left: layout === 'mobile' ? header.mobilePaddingX : tagInset(layout),
                right: layout === 'mobile' ? header.mobilePaddingX : undefined,
                zIndex: 20,
                boxShadow: component.modal.shadow,
                borderRadius: component.modal.radius,
              }}
            >
              {step === 'noBm' ? (
                <ModalCard width={layout === 'mobile' ? '100%' : 360}>
                  <ModalHeader divided={false}>{COPY.oneToOne} room</ModalHeader>
                  <ModalContent>
                    <span style={{ ...textStyle.mRegular, color: color.main.description }}>
                      {COPY.oneToOneWho} {COPY.why} {COPY.noBm}
                    </span>
                  </ModalContent>
                  <ModalFooter>
                    <Button disabled>{COPY.action}</Button>
                  </ModalFooter>
                </ModalCard>
              ) : (
                <ConfirmBands go={go} creating={step === 'creating'} width={layout === 'mobile' ? '100%' : 380} />
              )}
            </div>
          )}
        </div>
      ),
      phonePane: 'room',
    };
  },
];

/**
 * One proposal in one state, on the whole Inbox.
 *
 * `go` moves between states; a static frame passes nothing and stays put.
 */
export function RoomTypeScreen({
  proposal,
  step,
  layout = 'desktop',
  go = () => undefined,
}: {
  proposal: number;
  step: RoomTypeStep;
  layout?: Layout;
  go?: Go;
}) {
  const slots = PROPOSAL_SLOTS[proposal - 1]!(step, layout, go);
  const bm = step === 'bm';
  // Proposal 1's creating state keeps the band's own spinner; 3 keeps its
  // popover's. Both need the frame to stay put, which is why the screen is
  // keyed by layout only — not by step.
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <AssembledInbox
        layout={layout}
        initialPane={slots.phonePane}
        headerProps={slots.headerProps}
        wrapHeader={slots.wrapHeader}
        thread={bm ? BM_THREAD : ONE_TO_ONE_THREAD}
        details={slots.details ?? <RoomDetails bm={bm} loading={step === 'loading'} />}
        chooseBm={bm ? { name: maria.name as string, avatar: maria.avatarSrc } : null}
        leadRoom={bm ? BM_ROOM : undefined}
      />
      {slots.overlay}
    </div>
  );
}

/**
 * The flow, clickable: create, confirm, watch it run, land in the new room.
 *
 * The request is faked with a timer. What is being reviewed is what the screen
 * does while it waits, so the wait has to be long enough to see.
 */
export function RoomTypeFlow({ proposal, layout = 'desktop' }: { proposal: number; layout?: Layout }) {
  const [step, setStep] = useState<RoomTypeStep>('oneToOne');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const go: Go = (next) => {
    setStep(next);
    if (next === 'creating') timer.current = window.setTimeout(() => setStep('bm'), 1800);
  };
  return <RoomTypeScreen proposal={proposal} step={step} layout={layout} go={go} />;
}

export const PROPOSALS: RoomTypeProposal[] = [
  {
    number: 1,
    approach: 'A tag in the header, and a band under it that always offers the room',
    rationale:
      'The type sits on the header’s meta row in place of “Team”, so it is read with the title at a glance, and every one-to-one carries the Business Manager band that ships today — with “Create BM room” instead of “Add”. Confirmation is a modal, because a new room the client sees is a real commitment. Costs a permanent 40px band on every one-to-one room, whether or not the reader wants a meeting, and the band’s in-flight label is AddBmInfo’s hard-coded “Adding”, which would need a prop to read “Creating”. With no manager connected the band needs a chip it has nobody to put in.',
    slots: PROPOSAL_SLOTS[0]!,
    render: () => <RoomTypeFlow proposal={1} />,
  },
  {
    number: 2,
    approach: 'The Details pane says what the room is, and offers the new one there',
    rationale:
      'The header stays exactly as it ships; the pane’s participants section moves to the top as “This room”, led by a card naming the type, who is in it, and the create action, with the confirmation opening inside the card. It sits next to the list of people it describes, which is what the type is about. Costs glanceability: the header never says the type, the card moves the client card down, and on a phone the whole thing is behind the info button — two taps from the thread.',
    slots: PROPOSAL_SLOTS[1]!,
    render: () => <RoomTypeFlow proposal={2} />,
  },
  {
    number: 3,
    approach: 'The header tag is the way in — it opens a popover that is the confirmation',
    rationale:
      'The same tag as 1, but pressable on a one-to-one: it opens a card under itself explaining the type, with “Create room” in it. One click fewer than 1, and nothing is added to rooms that do not need a meeting. Costs discoverability — a tag does not look like it does anything, so a reader who wants a meeting may never find it — and on a phone the popover spans the header, covering the first message while it is open.',
    slots: PROPOSAL_SLOTS[2]!,
    render: () => <RoomTypeFlow proposal={3} />,
  },
];
