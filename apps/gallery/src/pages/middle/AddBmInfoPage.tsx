import { AddBmInfo, ChatHeader } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { chatRoom } from '../../fixtures/inbox';
import { Caption, Surface, Thread } from './parts';

/**
 * Mid ▸ Add BM Information — Figma node 3541:29473.
 *
 * The band offering to add GigRadar's Business Manager to the room. Drawn on its
 * own here, and inside the chat header at node 3994:21968 — the same component
 * in both places.
 */
export function AddBmInfoPage() {
  const [adding, setAdding] = useState(false);

  return (
    <>
      <PageHeader
        title="Add BM Information"
        description="Offering to add GigRadar's Business Manager to the room, which is what enables meetings and attachments. Figma node 3541:29473."
      />

      <CrossLink eyebrow="Used by" links={[{ label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' }]}>
        The header's <code>addBusinessManager</code> prop draws this band as a second row inside the
        header frame — Figma's “BM not in this room”. It is the same component there as here; the
        header only supplies the inset and the rule above it.
      </CrossLink>

      <Section
        title="Both states"
        description="Default and Adding. `adding` is a prop rather than internal state: whether the manager actually joined the room is known by whatever owns the room, and a spinner that cleared itself would clear before the room changed."
      >
        <Surface>
          <AddBmInfo managerName={chatRoom.managerName} onAdd={() => undefined} />
          <AddBmInfo managerName={chatRoom.managerName} adding />
        </Surface>
        <Caption>Default, then Adding — the button greys and its glyph becomes a spinner.</Caption>
        <CodeBlock
          code={`<AddBmInfo managerName="Maria Ovcharenko" onAdd={addManager} />
<AddBmInfo managerName="Maria Ovcharenko" adding={pending} />`}
        />
      </Section>

      <Section
        title="Interactive"
        description="Press Add to move it into the state the request would put it in."
      >
        <Surface>
          <AddBmInfo
            managerName={chatRoom.managerName}
            adding={adding}
            onAdd={() => setAdding(true)}
          />
        </Surface>
        <Caption>{adding ? 'Adding — the button no longer accepts clicks.' : 'Resting.'}</Caption>
      </Section>

      <Section
        title="Inside the header"
        description="Where it actually appears. The band takes the header's own horizontal inset — 32px on desktop, 16px on mobile — so the prompt lines up with the title above it rather than with the frame's edge."
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
            addBusinessManager={{ managerName: chatRoom.managerName }}
          />
        </Thread>
        <CodeBlock
          code={`<ChatHeader
  title={room.title}
  addBusinessManager={{ managerName: 'Maria Ovcharenko', onAdd: addManager }}
/>`}
        />
      </Section>

      <Section
        title="Its own copy"
        description="The prompt and the button's label are overridable, because the reason for adding a manager differs by plan even though it says the same thing in the common case."
      >
        <Surface>
          <AddBmInfo managerName={chatRoom.managerName} actionLabel="Invite">
            Add a Business Manager to unlock scheduling on this room.
          </AddBmInfo>
        </Surface>
        <CodeBlock
          code={`<AddBmInfo managerName="Maria Ovcharenko" actionLabel="Invite">
  Add a Business Manager to unlock scheduling on this room.
</AddBmInfo>`}
        />
      </Section>
    </>
  );
}
