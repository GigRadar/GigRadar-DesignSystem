import { color, spacing, textStyle } from '@gigradar/theme';
import { UpworkApiKey } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { API_KEY_DETAILS } from '../../fixtures/upworkApiKey';

/**
 * CRM ▸ Settings ▸ Upwork API Key.
 *
 * The whole screen. Figma draws five states and all five are one composition
 * with parts switched off, which is what this page is arranged to show.
 */
export function ApiKeyPage() {
  return (
    <>
      <PageHeader
        title="Upwork API Key"
        description="Connect, test, and save a pair of Upwork API credentials. Figma node 2105:33765."
      />

      <CrossLink
        eyebrow="Built from CRM components"
        links={[
          { label: 'Components ▸ CRM ▸ API key parts', pageId: 'api-key-parts' },
          { label: 'Components ▸ Main ▸ Text field', pageId: 'text-field' },
        ]}
      >
        The status card, the result strip, the remove action, and the two reference cards are
        documented on their own under Components ▸ CRM. The credential inputs are the system's{' '}
        <code>TextField</code>.
      </CrossLink>

      <Section
        title="Empty"
        description="Nothing connected. The status card says so, both actions are inert until there is something to test, and the rent banner offers the way out for anyone who cannot produce a key of their own."
      >
        <Frame height="auto">
          <UpworkApiKey statusProps={{ status: 'empty' }} rentBannerProps={{}} viewGuideProps={{ href: '#' }} />
        </Frame>
        <CodeBlock
          code={`<UpworkApiKey
  statusProps={{ status: 'empty' }}
  rentBannerProps={{ onAction: openRentFlow }}
  viewGuideProps={{ href: guideUrl }}
/>`}
        />
      </Section>

      <Section
        title="Testing"
        description="A test in flight. Both fields and both buttons go inert — the key cannot be saved until the test it is running comes back — and the strip reports progress in place."
      >
        <Frame height="auto">
          <UpworkApiKey
            statusProps={{ status: 'empty' }}
            clientId="4b9f8e2a7c1d3e5f"
            secretKey="9f82a3c7d1e5b4a6"
            testTone="testing"
            rentBannerProps={{}}
            viewGuideProps={{ href: '#' }}
          />
        </Frame>
      </Section>

      <Section
        title="Test complete"
        description="The test came back. The strip reports it, and Save Key lights up — saving is gated on a returned test rather than on the fields being non-empty, which is a product decision the screen makes rather than a form-validity one."
      >
        <Frame height="auto">
          <UpworkApiKey
            statusProps={{ status: 'empty' }}
            clientId="4b9f8e2a7c1d3e5f"
            secretKey="9f82a3c7d1e5b4a6"
            testTone="success"
            canTest
            canSave
            rentBannerProps={{}}
            viewGuideProps={{ href: '#' }}
          />
        </Frame>
      </Section>

      <Section
        title="Saved"
        description="Once a key is in, the form has nothing left to ask for. `hideForm` drops it and the status card takes over the column, carrying the credentials and the action that removes them."
      >
        <Frame height="auto">
          <UpworkApiKey
            hideForm
            statusProps={{ status: 'active', details: API_KEY_DETAILS }}
            rentBannerProps={null}
            viewGuideProps={{ href: '#' }}
          />
        </Frame>
        <CodeBlock
          code={`<UpworkApiKey
  hideForm
  statusProps={{ status: 'active', details, removeButtonProps: { onClick: remove } }}
  rentBannerProps={null}
/>`}
        />
      </Section>

      <Section
        title="Loading"
        description="Every block swapped for a skeleton bar, in the shape of what is arriving. Both columns load together — the right one is reference material, but a half-drawn screen reads as broken rather than as loading."
      >
        <Frame height="auto">
          <UpworkApiKey loading />
        </Frame>
        <CodeBlock code={`<UpworkApiKey loading />`} />
      </Section>

      <Section
        title="Working, end to end"
        description="Type into both fields to enable Test Key; the test runs, reports, and enables Save Key; saving switches the screen to its saved state. The five states above are this one component with parts switched off — there is no variant prop."
      >
        <LiveDemo />
      </Section>
    </>
  );
}

/** The whole flow, wired up. */
function LiveDemo() {
  const [clientId, setClientId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [tone, setTone] = useState<'testing' | 'success' | undefined>();
  const [saved, setSaved] = useState(false);

  const filled = clientId.trim() !== '' && secretKey.trim() !== '';

  return (
    <>
      <Frame height="auto">
        <UpworkApiKey
          hideForm={saved}
          clientId={clientId}
          onClientIdChange={setClientId}
          secretKey={secretKey}
          onSecretKeyChange={setSecretKey}
          testTone={tone}
          canTest={filled}
          canSave={tone === 'success'}
          onTest={() => {
            setTone('testing');
            window.setTimeout(() => setTone('success'), 1200);
          }}
          onSave={() => setSaved(true)}
          statusProps={
            saved
              ? {
                  status: 'active',
                  details: [
                    { label: 'Client ID', value: clientId },
                    { label: 'Secret Key', value: secretKey, secret: true },
                    { label: 'Created', value: '2026-08-18' },
                  ],
                  removeButtonProps: {
                    onClick: () => {
                      setSaved(false);
                      setTone(undefined);
                      setClientId('');
                      setSecretKey('');
                    },
                  },
                }
              : { status: 'empty' }
          }
          rentBannerProps={saved ? null : {}}
          viewGuideProps={{ href: '#' }}
        />
      </Frame>
      <Caption>
        Removing the saved key puts the screen back to empty, so the flow can be run again.
      </Caption>
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
