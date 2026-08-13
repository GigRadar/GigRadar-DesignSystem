import { color, spacing, textStyle } from '@gigradar/theme';
import { UpworkConnectedAccounts } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { ACCOUNTS, FULL_ACCOUNTS } from '../../fixtures/upworkAccounts';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Frame } from '../../components/Frame';

/**
 * CRM ▸ Settings ▸ Upwork Connected Account ▸ Account slots.
 *
 * The screen's left column. This page is about the column as the screen
 * assembles it — the grid, the capacity arithmetic, and the states it moves
 * through. The cell it repeats is documented under Components ▸ CRM.
 */
export function AccountSlotsPage() {
  return (
    <>
      <PageHeader
        title="Account slots"
        description="The left column of the Upwork Connected Account screen — every slot the plan allows, filled or empty. Figma node 2105:34594."
      />

      <CrossLink
        eyebrow="Built from CRM components"
        links={[
          { label: 'Components ▸ CRM ▸ Account slot', pageId: 'account-slot' },
          { label: 'The whole screen', pageId: 'crm-settings-upwork' },
        ]}
      >
        Every cell in this grid is <code>AccountCard</code> from Components ▸ CRM ▸ Account slot.
        This column's own job is the arithmetic around it: how many empty slots follow the real
        accounts, which one is the call to action, and what the header's selection actions do.
      </CrossLink>

      <Section
        title="Before there is anything to list"
        description="Two empty states, and the difference between them is what the user is being asked to do. Without an API connection there is nothing to authorize against, so the column asks for the API first. Once the API is in, the same panel asks for the first account. (On the assembled screen the right column's authorize button greys out to match the first of these.)"
      >
        <Frame height={420}>
          <UpworkConnectedAccounts show="list" apiConnected={false} capacity={10} onConnectApi={() => undefined} />
        </Frame>
        <Caption>No API connection — the column asks for the API, not for an account.</Caption>

        <Frame height={420}>
          <UpworkConnectedAccounts show="list" accounts={[]} capacity={10} onAuthorize={() => undefined} />
        </Frame>
        <Caption>Connected, but empty — the API is in and the first account is the next step.</Caption>

        <CodeBlock
          code={`<UpworkConnectedAccounts show="list" apiConnected={false} onConnectApi={connect} />
<UpworkConnectedAccounts show="list" accounts={[]} onAuthorize={authorize} />`}
        />
      </Section>

      <Section
        title="Filled, with slots to spare"
        description="Connected accounts first, then one authorize slot, then plain placeholders up to the plan's capacity. The counter, the empty slots, and the authorize card all fall out of `accounts.length` against `capacity` — none of them is a prop."
      >
        <SlotsDemo />
        <CodeBlock
          code={`<UpworkConnectedAccounts show="list"
  accounts={accounts}
  capacity={10}
  selected={selected}
  onSelectionChange={setSelected}
  onAuthorize={authorize}
  onUpgrade={openBilling}
  onRemove={(ids) => remove(ids)}
/>`}
        />
      </Section>

      <Section
        title="A full plan"
        description="Once `accounts.length` reaches `capacity`, the empty slots and the authorize card drop out on their own. The upgrade slot is the one that stays — it is the only route to more."
      >
        <Frame height={620}>
          <UpworkConnectedAccounts show="list"
            accounts={FULL_ACCOUNTS}
            capacity={FULL_ACCOUNTS.length}
            selected={[]}
            onSelectionChange={() => undefined}
          />
        </Frame>
      </Section>

      <Section
        title="Loading"
        description="Skeleton bars in the shape of the grid that is coming — one per slot, at the height a filled card would be. On the assembled screen the right column loads alongside it, since loading only half a screen reads as broken rather than pending."
      >
        <Frame height={420}>
          <UpworkConnectedAccounts show="list" loading />
        </Frame>
        <CodeBlock code={`<UpworkConnectedAccounts show="list" loading />`} />
      </Section>
    </>
  );
}

/** The grid wired to real selection state, with Remove that actually removes. */
function SlotsDemo() {
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <Frame height={560}>
        <UpworkConnectedAccounts show="list"
          accounts={accounts}
          capacity={10}
          selected={selected}
          onSelectionChange={setSelected}
          onAuthorize={() => undefined}
          onUpgrade={() => undefined}
          onRemove={(ids) => {
            setAccounts((current) => current.filter((account) => !ids.includes(account.id)));
            setSelected([]);
          }}
        />
      </Frame>
      <Caption>
        Remove actually removes here, so the counter and the empty slots move with it.
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
