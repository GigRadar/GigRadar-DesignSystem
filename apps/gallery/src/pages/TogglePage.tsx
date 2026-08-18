import { color, spacing, textStyle } from '@gigradar/theme';
import { HStack, Toggle, VStack } from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Frame } from '../components/Frame';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Section } from '../layout';
import { CrossLink } from '../navigation';

/** A caption under a demo, matching the other gallery pages. */
function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/**
 * Components ▸ Main ▸ Toggle.
 *
 * The generic tier: a binary switch knows nothing about notifications, which
 * is why it is filed here rather than under CRM even though the notification
 * cards are what prompted it.
 */
export function TogglePage() {
  return (
    <>
      <PageHeader
        title="Toggle"
        description="A binary on/off switch — a track with a sliding handle, optionally captioned. Figma node 3460:60145."
      />

      <CrossLink
        eyebrow="Not to be confused with"
        links={[
          { label: 'Components ▸ Main ▸ Switch', pageId: 'switch' },
          { label: 'CRM ▸ Settings ▸ CRM Notifications', pageId: 'crm-settings-notifications' },
        ]}
      >
        <strong>Switch</strong> is the segmented control — a row of labelled choices where exactly
        one is picked. This is the two-state track. They are different controls that Figma happens
        to file near each other, so reach for the one whose job matches: a binary setting is a
        Toggle, a choice between named options is a Switch.
      </CrossLink>

      <Section
        title="On and off"
        description="Uncontrolled by default — the toggle keeps its own state and reports changes through `onCheckedChange`. Pass `checked` when something outside it owns the value."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <HStack gap={16} alignItems="center">
              <Toggle defaultChecked={false} label="Off example" />
              <Toggle defaultChecked label="On example" />
            </HStack>
          </div>
        </Frame>
        <Caption>Off, then on. The handle slides and the track takes the brand blue.</Caption>
        <CodeBlock code={`<Toggle checked={on} onCheckedChange={setOn} label="Slack notifications" />`} />
      </Section>

      <Section
        title="Captioned"
        description="Figma's wider variant carries ON/OFF inside the track. The caption sits on the side the handle is not, which is why the track's padding is asymmetric — and why a captioned track is wider than a bare one."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <VStack gap={16} alignItems="flex-start">
              <HStack gap={16} alignItems="center">
                <Toggle caption defaultChecked={false} label="Off with caption" />
                <Toggle caption defaultChecked label="On with caption" />
              </HStack>
              <HStack gap={16} alignItems="center">
                <Toggle
                  caption
                  captionLabels={{ on: 'YES', off: 'NO' }}
                  defaultChecked
                  label="Custom caption"
                />
              </HStack>
            </VStack>
          </div>
        </Frame>
        <Caption>
          A captioned track holds a fixed width so the handle does not shift as "ON" becomes the
          longer "OFF". A bare one hugs its handle instead.
        </Caption>
        <CodeBlock
          code={`<Toggle caption />
<Toggle caption captionLabels={{ on: 'YES', off: 'NO' }} />`}
        />
      </Section>

      <Section
        title="Sizes"
        description="Three steps. The track's width follows from the handle and its travel rather than being declared per size, so a retuned handle keeps the proportions."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <VStack gap={16} alignItems="flex-start">
              <HStack gap={16} alignItems="center">
                <Toggle size="small" defaultChecked label="Small" />
                <Toggle size="medium" defaultChecked label="Medium" />
                <Toggle size="large" defaultChecked label="Large" />
              </HStack>
              <HStack gap={16} alignItems="center">
                <Toggle size="small" caption defaultChecked label="Small captioned" />
                <Toggle size="medium" caption defaultChecked label="Medium captioned" />
                <Toggle size="large" caption defaultChecked label="Large captioned" />
              </HStack>
            </VStack>
          </div>
        </Frame>
        <Caption>Bare above, captioned below — the caption is what widens the track.</Caption>
        <CodeBlock code={`<Toggle size="small" />  <Toggle size="large" caption />`} />
      </Section>

      <Section
        title="Disabled"
        description="Dimmed and inert, in both positions. The button is genuinely disabled rather than merely styled, so it drops out of the tab order too."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <HStack gap={16} alignItems="center">
              <Toggle disabled label="Disabled off" />
              <Toggle disabled defaultChecked label="Disabled on" />
            </HStack>
          </div>
        </Frame>
        <CodeBlock code={`<Toggle disabled checked={value} />`} />
      </Section>

      <Section
        title="Controlled"
        description="Drive it from your own state when something else has to react to the change."
      >
        <ControlledDemo />
        <CodeBlock
          code={`const [on, setOn] = useState(false);

<Toggle checked={on} onCheckedChange={setOn} label="Email alerts" />`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'checked', type: 'boolean', description: 'Whether the toggle is on. Controlled.' },
            {
              name: 'defaultChecked',
              type: 'boolean',
              default: 'false',
              description: 'Starting position when the toggle manages its own state.',
            },
            {
              name: 'onCheckedChange',
              type: '(checked: boolean) => void',
              description: 'Fires with the new position.',
            },
            {
              name: 'caption',
              type: 'boolean',
              default: 'false',
              description: 'Draws ON/OFF inside the track, and widens it to fit.',
            },
            {
              name: 'captionLabels',
              type: '{ on: ReactNode; off: ReactNode }',
              default: "{ on: 'ON', off: 'OFF' }",
              description: 'Overrides the caption text.',
            },
            {
              name: 'size',
              type: "'small' | 'medium' | 'large'",
              default: "'medium'",
              description: 'The track and handle step.',
            },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims and blocks it.' },
            {
              name: 'label',
              type: 'string',
              description: 'Names the control for a screen reader. Required without aria-labelledby.',
            },
          ]}
        />
      </Section>
    </>
  );
}

/** A toggle whose value is owned outside it. */
function ControlledDemo() {
  const [on, setOn] = useState(false);

  return (
    <Frame height="auto">
      <div style={{ padding: spacing.l }}>
        <HStack gap={16} alignItems="center">
          <Toggle checked={on} onCheckedChange={setOn} label="Email alerts" />
          <span style={{ ...textStyle.mRegular, color: color.navbar.text2 }}>
            Email alerts are {on ? 'on' : 'off'}
          </span>
        </HStack>
      </div>
    </Frame>
  );
}
