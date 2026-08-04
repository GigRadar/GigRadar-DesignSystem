import { color, component, radius, type AvatarToneName } from '@uiuxjoseph/theme';
import { Avatar, AvatarGroup, HStack, VStack } from '@uiuxjoseph/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

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

const PHOTO = 'https://i.pravatar.cc/96?img=47';

export function AvatarPage() {
  return (
    <>
      <PageHeader
        title="Avatar"
        description="A user, company, or service avatar — a photo, a service mark, or tinted initials, with an optional mini avatar pinned to the bottom-right corner. Mirrors the Figma component at node 456:8607."
      />

      <Section
        title="Install"
        description="The packages are private and hosted on GitHub Packages, so npm needs to know where to look. The repo .npmrc holds routing only — the auth token goes in your global ~/.npmrc and is never committed."
      >
        <VStack gap="s">
          <CodeBlock
            label="1. Route the scope — .npmrc at the app repo root"
            code={`@uiuxjoseph:registry=https://npm.pkg.github.com`}
          />
          <CodeBlock
            label="2. Authenticate once — your global ~/.npmrc"
            code={`//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxx`}
          />
          <CodeBlock
            label="3. Install"
            code={`npm install @uiuxjoseph/theme @uiuxjoseph/ui
npm install -D @uiuxjoseph/eslint-plugin`}
          />
        </VStack>
      </Section>

      <Section
        title="Setup"
        description="Mount GigRadarProvider once at the app root. It injects the token CSS variables, so a token change ships as a version bump rather than an edit in every app."
      >
        <CodeBlock
          label="App root"
          code={`import { GigRadarProvider } from "@uiuxjoseph/ui"

export default function App() {
  return (
    <GigRadarProvider>
      <YourApp />
    </GigRadarProvider>
  )
}`}
        />
      </Section>

      <Section
        title="Quick start"
        description="Everything on this page is imported from @uiuxjoseph/ui — components, layout primitives, and tokens all come from the one entry point."
      >
        <Preview>
          <HStack gap="s">
            <Avatar name="Ada Lovelace" src={PHOTO} badge="gigradar" />
            <Avatar name="Grace Hopper" />
            <Avatar type="placeholder" />
          </HStack>
        </Preview>
        <CodeBlock
          code={`import { Avatar, HStack } from "@uiuxjoseph/ui"

export function TeamRow({ people }) {
  return (
    <HStack gap="s">
      {people.map((person) => (
        <Avatar
          key={person.id}
          name={person.fullName}
          src={person.photoUrl}
          badge={person.isVerified ? "gigradar" : undefined}
        />
      ))}
    </HStack>
  )
}`}
        />
      </Section>

      <Section
        title="Avatar"
        description="Six types. The type is normally inferred from the content you give it — src makes an image, service makes that service mark, and no name at all makes the placeholder — so `type` is only needed to pin one regardless of the data."
      >
        <Preview>
          <Avatar type="default" name="Ada Lovelace" />
          <Avatar type="image" name="Ada Lovelace" src={PHOTO} />
          <Avatar type="placeholder" />
          <Avatar type="upwork" name="Upwork" />
          <Avatar type="zoom" name="Zoom" />
          <Avatar type="gigradar" name="GigRadar" />
        </Preview>
        <CodeBlock
          code={`import { Avatar, HStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar type="default" name="Ada Lovelace" />
      <Avatar type="image" name="Ada Lovelace" src="/ada.jpg" />
      <Avatar type="placeholder" />
      <Avatar type="upwork" name="Upwork" />
      <Avatar type="zoom" name="Zoom" />
      <Avatar type="gigradar" name="GigRadar" />
    </HStack>
  )
}`}
        />
      </Section>

      <Section
        title="With mini avatar"
        description="The mini avatar sits in the bottom-right corner, separated from the avatar beneath it by a white ring."
      >
        <Preview>
          <Avatar type="default" name="Ada Lovelace" badge="gigradar" />
          <Avatar type="image" name="Ada Lovelace" src={PHOTO} badge="gigradar" />
          <Avatar type="placeholder" badge="gigradar" />
          <Avatar type="upwork" name="Upwork" badge="gigradar" />
          <Avatar type="zoom" name="Zoom" badge="gigradar" />
          <Avatar type="gigradar" name="GigRadar" badge="upworkApi" />
        </Preview>
        <CodeBlock
          code={`import { Avatar, HStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar type="default" name="Ada Lovelace" badge="gigradar" />
      <Avatar type="image" name="Ada Lovelace" src="/ada.jpg" badge="gigradar" />
      <Avatar type="placeholder" badge="gigradar" />
      <Avatar type="upwork" name="Upwork" badge="gigradar" />
      <Avatar type="zoom" name="Zoom" badge="gigradar" />
      <Avatar type="gigradar" name="GigRadar" badge="upworkApi" />
    </HStack>
  )
}`}
        />
      </Section>

      <Section title="Avatar size" description="Three steps. medium is the 32px size drawn in Figma.">
        <Preview>
          <Avatar size="small" name="Ada Lovelace" badge="gigradar" />
          <Avatar size="medium" name="Ada Lovelace" badge="gigradar" />
          <Avatar size="large" name="Ada Lovelace" badge="gigradar" />
        </Preview>
        <CodeBlock
          code={`import { Avatar, HStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar size="small" name="Ada Lovelace" badge="gigradar" />
      <Avatar size="medium" name="Ada Lovelace" badge="gigradar" />
      <Avatar size="large" name="Ada Lovelace" badge="gigradar" />
    </HStack>
  )
}`}
        />
      </Section>

      <Section
        title="Badges type"
        description="Two marks are drawn in Figma — the GigRadar logo and the blue Upwork API pill. Any node works in the same slot."
      >
        <Preview>
          <Avatar name="Ada Lovelace" badge="gigradar" />
          <Avatar name="Ada Lovelace" badge="upworkApi" />
          <Avatar
            name="Ada Lovelace"
            badge={
              <span
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: radius.round,
                  backgroundColor: color.status.success.main,
                }}
              />
            }
          />
        </Preview>
        <CodeBlock
          code={`import { Avatar, HStack, color, radius } from "@uiuxjoseph/ui"

const OnlineDot = () => (
  <span style={{ width: "100%", height: "100%", borderRadius: radius.round, background: color.status.success.main }} />
)

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar name="Ada Lovelace" badge="gigradar" />
      <Avatar name="Ada Lovelace" badge="upworkApi" />
      <Avatar name="Ada Lovelace" badge={<OnlineDot />} />
    </HStack>
  )
}`}
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
        <CodeBlock
          code={`import { Avatar, HStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar tone="cyan" initials="GR" />
      <Avatar tone="volcano" initials="GR" />
      <Avatar tone="geekBlue" initials="GR" />
      <Avatar tone="default" initials="GR" />
    </HStack>
  )
}`}
        />
      </Section>

      <Section
        title="Automatic tones"
        description="Omit tone and one is hashed from the name — the same person keeps the same color on every screen, with no palette bookkeeping in app code."
      >
        <Preview>
          {TEAM.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </Preview>
        <CodeBlock
          code={`import { Avatar, HStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Alan Turing" />
    </HStack>
  )
}`}
        />
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
          code={`import { Avatar, AvatarGroup, HStack } from "@uiuxjoseph/ui"

const team = [
  { id: 1, name: "Ada Lovelace" },
  { id: 2, name: "Grace Hopper" },
  { id: 3, name: "Alan Turing" },
  { id: 4, name: "Katherine Johnson" },
]

const Demo = () => {
  return (
    <AvatarGroup max={3}>
      {team.map((person) => (
        <Avatar key={person.id} name={person.name} />
      ))}
    </AvatarGroup>
  )
}`}
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
        <CodeBlock
          code={`import { Avatar, HStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar service="gigradar" />                 {/* service mark */}
      <Avatar src="/alan.jpg" name="Alan Turing" /> {/* photo */}
      <Avatar name="Alan Turing" />                 {/* initials "AT" */}
      <Avatar initials="XY" tone="gold" />          {/* explicit initials */}
      <Avatar />                                    {/* grey placeholder */}
    </HStack>
  )
}`}
        />
      </Section>

      <Section
        title="Style props"
        description="Every CSS property the avatar exposes is a typed prop — metrics and colors alike — so nothing here needs a style prop, which the component does not accept. Each writes the matching CSS variable, making a prop, a stylesheet rule, and the token default one mechanism. Numbers mean px."
      >
        <Preview>
          <Avatar name="Ada Lovelace" badge="gigradar" diameter={56} badgeSize={20} />
          <Avatar tone="cyan" initials="GR" radius={12} borderWidth={2} />
          <Avatar tone="volcano" initials="GR" diameter={48} fontSize={20} radius="30%" />
          <Avatar name="Grace Hopper" badge="gigradar" badgeRingWidth={3} diameter={48} />

      {/* colours are props too — no style prop needed, or accepted */}
      <Avatar initials="GR" background="#101820" borderColor="#FFB000"
              textColor="#FFB000" fontWeight={700} />
      <Avatar name="Ada Lovelace" badge="gigradar"
              badgeRingColor={color.main.brand} badgeRingWidth={2} />
          <Avatar
            initials="GR"
            background="#101820"
            borderColor="#FFB000"
            textColor="#FFB000"
            fontWeight={700}
          />
          <Avatar
            name="Ada Lovelace"
            badge="gigradar"
            badgeRingColor={color.main.brand}
            badgeRingWidth={2}
          />
          <AvatarGroup gap="-xxs" max={4}>
            {TEAM.map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </AvatarGroup>
        </Preview>
        <CodeBlock
          code={`import { Avatar, AvatarGroup, HStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <HStack gap="s">
      <Avatar name="Ada Lovelace" badge="gigradar" diameter={56} badgeSize={20} />
      <Avatar tone="cyan" initials="GR" radius={12} borderWidth={2} />
      <Avatar tone="volcano" initials="GR" diameter={48} fontSize={20} radius="30%" />
      <Avatar name="Grace Hopper" badge="gigradar" badgeRingWidth={3} diameter={48} />

      {/* colours are props too — no style prop needed, or accepted */}
      <Avatar initials="GR" background="#101820" borderColor="#FFB000"
              textColor="#FFB000" fontWeight={700} />
      <Avatar name="Ada Lovelace" badge="gigradar"
              badgeRingColor={color.main.brand} badgeRingWidth={2} />

      {/* gap is AvatarGroup's own knob — negative tokens overlap */}
      <AvatarGroup gap="-xxs" max={4}>
        {team.map((person) => (
          <Avatar key={person.id} name={person.name} />
        ))}
      </AvatarGroup>
    </HStack>
  )
}`}
        />
      </Section>

      <Section
        title="Layout"
        description={`Box, HStack, and VStack turn layout into props, so a row of avatars needs no style object. Spacing props take a token name — gap="s" resolves the spacing scale, and a typo is a type error rather than a silently odd layout.`}
      >
        <Preview>
          <VStack gap="s">
            <HStack gap="xxs">
              {TEAM.slice(0, 3).map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </HStack>
            <HStack gap="l">
              {TEAM.slice(0, 3).map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </HStack>
          </VStack>
        </Preview>
        <CodeBlock
          code={`import { Avatar, HStack, VStack } from "@uiuxjoseph/ui"

const Demo = () => {
  return (
    <VStack gap="s">
      <HStack gap="xxs">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
      </HStack>
      <HStack gap="l">
        <Avatar name="Alan Turing" />
        <Avatar name="Katherine Johnson" />
      </HStack>
    </VStack>
  )
}`}
        />
      </Section>

      <Section title="Box props">
        <PropsTable
          rows={[
            { name: 'as', type: 'ElementType', default: `'div'`, description: 'The element to render.' },
            {
              name: 'gap',
              type: `'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'sxxl' | number`,
              description: 'Gap between children. A token name resolves the spacing scale; a number means px.',
            },
            {
              name: 'p / px / py / pt / pr / pb / pl',
              type: 'SpaceValue',
              description: 'Padding. p sets all sides; px/py narrow it, and a single side wins.',
            },
            {
              name: 'm / mx / my / mt / mr / mb / ml',
              type: 'SpaceValue',
              description: 'Margin, with the same shorthand rules as padding.',
            },
            {
              name: 'display / flexDirection / alignItems / justifyContent / flexWrap / flex',
              type: 'CSS values',
              description: 'Flex layout, passed through as written.',
            },
            {
              name: 'width / height / maxWidth / minWidth',
              type: 'number | string',
              description: 'Numbers mean px; strings pass through.',
            },
            {
              name: 'background / textColor / borderColor',
              type: 'string',
              description: 'Surface, text, and border colors. A token or any CSS color.',
            },
            {
              name: 'borderWidth',
              type: 'number | string',
              description: 'Border thickness. Setting it (or borderColor) applies borderStyle: solid.',
            },
            {
              name: 'radius',
              type: `RadiusToken | number`,
              description: 'Corner radius. A token name resolves the radius scale; a number means px.',
            },
            {
              name: 'position / overflow / textAlign',
              type: 'CSS values',
              description: 'Passed through as written.',
            },
          ]}
        />
      </Section>

      <Section title="Avatar props">
        <PropsTable
          rows={[
            {
              name: 'type',
              type: `'default' | 'image' | 'placeholder' | 'upwork' | 'zoom' | 'gigradar'`,
              description:
                'Which of the six kinds to render. Inferred from src / service / name when omitted.',
            },
            {
              name: 'size',
              type: `'small' | 'medium' | 'large'`,
              default: `'medium'`,
              description: 'Avatar diameter and type scale. medium is the 32px Figma size.',
            },
            {
              name: 'tone',
              type: 'AvatarToneName',
              description:
                'Initials palette. Defaults to a tone hashed from name. Ignored when src or service is set.',
            },
            {
              name: 'name',
              type: 'string',
              description: 'Full name. Supplies the initials, the image alt text, and the automatic tone.',
            },
            {
              name: 'initials',
              type: 'string',
              description: 'Overrides the initials derived from name. Uppercased, truncated to two characters.',
            },
            { name: 'src', type: 'string', description: 'Photo URL. Takes precedence over initials.' },
            {
              name: 'service',
              type: `'gigradar' | 'upwork' | 'zoom'`,
              description: 'Renders a built-in service mark. Takes precedence over src.',
            },
            {
              name: 'badge',
              type: `'gigradar' | 'upworkApi' | ReactNode`,
              description: 'The mini avatar pinned to the bottom-right corner.',
            },
            {
              name: 'diameter',
              type: 'number | string',
              description: 'Avatar diameter, overriding the size step. Writes --gr-avatar-size-*.',
            },
            {
              name: 'radius',
              type: 'number | string',
              description: 'Corner radius. Writes --gr-avatar-radius.',
            },
            {
              name: 'borderWidth',
              type: 'number | string',
              description: 'Border thickness on tinted avatars. Writes --gr-avatar-border-width.',
            },
            {
              name: 'fontSize',
              type: 'number | string',
              description: 'Initials type size. Writes --gr-avatar-font-size-*.',
            },
            {
              name: 'badgeSize',
              type: 'number | string',
              description: 'Mini avatar diameter. Writes --gr-avatar-badge-size-*.',
            },
            {
              name: 'badgeRingWidth',
              type: 'number | string',
              description: 'Ring around the mini avatar. Writes --gr-avatar-badge-ring-width.',
            },
            {
              name: 'fontWeight',
              type: 'number',
              description: 'Initials weight. Writes --gr-avatar-font-weight.',
            },
            {
              name: 'background',
              type: 'string',
              description: 'Surface fill, overriding the tone. Writes --gr-avatar-background.',
            },
            {
              name: 'borderColor',
              type: 'string',
              description: 'Border color, overriding the tone. Writes --gr-avatar-border-color.',
            },
            {
              name: 'textColor',
              type: 'string',
              description: 'Initials color, overriding the tone. Writes --gr-avatar-text-color.',
            },
            {
              name: 'badgeRingColor',
              type: 'string',
              description: 'Color of the ring around the mini avatar. Writes --gr-avatar-badge-ring-color.',
            },
          ]}
        />
      </Section>

      <Section title="AvatarGroup props">
        <PropsTable
          rows={[
            {
              name: 'max',
              type: 'number',
              description: 'Show at most this many avatars, then a +N count. Without it, every child renders.',
            },
            {
              name: 'size',
              type: `'small' | 'medium' | 'large'`,
              default: `'medium'`,
              description: 'Applied to the overflow count. Avatars keep their own size.',
            },
            {
              name: 'gap',
              type: `SpacingToken | \`-\${SpacingToken}\` | number`,
              default: `'-xs'`,
              description:
                'Space between avatars. Negative tokens overlap them — "-xs" pulls each 6px over the one before it.',
            },
            {
              name: 'diameter',
              type: 'number | string',
              description: 'Avatar diameter applied to the whole row. Writes --gr-avatar-size-*.',
            },
          ]}
        />
      </Section>

    </>
  );
}
