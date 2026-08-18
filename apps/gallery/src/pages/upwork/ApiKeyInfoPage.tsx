import { color, spacing, textStyle } from '@gigradar/theme';
import { UpworkApiKey } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';

/**
 * CRM ▸ Settings ▸ Upwork API Key ▸ Info details (Right).
 *
 * The screen's right column on its own — the guide card and the numbered setup
 * steps. Reference material: it never changes with the form's state, which is
 * why it is worth documenting apart from the column that does.
 */
export function ApiKeyInfoPage() {
  return (
    <>
      <PageHeader
        title="Info details (Right)"
        description="The right column of the Upwork API Key screen — how to get a key, and the four steps to do it. Figma node 2104:31980."
      />

      <CrossLink
        eyebrow="Built from CRM components"
        links={[
          { label: 'Components ▸ CRM ▸ API key parts', pageId: 'api-key-parts' },
          { label: 'The whole screen', pageId: 'crm-settings-api-key' },
        ]}
      >
        The guide card is <code>ViewGuide</code>, documented under Components ▸ CRM. The steps
        below it are the column's own — they are content rather than a component, so they arrive
        as data.
      </CrossLink>

      <Section
        title="As drawn"
        description="A reference column: unlike the left, nothing here moves with the form's state. It says the same thing whether a key is connected or not, which is what makes it safe to render on its own."
      >
        <Frame height="auto">
          <UpworkApiKey show="side" viewGuideProps={{ href: '#' }} />
        </Frame>
        <CodeBlock code={`<UpworkApiKey show="side" viewGuideProps={{ href: guideUrl }} />`} />
      </Section>

      <Section
        title="The steps are data"
        description="`steps` takes the four rows, so a screen can retitle them or add a fifth without forking the column. `highlighted` puts a step's description in brand blue — Figma marks the one that leaves GigRadar."
      >
        <Frame height="auto">
          <UpworkApiKey
            show="side"
            viewGuideProps={{ href: '#' }}
            sideTitle="Before you start"
            steps={[
              { title: 'Open Upwork', description: 'Sign in to your account', highlighted: true },
              { title: 'Find the API page', description: 'Settings ▸ Developer' },
              { title: 'Generate a key', description: 'Copy both halves' },
            ]}
          />
        </Frame>
        <CodeBlock
          code={`<UpworkApiKey show="side"
  steps={[
    { title: 'Open Upwork', description: 'Sign in to your account', highlighted: true },
    { title: 'Find the API page', description: 'Settings ▸ Developer' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Without the guide card"
        description="`viewGuideProps={null}` drops it, leaving the steps alone — for a screen that links the guide from somewhere else."
      >
        <Frame height="auto">
          <UpworkApiKey show="side" viewGuideProps={null} />
        </Frame>
      </Section>

      <Section title="Loading" description="The column's own skeleton.">
        <Frame height="auto">
          <UpworkApiKey show="side" loading />
        </Frame>
        <Caption>Both columns load together on the assembled screen — a half-drawn screen reads as broken rather than as loading.</Caption>
      </Section>
    </>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        ...textStyle.sRegular,
        color: color.main.description,
        margin: 0,
        marginBottom: spacing.m,
      }}
    >
      {children}
    </p>
  );
}
