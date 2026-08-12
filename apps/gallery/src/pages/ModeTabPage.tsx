import { AutoReplyModeTab, VStack } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * The tab strip that sits on top of a settings panel.
 *
 * Documented on its own page rather than inside the Auto Reply card: the tab
 * knows nothing about replies. It is a tab that happens to carry a `ModeBadge`,
 * and any panel that splits its content by class can use it.
 */
export function ModeTabPage() {
  return (
    <>
      <PageHeader
        title="Mode tab"
        description="One tab of a panel that splits its content by class, with the mode that class currently runs in shown beside the label. Figma node 4498:4818."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[{ label: 'CRM ▸ Settings ▸ AI Configuration', pageId: 'crm-settings-ai' }]}
      >
        The Auto Reply card uses a pair of these to split first messages from later ones. The tab
        itself is generic — it takes a label and a mode, and reports the click.
      </CrossLink>

      <Section
        title="Selected and unselected"
        description="A selected tab is white with black text and rounds its top corners; an unselected one drops to the page background and keeps only its bottom border. That asymmetry is the point: the selected tab and the panel below it read as one surface, and the unselected one reads as the edge of another."
      >
        <TabDemo />
        <CodeBlock
          code={`const [tab, setTab] = useState('first');

<div style={{ display: 'flex' }}>
  <AutoReplyModeTab
    label="First Message"
    mode="fullAuto"
    selected={tab === 'first'}
    onClick={() => setTab('first')}
  />
  <AutoReplyModeTab
    label="Other Message"
    mode="coPilot"
    selected={tab === 'other'}
    onClick={() => setTab('other')}
  />
</div>`}
        />
      </Section>

      <Section
        title="Without a mode"
        description="`mode` is optional. Omit it and the tab is a plain label — the badge only appears when there is a mode to report."
      >
        <Preview>
          <div style={{ display: 'flex', width: '100%', maxWidth: 560 }}>
            <AutoReplyModeTab label="Overview" selected />
            <AutoReplyModeTab label="History" />
          </div>
        </Preview>
        <CodeBlock code={`<AutoReplyModeTab label="Overview" selected />`} />
      </Section>

      <Section
        title="Every mode"
        description="The badge is the shared `ModeBadge`, so a tab reports a mode with exactly the palette the rest of the product uses for it."
      >
        <Preview>
          <VStack gap={8} style={{ width: '100%', maxWidth: 560 }}>
            <div style={{ display: 'flex', width: '100%' }}>
              <AutoReplyModeTab label="Full auto" mode="fullAuto" selected />
              <AutoReplyModeTab label="Co-pilot" mode="coPilot" />
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
              <AutoReplyModeTab label="Other" mode="other" selected />
              <AutoReplyModeTab label="Off" mode="off" />
            </div>
          </VStack>
        </Preview>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'The class this tab configures — "First Message", "Other Message".' },
            { name: 'mode', type: `'fullAuto' | 'coPilot' | 'off' | 'other'`, description: 'The mode that class runs in, drawn as a `ModeBadge`. Omitted, no badge is drawn.' },
            { name: 'selected', type: 'boolean', default: 'false', description: 'Whether this tab is the open one. Sets `aria-selected`.' },
            { name: 'height / padding / gap / radius / fontSize', type: 'number | string', description: "Overrides for the tab's own metrics." },
            { name: 'borderColor', type: 'string', description: 'The edge, shared by the selected outline and the unselected underline.' },
          ]}
        />
      </Section>
    </>
  );
}

/** The pair, wired so the strip behaves as it does on the screen. */
function TabDemo() {
  const [tab, setTab] = useState('first');

  return (
    <Preview>
      <div style={{ display: 'flex', width: '100%', maxWidth: 560 }} role="tablist">
        <AutoReplyModeTab
          label="First Message"
          mode="fullAuto"
          selected={tab === 'first'}
          onClick={() => setTab('first')}
        />
        <AutoReplyModeTab
          label="Other Message"
          mode="coPilot"
          selected={tab === 'other'}
          onClick={() => setTab('other')}
        />
      </div>
    </Preview>
  );
}
