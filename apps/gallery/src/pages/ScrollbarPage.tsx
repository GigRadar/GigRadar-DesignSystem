import { color, component, textStyle } from '@gigradar/theme';
import { useScrollbar } from '@gigradar/ui';
import type { ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const FILLER = Array.from({ length: 14 }, (_, i) => `Line ${i + 1} — scroll to see the bar.`);

export function ScrollbarPage() {
  return (
    <>
      <PageHeader
        title="Scrollbar"
        description="The bar every scrolling surface in the product shares. Figma node 2583:25060 — an 8px thumb with a 4px radius, inset 2px from the track's long edges."
      />

      <Section
        title="Vertical"
        description="Scroll the box. The bar replaces the browser default so a scrolling panel matches the rest of the product rather than the operating system."
      >
        <Preview>
          <ScrollBox>{FILLER.map((line) => <p key={line} style={{ margin: 0 }}>{line}</p>)}</ScrollBox>
        </Preview>
        <CodeBlock
          code={`const bar = useScrollbar();

<div {...bar.props} style={{ overflowY: 'auto', maxHeight: 200, ...bar.style }}>
  {bar.styleTag}
  {children}
</div>`}
        />
      </Section>

      <Section
        title="Horizontal"
        description="The same bar rotated — Figma draws both from one component (node 2583:25060), so `size` is the thumb's short edge in either orientation. Nothing extra to pass: the hook sets `width` and `height` on the thumb together, and the browser draws whichever axis actually overflows."
      >
        <Preview>
          <ScrollBox horizontal>
            <div style={{ display: 'flex', gap: 12, width: 'max-content' }}>
              {FILLER.map((line) => (
                <span key={line} style={{ whiteSpace: 'nowrap' }}>
                  {line}
                </span>
              ))}
            </div>
          </ScrollBox>
        </Preview>
        <CodeBlock
          code={`// Identical call — only the overflow axis differs.
const bar = useScrollbar();

<div {...bar.props} style={{ overflowX: 'auto', ...bar.style }}>
  {bar.styleTag}
  {children}
</div>`}
        />
      </Section>

      <Section
        title="Why a hook, not a component"
        description="A scrollbar is not an element you render."
      >
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0, marginBottom: 12 }}>
            The bar belongs to whichever box actually scrolls, and the only way to style it is CSS
            on that box. A <code>&lt;Scrollbar /&gt;</code> element would have nothing to attach to.
          </p>
          <p style={{ margin: 0, marginBottom: 12 }}>
            So the hook returns the three pieces a scrolling element needs.{' '}
            <code>props</code> carries a generated data attribute, so two scrolling boxes on one
            page cannot style each other. <code>style</code> is the Firefox path —{' '}
            <code>scrollbar-width</code> and <code>scrollbar-color</code>, which that engine reads
            and every other ignores. <code>styleTag</code> is the WebKit path — the{' '}
            <code>::-webkit-scrollbar</code> pseudo-elements, which cannot be expressed inline at
            all, and which Firefox ignores in turn.
          </p>
          <p style={{ margin: 0 }}>
            Both paths are always emitted, so the bar looks the same either way.
          </p>
        </div>
      </Section>

      <Section
        title="Tinted"
        description="Override the thumb where a surface needs it — a dark panel, or a bar that has to read against a coloured fill."
      >
        <Preview>
          <ScrollBox thumbColor={color.main.brand}>
            {FILLER.map((line) => <p key={line} style={{ margin: 0 }}>{line}</p>)}
          </ScrollBox>
        </Preview>
        <CodeBlock code={`const bar = useScrollbar({ thumbColor: color.main.brand });`} />
      </Section>

      <Section
        title="Where it is used"
        description="Two components carry it today. Both read the same tokens, so the bar is identical in each."
      >
        <PropsTable
          rows={[
            { name: 'CustomPromptField', type: 'Components ▸ Prompt', description: 'The mono prompt editor, once the text passes its visible height.' },
            { name: 'MentionPresetList', type: 'Components ▸ Preset', description: 'The preset list, once it passes 350px.' },
          ]}
        />
      </Section>

      <Section title="Tokens">
        <PropsTable
          rows={[
            { name: 'component.scrollbar.size', type: '8', description: "Thumb thickness — its short edge in both orientations." },
            { name: 'component.scrollbar.trackInset', type: '2', description: 'Track padding around the thumb, drawn as a transparent border with `background-clip: padding-box`.' },
            { name: 'component.scrollbar.radius', type: '4', description: 'Half the thumb, so it reads as a capsule.' },
            { name: 'component.scrollbar.minLength', type: '42', description: "Figma's drawn thumb length. Browsers enforce their own floor, so this only matters when drawing a bar by hand." },
            { name: 'color.main.scrollbar', type: '#C1C1C1', description: 'The thumb. Browser chrome rather than product color — nothing else should reach for it.' },
          ]}
        />
      </Section>

      <Section title="useScrollbar options">
        <PropsTable
          rows={[
            { name: 'size', type: 'number', default: '8', description: 'Thumb thickness.' },
            { name: 'trackInset', type: 'number', default: '2', description: 'Track padding around the thumb.' },
            { name: 'radius', type: 'number', default: '4', description: 'Thumb corner radius.' },
            { name: 'thumbColor', type: 'string', default: 'color.main.scrollbar', description: 'The bar you drag.' },
            { name: 'trackColor', type: 'string', default: `'transparent'`, description: 'The groove behind it. Transparent by default, so the surface below shows through.' },
          ]}
        />
      </Section>
    </>
  );
}

/**
 * A scrolling box, so the bar has something to appear in.
 *
 * The axis is the only thing that changes between the demos — the hook call is
 * identical in all three, which is the point the sections are making.
 */
function ScrollBox({
  children,
  thumbColor,
  horizontal = false,
}: {
  children: ReactNode;
  thumbColor?: string;
  horizontal?: boolean;
}) {
  const bar = useScrollbar(thumbColor ? { thumbColor } : {});

  return (
    <div
      {...bar.props}
      style={{
        boxSizing: 'border-box',
        // A capped width is what forces horizontal overflow: without it the
        // box grows to fit `max-content` children and never scrolls sideways.
        width: '100%',
        maxWidth: '100%',
        maxHeight: horizontal ? undefined : 200,
        overflowX: horizontal ? 'auto' : undefined,
        overflowY: horizontal ? 'hidden' : 'auto',
        padding: 12,
        borderRadius: component.scrollbar.radius * 3,
        border: `1px solid ${color.navbar.hover}`,
        backgroundColor: color.main.background,
        ...textStyle.mRegular,
        color: color.main.description,
        ...bar.style,
      }}
    >
      {bar.styleTag}
      {children}
    </div>
  );
}
