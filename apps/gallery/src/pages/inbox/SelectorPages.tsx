import { InboxAccountRow, InboxSelector, VStack } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { accounts } from '../../fixtures/inbox';
import { Caption, Column, Surface } from './parts';

/**
 * Left ▸ Inbox Selector — Figma nodes 2138:6491, 2138:6490, 2138:7095.
 *
 * The trigger, the dropdown it opens, and the rows inside that dropdown are
 * one page rather than three. They are one control: the dropdown has no life
 * apart from the trigger that opens it, and a row has none apart from the
 * dropdown that lists it. Splitting them would document three fragments of a
 * single interaction on three pages nobody can see side by side.
 */
export function InboxSelectorPage() {
  const [account, setAccount] = useState('all');

  return (
    <>
      <PageHeader
        title="Inbox Selector"
        description="Which connected Upwork account the inbox is showing — one, or all of them at once. Figma nodes 2138:6491 (control), 2138:6490 (dropdown), and 2138:7095 (rows)."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Components ▸ Main ▸ Avatar', pageId: 'avatar' },
          { label: 'Components ▸ Main ▸ Badge', pageId: 'badge' },
          { label: 'Left ▸ Websocket indicators', pageId: 'crm-inbox-websocket' },
        ]}
      >
        Each row draws an <strong>Avatar</strong> for the account holder, a{' '}
        <strong>CounterBadge</strong> for its unread count, and the{' '}
        <strong>SignalIcon</strong> from the websocket indicator when the account's connection is
        anything but healthy.
      </CrossLink>

      <Section
        title="Closed"
        description="Six states in Figma — All and User, each with Default, Hover, and Clicked. All six are this one control reading off which account is selected and whether the menu is open, so they are props here rather than variants."
      >
        <Frame height="auto" hug>
          <Column>
            <InboxSelector
              accounts={accounts}
              value={account}
              onValueChange={setAccount}
              onConnectAccount={() => undefined}
            />
          </Column>
        </Frame>
        <Caption>
          Showing "All accounts". Pick a person from the menu and the same control draws their
          avatar and unread count instead.
        </Caption>
        <CodeBlock
          code={`<InboxSelector accounts={accounts} value={account} onValueChange={setAccount} />`}
        />
      </Section>

      <Section
        title="Open"
        description="Escape and a click outside both close it. A dropdown that only closes by picking something traps anyone who opened it to look — and looking is the common case here, since the menu doubles as the account health summary."
      >
        <Frame height={420} hug>
          <Column>
            <InboxSelector
              accounts={accounts}
              value={account}
              onValueChange={setAccount}
              open
              onConnectAccount={() => undefined}
            />
          </Column>
        </Frame>
        <Caption>
          Pinned open with the `open` prop. The combined row, the accounts, and the connect row that
          only appears when `onConnectAccount` is set.
        </Caption>
        <CodeBlock code={`<InboxSelector accounts={accounts} open onOpenChange={setOpen} />`} />
      </Section>

      <Section
        title="Rows"
        description="A dead account stays listed but grays out, and its unread count is replaced by a reconnect prompt: a count that cannot change is not worth showing, but hiding the account entirely would leave someone wondering where it went."
      >
        <Frame height="auto" hug>
          <Surface>
            <VStack gap={2}>
              <InboxAccountRow accountCount={accounts.length} selected />
              <InboxAccountRow accountCount={accounts.length} />
              <InboxAccountRow account={accounts[0]} />
              <InboxAccountRow account={accounts[1]} />
              <InboxAccountRow account={accounts[2]} />
            </VStack>
          </Surface>
        </Frame>
        <Caption>
          The combined row selected and unselected, a healthy account with its counter, an expired
          token, and a suspended account.
        </Caption>
        <CodeBlock
          code={`<InboxAccountRow account={account} selected={account.id === value} onSelect={pick} />`}
        />
      </Section>

      <Section
        title="Signal"
        description="The connection glyph sits with the avatar rather than with the count, because it qualifies who this is — whether their messages are current — not how many are waiting."
      >
        <Frame height="auto" hug>
          <Surface>
            <VStack gap={2}>
              <InboxAccountRow account={{ ...accounts[0], connection: 'online' }} />
              <InboxAccountRow
                account={{
                  ...accounts[0],
                  name: 'Offline account',
                  connection: 'offline',
                  problem: undefined,
                }}
              />
              <InboxAccountRow
                account={{
                  ...accounts[0],
                  name: 'Broken account',
                  connection: 'error',
                  problem: undefined,
                }}
              />
            </VStack>
          </Surface>
        </Frame>
        <Caption>Online draws no glyph — the healthy case needs no annotation.</Caption>
        <CodeBlock code={`<InboxAccountRow account={{ ...account, connection: 'offline' }} />`} />
      </Section>
    </>
  );
}
