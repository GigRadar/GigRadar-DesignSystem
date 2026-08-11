import { color, radius, textStyle } from '@gigradar/theme';
import {
  SettingsCard,
  SettingsPanel,
  IconAgentToolsFill,
  IconAutoReplyBubbleFill,
  IconConnectedPeopleFill,
  IconKeyFill,
  IconLazizaSparkleFill,
  IconNotificationBellFill,
  IconPresetDocumentFill,
  IconPromptTerminalFill,
  type SettingsItem,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * The settings rail, exactly as CRM ▸ Settings wires it.
 *
 * Every icon comes from the design system set — the panel takes `IconDef`s
 * rather than drawing its own, so a screen that needs a different set of
 * entries never has to hand-author a glyph.
 */
const ITEMS: SettingsItem[] = [
  {
    id: 'crm-ai',
    label: 'CRM AI Configuration',
    icon: IconLazizaSparkleFill,
    children: [
      { id: 'prompt', label: 'Prompt', icon: IconPromptTerminalFill },
      { id: 'presets', label: 'Presets', icon: IconPresetDocumentFill },
      { id: 'auto-reply', label: 'Auto Reply', icon: IconAutoReplyBubbleFill },
      { id: 'agent-tools', label: 'Agent Tools', icon: IconAgentToolsFill },
    ],
  },
  { id: 'api-key', label: 'Upwork API Key', icon: IconKeyFill },
  { id: 'account', label: 'Upwork Connected Account', icon: IconConnectedPeopleFill },
  { id: 'notifications', label: 'Notifications', icon: IconNotificationBellFill },
];

export function SettingsPanelPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="CRM ▸ Settings. The left rail every settings screen sits beside — a list of rounded cards, one per screen, that collapses to an icon rail. Figma nodes 8272:40787 and 8299:28723."
      />

      <CrossLink
        eyebrow="The screens it opens"
        links={[{ label: 'AI Configuration', pageId: 'crm-settings-ai' }]}
      >
        This rail is the navigation for CRM Settings — <code>SettingsPanel</code> takes a list of
        entries and reports which one was clicked. The screens themselves are separate pages; AI
        Configuration is the one built so far.
      </CrossLink>

      <Section
        title="Expanded"
        description="Click the chevron in the header to collapse it. Click any entry to select it — the selected one fills brand blue, and its sub-entries stay visible beneath."
      >
        <PanelDemo />
        <CodeBlock
          code={`const ITEMS: SettingsItem[] = [
  {
    id: 'crm-ai',
    label: 'CRM AI Configuration',
    icon: IconLazizaSparkleFill,
    children: [
      { id: 'prompt', label: 'Prompt', icon: IconPromptTerminalFill },
      { id: 'presets', label: 'Presets', icon: IconPresetDocumentFill },
      { id: 'auto-reply', label: 'Auto Reply', icon: IconAutoReplyBubbleFill },
      { id: 'agent-tools', label: 'Agent Tools', icon: IconAgentToolsFill },
    ],
  },
  { id: 'api-key', label: 'Upwork API Key', icon: IconKeyFill },
  { id: 'account', label: 'Upwork Connected Account', icon: IconConnectedPeopleFill },
  { id: 'notifications', label: 'Notifications', icon: IconNotificationBellFill },
];

<SettingsPanel items={ITEMS} value={active} onSelect={(item) => setActive(item.id)} />`}
        />
      </Section>

      <Section
        title="Collapsed"
        description="Not just a narrower panel. Figma drops the title, every label, and every sub-entry, leaving one icon per top-level screen — so the two states are different content, not the same content at two widths."
      >
        <Preview>
          <Frame>
            <SettingsPanel items={ITEMS} value="crm-ai" collapsed />
          </Frame>
        </Preview>
        <CodeBlock code={`<SettingsPanel items={ITEMS} value="crm-ai" collapsed />`} />
      </Section>

      <Section
        title="Settings card"
        description="One row of the rail, and its own component. Figma node 2104:18385 draws three states: Default is white with dark text, Hover fills the pale badge blue, and Selected fills brand blue."
      >
        <Preview>
          <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SettingsCard label="Settings" icon={IconKeyFill} selected />
            <SettingsCard label="Settings" icon={IconKeyFill} hovered />
            <SettingsCard label="Settings" icon={IconKeyFill} background={color.main.white} />
          </div>
        </Preview>
        <Caption>Selected, hover, default — top to bottom.</Caption>
        <CodeBlock
          code={`<SettingsCard label="Upwork API Key" icon={IconKeyFill} selected onClick={open} />`}
        />
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680, marginTop: 12 }}>
          <p style={{ margin: 0 }}>
            Not the design system’s <code>Button</code>. Figma models this as its own component, and
            the two disagree on nearly everything that defines a button — a 16px radius against
            Button’s 6, 12px vertical padding against 8, a 24px icon against 16, 16px type against
            14, left-aligned content against centred, and no minimum height. “Selected” means
            something different too: this row marks the route you are on, where a button marks a
            press.
          </p>
        </div>
      </Section>

      <Section
        title="Icons"
        description="Every entry takes an IconDef from the design system set. Nothing here is hand-drawn."
      >
        <PropsTable
          rows={[
            { name: 'CRM AI Configuration', type: 'IconLazizaSparkleFill', description: 'The parent entry.' },
            { name: 'Prompt', type: 'IconPromptTerminalFill', description: 'Sub-setting.' },
            { name: 'Presets', type: 'IconPresetDocumentFill', description: 'Sub-setting.' },
            { name: 'Auto Reply', type: 'IconAutoReplyBubbleFill', description: 'Sub-setting.' },
            { name: 'Agent Tools', type: 'IconAgentToolsFill', description: 'Sub-setting.' },
            { name: 'Upwork API Key', type: 'IconKeyFill', description: 'Top-level entry.' },
            { name: 'Upwork Connected Account', type: 'IconConnectedPeopleFill', description: 'Top-level entry.' },
            { name: 'Notifications', type: 'IconNotificationBellFill', description: 'Top-level entry.' },
            { name: 'Collapse toggle', type: 'IconCollapseDoubleArrowLeft', description: 'Drawn by the panel while expanded.' },
            { name: 'Expand toggle', type: 'IconExpandDoubleArrowRight', description: 'Drawn by the panel while collapsed.' },
          ]}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'items', type: 'SettingsItem[]', default: '[]', description: '`{ id, label, icon, children }` per entry. `children` nests one level.' },
            { name: 'value', type: 'string', description: 'Id of the selected entry. Matches nested entries too.' },
            { name: 'onSelect', type: '(item: SettingsItem) => void', description: 'An entry was clicked.' },
            { name: 'title', type: 'ReactNode', default: `'Settings'`, description: 'The heading. Hidden when collapsed.' },
            { name: 'collapsed / defaultCollapsed', type: 'boolean', description: 'Controlled and uncontrolled collapse state.' },
            { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Called whenever the panel collapses or expands.' },
            { name: 'renderItem', type: 'RenderProp<SettingsItemRenderProps>', description: 'Replace one entry — for a badge, a count, a status dot. Call `defaultRender()` to decorate.' },
            { name: 'renderHeader', type: 'RenderProp<SettingsHeaderRenderProps>', description: 'Replace the header band. Carries `collapsed` and `toggle`.' },
            { name: 'width / collapsedWidth', type: 'CssLength', default: '300 / 88', description: 'The two panel widths.' },
            { name: 'radius', type: 'CssLength', default: '16', description: 'Corner radius of an entry.' },
            { name: 'background / borderColor', type: 'string', description: 'Panel fill and its right-hand edge.' },
            { name: 'selectedBackground / selectedTextColor', type: 'string', description: 'The selected entry’s palette.' },
          ]}
        />
      </Section>
    </>
  );
}

/** The panel, wired the way the settings screen wires it. */
function PanelDemo() {
  const [active, setActive] = useState('prompt');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Preview>
      <Frame>
        <SettingsPanel
          items={ITEMS}
          value={active}
          onSelect={(item) => setActive(item.id)}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
        <div style={{ flex: 1, padding: 24, ...textStyle.mRegular, color: color.main.description }}>
          Selected: <code>{active}</code>
        </div>
      </Frame>
    </Preview>
  );
}

/**
 * A stand-in for the settings screen the rail sits inside.
 *
 * The panel fills its container's height, so a preview needs to give it one —
 * otherwise it collapses to the height of its own list and the rail reads as a
 * floating card rather than an edge.
 */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: 560,
        borderRadius: radius.m,
        border: `1px solid ${color.navbar.hover}`,
        backgroundColor: color.main.white,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <div style={{ ...textStyle.sMedium, color: color.main.description }}>{children}</div>;
}
