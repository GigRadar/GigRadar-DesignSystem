import { color, spacing, textStyle } from '@gigradar/theme';
import { UpworkApiKey } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { API_KEY_DETAILS } from '../../fixtures/upworkApiKey';

/**
 * CRM ▸ Settings ▸ Upwork API Key ▸ API status (Left).
 *
 * The screen's left column on its own — the status card, the credential form,
 * and the rent banner under it. Drawn with `show="form"`, so the column is a
 * real full-width composition here rather than a cropped half of the screen.
 */
export function ApiKeyFormPage() {
  return (
    <>
      <PageHeader
        title="API status (Left)"
        description="The left column of the Upwork API Key screen — what the user reads, fills in, and acts on. Figma node 2104:19566."
      />

      <CrossLink
        eyebrow="Built from CRM components"
        links={[
          { label: 'Components ▸ CRM ▸ API key parts', pageId: 'api-key-parts' },
          { label: 'The whole screen', pageId: 'crm-settings-api-key' },
        ]}
      >
        The status card, the result strip, and the rent banner are documented on their own under
        Components ▸ CRM. This page is about the column as the screen assembles it — which blocks
        are showing, and what each state does to the actions.
      </CrossLink>

      <Section
        title="Empty"
        description="Nothing connected. Both actions are inert until there is something to test, and the rent banner offers the way out for anyone who cannot produce a key of their own."
      >
        <Frame height="auto">
          <UpworkApiKey show="form" statusProps={{ status: 'empty' }} rentBannerProps={{}} />
        </Frame>
        <CodeBlock code={`<UpworkApiKey show="form" statusProps={{ status: 'empty' }} />`} />
      </Section>

      <Section
        title="Testing"
        description="A test in flight. Both fields and both buttons go inert — the key cannot be saved until the test it is running comes back — and the strip reports progress in place."
      >
        <Frame height="auto">
          <UpworkApiKey
            show="form"
            statusProps={{ status: 'empty' }}
            clientId="4b9f8e2a7c1d3e5f"
            secretKey="9f82a3c7d1e5b4a6"
            testTone="testing"
            rentBannerProps={{}}
          />
        </Frame>
      </Section>

      <Section
        title="Test complete"
        description="The test came back and Save Key lights up. Saving is gated on a returned test rather than on the fields being non-empty — a product decision the screen makes, not a form-validity one."
      >
        <Frame height="auto">
          <UpworkApiKey
            show="form"
            statusProps={{ status: 'empty' }}
            clientId="4b9f8e2a7c1d3e5f"
            secretKey="9f82a3c7d1e5b4a6"
            testTone="success"
            canTest
            canSave
            rentBannerProps={{}}
          />
        </Frame>
      </Section>

      <Section
        title="Saved"
        description="Once a key is in, the form has nothing left to ask for. `hideForm` drops it and the status card takes over the column, carrying the credentials and the action that removes them."
      >
        <Frame height="auto">
          <UpworkApiKey
            show="form"
            hideForm
            statusProps={{ status: 'active', details: API_KEY_DETAILS }}
            rentBannerProps={null}
          />
        </Frame>
        <CodeBlock
          code={`<UpworkApiKey show="form" hideForm
  statusProps={{ status: 'active', details, removeButtonProps: { onClick: remove } }}
  rentBannerProps={null}
/>`}
        />
      </Section>

      <Section
        title="Loading"
        description="Every block swapped for a skeleton bar, in the shape of what is arriving."
      >
        <Frame height="auto">
          <UpworkApiKey show="form" loading />
        </Frame>
        <Caption>The column loads on its own — `show` and `loading` are independent.</Caption>
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
