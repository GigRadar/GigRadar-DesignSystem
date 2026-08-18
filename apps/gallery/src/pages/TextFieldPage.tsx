import { color, spacing, textStyle } from '@gigradar/theme';
import { IconClientIdPeopleStroke, IconSecretKeyShieldStroke, TextField } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PageHeader, Section } from '../layout';

/**
 * Components ▸ Main ▸ Text field.
 *
 * The system's single-line input. Filed under Main rather than CRM: nothing
 * about it knows what a CRM is, and the settings screens are simply its first
 * consumer.
 */
export function TextFieldPage() {
  return (
    <>
      <PageHeader
        title="Text field"
        description="The single-line input — Figma's Settings Textfield, node 2104:32695. One box, four states, and a label that travels with it."
      />

      <Section
        title="The four states Figma draws"
        description="Only the edge and the value color move between them. Default is a pale blue edge on the page background; hover and focus lift the edge to brand blue; a filled field darkens the value from the placeholder tint to black."
      >
        <Column>
          <TextField label="Client ID" labelIcon={IconClientIdPeopleStroke} placeholder="Input Client ID" />
          <Caption>Default — empty, with the placeholder in the resting tint.</Caption>

          <TextField label="Client ID" labelIcon={IconClientIdPeopleStroke} placeholder="Input Client ID" hovered />
          <Caption>Hover.</Caption>

          <TextField label="Client ID" labelIcon={IconClientIdPeopleStroke} placeholder="Input Client ID" focused />
          <Caption>Focus — the same edge as hover.</Caption>

          <TextField
            label="Client ID"
            labelIcon={IconClientIdPeopleStroke}
            defaultValue="4b9f8e2a7c1d3e5f"
          />
          <Caption>Filled.</Caption>
        </Column>

        <CodeBlock
          code={`<TextField label="Client ID" labelIcon={IconClientIdPeopleStroke} placeholder="Input Client ID" />`}
        />
      </Section>

      <Section
        title="Secrets"
        description="`secret` masks the value and adds the reveal control. It is a prop rather than `type='password'` at the call site because a key the user has just pasted has to be checkable — and every screen that takes one would otherwise build the same eye toggle."
      >
        <Column>
          <TextField
            label="Secret Key"
            labelIcon={IconSecretKeyShieldStroke}
            secret
            defaultValue="9f82a3c7d1e5b4a6"
          />
        </Column>
        <Caption>Press the eye to check what was pasted.</Caption>
        <CodeBlock code={`<TextField label="Secret Key" labelIcon={IconSecretKeyShieldStroke} secret />`} />
      </Section>

      <Section
        title="Errors"
        description="`error` takes a boolean or a message. One prop rather than a state enum plus a separate message: an error is the only state a caller sets deliberately — hover and focus come from the pointer and the keyboard, so the component owns those."
      >
        <Column>
          <TextField label="Client ID" defaultValue="not-a-key" error />
          <Caption>`error` alone — the palette moves, nothing is said.</Caption>

          <TextField
            label="Client ID"
            defaultValue="not-a-key"
            error="That does not look like a Client ID."
          />
          <Caption>`error` with a message.</Caption>
        </Column>
        <CodeBlock code={`<TextField label="Client ID" error="That does not look like a Client ID." />`} />
      </Section>

      <Section
        title="Disabled"
        description="Greyed and inert — what the form draws while a test is running against the values already in it."
      >
        <Column>
          <TextField label="Client ID" defaultValue="4b9f8e2a7c1d3e5f" disabled />
        </Column>
        <CodeBlock code={`<TextField label="Client ID" disabled />`} />
      </Section>

      <Section
        title="Controlled"
        description="A plain controlled input — `value` and `onChange` behave as they do on any `<input>`, because underneath it is one."
      >
        <ControlledDemo />
      </Section>
    </>
  );
}

function ControlledDemo() {
  const [value, setValue] = useState('');
  return (
    <Column>
      <TextField
        label="Client ID"
        labelIcon={IconClientIdPeopleStroke}
        placeholder="Input Client ID"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Caption>{value ? `Holding "${value}".` : 'Empty.'}</Caption>
    </Column>
  );
}

/** The fields are full-width, so a preview needs a column to sit in. */
function Column({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s, maxWidth: 420 }}>
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
        marginBottom: spacing.xs,
      }}
    >
      {children}
    </p>
  );
}
