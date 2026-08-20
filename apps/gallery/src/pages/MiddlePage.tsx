import {
  AutoCancelSwitch,
  ChatHeader,
  HeaderMetaTag,
  HeaderNavButton,
  IconSearch,
  defaultChatFilters,
  type StageName,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PageHeader, Section } from '../layout';
import { CrossLink } from '../navigation';
import { chatRoom } from '../fixtures/inbox';
import { Caption, Row, Surface, Thread } from './middle/parts';

/**
 * CRM ▸ Inbox ▸ Chat Room (Mid).
 *
 * The middle column — Figma's "Middle - Chat Room", node 426:23179. Its header
 * is what exists today; the message thread and the composer under it are still
 * to be built, which is why this page documents the band rather than the screen.
 */
export function MiddlePage() {
  const [autoCancel, setAutoCancel] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [shownFilters, setShownFilters] = useState(defaultChatFilters.map((f) => f.name));
  const [stageOpen, setStageOpen] = useState(false);
  const [stage, setStage] = useState<StageName>(chatRoom.stage);

  return (
    <>
      <PageHeader
        title="Chat Room (Mid)"
        description="The conversation itself — the column between the room list and the client panel. Figma node 426:23179, five states."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' },
          { label: 'Mid ▸ Add BM Information', pageId: 'crm-mid-addbm' },
          { label: 'Mid ▸ Filter Chat', pageId: 'crm-mid-filterchat' },
          { label: 'Mid ▸ Menu Button', pageId: 'crm-mid-menubutton' },
          { label: 'Mid ▸ Lead Stage Button', pageId: 'crm-mid-leadstage' },
        ]}
      >
        Each piece Figma files inside this column is documented beneath this page, in the order the
        header stacks them. Every interactive part is its own component — nothing here draws a button
        it could compose — so a screen assembling its own header band reaches for the same controls.
      </CrossLink>

      <Section
        title="The header"
        description="What is built so far. The band names who the conversation is with and carries everything that can be done to the room; the thread and the composer below it are still to come."
      >
        <Thread>
          <ChatHeader
            title={chatRoom.title}
            topic={chatRoom.topic}
            clientName={chatRoom.clientName}
            clientTone={chatRoom.clientTone}
            preset={chatRoom.preset}
            assignee={chatRoom.assignee}
            stage={stage}
            onStageChange={setStage}
            stageOpen={stageOpen}
            onStageClick={() => {
              setStageOpen((open) => !open);
              setFilterOpen(false);
            }}
            filters={defaultChatFilters}
            shownFilters={shownFilters}
            onFiltersChange={setShownFilters}
            filterOpen={filterOpen}
            onFilterClick={() => {
              setFilterOpen((open) => !open);
              setStageOpen(false);
            }}
            addBusinessManager={{ managerName: chatRoom.managerName }}
          />
        </Thread>
        <Caption>
          Click the filter button to open the filter popover, and the stage pill to open the stage
          menu — the current stage carries a tick. Only one is open at a time, and clicking outside
          closes it.
        </Caption>
        <CodeBlock
          code={`<ChatHeader
  title={room.title}
  topic="Team"
  clientName={room.client}
  preset="V1 Jane - UI UX"
  assignee="Jane Cooper"

  // The filter button opens FilterChat when given the kinds to offer.
  filters={defaultChatFilters}
  shownFilters={shown}
  onFiltersChange={setShown}
  filterOpen={filterOpen}
  onFilterClick={() => setFilterOpen((open) => !open)}

  // The stage pill opens LeadStageMenu when given a change handler.
  stage={stage}
  onStageChange={setStage}
  stageOpen={stageOpen}
  onStageClick={() => setStageOpen((open) => !open)}

  addBusinessManager={{ managerName: 'Maria Ovcharenko', onAdd: addManager }}
/>`}
        />
      </Section>

      <Section
        title="The smaller shared parts"
        description="Three controls the header composes that Figma does not file separately, exported anyway because they are the same decision wherever a header band is drawn: the leading chevron, the meta tags, and the scheduled queue's auto-cancel switch."
      >
        <Surface>
          <Row>
            <HeaderNavButton action="back" />
            <HeaderNavButton action="collapse" />
            <HeaderMetaTag icon={IconSearch} variant="brand">
              V1 Jane - UI UX
            </HeaderMetaTag>
            <HeaderMetaTag icon={IconSearch} variant="brand" label="Reply preset" />
            <AutoCancelSwitch checked={autoCancel} onCheckedChange={setAutoCancel} />
            <AutoCancelSwitch checked={autoCancel} onCheckedChange={setAutoCancel} label={null} />
          </Row>
        </Surface>
        <Caption>
          The chevron in both directions, a meta tag with and without its label, and the switch in
          both widths.
        </Caption>
        <CodeBlock
          code={`<HeaderNavButton action="back" onClick={goBack} />
<HeaderMetaTag icon={IconSearch} variant="brand">V1 Jane - UI UX</HeaderMetaTag>
<AutoCancelSwitch checked={autoCancel} onCheckedChange={setAutoCancel} />`}
        />
      </Section>

      <Section
        title="Still to build"
        description="Figma draws five states for this column: Default, Schedule Message, Empty or Not Found, Load Chat, and 1st Loading. The header is common to all of them; what differs is the thread underneath, which is the next thing to build."
      >
        <Caption>
          Nodes 386:24899, 2077:17400, 426:20575, 426:22312, and 426:22896 — the five frames under
          "Middle - Chat Room".
        </Caption>
      </Section>
    </>
  );
}
