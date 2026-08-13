import { AiTool, SettingsSection } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { AI_TOOLS } from '../../fixtures/aiConfiguration';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ AI Tools.
 *
 * The capabilities Laziza can call. A read-only manifest rather than a form:
 * the rows report what the runtime registered, so there is nothing to save.
 */
export function AiToolsPage() {
  return (
    <>
      <PageHeader
        title="AI Tools"
        description="The capabilities registered for Laziza on every CRM run, grouped by what they do. Figma nodes 3777:9845 and 3777:9422."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'The whole screen', pageId: 'crm-settings-ai' },
          { label: 'Components ▸ Badge', pageId: 'badge' },
        ]}
      >
        Each row leads with an <code>AiToolBadge</code>, documented under Components ▸ Badge along
        with the rest of the badge family. The category palette is shared through{' '}
        <code>aiToolPalette</code>, so the badge and the tag beside the name always agree.
      </CrossLink>

      <Section
        title="The section"
        description="One row per registered capability: the category badge, the function name as the agent calls it, the category tag, and what the tool actually does."
      >
        <Preview>
          <div style={{ width: '100%' }}>
            <SettingsSection
              paddingX={0}
              title="AI Tools"
              description="Registered capabilities available to Laziza on every CRM run. Reference them by name in your custom prompt above."
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {AI_TOOLS.map((tool) => (
                  <AiTool key={tool.name} {...tool} />
                ))}
              </div>
            </SettingsSection>
          </div>
        </Preview>
        <CodeBlock
          code={`{tools.map((tool) => (
  <AiTool
    key={tool.name}
    name={tool.name}
    category={tool.category}
    categoryLabel={tool.categoryLabel}
    description={tool.description}
  />
))}`}
        />
      </Section>

      <Section
        title="Nothing to save"
        description="The only section on this screen with no footer."
      >
        <CodeBlock
          code={`// The rows report what the runtime registered. A caller cannot add a
// capability from here, so there is no Save, no Cancel, and no dirty
// state — a footer would imply an edit that is not possible.
<AiTool name="schedule_wake_up" category="schedule" categoryLabel="Scheduling" />`}
        />
      </Section>

      <Section
        title="A disabled capability"
        description="`crossed` slashes the badge for a tool the agent cannot currently call. A slash rather than a grey-out, because the category still matters when it is off: you need to see which capability is unavailable, not just that one is."
      >
        <Preview>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            <AiTool
              name="post_comment_as_laziza"
              category="message"
              categoryLabel="Public Communication"
              description="Unavailable while the workspace has no connected Upwork account."
              crossed
            />
          </div>
        </Preview>
        <CodeBlock code={`<AiTool name="post_comment_as_laziza" category="message" crossed />`} />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'name', type: 'ReactNode', description: 'The function name, as the agent calls it. Drawn in mono.' },
            { name: 'description', type: 'ReactNode', description: 'What the tool does, and when the agent should reach for it.' },
            { name: 'category', type: `'message' | 'notes' | 'schedule' | 'meeting'`, default: `'message'`, description: 'Colours the badge and the tag through the shared `aiToolPalette`.' },
            { name: 'categoryLabel', type: 'ReactNode', description: 'The tag beside the name — "Scheduling", "Public Communication". Falls back to the category.' },
            { name: 'icon', type: 'IconDef', description: "Overrides the category's own glyph." },
            { name: 'crossed', type: 'boolean', default: 'false', description: 'Slashes the badge — a capability that cannot currently be called.' },
            { name: 'paddingX / paddingY / gap / radius / fontSize', type: 'CssLength', description: "The row's own metrics." },
            { name: 'background / borderColor', type: 'string', description: 'Row fill and edge.' },
          ]}
        />
      </Section>
    </>
  );
}
