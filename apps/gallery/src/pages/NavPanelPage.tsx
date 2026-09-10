import { color, radius, spacing, textStyle } from '@gigradar/theme';
import {
  HStack,
  IconDashboardFill,
  IconInboxFill,
  IconMeetingsFill,
  IconProductTourFill,
  IconSequenceFill,
  IconSettingsFill,
  NavPanel,
  NavPanelItem,
  VStack,
  type NavPanelArea,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

/**
 * The rail as Figma draws it — six product areas in order.
 *
 * Onboarding uses the product-tour glyph as a stand-in: the design draws a
 * handshake that is not in the icon set yet, and `icons/defs.ts` is generated
 * from the Figma icon page rather than edited by hand. Adding it there means
 * adding it to that page first.
 */
const AREAS: NavPanelArea[] = [
  { id: 'onboarding', label: 'Onboarding', icon: IconProductTourFill },
  { id: 'inbox', label: 'Unified Inbox', icon: IconInboxFill, count: 1 },
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboardFill },
  { id: 'sequence', label: 'Sequence', icon: IconSequenceFill },
  { id: 'meetings', label: 'Meetings', icon: IconMeetingsFill },
  { id: 'settings', label: 'Settings', icon: IconSettingsFill },
];

/** The app background, so the rail's white selected plate reads as it does in the product. */
function Stage({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        display: 'inline-block',
        width,
        borderRadius: radius.s,
        backgroundColor: color.main.background,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <div style={{ ...textStyle.sSemibold, color: color.main.description, marginBottom: spacing.xxs }}>
      {children}
    </div>
  );
}

export function NavPanelPage() {
  const [area, setArea] = useState('inbox');
  const [step, setStep] = useState(0);

  return (
    <>
      <PageHeader
        title="Nav panel"
        description="The app's left navigation rail — one entry per product area, each a round icon plate above a label. Figma node 2712:30773."
      />

      <Section
        title="The rail"
        description="Six areas, vertical as the desktop draws it. Click an entry to move the selection; the plate fills white on the area you are in and takes the nav wash under the pointer."
      >
        <Preview>
          <Stage>
            <NavPanel areas={AREAS} selected={area} onSelect={setArea} />
          </Stage>
        </Preview>
        <CodeBlock
          code={`const AREAS = [
  { id: 'inbox', label: 'Unified Inbox', icon: IconInboxFill, count: 4 },
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboardFill },
  // …
];

<NavPanel areas={AREAS} selected={area} onSelect={setArea} />`}
        />
      </Section>

      <Section
        title="Orientation"
        description="Desktop runs the rail down the left edge; mobile lays the same entries along the bottom. One prop rather than two components — the entries, their size, and their states are identical, and only the direction moves."
      >
        <Preview>
          <VStack gap="l" alignItems="flex-start">
            <div>
              <Caption>vertical — desktop</Caption>
              <Stage>
                <NavPanel areas={AREAS.slice(1)} selected="inbox" />
              </Stage>
            </div>
            <div>
              <Caption>horizontal — mobile</Caption>
              <Stage>
                <NavPanel areas={AREAS.slice(1)} selected="inbox" orientation="horizontal" />
              </Stage>
            </div>
          </VStack>
        </Preview>
        <CodeBlock code={`<NavPanel areas={AREAS} orientation="horizontal" />`} />
      </Section>

      <Section
        title="States"
        description="The plate carries the state, not the label. That is what makes the rail scannable: a filled 32px disc reads at a glance where a colour change on 12px text does not."
      >
        <Preview>
          <Stage>
            <HStack gap="s" alignItems="flex-start" style={{ padding: spacing.s }}>
              <VStack gap="xxs" alignItems="center">
                <NavPanelItem label="Settings" icon={IconSettingsFill} />
              </VStack>
              <VStack gap="xxs" alignItems="center">
                <NavPanelItem label="Settings" icon={IconSettingsFill} hovered />
              </VStack>
              <VStack gap="xxs" alignItems="center">
                <NavPanelItem label="Settings" icon={IconSettingsFill} selected />
              </VStack>
            </HStack>
          </Stage>
        </Preview>
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0 }}>
            Left to right: at rest, hovered, selected. Selected wins over hover — the pointer
            resting on the area you are already in should not restyle it as though it were
            somewhere to go.
          </p>
        </div>
      </Section>

      <Section
        title="Unread counter"
        description="A red disc holding the count, overhanging the plate's top-right. Red rather than the counter badge's usual brand blue: the plate already fills with the brand family when selected, so a blue counter over it would read as part of the selection rather than as something waiting."
      >
        <Preview>
          <Stage>
            <HStack gap="s" alignItems="flex-start" style={{ padding: spacing.s }}>
              <NavPanelItem label="Unified Inbox" icon={IconInboxFill} count={1} />
              <NavPanelItem label="Unified Inbox" icon={IconInboxFill} count={12} selected />
              <NavPanelItem label="Unified Inbox" icon={IconInboxFill} count={150} />
              <NavPanelItem label="Unified Inbox" icon={IconInboxFill} count={0} />
            </HStack>
          </Stage>
        </Preview>
        <CodeBlock
          code={`<NavPanelItem
  label="Unified Inbox"
  icon={IconInboxFill}
  count={unread}
  countLabel={\`\${unread} unread messages\`}
/>`}
        />
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0 }}>
            Left to right: one, a two-digit count, an overflowing count, and zero. Counts above 99
            render as <code>99+</code> — the disc is sized rather than padded, so a four-digit
            number would burst it. Zero draws nothing at all: a badge reading “0” pulls the eye
            toward the one area with nothing waiting in it.
          </p>
          <p style={{ marginBottom: 0 }}>
            Pass <code>countLabel</code> to say what is being counted. Without it a screen reader
            announces a bare number, which does not say what is waiting; the fallback is
            “{'{count}'} unread”.
          </p>
        </div>
      </Section>

      <Section
        title="Onboarding"
        description="A walkthrough points at one area at a time. Everything else drops to a tenth — dimmed rather than removed, so the rail keeps its height and the highlighted entry does not jump between steps."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <HStack gap="xs" alignItems="center">
              {AREAS.map((a, index) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setStep(index)}
                  style={{
                    ...textStyle.sRegular,
                    padding: `${spacing.xxs}px ${spacing.xs}px`,
                    borderRadius: radius.xs,
                    border: `1px solid ${color.navbar.hover}`,
                    background: step === index ? color.badge.background : color.main.white,
                    color: step === index ? color.badge.foreground : color.navbar.text,
                    cursor: 'pointer',
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </HStack>
            <Stage>
              <NavPanel areas={AREAS} selected={AREAS[step]?.id} highlight={AREAS[step]?.id} />
            </Stage>
          </VStack>
        </Preview>
        <CodeBlock
          code={`// The step points at an area; the rest fade.
<NavPanel areas={AREAS} selected={area} highlight={step.areaId} onSelect={setArea} />`}
        />
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0 }}>
            The highlighted area does not have to be the selected one — a step can point at
            somewhere the user has not opened yet. Dimmed entries stop taking the pointer, so a
            walkthrough cannot be clicked past sideways.
          </p>
        </div>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'NavPanel ▸ areas', type: 'NavPanelArea[]', description: 'The product areas, in the order they are drawn.' },
            { name: 'NavPanel ▸ selected', type: 'string', description: 'The `id` of the area the user is in.' },
            { name: 'NavPanel ▸ onSelect', type: '(id: string) => void', description: 'Called with the `id` of the area pressed.' },
            { name: 'NavPanel ▸ orientation', type: `'vertical' | 'horizontal'`, default: `'vertical'`, description: 'Down the left edge, or along the bottom.' },
            { name: 'NavPanel ▸ highlight', type: 'string', description: 'Fades every area but this one, for the onboarding walkthrough.' },
            { name: 'NavPanel ▸ label', type: 'string', default: `'Main'`, description: 'Accessible name for the nav landmark.' },
            { name: 'NavPanel ▸ renderArea', type: 'RenderProp', description: 'Replaces one entry. Call `defaultRender()` to decorate.' },
            { name: 'NavPanelItem ▸ label / icon', type: 'ReactNode / IconDef', description: 'The area’s name and glyph.' },
            { name: 'NavPanelItem ▸ selected', type: 'boolean', default: 'false', description: 'Fills the plate white and darkens the label.' },
            { name: 'NavPanelItem ▸ count', type: 'number', description: 'Unread count, drawn as a red disc. Zero or absent draws no badge; above 99 renders as 99+.' },
            { name: 'NavPanelItem ▸ countLabel', type: 'string', description: 'What the count means, for a screen reader. Falls back to "{count} unread".' },
            { name: 'NavPanelItem ▸ counterBackground', type: 'string', description: 'The counter’s fill. Red by default.' },
            { name: 'NavPanelItem ▸ dimmed', type: 'boolean', default: 'false', description: 'Fades the entry to a tenth and stops it taking the pointer.' },
            { name: 'NavPanelItem ▸ hovered', type: 'boolean', description: 'Draws the hover palette regardless of the pointer. For docs and tests.' },
            { name: 'NavPanelItem ▸ renderPlate / renderCounter', type: 'RenderProp', description: 'Replace the icon plate or the counter. Call `defaultRender()` to decorate.' },
          ]}
        />
      </Section>
    </>
  );
}
