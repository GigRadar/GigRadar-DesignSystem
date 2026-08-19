import {
  IconBubbleMessageStroke,
  IconFilterChatStroke,
  IconInfoStroke,
  IconJobPostingArrowUpRight,
  MenuButton,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Row, Surface } from './parts';

/**
 * Mid ▸ Menu Button — Figma node 3523:37499.
 *
 * The round control the chat header's trailing edge is made of. Figma files it
 * as "View Job Posting" because that is the instance it was drawn from, but the
 * same button draws filter-chat and view-message too — they differ only by
 * glyph and by what they open.
 */
export function MenuButtonPage() {
  const [selected, setSelected] = useState(false);

  return (
    <>
      <PageHeader
        title="Menu Button"
        description="One round control in the chat header. Three states and an optional count that overhangs the corner. Figma node 3523:37499."
      />

      <CrossLink eyebrow="Used by" links={[{ label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' }]}>
        The header composes three of these — filter chat, view messages, and view job posting. It
        does not draw its own, so a screen building a header band of its own gets the same button at
        the same size.
      </CrossLink>

      <Section
        title="States"
        description="Default is an outlined ring. Hover and selected are the same fill — the brand blue — because what separates them is not appearance but duration: selected outlives the pointer, and says the surface it opens is still showing."
      >
        <Surface>
          <Row>
            <MenuButton icon={IconJobPostingArrowUpRight} label="View job posting" />
            <MenuButton
              icon={IconJobPostingArrowUpRight}
              label="View job posting"
              selected
            />
            <MenuButton icon={IconJobPostingArrowUpRight} label="View job posting" disabled />
          </Row>
        </Surface>
        <Caption>
          Default, selected, and disabled — hover the first to see the state between them.
        </Caption>
        <CodeBlock
          code={`<MenuButton icon={IconJobPostingArrowUpRight} label="View job posting" />
<MenuButton icon={IconFilterChatStroke} label="Filter chat" selected />`}
        />
      </Section>

      <Section
        title="The count badge"
        description="How many filters are applied, how many messages are unread. It overhangs the top-right corner and carries a white ring, which is what keeps it legible against a filled button. Omitted — or zero — nothing is drawn: a badge reading zero reports something where there is nothing to report."
      >
        <Surface>
          <Row>
            <MenuButton icon={IconFilterChatStroke} label="Filter chat" count={5} />
            <MenuButton icon={IconBubbleMessageStroke} label="View messages" count={1} />
            <MenuButton
              icon={IconFilterChatStroke}
              label="Filter chat"
              count={5}
              selected={selected}
              onClick={() => setSelected((on) => !on)}
            />
            <MenuButton icon={IconFilterChatStroke} label="Filter chat" count={0} />
          </Row>
        </Surface>
        <Caption>
          The third toggles; the fourth passes <code>count={'{0}'}</code> and draws no badge.
        </Caption>
        <CodeBlock code={`<MenuButton icon={IconFilterChatStroke} label="Filter chat" count={5} />`} />
      </Section>

      <Section
        title="The quiet tone"
        description="`muted` draws the button in the nav text rather than the brand. The mobile header's info button uses it: there is only one control in that row, and it should not read as the room's primary action."
      >
        <Surface>
          <Row>
            <MenuButton icon={IconInfoStroke} label="Room information" muted />
            <MenuButton icon={IconInfoStroke} label="Room information" muted selected />
          </Row>
        </Surface>
        <CodeBlock code={`<MenuButton icon={IconInfoStroke} label="Room information" muted />`} />
      </Section>
    </>
  );
}
