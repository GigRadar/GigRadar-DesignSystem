import { color, spacing, textStyle } from '@gigradar/theme';
import { ApiStatus, RemoveApiButton, RentApiBanner, TestStatus, ViewGuide } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { API_KEY_DETAILS, RENTED_DETAILS, RENTED_NOTE } from '../../fixtures/upworkApiKey';

/**
 * Components ▸ CRM ▸ API key parts.
 *
 * The four components the Upwork API Key screen is built from, documented on
 * their own. The screen that assembles them lives under CRM ▸ Settings.
 */
export function ApiKeyPartsPage() {
  return (
    <>
      <PageHeader
        title="API key parts"
        description="The status card, the result strip, the remove action, and the two reference cards that make up the Upwork API Key screen."
      />

      <CrossLink
        eyebrow="Assembled into a screen"
        links={[{ label: 'CRM ▸ Settings ▸ Upwork API Key', pageId: 'crm-settings-api-key' }]}
      >
        Everything here is drawn on its own. The screen that stacks them — and decides which are
        showing in which state — is under CRM ▸ Settings.
      </CrossLink>

      <Section
        title="API status"
        description="Six states on one card. The empty state is the outlier: no key means no rows and no action, so Figma pads it taller and centres the plate over two lines. Every other state fills the same card with a status header, a divided detail band, and a closing destructive action."
      >
        <Column>
          <ApiStatus status="empty" />
          <Caption>Empty — nothing connected.</Caption>

          <ApiStatus status="active" details={API_KEY_DETAILS} />
          <Caption>Active.</Caption>

          <ApiStatus status="expiringSoon" details={API_KEY_DETAILS} />
          <Caption>Expiring soon.</Caption>

          <ApiStatus status="expired" details={API_KEY_DETAILS} />
          <Caption>Expired.</Caption>

          <ApiStatus status="error" details={API_KEY_DETAILS} />
          <Caption>Error — the key is present but authentication failed.</Caption>

          <ApiStatus status="rented" details={RENTED_DETAILS} note={RENTED_NOTE} />
          <Caption>
            Rented — GigRadar's key, not the user's. It lists a created date but no credentials,
            because they are not theirs to see, and its action disconnects rather than removes.
          </Caption>
        </Column>

        <CodeBlock
          code={`<ApiStatus
  status="active"
  details={[
    { label: 'Client ID', value: '4b9f8e2a7c1d3e5f' },
    { label: 'Secret Key', value: '9f82a3c7d1e5b4a6', secret: true },
    { label: 'Created', value: '2025-11-20' },
  ]}
  removeButtonProps={{ onClick: remove }}
/>`}
        />
      </Section>

      <Section
        title="Detail rows are data"
        description="A caller passes `details` and the card draws the divider, the spacing, and the masking. `secret` shows only the tail of a value — enough to recognise which key this is, and not enough to use it. That is what stops each screen re-deriving the row height and the two greys Figma separates label from value with."
      >
        <CodeBlock code={`{ label: 'Secret Key', value: '9f82a3c7d1e5b4a6', secret: true }`} />
      </Section>

      <Section
        title="Test status"
        description="Five outcomes on one strip. Four fill and outline in their status color; `invalid` alone drops the box entirely, because a formatting complaint about the field above is not a result from the server and should not look like one."
      >
        <Column>
          <TestStatus tone="testing" />
          <TestStatus tone="success" />
          <TestStatus tone="warning" />
          <TestStatus tone="failed" />
          <TestStatus tone="invalid" />
        </Column>
        <Caption>
          Each carries a default message; pass children to override it. The strip announces itself
          with `role="status"`, so an outcome reaches a screen reader without stealing focus.
        </Caption>
        <CodeBlock code={`<TestStatus tone="success" />`} />
      </Section>

      <Section
        title="Remove API key"
        description="The strip closing the status card. Deliberately not `Button` with `variant='danger'` — Figma draws a 30px full-width outline strip at 12px text, where the system button is a content-width 36px control at 14px. The difference is the shape and the job: this is a full-bleed footer closing a card."
      >
        <Column>
          <RemoveApiButton />
          <Caption>Idle.</Caption>

          <RemoveApiButton hovered />
          <Caption>Hover — a red wash over white.</Caption>

          <RemoveApiButton state="removing" />
          <Caption>Removing — the edge drops to the pale tint so the strip recedes.</Caption>

          <RemoveApiButton state="failed" />
          <Caption>Failed — the label becomes the retry instruction, and the button stays live.</Caption>
        </Column>
        <CodeBlock code={`<RemoveApiButton state="removing" />`} />
      </Section>

      <Section
        title="View guide"
        description="The right column's reference card. Drawn as an anchor rather than a card with a link inside it: the whole card is the target in Figma's hover state, and a link that only covers its own label leaves most of a 255px card inert."
      >
        <Row>
          <ViewGuide href="#" />
          <ViewGuide href="#" hovered />
        </Row>
        <Caption>Hover moves the border and nothing else — the fill staying put keeps it a quiet aside rather than a button.</Caption>
        <CodeBlock code={`<ViewGuide href="https://support.upwork.com/..." />`} />
      </Section>

      <Section
        title="Rent API banner"
        description="The upsell under the form, for anyone who cannot produce a key of their own. A gradient wash rather than a plain card: it sits below a form the user may not be able to complete, and the wash separates an offer from the form's own instructions without shouting."
      >
        <Column>
          <RentApiBanner onAction={() => undefined} />
        </Column>
        <Caption>
          Its action is the design system `Button` — unlike the remove strip, this one agrees with
          Button on every metric that matters, so it is the button.
        </Caption>
        <CodeBlock code={`<RentApiBanner onAction={openRentFlow} />`} />
      </Section>
    </>
  );
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s, maxWidth: 590 }}>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: spacing.m, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {children}
    </div>
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
