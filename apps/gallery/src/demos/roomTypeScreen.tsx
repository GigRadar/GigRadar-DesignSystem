import { component } from '@gigradar/theme';
import {
  BubbleChat,
  CreateBmRoomConfirm,
  CreateBmRoomModal,
  InboxDetails,
  ModalCard,
  RoomDivider,
  RoomMessage,
  RoomNotice,
  Sender,
  type AddBmInfoProps,
  type DetailsParticipant,
  type RelevanceVerdict,
} from '@gigradar/ui';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AssembledInbox } from './inboxScreen';
import {
  aiConfiguration,
  chatRoom,
  clientDetails,
  participants,
  rooms,
  type Room,
} from '../fixtures/inbox';

/**
 * The Inbox around a room's type — BF-3481, as built.
 *
 * One fixture for every state: Floyd Miles, the same thread, Maria Ovcharenko
 * as the Business Manager. The states differ only in what the room knows about
 * itself, so a reader comparing two frames is comparing the design and not two
 * datasets.
 */

/** Every state the flow passes through, in order. */
export type RoomTypeStep = 'loading' | 'oneToOne' | 'noBm' | 'confirm' | 'creating' | 'bm';

export const ROOM_TYPE_STEPS: { step: RoomTypeStep; name: string; trigger: string }[] = [
  {
    step: 'loading',
    name: 'Loading',
    trigger:
      'The room is open but its participants have not arrived, so its type is not known. The tag is a grey bar and nothing is offered until the type is known.',
  },
  {
    step: 'oneToOne',
    name: 'One-to-one room',
    trigger:
      'Only the freelancer and the client are in the room. The tag reads One-to-one and the band under the header offers Create BM room. The composer has no meeting or attachment controls.',
  },
  {
    step: 'noBm',
    name: 'One-to-one, no manager to add',
    trigger:
      'The team has no Business Manager connected. The tag still reads One-to-one; the band drops its manager chip, says how to fix it, and disables the button rather than hiding it.',
  },
  {
    step: 'confirm',
    name: 'Confirming',
    trigger:
      'Create BM room was pressed. The new room is one the client sees and cannot be undone, so the modal names who will be in it, that the client is notified, and that this one-to-one stays.',
  },
  {
    step: 'creating',
    name: 'Creating',
    trigger:
      'The request is in flight. The modal cannot be dismissed, its buttons stop taking clicks, and the confirming one reads Creating room with a spinner.',
  },
  {
    step: 'bm',
    name: 'Landed in the Business Manager room',
    trigger:
      'The room exists and is open. It leads the list, the tag reads Business Manager in the meetings green, the band is gone, the composer has its manager picker, meetings and attachments, and its first line says where it came from.',
  },
];

const floyd = participants.find((p) => p.id === 'floyd')!;
const maria = participants.find((p) => p.id === 'maria')!;
const jane = participants.find((p) => p.id === 'jane')!;

const ONE_TO_ONE_PEOPLE: DetailsParticipant[] = [floyd, jane];
const BM_PEOPLE: DetailsParticipant[] = [floyd, maria, jane];

/** The new room, at the top of the list. */
const BM_ROOM: Room = {
  ...rooms[0]!,
  id: 'r1-bm',
  sender: 'You',
  preview: 'Business Manager room created',
  timestamp: 'Now',
  unread: undefined,
};

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

const BM_THREAD = (
  <>
    <RoomDivider>Today</RoomDivider>
    <RoomNotice>
      Business Manager room created from your one-to-one with {clientDetails.name}.{' '}
      {chatRoom.managerName} joined as Business Manager.
    </RoomNotice>
  </>
);

function RoomDetails({ bm, loading }: { bm: boolean; loading: boolean }) {
  const [verdict, setVerdict] = useState<RelevanceVerdict | undefined>('relevant');
  return (
    <InboxDetails
      client={clientDetails}
      ai={{ ...aiConfiguration, onEdit: () => undefined }}
      relevance={verdict}
      onRelevanceChange={setVerdict}
      participants={loading ? [] : bm ? BM_PEOPLE : ONE_TO_ONE_PEOPLE}
    />
  );
}

/** The band under the header, in the state the room is in. */
export function roomTypeBand(
  step: RoomTypeStep,
  onCreate: () => void,
): Omit<AddBmInfoProps, 'paddingX' | 'paddingY' | 'background'> | undefined {
  if (step === 'loading' || step === 'bm') return undefined;
  if (step === 'noBm')
    return {
      children: 'One-to-one room. Connect a Business Manager in Settings to create a BM room.',
      actionLabel: 'Create BM room',
      disabled: true,
    };
  return {
    managerName: chatRoom.managerName,
    managerAvatar: maria.avatarSrc,
    children: 'One-to-one room. Meetings and attachments need a Business Manager in the room.',
    actionLabel: 'Create BM room',
    busyLabel: 'Creating',
    adding: step === 'creating',
    onAdd: onCreate,
  };
}

/**
 * A still picture of the modal state: the shipped confirmation in a
 * `ModalCard`, over the layer `Modal` draws. Only the layer is local — a real
 * `Modal` locks the page's scroll and traps its focus, which a page carrying a
 * dozen frames cannot have.
 */
function StillModal({ creating }: { creating: boolean }) {
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
      <ModalCard width={component.middle.createBmRoom.width} shadow={component.modal.shadow}>
        <CreateBmRoomConfirm
          clientName={clientDetails.name}
          managerName={chatRoom.managerName}
          creating={creating}
          onCancel={() => undefined}
        />
      </ModalCard>
    </div>
  );
}

/**
 * The whole Inbox in one state.
 *
 * With `go`, the screen is live: the band opens the real `CreateBmRoomModal`,
 * mounted inside the frame so it dims the screen it belongs to. Without it,
 * the state is a still, and the modal is drawn in place.
 */
export function RoomTypeInbox({
  step,
  layout = 'desktop',
  go,
}: {
  step: RoomTypeStep;
  layout?: 'desktop' | 'mobile';
  go?: (next: RoomTypeStep) => void;
}) {
  const bm = step === 'bm';
  const loading = step === 'loading';
  const host = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLDivElement | null>(null);
  useEffect(() => setMount(host.current), []);
  const asking = step === 'confirm' || step === 'creating';

  return (
    <div ref={host} style={{ position: 'relative', height: '100%' }}>
      <AssembledInbox
        layout={layout}
        initialPane="room"
        headerProps={{
          topic: undefined,
          roomType: loading ? undefined : bm ? 'businessManager' : 'oneToOne',
          roomTypeLoading: loading,
          addBusinessManager: roomTypeBand(step, () => go?.('confirm')),
        }}
        thread={bm ? BM_THREAD : ONE_TO_ONE_THREAD}
        details={<RoomDetails bm={bm} loading={loading} />}
        chooseBm={bm ? { name: chatRoom.managerName, avatar: maria.avatarSrc } : null}
        leadRoom={bm ? BM_ROOM : undefined}
      />
      {go ? (
        <CreateBmRoomModal
          open={asking}
          container={mount}
          clientName={clientDetails.name}
          managerName={chatRoom.managerName}
          creating={step === 'creating'}
          onClose={() => go('oneToOne')}
          onConfirm={() => go('creating')}
        />
      ) : (
        asking && <StillModal creating={step === 'creating'} />
      )}
    </div>
  );
}

/**
 * The flow, clickable: Create BM room, confirm, watch it run, land in the new
 * room. The request is a timer — what is under review is what the screen does
 * while it waits, so the wait is long enough to see.
 */
export function RoomTypeFlow({ layout = 'desktop' }: { layout?: 'desktop' | 'mobile' }) {
  const [step, setStep] = useState<RoomTypeStep>('oneToOne');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const go = (next: RoomTypeStep) => {
    window.clearTimeout(timer.current);
    setStep(next);
    if (next === 'creating') timer.current = window.setTimeout(() => setStep('bm'), 1800);
  };
  return <RoomTypeInbox step={step} layout={layout} go={go} />;
}
