import { color, spacing, textStyle } from '@gigradar/theme';
import {
  NotificationToggle,
  OsNotification,
  PushNotificationToggle,
  type OsNotificationPlatform,
  type PushPermission,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption } from './parts';

/** The platforms Figma draws, and how each labels itself. */
const PLATFORMS: { id: OsNotificationPlatform; label: string }[] = [
  { id: 'windows-chrome', label: 'Windows · Chrome' },
  { id: 'windows-firefox', label: 'Windows · Firefox' },
  { id: 'windows-edge', label: 'Windows · Edge' },
  { id: 'mac-chrome', label: 'macOS · Chrome' },
  { id: 'mac-firefox', label: 'macOS · Firefox' },
  { id: 'mac-safari', label: 'macOS · Safari' },
];

/**
 * Left ▸ Push notifications — Figma node 1135:16742, flow at 2422:35659 in the
 * CRM file.
 *
 * Its own SubNav rather than a section on Cards: the switch owns a permission
 * flow, an explainer, and six platform renderings, none of which is about a
 * room card.
 */
export function PushNotificationPage() {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<PushPermission | null>(null);
  const [notify, setNotify] = useState(false);

  return (
    <>
      <PageHeader
        title="Push notifications"
        description="The switch in the Inbox header, the explainer it opens, and what a notification looks like once it lands. Figma node 1135:16742."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'List of Room (Left)', pageId: 'crm-inbox-left' },
          { label: 'Components ▸ Main ▸ Tooltip', pageId: 'tooltip' },
        ]}
      >
        <strong>PushNotificationToggle</strong> wraps the bare{' '}
        <strong>NotificationToggle</strong> with a hover explainer built on{' '}
        <strong>Tooltip</strong>, and asks the browser for permission on the way on.
      </CrossLink>

      <Section
        title="The switch"
        description="Two states, and no label. The bell is the whole affordance — the header has room for one control and none for a caption beside it, which is why the explainer on hover carries the words instead."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', gap: spacing.l, padding: spacing.l, alignItems: 'center' }}>
            <NotificationToggle checked={notify} onCheckedChange={setNotify} />
            <NotificationToggle checked onCheckedChange={() => undefined} />
          </div>
        </Frame>
        <Caption>Off and on. What it means is the hover explainer's job, not the switch's.</Caption>
        <CodeBlock
          code={`<NotificationToggle checked={on} onCheckedChange={setOn} />`}
        />
      </Section>

      <Section
        title="Asking for permission"
        description="Hovering opens the explainer; “Later” retires it for the session. Switching on calls the browser's prompt and fires a sample notification if it is granted — and if the browser blocks it, the switch returns to off rather than lying about a channel that will deliver nothing."
      >
        <Frame height={300}>
          <div style={{ display: 'flex', gap: spacing.l, padding: spacing.l, alignItems: 'center' }}>
            <PushNotificationToggle
              checked={enabled}
              onCheckedChange={setEnabled}
              onPermissionChange={setPermission}
              tooltipAlign="start"
            />
            <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>
              {permission ? `Browser said: ${permission}` : 'Hover the toggle, then switch it on.'}
            </span>
          </div>
        </Frame>
        <Caption>
          Four permission outcomes, not two: `granted`, `denied`, `default` (dismissed without
          answering), and `unsupported` for browsers with no Notification API at all.
        </Caption>
        <CodeBlock
          code={`<PushNotificationToggle
  checked={enabled}
  onCheckedChange={setEnabled}
  onPermissionChange={(p) => persist(p)}
/>`}
        />
      </Section>

      <Section
        title="Where it lands"
        description="Six renderings of one payload. The browser owns the chrome — a page supplies a title, a body, and an icon, and nothing else — so these are previews for reviewing copy, not components the product ships. The words are the only part it controls, and a title that fits Safari can be cut by Chrome."
      >
        <Frame height="auto">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: spacing.m,
              padding: spacing.l,
            }}
          >
            {PLATFORMS.map((platform) => (
              <div key={platform.id} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                <span style={{ ...textStyle.sMedium, color: color.navbar.text }}>
                  {platform.label}
                </span>
                <OsNotification
                  platform={platform.id}
                  title="New Message from Floyd Miles"
                  body="Hi Jane Cooper could you send me the first drafts of the designs?"
                />
              </div>
            ))}
          </div>
        </Frame>
        <Caption>
          Chrome and Edge name themselves above the site; Firefox names only the site; Safari
          attributes in its own chrome and shows neither.
        </Caption>
        <CodeBlock
          code={`<OsNotification
  platform="mac-chrome"
  title="New Message from Floyd Miles"
  body="Hi Jane Cooper could you send me the first drafts of the designs?"
/>`}
        />
      </Section>
    </>
  );
}
