import { color, spacing, textStyle } from '@gigradar/theme';
import { ConnectionIndicator, SignalIcon } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption } from './parts';

/**
 * Left ▸ Websocket indicators — Figma nodes 2694:21065 and 2727:4848.
 *
 * The pill and the signal glyph inside it are one page. The glyph is exported
 * separately because the account rows draw it bare, but it is the same mark
 * reporting the same thing, and its states only make sense read against the
 * pill's.
 */
export function WebsocketIndicatorsPage() {
  return (
    <>
      <PageHeader
        title="Websocket indicators"
        description="Whether the inbox is receiving messages live. Figma nodes 2694:21065 (pill) and 2727:4848 (glyph)."
      />

      <CrossLink
        eyebrow="Used by"
        links={[{ label: 'Left ▸ Inbox Selector', pageId: 'crm-inbox-selector' }]}
      >
        <strong>SignalIcon</strong> is exported separately from the pill around it, because the
        account rows in the selector's dropdown draw the bars bare to report each account's own
        connection.
      </CrossLink>

      <Section
        title="States"
        description="Four rather than a boolean, because “not receiving messages” means three different things to the person reading it: offline is expected — they disconnected — error is not, and syncing is temporary. Only error asks for action, and only error is drawn in red."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', gap: spacing.m, padding: spacing.l, flexWrap: 'wrap' }}>
            <ConnectionIndicator state="online" />
            <ConnectionIndicator state="offline" />
            <ConnectionIndicator state="error" />
            <ConnectionIndicator state="syncing" />
          </div>
        </Frame>
        <Caption>
          Syncing swaps the bars for a spinner: the bars report a level, and during a reconnect
          there is no level to report yet.
        </Caption>
        <CodeBlock code={`<ConnectionIndicator state="online" />`} />
      </Section>

      <Section
        title="The status icon"
        description="Exported on its own because the account rows in the selector dropdown draw it without the pill around it. Offline is the only state that grays the bars rather than tinting them: the others are all reporting something, and gray reads as “nothing to report”."
      >
        <Frame height="auto">
          <div
            style={{
              display: 'flex',
              gap: spacing.xl,
              padding: spacing.l,
              alignItems: 'flex-end',
            }}
          >
            {(['online', 'offline', 'error'] as const).map((state) => (
              <div
                key={state}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.xs,
                  alignItems: 'center',
                }}
              >
                <SignalIcon state={state} />
                <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>{state}</span>
              </div>
            ))}
          </div>
        </Frame>
        <Caption>
          The error state strikes the bars through, so a red signal cannot be mistaken for a strong
          one at a glance.
        </Caption>
        <CodeBlock code={`<SignalIcon state="error" />`} />
      </Section>

      <Section
        title="In place"
        description="It floats over the list at the column's foot rather than sitting in the header, because it reports a condition that changes on its own, without anyone doing anything. It is where a glance down the list will catch it, and nowhere near the controls, so it never reads as something to click."
      >
        <Frame height={220} hug>
          <div
            style={{
              position: 'relative',
              width: 328,
              height: 200,
              backgroundColor: color.main.white,
            }}
          >
            <div style={{ position: 'absolute', left: 14, bottom: 12 }}>
              <ConnectionIndicator state="online" />
            </div>
          </div>
        </Frame>
        <Caption>Pinned 14px from the column's left edge, 12px from its foot.</Caption>
      </Section>
    </>
  );
}
