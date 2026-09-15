import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { HStack, LifecycleBadge, RoomEvent, VStack } from '@gigradar/ui';
import type { ReactNode } from 'react';
import { DevelopmentPlaceholder, Proposal } from '../../components/DevelopmentPlaceholder';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { AssembledInbox } from '../../demos/inboxScreen';
import { PROPOSALS } from '../../proposals/StageEventNameProposals';

/**
 * CRM ▸ Chat Room ▸ Stage Update in Room.
 *
 * Figma node 8945:23018 — "1.5.17 Stage update in Room", as a page rather than
 * a file. That file carries one main flow and five states of the same thing:
 * the line the thread draws when a lead's stage changes.
 *
 * This page exists because the Figma page was the only place a reviewer could
 * see those five states, and a pull request diff shows none of them. A diff on
 * `RoomEvent` is a handful of lines that say nothing about what the thread looks
 * like when three stage changes land in a row, or when the name is too long to
 * fit. So each state below is drawn the way Figma draws it — the whole screen,
 * the state's name, and the note saying when it triggers — and the screen is
 * the shipped components rather than an image of them.
 *
 * The consequence worth stating: this page goes stale the moment `RoomEvent`
 * changes, in a way the Figma file cannot. That is the point. What stays in
 * Figma is why a state exists and what precedes it; what lives here is what it
 * looks like, which is the half a reviewer needs and the half that drifts.
 */

/** The width the Inbox wants before its thread starts losing its layout. */
const SCREEN_WIDTH = 1421;

/** The phone the Figma node draws, and the width InboxScreen stacks at. */
const MOBILE_WIDTH = 402;

/**
 * One state — the screen, its name, and when it triggers.
 *
 * The three travel together because that is what makes the Figma page
 * reviewable: a screenshot with no trigger note is a picture, and a note with
 * no screen is a changelog. Laid out in that order, so a reader scrolling for
 * one state finds its name before its screen rather than after it.
 */
function State({
  name,
  slug,
  trigger,
  ships,
  children,
  mobile,
}: {
  /** The state's name, as the Figma frame labels it. */
  name: string;
  /** Short id for the screenshot the review Artifact captures from this state. */
  slug: string;
  /** The note under the Figma frame — when this state is on screen. */
  trigger: ReactNode;
  /**
   * Whether the shipped components already draw this state.
   *
   * Marked rather than left to the reader: three of these five are already
   * right, and a reviewer who cannot tell which spends their attention
   * re-approving settled work.
   */
  ships: boolean;
  children: ReactNode;
  /**
   * The same state at 402px.
   *
   * Every state is drawn at both widths, because a rule that only holds on a
   * desktop is half a rule — truncation, wrapping and a one-pane screen are
   * exactly where a phone disagrees. The mobile frame carries the room pane:
   * that is where the event lives, and a phone shows one pane at a time.
   */
  mobile?: ReactNode;
}) {
  return (
    <VStack gap="s" style={{ marginBottom: spacing.xl }}>
      <HStack gap="s" alignItems="center" flexWrap="wrap">
        <span style={{ ...textStyle.lSemibold, color: color.navbar.text2 }}>{name}</span>
        {ships ? (
          <span
            style={{
              ...textStyle.sMedium,
              color: color.main.description,
              border: `1px solid ${color.navbar.border}`,
              borderRadius: radius.xs,
              padding: `0 ${spacing.xxs}px`,
            }}
          >
            Ships today
          </span>
        ) : (
          <LifecycleBadge stage="development" />
        )}
      </HStack>
      <p
        style={{
          ...textStyle.mRegular,
          color: color.main.description,
          margin: 0,
          maxWidth: 680,
        }}
      >
        {trigger}
      </p>
      {/* The capture hook. Anchoring the Artifact's screenshots on a named
          attribute rather than on shape keeps them pinned to the screen even
          when the page around it grows another frame — the gallery's own nav
          also looks like "narrow rail beside wide pane". */}
      <div data-state-screen={slug}>
        <Frame wide={SCREEN_WIDTH} height="auto">
          {children}
        </Frame>
      </div>

      {mobile && (
        <VStack gap="xs" style={{ marginTop: spacing.m }}>
          <span style={{ ...textStyle.sMedium, color: color.main.description }}>
            On a phone — 402px, the room pane
          </span>
          <div data-state-screen={`${slug}-mobile`}>
            <Frame hug height="auto">
              <div style={{ width: MOBILE_WIDTH }}>{mobile}</div>
            </Frame>
          </div>
        </VStack>
      )}
    </VStack>
  );
}

/** The stage event as every settled state draws it. */
const BY = 'Jane Cooper';

export function StageUpdatePage() {
  return (
    <>
      <PageHeader
        title="Stage Update in Room"
        description="What the thread draws when a lead moves between stages — the main flow and every state around it. Figma node 8945:23018, as a running screen."
      />

      <Section
        title="Main flow"
        description="A stage changes, and the thread says so where it happened. The line is centred and unboxed: nobody said it, so it reads beside the conversation rather than in it."
      >
        <State
          name="Stage Transition — Default"
          slug="default"
          ships
          trigger="A person moves the lead to another stage from the room's stage menu. The line lands in the thread at the moment of the change, using the same entrance as a chat bubble."
          mobile={<AssembledInbox layout="mobile" initialPane="room" />}
        >
          <AssembledInbox />
        </State>
      </Section>

      <Section
        title="Possible states"
        description="Every alternative the Figma page draws. Three of the five are already what the shipped RoomEvent does; two are not, and are marked."
      >
        <State
          name="Stage Transition — Multiple"
          slug="multiple"
          ships
          trigger="Several stage changes land in a row. All consecutive changes are shown, with no collapsing and no limit — three changes are three lines, because hiding one would hide who made it."
          mobile={
            <AssembledInbox
              layout="mobile"
              initialPane="room"
              events={
                <>
                  <RoomEvent kind="stage" from="new" to="interested" by={BY} time="09:47" />
                  <RoomEvent kind="stage" from="interested" to="contactLater" by={BY} time="10:47" />
                  <RoomEvent kind="stage" from="contactLater" to="interested" by={BY} time="11:47" />
                </>
              }
            />
          }
        >
          <AssembledInbox
            events={
              <>
                <RoomEvent kind="stage" from="new" to="interested" by={BY} time="09:47" />
                <RoomEvent kind="stage" from="interested" to="contactLater" by={BY} time="10:47" />
                <RoomEvent kind="stage" from="contactLater" to="interested" by={BY} time="11:47" />
              </>
            }
          />
        </State>

        <State
          name="Stage Transition — By System (Auto)"
          slug="auto"
          ships
          trigger="GigRadar moves the stage itself rather than a person doing it. The attribution reads “GigRadar Automation” as plain text, with no icon and no avatar — the same sentence, only the name differs."
          mobile={
            <AssembledInbox
              layout="mobile"
              initialPane="room"
              events={
                <RoomEvent
                  kind="stage"
                  from="new"
                  to="interested"
                  by="GigRadar Automation"
                  time="8:47"
                />
              }
            />
          }
        >
          <AssembledInbox
            events={
              <RoomEvent
                kind="stage"
                from="new"
                to="interested"
                by="GigRadar Automation"
                time="8:47"
              />
            }
          />
        </State>

        <State
          name="Stage Transition — Max Width"
          slug="maxwidth"
          ships={false}
          trigger="The name is longer than the row can hold. Figma truncates it with an ellipsis; the shipped component wraps instead, so a long name turns the event into two rows. What the name does when it no longer fits is the open question — three proposals below."
          mobile={
            <AssembledInbox
              layout="mobile"
              initialPane="room"
              events={
                <RoomEvent
                  kind="stage"
                  from="new"
                  to="interested"
                  by="Christian Samuel Racing Tan Wijaya Winangun"
                  time="8:47"
                />
              }
            />
          }
        >
          <AssembledInbox
            events={
              <RoomEvent
                kind="stage"
                from="new"
                to="interested"
                by="Christian Samuel Racing Tan Wijaya Winangun"
                time="8:47"
              />
            }
          />
        </State>

        <DevelopmentPlaceholder
          title="Stage event — the name at max width"
          problem="A name longer than the row wraps the sentence onto a second line. Figma clips it with an ellipsis; what is undecided is whether the reader can still recover the full name, and what that costs."
          proposalCount={PROPOSALS.length}
        >
          <VStack gap="l">
            {PROPOSALS.map((proposal) => (
              <Proposal
                key={proposal.number}
                number={proposal.number}
                approach={proposal.approach}
                rationale={proposal.rationale}
              >
                {/* Each proposal draws the long name and a short one, on the
                    thread's own width rather than the full screen: the question
                    is what the row does, and three whole Inboxes would bury it. */}
                <VStack
                  gap="xs"
                  style={{
                    width: 788,
                    maxWidth: '100%',
                    borderRadius: radius.xs,
                    border: `1px solid ${color.navbar.border}`,
                    backgroundColor: color.main.background,
                  }}
                >
                  {proposal.render()}
                </VStack>
              </Proposal>
            ))}
          </VStack>
        </DevelopmentPlaceholder>

        <State
          name="Stage Transition — Last message in the room list"
          slug="lastmessage"
          ships={false}
          trigger="The stage change is the newest thing in the room, so it becomes the room's preview in the left column. The row reads “Stage changed to …” under the sender's name, truncated to the column like any other preview."
          // The one state that is about the list rather than the thread, so its
          // phone frame is the list pane — that is where the preview it changes
          // is actually read.
          mobile={
            <AssembledInbox
              layout="mobile"
              initialPane="list"
              previewOverrides={{ r1: 'Stage changed to interested' }}
            />
          }
        >
          <AssembledInbox
            events={
              <RoomEvent
                kind="stage"
                from="new"
                to="interested"
                by="Christian Samuel Racing Tan Wijaya Winangun"
                time="8:47"
              />
            }
            previewOverrides={{ r1: 'Stage changed to interested' }}
          />
        </State>
      </Section>
    </>
  );
}
