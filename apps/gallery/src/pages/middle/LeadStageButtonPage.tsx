import { LeadStageButton } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { leadStages } from '../../fixtures/inbox';
import { Caption, Row, Surface } from './parts';

/**
 * Mid ▸ Lead Stage Button — Figma node 3523:37527.
 *
 * Eleven stages at the L size Figma draws, plus the M size it does not: the
 * pill is needed one step smaller in rows that cannot spend 30px on it, and
 * building that as a `size` prop keeps it one component rather than two.
 */
export function LeadStageButtonPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Lead Stage Button"
        description="The lead's position in the pipeline, and the control that moves it. Eleven stages in two sizes. Figma node 3523:37527."
      />

      <CrossLink
        eyebrow="Used by"
        links={[
          { label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' },
          { label: 'Left ▸ List of Room', pageId: 'crm-inbox-left' },
        ]}
      >
        The stage pill appears wherever a lead does. Figma files this one as a badge, but every
        instance carries a chevron and opens the stage menu — so it is built as a button, and{' '}
        <code>interactive={'{false}'}</code> is the badge.
      </CrossLink>

      <Section
        title="Every stage — L"
        description="The size Figma draws in the chat header: 30px tall. The tint comes from `color.stageFlat` keyed by stage name, so the label and the fill can never disagree."
      >
        <Surface>
          <Row>
            {leadStages.map((stage) => (
              <LeadStageButton key={stage} stage={stage} />
            ))}
          </Row>
        </Surface>
        <Caption>
          Unqualified, then the pipeline, then the three lost reasons — which Figma gives the same
          fill and distinguishes by label.
        </Caption>
        <CodeBlock code={`<LeadStageButton stage="qualified" onClick={openStageMenu} />`} />
      </Section>

      <Section
        title="Every stage — M"
        description="The same pill one step down: 24px tall with a tighter inset. The type size does not change — 12px is already the smallest step the label reads at, so `m` trims the box instead of the text."
      >
        <Surface>
          <Row gap={8}>
            {leadStages.map((stage) => (
              <LeadStageButton key={stage} stage={stage} size="m" />
            ))}
          </Row>
        </Surface>
        <CodeBlock code={`<LeadStageButton stage="qualified" size="m" />`} />
      </Section>

      <Section
        title="Open, read-only, and disabled"
        description="`open` rotates the chevron while the stage menu is showing. `interactive={false}` drops it altogether, which is the badge — a stage that is being reported rather than changed. `disabled` keeps the chevron and dims the pill: the stage can be changed in principle, just not now."
      >
        <Surface>
          <Row>
            <LeadStageButton
              stage="booked"
              open={open}
              onClick={() => setOpen((showing) => !showing)}
            />
            <LeadStageButton stage="booked" interactive={false} />
            <LeadStageButton stage="booked" disabled />
          </Row>
          <Row>
            <LeadStageButton stage="booked" size="m" open={open} />
            <LeadStageButton stage="booked" size="m" interactive={false} />
            <LeadStageButton stage="booked" size="m" disabled />
          </Row>
        </Surface>
        <Caption>Click the first pill to rotate its chevron. Both sizes, same three states.</Caption>
        <CodeBlock
          code={`<LeadStageButton stage="booked" open={menuOpen} onClick={toggleMenu} />
<LeadStageButton stage="booked" interactive={false} />   // the badge`}
        />
      </Section>

      <Section
        title="A renamed stage"
        description="Children override the label without touching the tint — for a pipeline the product has renamed while the stage itself stayed put."
      >
        <Surface>
          <Row>
            <LeadStageButton stage="happened">Call done</LeadStageButton>
            <LeadStageButton stage="contactLater" size="m">
              Snoozed
            </LeadStageButton>
          </Row>
        </Surface>
        <CodeBlock code={`<LeadStageButton stage="happened">Call done</LeadStageButton>`} />
      </Section>
    </>
  );
}
