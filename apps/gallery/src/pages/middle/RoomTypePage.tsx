import { color, component, radius, spacing, textStyle } from '@gigradar/theme';
import {
  AddBmInfo,
  Button,
  CreateBmRoomConfirm,
  HStack,
  ModalCard,
  RoomTypeTag,
  VStack,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { chatRoom, clientDetails, participants } from '../../fixtures/inbox';
import { ROOM_TYPE_STEPS, RoomTypeFlow, RoomTypeInbox } from '../../demos/roomTypeScreen';
import { Caption, Surface } from './parts';

/**
 * CRM ▸ Chat Room ▸ Room type & Create BM room — BF-3481.
 *
 * Proposal 1 won the review: a type tag on the header's meta row, and the
 * shipped Business Manager band offering Create BM room on every one-to-one,
 * confirmed in a modal. It ships as `RoomTypeTag`, `ChatHeader.roomType`,
 * `AddBmInfo.busyLabel` and `CreateBmRoomModal`.
 */

/** The width the Inbox wants before its thread starts losing its layout. */
const SCREEN_WIDTH = 1421;
/** The phone the CRM's mobile shell draws. */
const PHONE_WIDTH = 402;
/**
 * The screens' height. The Inbox would draw ~1600px for a thread this short,
 * almost all of it empty wash; at this height the header, the messages and the
 * composer all fit, and only the blank middle goes.
 */
const SCREEN_HEIGHT = 820;

const maria = participants.find((p) => p.id === 'maria')!;

/** A screen at a fixed size, bordered the way `Frame` borders one. */
function Screen({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div
      style={{
        width,
        height: SCREEN_HEIGHT,
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: radius.s,
        border: `1px solid ${color.navbar.border}`,
        position: 'relative',
        // A containing block for the modal's fixed layer, so the confirmation
        // dims the screen it belongs to rather than the whole page.
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  );
}

/** Desktop and phone side by side — compared, not remembered. */
function Widths({ slug, desktop, phone }: { slug?: string; desktop: ReactNode; phone: ReactNode }) {
  const label = { ...textStyle.sMedium, color: color.main.description };
  return (
    <div style={{ overflowX: 'auto', width: 'calc(100vw - 408px)', paddingBottom: spacing.xs }}>
      <div style={{ display: 'flex', gap: spacing.l, alignItems: 'flex-start', width: 'max-content' }}>
        <VStack gap="xxs">
          <span style={label}>Desktop · {SCREEN_WIDTH}px</span>
          <div data-state-screen={slug}>
            <Screen width={SCREEN_WIDTH}>{desktop}</Screen>
          </div>
        </VStack>
        <VStack gap="xxs">
          <span style={label}>Phone · {PHONE_WIDTH}px — the room</span>
          <div data-state-screen={slug ? `${slug}-mobile` : undefined}>
            <Screen width={PHONE_WIDTH}>{phone}</Screen>
          </div>
        </VStack>
      </div>
    </div>
  );
}

function TryIt() {
  const [run, setRun] = useState(0);
  return (
    <VStack gap="xs">
      <HStack gap="s" alignItems="center">
        <span style={{ ...textStyle.mSemibold, color: color.navbar.text2 }}>
          Press Create BM room, confirm, and wait for the new room
        </span>
        <Button variant="third" size="small" onClick={() => setRun((n) => n + 1)}>
          Start over
        </Button>
      </HStack>
      <Widths
        key={run}
        desktop={<RoomTypeFlow />}
        phone={<RoomTypeFlow layout="mobile" />}
      />
    </VStack>
  );
}

export function RoomTypePage() {
  const [adding, setAdding] = useState(false);

  return (
    <>
      <PageHeader
        title="Room type & Create BM room"
        description="BF-3481. The room says whether it is one-to-one or has a Business Manager, and a one-to-one can start a Business Manager room — which is what unlocks meetings (BF-2947)."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' },
          { label: 'Mid ▸ Add BM Information', pageId: 'crm-mid-addbm' },
        ]}
      >
        A <strong>RoomTypeTag</strong> on the header&rsquo;s meta row through{' '}
        <code>ChatHeader</code>&rsquo;s <code>roomType</code>; the Business Manager band that
        already ships, offering <strong>Create BM room</strong>; and{' '}
        <strong>CreateBmRoomModal</strong> to confirm. Everything else on the screen is the Inbox
        as it ships.
      </CrossLink>

      <Section
        title="Live example"
        description="The whole flow in the real Inbox, at both widths. The request is faked with a 1.8s timer; the modal is the real CreateBmRoomModal, mounted inside the frame."
      >
        <TryIt />
      </Section>

      <Section
        title="Every state"
        description="The six states the room passes through, the whole Inbox at 1421px beside the phone. The phone opens on the room, where the tag and the band live."
      >
        {ROOM_TYPE_STEPS.map((state) => (
          <VStack key={state.step} gap="xs" mb="xl">
            <span style={{ ...textStyle.lSemibold, color: color.navbar.text2 }}>{state.name}</span>
            <p style={{ ...textStyle.mRegular, color: color.main.description, margin: 0, maxWidth: 720 }}>
              {state.trigger}
            </p>
            <Widths
              slug={state.step}
              desktop={<RoomTypeInbox step={state.step} />}
              phone={<RoomTypeInbox step={state.step} layout="mobile" />}
            />
          </VStack>
        ))}
      </Section>

      <Section
        title="The parts"
        description="The three pieces on their own. The tag and the band are shipped components with new optional props; the confirmation is new."
      >
        <Surface>
          <HStack gap="s" alignItems="center">
            <RoomTypeTag type="oneToOne" />
            <RoomTypeTag type="businessManager" />
            <RoomTypeTag loading />
          </HStack>
        </Surface>
        <Caption>RoomTypeTag — one-to-one, Business Manager, and loading.</Caption>

        <Surface>
          <VStack gap="s">
            <AddBmInfo
              managerName={chatRoom.managerName}
              managerAvatar={maria.avatarSrc}
              actionLabel="Create BM room"
              busyLabel="Creating"
              adding={adding}
              onAdd={() => setAdding((value) => !value)}
            >
              One-to-one room. Meetings and attachments need a Business Manager in the room.
            </AddBmInfo>
            <AddBmInfo actionLabel="Create BM room" disabled>
              One-to-one room. Connect a Business Manager in Settings to create a BM room.
            </AddBmInfo>
          </VStack>
        </Surface>
        <Caption>
          AddBmInfo on a one-to-one — press the first to see it creating; the second has no manager
          to create it with, so it drops the chip.
        </Caption>

        <Surface>
          <ModalCard width={component.middle.createBmRoom.width} shadow={component.modal.shadow}>
            <CreateBmRoomConfirm clientName={clientDetails.name} managerName={chatRoom.managerName} />
          </ModalCard>
        </Surface>
        <Caption>
          CreateBmRoomConfirm, the modal&rsquo;s content, in a ModalCard. CreateBmRoomModal puts it
          over the page.
        </Caption>
      </Section>

      <Section title="Usage">
        <CodeBlock
          code={`const [step, setStep] = useState<'idle' | 'confirm' | 'creating'>('idle');

<ChatHeader
  title={room.title}
  roomType={room.hasBusinessManager ? 'businessManager' : 'oneToOne'}
  roomTypeLoading={!room.participantsLoaded}
  addBusinessManager={
    room.participantsLoaded && !room.hasBusinessManager
      ? {
          managerName: manager?.name,          // omit when none is connected
          managerAvatar: manager?.avatar,
          actionLabel: 'Create BM room',
          busyLabel: 'Creating',
          adding: step === 'creating',
          disabled: !manager,
          onAdd: () => setStep('confirm'),
          children: manager
            ? 'One-to-one room. Meetings and attachments need a Business Manager in the room.'
            : 'One-to-one room. Connect a Business Manager in Settings to create a BM room.',
        }
      : undefined
  }
/>

<CreateBmRoomModal
  open={step !== 'idle'}
  creating={step === 'creating'}
  clientName={room.client.name}
  managerName={manager.name}
  onClose={() => setStep('idle')}
  onConfirm={async () => {
    setStep('creating');
    const created = await createBmRoom(room.id);
    setStep('idle');
    openRoom(created.id);
  }}
/>`}
        />
      </Section>

      <Section title="ChatHeader — new props">
        <PropsTable
          rows={[
            {
              name: 'roomType',
              type: "'oneToOne' | 'businessManager'",
              description:
                'Draws a RoomTypeTag at the head of the meta row. Omitted, no tag. It says what "Team" did, more precisely, so a screen passing it usually drops topic.',
            },
            {
              name: 'roomTypeLoading',
              type: 'boolean',
              default: 'false',
              description:
                "Draws the tag's loading bar while the room's participants are still arriving. Pair it with no addBusinessManager.",
            },
          ]}
        />
      </Section>

      <Section title="RoomTypeTag">
        <PropsTable
          rows={[
            { name: 'type', type: "'oneToOne' | 'businessManager'", default: "'oneToOne'", description: 'The room’s type. Business Manager takes the meetings green.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Draws a grey bar the size of the tag instead of guessing.' },
            { name: 'children', type: 'ReactNode', default: 'roomTypeLabels[type]', description: 'Overrides the label.' },
            { name: 'tooltip', type: 'ReactNode', default: "'Room type'", description: 'Names what the tag is on hover. null drops it.' },
          ]}
        />
      </Section>

      <Section title="AddBmInfo — new and changed props">
        <PropsTable
          rows={[
            { name: 'busyLabel', type: 'ReactNode', default: "'Adding'", description: 'The button’s label while adding. A one-to-one passes "Creating".' },
            { name: 'managerName', type: 'string', description: 'Now optional. Omitted, the manager chip is dropped — a team with nobody to add.' },
          ]}
        />
      </Section>

      <Section title="CreateBmRoomModal">
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', description: 'Whether the confirmation is on screen.' },
            { name: 'onClose', type: '() => void', description: 'Escape, backdrop, close button and Cancel. Not called while creating — the modal is undismissable while the request runs.' },
            { name: 'onConfirm', type: '() => void', description: 'Starts the room. Set creating until it lands, then close and open the new room.' },
            { name: 'creating', type: 'boolean', default: 'false', description: 'Spinner on the confirming button, both buttons inert, close button dropped.' },
            { name: 'clientName', type: 'string', default: "'the client'", description: 'Named in the default body.' },
            { name: 'managerName', type: 'string', default: "'your Business Manager'", description: 'Named in the default body.' },
            { name: 'title', type: 'ReactNode', default: "'Create a Business Manager room?'", description: 'The heading.' },
            { name: 'children', type: 'ReactNode', description: 'Replaces the default body.' },
            { name: 'confirmLabel / creatingLabel / cancelLabel', type: 'ReactNode', default: "'Create room' / 'Creating room' / 'Cancel'", description: 'The buttons’ labels.' },
            { name: 'container', type: 'HTMLElement | null', default: 'document.body', description: 'Where the layer mounts.' },
          ]}
        />
        <Caption>
          CreateBmRoomConfirm takes the same props less open, onClose and container, plus onCancel —
          the bands without the layer, for a ModalCard of your own.
        </Caption>
      </Section>
    </>
  );
}
