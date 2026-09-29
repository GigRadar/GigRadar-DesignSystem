import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { AddBmInfo, Button, HStack, VStack } from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { DevelopmentPlaceholder, Proposal } from '../../components/DevelopmentPlaceholder';
import { PageHeader, Section } from '../../layout';
import { chatRoom } from '../../fixtures/inbox';
import {
  PROPOSALS,
  RoomTypeFlow,
  RoomTypeScreen,
  STEPS,
} from '../../proposals/RoomTypeProposals';
import { Surface } from './parts';

/**
 * CRM ▸ Chat Room ▸ Room type, and creating a Business Manager room.
 *
 * BF-3481. Under review, so not in the nav: this page is what the review
 * Artifact's screenshots are captured from, and it is reached from the
 * sidebar's review list rather than from the tree of things that ship.
 *
 * Every proposal is drawn twice. Once as a flow you can click through — create,
 * confirm, watch it run, land in the new room — and once as each of its states
 * frozen, desktop and phone side by side, so the states can be compared without
 * replaying the flow to reach them.
 */

/** The width the Inbox wants before its thread starts losing its layout. */
const SCREEN_WIDTH = 1421;
/** The phone the CRM's mobile shell draws. */
const PHONE_WIDTH = 402;
/**
 * The screens' height. The Inbox would draw ~1600px for a thread this short,
 * almost all of it empty wash; held here the header, the messages and the
 * composer all fit, and only the blank middle goes.
 */
const SCREEN_HEIGHT = 820;

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
        // The confirmation layer is positioned against this box, so a
        // proposal's modal dims the screen it belongs to and not the page.
        position: 'relative',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  );
}

/** Desktop and phone side by side — compared, not remembered. */
function Widths({
  slug,
  desktop,
  phone,
  phoneLabel,
}: {
  slug?: string;
  desktop: ReactNode;
  phone: ReactNode;
  phoneLabel: string;
}) {
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
          <span style={label}>
            Phone · {PHONE_WIDTH}px — {phoneLabel}
          </span>
          <div data-state-screen={slug ? `${slug}-mobile` : undefined}>
            <Screen width={PHONE_WIDTH}>{phone}</Screen>
          </div>
        </VStack>
      </div>
    </div>
  );
}

/** The clickable flow at both widths, with a way back to the start. */
function TryIt({ proposal, phoneLabel }: { proposal: number; phoneLabel: string }) {
  const [run, setRun] = useState(0);
  return (
    <VStack gap="xs">
      <HStack gap="s" alignItems="center">
        <span style={{ ...textStyle.mSemibold, color: color.navbar.text2 }}>
          Try it — press Create BM room
        </span>
        <Button variant="third" size="small" onClick={() => setRun((n) => n + 1)}>
          Start over
        </Button>
      </HStack>
      <Widths
        key={run}
        phoneLabel={phoneLabel}
        desktop={<RoomTypeFlow proposal={proposal} />}
        phone={<RoomTypeFlow proposal={proposal} layout="mobile" />}
      />
    </VStack>
  );
}

export function RoomTypePage() {
  return (
    <>
      <PageHeader
        title="Room type & Create BM room"
        description="BF-3481. Say whether a room is one-to-one or has a Business Manager, and let a one-to-one start a Business Manager room — which is what unlocks meetings (BF-2947)."
      />

      <Section
        title="What already ships"
        description="A room that can take a Business Manager already has its band: AddBmInfo, hung under the header by ChatHeader's addBusinessManager. A one-to-one cannot take a third person, so for it the only way to a meeting is a new room — the case this review is about. The band is settled and reused below, not re-proposed."
      >
        <Surface>
          <AddBmInfo managerName={chatRoom.managerName} onAdd={() => undefined} />
        </Surface>
      </Section>

      <Section
        title="Room type"
        stage="development"
        description="Where the room says what kind it is, and how loudly a one-to-one offers to become a Business Manager room. Three proposals, one shared fixture: Floyd Miles, the same thread, Maria Ovcharenko as the manager."
      >
        <DevelopmentPlaceholder
          title="Room type and Create BM room"
          problem="A reader cannot tell a one-to-one room from a Business Manager room, and a one-to-one has no way to become one. Where the type is shown and where the create action lives decide everything else — its confirmation, its wait, and what the reader lands on."
          proposalCount={PROPOSALS.length}
        >
          <VStack gap="l">
            {PROPOSALS.map((proposal) => {
              const phonePane = proposal.number === 2 ? 'the details pane' : 'the room';
              return (
                <Proposal
                  key={proposal.number}
                  number={proposal.number}
                  approach={proposal.approach}
                  rationale={proposal.rationale}
                >
                  <VStack gap="m">
                    <TryIt proposal={proposal.number} phoneLabel={phonePane} />
                    {STEPS.map((state) => (
                      <VStack key={state.step} gap="xs" mt="m">
                        <span style={{ ...textStyle.lSemibold, color: color.navbar.text2 }}>
                          {state.name}
                        </span>
                        <p
                          style={{
                            ...textStyle.mRegular,
                            color: color.main.description,
                            margin: 0,
                            maxWidth: 720,
                          }}
                        >
                          {state.trigger}
                        </p>
                        <Widths
                          slug={`p${proposal.number}-${state.step}`}
                          phoneLabel={phonePane}
                          desktop={<RoomTypeScreen proposal={proposal.number} step={state.step} />}
                          phone={
                            <RoomTypeScreen
                              proposal={proposal.number}
                              step={state.step}
                              layout="mobile"
                            />
                          }
                        />
                      </VStack>
                    ))}
                  </VStack>
                </Proposal>
              );
            })}
          </VStack>
        </DevelopmentPlaceholder>
      </Section>
    </>
  );
}
