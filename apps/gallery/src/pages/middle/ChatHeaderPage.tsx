import { ChatHeader } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { chatRoom } from '../../fixtures/inbox';
import { Caption, Thread } from './parts';

/**
 * Mid ▸ Chat Header — Figma node 3523:37230.
 *
 * The band across the top of the thread, in all four of the variants Figma
 * draws plus the Business Manager band that can hang under any of them.
 */
export function ChatHeaderPage() {
  const [autoCancel, setAutoCancel] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  return (
    <>
      <PageHeader
        title="Chat Header"
        description="The band across the top of the chat room — who the conversation is with, and everything that can be done to it. Figma node 3523:37230."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Mid ▸ Menu Button', pageId: 'crm-mid-menubutton' },
          { label: 'Mid ▸ Lead Stage Button', pageId: 'crm-mid-leadstage' },
          { label: 'Mid ▸ Filter Chat', pageId: 'crm-mid-filterchat' },
          { label: 'Mid ▸ Add BM Information', pageId: 'crm-mid-addbm' },
        ]}
      >
        The header draws none of its own controls. The three round buttons are{' '}
        <strong>Menu Button</strong>, the stage pill is <strong>Lead Stage Button</strong>, the
        filter button opens <strong>Filter Chat</strong>, and the band underneath is{' '}
        <strong>Add BM Information</strong> — each documented on its own page and each usable
        without the header.
      </CrossLink>

      <Section
        title="Desktop — default"
        description="The resting header. The client's avatar and the job title lead, the meta row names the topic, the reply preset, and who the room is assigned to, and the controls sit at the trailing edge with the lead's stage last."
      >
        <Thread>
          <ChatHeader
            title={chatRoom.title}
            topic={chatRoom.topic}
            clientName={chatRoom.clientName}
            clientTone={chatRoom.clientTone}
            preset={chatRoom.preset}
            assignee={chatRoom.assignee}
            stage={chatRoom.stage}
            filterCount={5}
            filterOpen={filterOpen}
            onFilterClick={() => setFilterOpen((open) => !open)}
          />
        </Thread>
        <Caption>
          Click the filter button to see its selected state — the fill it takes while the popover it
          opens is showing.
        </Caption>
        <CodeBlock
          code={`<ChatHeader
  title="Mobile and Website UI & UX Designer…"
  topic="Team"
  clientName="Floyd Miles"
  preset="V1 Jane - UI UX"
  assignee="Jane Cooper"
  stage="new"
  filterCount={5}
  onFilterClick={openFilterChat}
/>`}
        />
      </Section>

      <Section
        title="Desktop — with the Business Manager band"
        description="Figma's “BM not in this room” toggle. The band is a second row inside the header frame rather than something the screen stacks underneath, so it shares the header's inset and picks up its own top rule."
      >
        <Thread>
          <ChatHeader
            title={chatRoom.title}
            topic={chatRoom.topic}
            clientName={chatRoom.clientName}
            clientTone={chatRoom.clientTone}
            preset={chatRoom.preset}
            assignee={chatRoom.assignee}
            stage="interested"
            filterCount={5}
            addBusinessManager={{
              managerName: chatRoom.managerName,
              adding,
              onAdd: () => setAdding(true),
            }}
          />
        </Thread>
        <Caption>Press Add to see the “Adding” state the band goes into.</Caption>
        <CodeBlock
          code={`<ChatHeader
  title={room.title}
  stage="interested"
  addBusinessManager={{ managerName: 'Maria Ovcharenko', onAdd: addManager }}
/>`}
        />
      </Section>

      <Section
        title="Desktop — scheduled"
        description="The scheduled-messages queue. A different surface rather than a different size: the room's controls have no role over a queue, so the header names what is being looked at and carries the one switch that applies to it."
      >
        <Thread>
          <ChatHeader
            title={chatRoom.title}
            scheduled
            autoCancel={autoCancel}
            onAutoCancelChange={setAutoCancel}
          />
        </Thread>
        <CodeBlock
          code={`<ChatHeader
  title={room.title}
  scheduled
  autoCancel={autoCancel}
  onAutoCancelChange={setAutoCancel}
/>`}
        />
      </Section>

      <Section
        title="Mobile"
        description="`layout=“mobile”` is not the desktop header narrowed. A back chevron replaces the sidebar, the meta tags keep their glyph and drop their label, and the three controls collapse to one info button — there is room for a mark but not for a name."
      >
        <Thread width={402}>
          <ChatHeader
            layout="mobile"
            title={chatRoom.title}
            topic={chatRoom.topic}
            clientName={chatRoom.clientName}
            clientTone={chatRoom.clientTone}
            preset={chatRoom.preset}
            assignee={chatRoom.assignee}
          />
        </Thread>
        <Caption>Mobile, default.</Caption>
        <Thread width={402}>
          <ChatHeader
            layout="mobile"
            title={chatRoom.title}
            topic={chatRoom.topic}
            clientName={chatRoom.clientName}
            clientTone={chatRoom.clientTone}
            preset={chatRoom.preset}
            addBusinessManager={{ managerName: chatRoom.managerName }}
          />
        </Thread>
        <Caption>Mobile, with the Business Manager band.</Caption>
        <Thread width={402}>
          <ChatHeader
            layout="mobile"
            title={chatRoom.title}
            scheduled
            autoCancel={autoCancel}
            onAutoCancelChange={setAutoCancel}
          />
        </Thread>
        <Caption>
          Mobile, scheduled. The switch keeps its shield and drops its label, the same trade the
          meta tags make.
        </Caption>
        <CodeBlock code={`<ChatHeader layout="mobile" title={room.title} onBack={goBack} />`} />
      </Section>
    </>
  );
}
