import { spacing } from '@gigradar/theme';
import { FilterChat, IconFilterChatStroke, MenuButton, defaultChatFilters } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Row, Surface } from './parts';

/**
 * Mid ▸ Filter Chat — Figma node 4486:31137.
 *
 * Which kinds of message the thread shows. Figma draws two states; they are not
 * variants — "Hide" is the same panel with nothing ticked — so the component
 * takes the selection and both drawings fall out of it.
 */
export function FilterChatPage() {
  const [shown, setShown] = useState<string[]>(defaultChatFilters.map((filter) => filter.name));
  const [open, setOpen] = useState(true);

  return (
    <>
      <PageHeader
        title="Filter Chat"
        description="The popover the header's filter button opens — which kinds of message the thread shows. Figma node 4486:31137."
      />

      <CrossLink
        eyebrow="Opened from"
        links={[
          { label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' },
          { label: 'Mid ▸ Menu Button', pageId: 'crm-mid-menubutton' },
        ]}
      >
        The header's filter <strong>Menu Button</strong> opens this panel and takes its selected fill
        while it is showing. The count on that button is how many kinds are being shown — the panel
        itself does not report it.
      </CrossLink>

      <Section
        title="The panel"
        description="Three rows, each a switch. The trailing action toggles everything and reads for the direction it would move: with everything on it offers “Hide all”, and with anything off it offers “Show all” — a mixed selection is one press from complete rather than two."
      >
        <Surface>
          <FilterChat filters={defaultChatFilters} value={shown} onChange={setShown} />
        </Surface>
        <Caption>
          Showing {shown.length} of {defaultChatFilters.length}. Tick rows, then use the action at
          the top to see it flip.
        </Caption>
        <CodeBlock
          code={`<FilterChat filters={defaultChatFilters} value={shown} onChange={setShown} />`}
        />
      </Section>

      <Section
        title="Both of Figma's drawings"
        description="Everything on and everything off — the two frames Figma files as “Un-hide (Default)” and “Hide”. One component, two selections."
      >
        <Surface>
          <Row gap={spacing.l}>
            <FilterChat
              filters={defaultChatFilters}
              value={defaultChatFilters.map((filter) => filter.name)}
            />
            <FilterChat filters={defaultChatFilters} value={[]} />
          </Row>
        </Surface>
        <CodeBlock
          code={`<FilterChat filters={defaultChatFilters} value={['customEvents', 'roomEvents', 'notesAndAiReplies']} />
<FilterChat filters={defaultChatFilters} value={[]} />`}
        />
      </Section>

      <Section
        title="In place, under its button"
        description="How the pair actually reads: the button holds its selected fill for as long as the panel is up, so the two are visibly one control rather than a button and a floating menu. Its badge counts the kinds being shown, so it reads as the number of message kinds currently in the thread and empties out only when everything has been hidden."
      >
        <Surface>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <MenuButton
              icon={IconFilterChatStroke}
              label="Filter chat"
              count={shown.length}
              selected={open}
              onClick={() => setOpen((showing) => !showing)}
            />
            {open && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: spacing.xxs }}>
                <FilterChat filters={defaultChatFilters} value={shown} onChange={setShown} />
              </div>
            )}
          </div>
        </Surface>
        <Caption>
          Click the button to close and reopen the panel. The badge follows the ticked rows — untick
          all three and it disappears, since there is nothing left to count.
        </Caption>
      </Section>

      <Section
        title="Its own filters"
        description="`defaultChatFilters` is the set Figma draws, exported rather than baked in — the filterable kinds belong to the product, and a thread with a fourth kind passes its own list."
      >
        <CodeBlock
          code={`const filters: ChatFilter[] = [
  ...defaultChatFilters,
  { name: 'attachments', label: 'Attachments', icon: IconAttachmentClip },
];

<FilterChat filters={filters} defaultValue={['attachments']} />`}
        />
      </Section>
    </>
  );
}
