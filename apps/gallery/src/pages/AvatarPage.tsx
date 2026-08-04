import { color, component, spacing, textStyle, type AvatarToneName } from '@uiuxjoseph/theme';
import { Avatar, AvatarGroup } from '@uiuxjoseph/ui';
import { CodeBlock } from '../components/CodeBlock';
import { CssPropsTable } from '../components/CssPropsTable';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { AVATAR_GROUP_SOURCE, AVATAR_SOURCE } from '../sources';

/** The 12 tones in the order Figma lays them out in node 456:8607. */
const TONES: AvatarToneName[] = [
  'cyan',
  'magenta',
  'purple',
  'orange',
  'red',
  'volcano',
  'green',
  'gold',
  'lime',
  'geekBlue',
  'blue',
  'default',
];

const TEAM = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Barbara Liskov'];

export function AvatarPage() {
  return (
    <>
      <PageHeader
        title="Avatar"
        description="A user, company, or service avatar — a photo, a service mark, or tinted initials, with an optional badge pinned to the bottom-right corner. Mirrors the Figma component at node 456:8607."
      />

      <Section
        title="Figma parity"
        description="Every variant from the Figma component, in source order: the 12 tones, then a photo, then the three service marks — each with the GigRadar corner badge."
      >
        <Preview>
          {TONES.map((tone) => (
            <Avatar key={tone} tone={tone} initials="GR" badge="gigradar" />
          ))}
          <Avatar
            src="https://i.pravatar.cc/96?img=47"
            name="Ada Lovelace"
            badge="gigradar"
          />
          <Avatar service="upwork" name="Upwork" badge="gigradar" />
          <Avatar service="zoom" name="Zoom" badge="gigradar" />
          <Avatar service="gigradar" name="GigRadar" badge="gigradar" />
        </Preview>
        <CodeBlock
          code={`<Avatar tone="cyan" initials="GR" badge="gigradar" />\n<Avatar src={photoUrl} name="Ada Lovelace" badge="gigradar" />\n<Avatar service="upwork" name="Upwork" badge="gigradar" />`}
        />
      </Section>

      <Section
        title="Tones"
        description="Background, border, and text are drawn from one hue so initials stay legible on their own fill."
      >
        <Preview>
          {TONES.map((tone) => (
            <Avatar key={tone} tone={tone} initials="GR" />
          ))}
        </Preview>
        <CodeBlock code={`<Avatar tone="cyan" initials="GR" />\n<Avatar tone="volcano" initials="AL" />`} />
      </Section>

      <Section
        title="Automatic tone"
        description="Omit tone and one is hashed from the name — the same person keeps the same color on every screen, with no palette bookkeeping in app code."
      >
        <Preview>
          {TEAM.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </Preview>
        <CodeBlock code={`<Avatar name="Ada Lovelace" />\n<Avatar name="Grace Hopper" />`} />
      </Section>

      <Section title="Sizes">
        <Preview>
          <Avatar size="small" name="Ada Lovelace" badge="gigradar" />
          <Avatar size="medium" name="Ada Lovelace" badge="gigradar" />
          <Avatar size="large" name="Ada Lovelace" badge="gigradar" />
        </Preview>
        <CodeBlock code={`<Avatar size="small" name="Ada Lovelace" />\n<Avatar size="large" name="Ada Lovelace" badge="gigradar" />`} />
      </Section>

      <Section
        title="Badges"
        description="The corner slot takes the two marks drawn in Figma, or any node for a custom marker."
      >
        <Preview>
          <Avatar name="Ada Lovelace" badge="gigradar" />
          <Avatar name="Ada Lovelace" badge="upworkApi" />
          <Avatar tone="green" initials="GR" badge="gigradar" />
          <Avatar tone="purple" initials="GR" badge="upworkApi" />
          <Avatar
            name="Ada Lovelace"
            badge={<span style={{ width: '100%', height: '100%', borderRadius: 9999, backgroundColor: color.status.success.main }} />}
          />
        </Preview>
        <CodeBlock
          code={`<Avatar name="Ada Lovelace" badge="gigradar" />\n<Avatar name="Ada Lovelace" badge="upworkApi" />\n{/* any node works — a presence dot, a count, an icon */}\n<Avatar name="Ada Lovelace" badge={<OnlineDot />} />`}
        />
      </Section>

      <Section
        title="Content precedence"
        description="Resolves in one order — service, then src, then initials — so a photo always wins over a letter and a service mark always wins over a photo."
      >
        <Preview>
          <Avatar service="gigradar" name="GigRadar" />
          <Avatar src="https://i.pravatar.cc/96?img=12" name="Alan Turing" />
          <Avatar name="Alan Turing" />
          <Avatar initials="XY" tone="gold" />
          <Avatar />
        </Preview>
        <CodeBlock code={`<Avatar service="gigradar" />       {/* service mark */}\n<Avatar src={url} name="Alan Turing" /> {/* photo */}\n<Avatar name="Alan Turing" />        {/* initials "AT" */}\n<Avatar />                           {/* grey placeholder */}`} />
      </Section>

      <Section
        title="Group"
        description="Overlapping avatars with an optional +N overflow. Leftmost sits on top, so stacking order matches reading order."
      >
        <Preview>
          <AvatarGroup>
            {TEAM.map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </AvatarGroup>
          <AvatarGroup max={3}>
            {TEAM.map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </AvatarGroup>
          <AvatarGroup size="large" max={2}>
            {TEAM.map((name) => (
              <Avatar key={name} size="large" name={name} />
            ))}
          </AvatarGroup>
        </Preview>
        <CodeBlock
          code={`<AvatarGroup max={3}>\n  {team.map((person) => (\n    <Avatar key={person.id} name={person.name} src={person.photo} />\n  ))}\n</AvatarGroup>`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Avatar diameter and type scale. medium is the 32px Figma size.' },
            { name: 'tone', type: 'AvatarToneName', description: 'Initials palette. Defaults to a tone hashed from name. Ignored when src or service is set.' },
            { name: 'name', type: 'string', description: 'Full name. Supplies the initials, the image alt text, and the automatic tone.' },
            { name: 'initials', type: 'string', description: 'Overrides the initials derived from name. Uppercased, truncated to two characters.' },
            { name: 'src', type: 'string', description: 'Photo URL. Takes precedence over initials.' },
            { name: 'service', type: `'gigradar' | 'upwork' | 'zoom'`, description: 'Renders a built-in service mark. Takes precedence over src.' },
            { name: 'badge', type: `'gigradar' | 'upworkApi' | ReactNode`, description: 'The bottom-right corner badge.' },
          ]}
        />
      </Section>

      <Section title="AvatarGroup props">
        <PropsTable
          rows={[
            { name: 'max', type: 'number', description: 'Show at most this many avatars, then a +N count. Without it, every child renders.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Applied to the overflow count. Avatars keep their own size.' },
          ]}
        />
      </Section>

      <Section title="CSS properties" description="Type a value to see it apply — the override is scoped to this preview.">
        <CssPropsTable
          rows={[
            { name: 'avatar-size-medium', value: `${component.avatar.size.medium}px`, description: 'Avatar diameter at the default size.' },
            { name: 'avatar-size-small', value: `${component.avatar.size.small}px`, description: 'Avatar diameter at size="small".' },
            { name: 'avatar-size-large', value: `${component.avatar.size.large}px`, description: 'Avatar diameter at size="large".' },
            { name: 'avatar-font-size-medium', value: `${component.avatar.fontSize.medium}px`, description: 'Initials type size at the default size.' },
            { name: 'avatar-badge-size-medium', value: `${component.avatar.badgeSize.medium}px`, description: 'Corner badge diameter at the default size.' },
            { name: 'avatar-badge-ring-width', value: `${component.avatar.badgeRingWidth}px`, description: 'White ring separating the badge from the avatar.' },
            { name: 'avatar-radius', value: `${component.avatar.radius}px`, description: 'Corner radius. 9999px produces the circle.' },
            { name: 'avatar-border-width', value: `${component.avatar.borderWidth}px`, description: 'Border thickness on tinted avatars.' },
            { name: 'avatar-group-overlap', value: String(component.avatar.groupOverlap), description: 'Group overlap, as a fraction of the avatar size.' },
          ]}
        >
          <Avatar tone="cyan" initials="GR" badge="gigradar" />
          <Avatar name="Ada Lovelace" badge="upworkApi" />
          <Avatar service="upwork" name="Upwork" />
          <AvatarGroup max={3}>
            {TEAM.map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </AvatarGroup>
        </CssPropsTable>
      </Section>

      <Section title="Usage">
        <div style={{ ...textStyle.mRegular, color: color.main.description, marginBottom: spacing.s, maxWidth: 680 }}>
          Assets are inlined as data URIs rather than imported as files, because
          <code style={{ fontFamily: 'monospace' }}> @uiuxjoseph/ui </code>
          builds with plain <code style={{ fontFamily: 'monospace' }}>tsc</code>. That keeps the
          package a single import with no bundler configuration required of the consuming app.
        </div>
        <CodeBlock code={`import { Avatar, AvatarGroup } from '@uiuxjoseph/ui';\n\n<Avatar name={user.fullName} src={user.photoUrl} badge="gigradar" />`} />
      </Section>

      <Section title="Source">
        <CodeBlock code={AVATAR_SOURCE} readingOnly />
      </Section>

      <Section title="AvatarGroup source">
        <CodeBlock code={AVATAR_GROUP_SOURCE} readingOnly />
      </Section>
    </>
  );
}
