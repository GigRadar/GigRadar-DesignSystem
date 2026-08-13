import { color, spacing, textStyle } from '@gigradar/theme';
import { AccountCard, StatusBadge, VStack } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * The account slot — one cell of the Upwork connected-account grid.
 *
 * Filed under Components ▸ CRM rather than with the screen: the slot takes no
 * screen-specific props, and the grid that lays it out is the screen's job.
 * A second product with a connected-accounts list would take this unchanged.
 */
export function AccountSlotPage() {
  return (
    <>
      <PageHeader
        title="Account slot"
        description="One cell of a connected-account grid — a filled account, an empty slot, or a call to action. Figma node 2117:9909, which draws all four variants."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[
          { label: 'CRM ▸ Settings ▸ Upwork ▸ Account slots', pageId: 'crm-upwork-slots' },
          { label: 'Components ▸ Badge', pageId: 'badge' },
        ]}
      >
        The Upwork Connected Account screen lays these out in a three-column grid and decides how
        many empty slots follow the real ones. Reach for <code>AccountCard</code> directly when a
        screen needs the cell outside that grid.
      </CrossLink>

      <Section
        title="Four variants, one box"
        description="They differ only in border and fill: a connected account gets a solid pale-blue edge on white, an available slot a dashed grey edge on nothing, and the two action slots a dashed brand edge on the badge blue. That is why they are one component rather than four — the difference is a palette and a label, not a shape."
      >
        <Preview>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 200px)', gap: spacing.m }}>
            <AccountCard name="Harper Garcia" status="active" selected={false} />
            <AccountCard variant="authorize" onClick={() => undefined} />
            <AccountCard variant="available" />
            <AccountCard variant="upgrade" onClick={() => undefined} />
          </div>
        </Preview>
        <CodeBlock
          code={`<AccountCard name="Harper Garcia" status="active" />
<AccountCard variant="authorize" onClick={authorize} />
<AccountCard variant="available" />
<AccountCard variant="upgrade" onClick={openBilling} />`}
        />
      </Section>

      <Section
        title="Only two of them click"
        description="`authorize` and `upgrade` are actions; `available` is a placeholder and stays inert even if a handler is passed. Keeping that honest is what makes the next step unambiguous — a grid where every empty slot invited a click would have the user picking one arbitrarily."
      >
        <CodeBlock
          code={`// The first empty slot is the call to action; the rest are placeholders.
{Array.from({ length: emptyCount }, (_, index) => (
  <AccountCard
    key={index}
    variant={index === 0 ? 'authorize' : 'available'}
    onClick={index === 0 ? authorize : undefined}
  />
))}`}
        />
      </Section>

      <Section
        title="Status, and the suspended case"
        description="The pill under the name is StatusBadge. A suspended account is drawn present-but-unusable — the name greys out and the avatar falls back to the placeholder — so the row still reads as an account rather than as an empty slot."
      >
        <Preview>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 200px)', gap: spacing.m }}>
            <AccountCard name="Harper Garcia" status="active" selected={false} />
            <AccountCard name="Olivia Smith" status="suspended" selected={false} />
            <AccountCard name="Isabella Brown" status="error" selected={false} />
            <AccountCard name="Noah Smith" status="pending" selected={false} />
          </div>
        </Preview>
        <Preview>
          <StatusBadge tone="active" />
          <StatusBadge tone="suspended" />
          <StatusBadge tone="pending" />
          <StatusBadge tone="inactive" />
          <StatusBadge tone="error" />
        </Preview>
      </Section>

      <Section
        title="Selection is opt-in"
        description="Passing `selected` is what puts a checkbox on the card. Omitting the prop renders a list with none at all, which is what a read-only view wants."
      >
        <SelectionDemo />
        <CodeBlock
          code={`// Selectable
<AccountCard name={name} selected={ids.includes(id)} onSelectedChange={() => toggle(id)} />

// Not selectable — no checkbox is drawn
<AccountCard name={name} />`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'variant', type: `'account' | 'authorize' | 'available' | 'upgrade'`, default: `'account'`, description: 'Which of the four slots to draw.' },
            { name: 'name', type: 'string', description: 'The account holder. Also seeds the avatar’s initials when no photo is passed.' },
            { name: 'avatarSrc', type: 'string', description: 'Profile photo. Falls back to tinted initials.' },
            { name: 'status', type: 'StatusTone', default: `'active'`, description: 'The pill under the name — active, suspended, error, pending, or inactive.' },
            { name: 'statusLabel', type: 'ReactNode', description: 'Overrides the pill’s text while keeping its palette.' },
            { name: 'label', type: 'ReactNode', description: 'Overrides an empty slot’s label. Each variant has its own default.' },
            { name: 'selected', type: 'boolean', description: 'Ticked state. Omitting the prop drops the checkbox entirely.' },
            { name: 'onSelectedChange', type: '(selected: boolean) => void', description: 'Fires when the checkbox is toggled.' },
            { name: 'onClick', type: '() => void', description: 'Makes the card a button. Honoured by `authorize` and `upgrade` only.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the card and blocks interaction.' },
            { name: 'radius / padding / borderWidth / gap', type: 'CssLength', description: 'The card’s own metrics.' },
            { name: 'background / borderColor / textColor', type: 'string', description: 'Fill, edge, and name color.' },
          ]}
        />
      </Section>
    </>
  );
}

/** A small grid wired to real selection state. */
function SelectionDemo() {
  const [selected, setSelected] = useState<string[]>(['olivia']);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  const accounts = [
    { id: 'olivia', name: 'Olivia Smith', status: 'suspended' as const },
    { id: 'harper', name: 'Harper Garcia', status: 'active' as const },
  ];

  return (
    <Preview>
      <VStack gap={spacing.s} style={{ width: 200 }}>
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            name={account.name}
            status={account.status}
            selected={selected.includes(account.id)}
            onSelectedChange={() => toggle(account.id)}
          />
        ))}
      </VStack>
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>
        {selected.length} selected
      </span>
    </Preview>
  );
}
