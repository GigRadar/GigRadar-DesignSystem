import { spacing } from '@gigradar/theme';
import { MarkAsReadButton, SelectionBar, VStack } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { rooms } from '../../fixtures/inbox';
import { Caption, Column } from './parts';

/**
 * Left ▸ Mark as read — Figma nodes 3935:31772 and 3980:25204.
 *
 * The bar and the button inside it are one page: the button is the only
 * control the bar has, and it is also what summons the bar in the first place.
 * Documenting them apart would put the two halves of one action on two pages.
 */
export function MarkAsReadPage() {
  const [ticked, setTicked] = useState<string[]>(['r2']);
  const [armed, setArmed] = useState(false);

  return (
    <>
      <PageHeader
        title="Mark as read"
        description="Selecting rooms and marking them read — the bar, and the button that arms it. Figma nodes 3935:31772 (bar) and 3980:25204 (button)."
      />

      <CrossLink
        eyebrow="Built from"
        links={[{ label: 'Left ▸ Searchbar', pageId: 'crm-inbox-searchbar' }]}
      >
        The bar's confirm control is <strong>MarkAsReadButton</strong>, the same component the
        searchbar row draws to arm selection mode in the first place — glyph-only there, labelled
        here.
      </CrossLink>

      <Section
        title="The bar"
        description="Figma's three states — Unselected, Selected, Select all — are all derived from the count, so this takes `selectedCount` rather than a state prop. The count is what a consumer already has, and deriving beats duplicating it."
      >
        <Frame height="auto" hug>
          <Column>
            <VStack gap={16}>
              <SelectionBar
                selectedCount={0}
                totalCount={rooms.length}
                onSelectAll={() => undefined}
              />
              <SelectionBar
                selectedCount={ticked.length}
                totalCount={rooms.length}
                onSelectAll={() => setTicked(rooms.map((room) => room.id))}
                onClearSelection={() => setTicked([])}
                onMarkAsRead={() => setTicked([])}
              />
              <SelectionBar selectedCount={rooms.length} totalCount={rooms.length} />
            </VStack>
          </Column>
        </Frame>
        <Caption>
          Nothing selected, some selected, everything selected. The leading action flips to
          "Unselect all" at the bottom — once everything is ticked, selecting all again would do
          nothing, and the only move left is back out.
        </Caption>
        <CodeBlock
          code={`<SelectionBar
  selectedCount={ticked.length}
  totalCount={rooms.length}
  onSelectAll={selectAll}
  onMarkAsRead={markRead}
/>`}
        />
      </Section>

      <Section
        title="The button"
        description="Glyph-only in the resting row, where the search field needs the width; labelled inside the bar, where there is room. Figma's “Clicked” state fills the pill blue — that is the difference between offering the action and being mid-action."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', gap: spacing.m, padding: spacing.l, alignItems: 'center' }}>
            <MarkAsReadButton />
            <MarkAsReadButton active />
            <MarkAsReadButton label="Mark as read" />
            <MarkAsReadButton label="Mark as read" active />
            <MarkAsReadButton label="Mark as read" disabled />
          </div>
        </Frame>
        <Caption>
          Resting, armed, labelled, labelled and armed, and disabled — the last is the bar's confirm
          button with nothing selected.
        </Caption>
        <CodeBlock
          code={`<MarkAsReadButton active={selecting} label="Mark as read" onClick={confirm} />`}
        />
      </Section>

      <Section
        title="Beside the field"
        description="How it sits in the search band: a fixed-width pill against a field that takes the rest."
      >
        <Frame height="auto" hug>
          <Column>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ flex: 1 }} />
              <MarkAsReadButton active={armed} onClick={() => setArmed(!armed)} />
            </div>
          </Column>
        </Frame>
        <Caption>Click to arm. The list enters selection mode and the bar appears below.</Caption>
        <CodeBlock code={`<MarkAsReadButton active={selectionMode} onClick={toggleSelectionMode} />`} />
      </Section>
    </>
  );
}
