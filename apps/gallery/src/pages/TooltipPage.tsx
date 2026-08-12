import { color, textStyle } from '@gigradar/theme';
import {
  Button,
  ConfirmTooltip,
  HStack,
  Tooltip,
  VStack,
  type TooltipPlacement,
  type TooltipCardRenderProps,
} from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const PLACEMENTS: TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];

/**
 * Room reserved around each placement example.
 *
 * A tooltip is absolutely positioned and takes no layout space, so an open one
 * can overlap whatever sits next to it. The examples open on hover rather than
 * staying pinned, so only ONE card is ever out at a time — the room only has to
 * clear that card, not every card at once.
 *
 * Split because the four sit in a single row: vertical room clears a title +
 * description card, while horizontal room is deliberately tighter, since four
 * columns of it would push the outer two off the content width.
 */
const PLACEMENT_ROOM = { block: 88, inline: 24 } as const;

/**
 * A tooltip example behaving exactly as it would in an app — closed until you
 * hover it.
 *
 * The examples on this page are deliberately NOT pinned open. A docs page that
 * forces them open shows you a picture of a tooltip; leaving them live lets you
 * feel the open delay, the focus behavior, and the dismissal, which is most of
 * what there is to evaluate. The captions say how to trigger each one, so
 * nothing is hidden — see `Hint`.
 */
const Shown = Tooltip;

/**
 * A caption telling the reader how to open the example beneath it.
 *
 * Every preview here is live rather than pinned open, so each one needs to say
 * what to do — otherwise the section looks empty and the reader moves on
 * without ever seeing the component.
 */
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        ...textStyle.sMedium,
        color: color.main.description,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span aria-hidden>↓</span>
      {children}
    </div>
  );
}

/**
 * Holds space around a placement example so an opened card does not land on
 * its neighbours. Only the placement row needs this — the other previews have
 * room to open into already.
 */
function Room({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: `${PLACEMENT_ROOM.block}px ${PLACEMENT_ROOM.inline}px`,
      }}
    >
      {children}
    </div>
  );
}

/** A caption above an example, so variants can be compared side by side. */
function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <VStack gap="xs" alignItems="center">
      <div style={{ ...textStyle.sSemibold, color: color.main.description }}>{label}</div>
      {children}
    </VStack>
  );
}

export function TooltipPage() {
  return (
    <>
      <PageHeader
        title="Tooltip"
        description="A floating label that explains what a control does. Figma node 64:2546 draws one card in four positions — a white 6px-radius panel with a 10×5px arrow aimed at its anchor, carrying an optional title above the text."
      />

      <Section
        title="Quick start"
        description="Wrap the control you want to explain. The tooltip attaches its hover, focus, and aria wiring to that element rather than wrapping it in a div, so it never disturbs your layout."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Hint>Hover either button to show its tooltip.</Hint>
            <div style={{ padding: '60px 0' }}>
              <HStack gap="xl" alignItems="center">
                <Shown content="Applies your filters to the search">
                  <Button>Apply</Button>
                </Shown>
                <Shown content="Discards this draft. This cannot be undone." placement="bottom">
                  <Button variant="secondary">Cancel</Button>
                </Shown>
              </HStack>
            </div>
          </VStack>
        </Preview>
        <CodeBlock
          code={`import { Tooltip, Button } from '@gigradar/ui';

// The common case — one line explaining the control. No title.
<Tooltip content="Applies your filters to the search">
  <Button onClick={apply}>Apply</Button>
</Tooltip>`}
        />
      </Section>

      <Section
        title="With and without the title — pick one deliberately"
        description="The title is OPTIONAL, and most tooltips should not have one. Reach for content alone when you are answering 'what does this control do' — that is the overwhelming majority of tooltips, and a title turns a one-line label into a small dialog that takes longer to read. Add a title only when the tooltip explains a NAMED thing worth repeating: a feature callout, an onboarding hint, a term the user may not know. If you cannot say what the title adds beyond the first few words of the content, it does not belong."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Hint>Hover each button to compare them.</Hint>
            <div style={{ paddingBottom: 110 }}>
              <HStack gap="xl" alignItems="flex-start" flexWrap="wrap">
                <Labeled label="No title — the default">
                  <Shown content="Applies your filters to the search" placement="bottom">
                    <Button variant="secondary">Apply</Button>
                  </Shown>
                </Labeled>
                <Labeled label="With a title — the exception">
                  <Shown
                    title="Smart Filters"
                    content="Narrows results using the criteria you saved earlier."
                    placement="bottom"
                  >
                    <Button variant="secondary">Smart Filters</Button>
                  </Shown>
                </Labeled>
              </HStack>
            </div>
          </VStack>
        </Preview>
        <CodeBlock
          code={`// ── DEFAULT: no title. Use this unless you have a reason not to. ──────
// "What does this button do?" — the answer is one line, so it is one line.
<Tooltip content="Applies your filters to the search">
  <Button onClick={apply}>Apply</Button>
</Tooltip>

<Tooltip content="Archived proposals stay searchable for 90 days">
  <Icon icon={IconInfo} size={16} />
</Tooltip>

// ── EXCEPTION: with a title. Naming a feature the user is meeting. ────
// The title is drawn in the badge blue and reads as a heading, so
// it earns its place only when the NAME is the point.
<Tooltip
  title="Smart Filters"
  content="Narrows results using the criteria you saved earlier."
>
  <Button>Smart Filters</Button>
</Tooltip>

// ── DON'T: a title that just restates the content. ────────────────────
<Tooltip title="Apply" content="Applies your filters" />   // ✗ says it twice`}
        />
      </Section>

      <Section
        title="Placement"
        description="Four positions, named for where the TOOLTIP sits — top puts the card above the anchor with its arrow pointing down. Figma names the same four from the arrow's side (Up, Bottom, Left, Right); these names match what every popover library uses, so placement='top' does what you expect."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Hint>Hover each button to see where its card opens.</Hint>
            {/* One row, always — the four placements are meant to be compared
                side by side, and an auto-fit grid wraps them into a 2×2 at this
                content width, which reads as a stack rather than a comparison.
                Each cell holds room on all four sides because the card is
                absolutely positioned and takes no layout space, so without it an
                opened tooltip lands on its neighbours. */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${PLACEMENTS.length}, 1fr)`,
                width: '100%',
              }}
            >
              {PLACEMENTS.map((placement) => (
                <div
                  key={placement}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Room>
                    <Labeled label={placement}>
                      <Shown
                        content="Description"
                        title="Title"
                        placement={placement}
                        // The sideways cards open into their column rather than
                        // above or below it, so they are capped to fit one.
                        // Without this a 260px card overflows a ~243px column
                        // and lands on the example beside it.
                        maxWidth={placement === 'left' || placement === 'right' ? 150 : undefined}
                      >
                        <Button variant="secondary">{placement}</Button>
                      </Shown>
                    </Labeled>
                  </Room>
                </div>
              ))}
            </div>
          </VStack>
        </Preview>
        <CodeBlock
          code={`<Tooltip content="…" placement="top">    {/* default */}
<Tooltip content="…" placement="bottom">
<Tooltip content="…" placement="left">
<Tooltip content="…" placement="right">`}
        />
      </Section>

      <Section
        title="With actions"
        description="Pass actions and the tooltip stops being a hover label: it opens on click and stays open, because the pointer has to travel to the buttons and any gap on the way would close it. This is Figma's Apply / Later pair — an onboarding nudge rather than a description."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Hint>
              Click “Show me” — this one opens on click, because it has buttons to reach.
            </Hint>
            {/* Taller than the other cards — title, body, and a row of buttons. */}
            <div style={{ paddingBottom: 180 }}>
              <Shown
                title="New: Saved Views"
                content="Pin the filters you use most and jump back to them in one click."
                placement="bottom"
                actions={
                  <>
                    <Button size="small" onClick={() => {}}>
                      Apply
                    </Button>
                    <Button
                      size="small"
                      variant="secondary"
                      background={color.navbar.disabledBackground}
                      borderColor={color.navbar.disabledBackground}
                      textColor={color.navbar.textActive}
                    >
                      Later
                    </Button>
                  </>
                }
              >
                <Button variant="secondary">Show me</Button>
              </Shown>
            </div>
          </VStack>
        </Preview>
        <CodeBlock
          code={`// Actions flip the trigger to click automatically — a hover tooltip you
// cannot reach with the pointer is a tooltip you cannot use.
<Tooltip
  title="New: Saved Views"
  content="Pin the filters you use most and jump back to them in one click."
  actions={
    <>
      <Button size="small" onClick={enable}>Apply</Button>
      <Button size="small" variant="secondary" onClick={dismiss}>Later</Button>
    </>
  }
>
  <Button>Show me</Button>
</Tooltip>`}
        />
      </Section>

      <Section
        title="Trigger and control"
        description="Hover is the default and opens after a short delay — that delay is what stops tooltips flashing as the pointer crosses a toolbar. Focus always opens immediately, so keyboard users reach the content too. Pass trigger='click' for touch, where there is no hover at all."
      >
        <CodeBlock
          code={`// Hover (default). Opens after ~150ms; focus opens it instantly.
<Tooltip content="Archived 3 days ago">…</Tooltip>

// Click — the right choice on touch, and whenever the tooltip is a nudge.
<Tooltip content="…" trigger="click">…</Tooltip>

// Controlled, when the tooltip is driven by something other than the pointer
// (a product tour, a first-run flag).
<Tooltip content="…" open={showHint} onOpenChange={setShowHint}>…</Tooltip>

// Tuning the delay, or turning the tooltip off entirely.
<Tooltip content="…" openDelay={400}>…</Tooltip>
<Tooltip content="…" disabled={!hasExplanation}>…</Tooltip>`}
        />
      </Section>

      <Section
        title="Confirmation — a different component"
        description="Deleting something uses ConfirmTooltip, not Tooltip. Figma draws it differently (node 1272:11979): a wider card built as three bands — a title, a message, and a right-aligned footer holding Cancel and Remove — with no arrow and a tighter shadow. The behavior differs more than the look does. A tooltip is passive, appears on hover, and is inert to the pointer; this is a small dialog that opens on click and traps a decision. Folding them together would mean a component whose most important behaviors flip on whether a prop was passed."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Hint>
              Click a delete button to open its confirmation. Escape or a click outside dismisses
              it.
            </Hint>
            {/* The confirm card is taller than a tooltip — three bands plus a
                footer — so it holds more room than a plain example. */}
            <div style={{ paddingBottom: 170 }}>
              <HStack gap="xxl" alignItems="flex-start" flexWrap="wrap">
                <Labeled label="Sync — closes on confirm">
                  <ConfirmTooltip
                    title="Delete this proposal?"
                    description="This cannot be undone."
                    onConfirm={() => {}}
                  >
                    <Button variant="secondary" tone="danger">
                      Delete proposal
                    </Button>
                  </ConfirmTooltip>
                </Labeled>

                <Labeled label="Async — spins until it settles">
                  <ConfirmTooltip
                    title="Remove member?"
                    description="They will lose access immediately."
                    confirmLabel="Remove"
                    onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
                  >
                    <Button variant="secondary" tone="danger">
                      Remove member
                    </Button>
                  </ConfirmTooltip>
                </Labeled>
              </HStack>
            </div>
          </VStack>
        </Preview>
        <CodeBlock
          code={`import { ConfirmTooltip, Button } from '@gigradar/ui';

// The anchor is the button that STARTS the deletion; ConfirmTooltip draws
// the Cancel / Remove pair for you.
<ConfirmTooltip
  title="Delete this proposal?"
  description="This cannot be undone."
  onConfirm={deleteProposal}
>
  <Button variant="secondary" tone="danger">Delete proposal</Button>
</ConfirmTooltip>

// Return a promise and the popover stays open with the button spinning
// until the work settles — so the user sees it happen rather than watching
// the card vanish and wondering whether it took.
<ConfirmTooltip
  title="Remove member?"
  description="They will lose access immediately."
  onConfirm={async () => { await api.removeMember(id) }}
>
  <Button variant="secondary" tone="danger">Remove</Button>
</ConfirmTooltip>`}
        />
      </Section>

      <Section
        title="Confirm, or a modal?"
        description="ConfirmTooltip is a popover, not a modal: it does not dim the page or trap focus, because it confirms one row's deletion in place. That is right for a delete button in a table row or a card. For something irreversible and far-reaching — closing an account, deleting a workspace — a real modal is the correct control, since the interruption is the point."
      >
        <CodeBlock
          code={`// ✓ In place, scoped to one row — a popover.
<ConfirmTooltip title="Delete this draft?" onConfirm={remove}>
  <Button variant="secondary" tone="danger" size="small">Delete</Button>
</ConfirmTooltip>

// ✗ Page-level and irreversible — this wants a modal, not a popover.
<ConfirmTooltip title="Delete workspace?" onConfirm={nukeEverything}>…`}
        />
      </Section>

      <Section
        title="Writing the content"
        description="A tooltip is read mid-task, usually while the pointer is already moving. Keep it to a sentence. Say what the control does or what the state means — not what the user should do, which the label already covers."
      >
        <CodeBlock
          code={`// ✓ Explains what happens.
<Tooltip content="Sends the proposal and moves it to Sent" />
<Tooltip content="Archived 3 days ago by Maria" />

// ✗ Restates the label — the user can already read the button.
<Tooltip content="Click to send" />

// ✗ Too long to read mid-task. This is documentation, not a tooltip.
<Tooltip content="Sending a proposal will move it into the Sent stage, where…" />`}
        />
      </Section>

      <Section
        title="Positioning, and its one limit"
        description="The card is positioned against the anchor rather than rendered through a portal, which keeps the component self-contained and dependency-free. The trade: an ancestor with overflow: hidden can clip it. For a tooltip's usual homes — a toolbar, a table cell, a form row — that is fine. Inside a scroll container that clips it, place the tooltip on an element outside that container, or pick a placement that opens into open space."
      >
        <CodeBlock
          code={`// If a tooltip is being clipped, the container is the reason — not the
// placement. Move the anchor out, or open toward the space that exists.
<Tooltip content="…" placement="right">…</Tooltip>`}
        />
      </Section>

      <Section
        title="Custom card"
        description="renderCard replaces the card while the tooltip keeps its positioning, its hover and focus wiring, and its ARIA relationships. This is the render-prop convention the higher-level components share — the parts that are hard to get right stay with the component, and the composition becomes yours. Low-level components like Button and Badge deliberately do not have this."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Hint>Hover each button.</Hint>
            <div style={{ paddingBottom: 90 }}>
              <HStack gap="xl" alignItems="flex-start" flexWrap="wrap">
                <Shown
                  content="Save changes"
                  placement="bottom"
                  renderCard={({ content }: TooltipCardRenderProps) => (
                    <HStack
                      gap="xs"
                      alignItems="center"
                      px="s"
                      py="xs"
                      radius="xs"
                      background={color.navbar.textActive}
                    >
                      <span style={{ ...textStyle.sMedium, color: color.main.white }}>{content}</span>
                      <kbd
                        style={{
                          ...textStyle.sMedium,
                          color: color.main.white,
                          background: 'rgba(255,255,255,0.18)',
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontFamily: 'inherit',
                        }}
                      >
                        ⌘S
                      </kbd>
                    </HStack>
                  )}
                >
                  <Button variant="secondary">Replaced</Button>
                </Shown>
                <Shown
                  content="Wrapped, not replaced"
                  placement="bottom"
                  renderCard={({ defaultRender }: TooltipCardRenderProps) => (
                    <span style={{ display: 'block', outline: `2px dashed ${color.main.brand}`, borderRadius: 8 }}>
                      {defaultRender()}
                    </span>
                  )}
                >
                  <Button variant="secondary">Wrapped</Button>
                </Shown>
              </HStack>
            </div>
          </VStack>
        </Preview>
        <CodeBlock
          code={`// Replace the card when it must hold something the props have no slot for
// — a keyboard shortcut, a thumbnail, a chart.
<Tooltip
  content="Save changes"
  renderCard={({ content }) => (
    <HStack gap="xs" px="s" py="xs" radius="xs" background={color.navbar.textActive}>
      <Text>{content}</Text>
      <kbd>⌘S</kbd>
    </HStack>
  )}
>
  <Button>Save</Button>
</Tooltip>

// Or call defaultRender() to DECORATE rather than replace — the common case,
// and the one that keeps tracking the design system as the card evolves.
<Tooltip
  content="Wrapped"
  renderCard={({ defaultRender }) => <Highlight>{defaultRender()}</Highlight>}
>
  <Button>Save</Button>
</Tooltip>

// If the existing props already cover it, use them. A render prop that only
// reproduces the default is a copy that stops receiving design updates.`}
        />
      </Section>

      <Section
        title="Style props"
        description="The tooltip's own metrics and colors, as typed props — the same mechanism the other components use. Reach for size first; these are for genuine one-offs. Note the arrow follows background automatically, so recoloring a tooltip never leaves a white arrow behind."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Hint>Hover each button.</Hint>
            <div style={{ paddingBottom: 110 }}>
              <HStack gap="xl" alignItems="flex-start" flexWrap="wrap">
                <Shown
                  content="On a dark surface"
                  placement="bottom"
                  background={color.navbar.textActive}
                  textColor={color.main.white}
                >
                  <Button variant="secondary">Dark</Button>
                </Shown>
                <Shown
                  content="A title in the heading color"
                  title="Neutral"
                  titleColor={color.navbar.textActive}
                  placement="bottom"
                >
                  <Button variant="secondary">Neutral title</Button>
                </Shown>
              </HStack>
            </div>
          </VStack>
        </Preview>
        <CodeBlock
          code={`// One-offs only. If the same override recurs, it belongs in the theme.
<Tooltip background={color.navbar.textActive} textColor={color.main.white} />
<Tooltip titleColor={color.navbar.textActive} />  // a neutral title
<Tooltip maxWidth={200} offset={12} hideArrow />`}
        />
      </Section>

      <Section title="Tooltip props">
        <PropsTable
          rows={[
            { name: 'content', type: 'ReactNode', description: 'The tooltip body. Required — a tooltip with no title is just this.' },
            { name: 'title', type: 'ReactNode', description: 'Optional heading in the badge blue. Most tooltips should NOT have one — see the section above.' },
            { name: 'children', type: 'ReactElement', description: 'The control being explained. A single element that accepts props.' },
            { name: 'placement', type: `'top' | 'bottom' | 'left' | 'right'`, default: `'top'`, description: 'Which side of the anchor the card sits on.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Padding, gap, and type size. Medium is the drawn size.' },
            { name: 'actions', type: 'ReactNode', description: 'Buttons below the content. Flips the trigger to click.' },
            { name: 'trigger', type: `'hover' | 'click'`, default: `'hover'`, description: `Click when actions are passed. Use click on touch.` },
            { name: 'open / defaultOpen', type: 'boolean', description: 'Controlled and uncontrolled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the tooltip opens or closes.' },
            { name: 'openDelay', type: 'number', default: '150', description: 'Milliseconds before a hover opens it. Focus is always instant.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Renders the anchor with no tooltip at all.' },
            { name: 'hideArrow', type: 'boolean', default: 'false', description: 'Drops the arrow, leaving a detached card.' },
            { name: 'paddingX / paddingY / gap / radius', type: 'number | string', description: "The card's own metrics." },
            { name: 'fontSize / titleFontSize / maxWidth', type: 'number | string', description: 'Type sizes, and the width at which text wraps.' },
            { name: 'offset', type: 'number', default: '8', description: 'Distance between the anchor and the card.' },
            { name: 'background / textColor / titleColor', type: 'string', description: 'Card fill (the arrow follows it), body color, and title color. The title defaults to the badge blue.' },
          ]}
        />
      </Section>

      <Section title="ConfirmTooltip props">
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactElement', description: 'The control that opens the confirmation — usually the delete button.' },
            { name: 'title', type: 'ReactNode', default: `'Are you sure?'`, description: 'The heading. Ask the question here.' },
            { name: 'description', type: 'ReactNode', description: 'What is about to happen, and whether it can be undone.' },
            { name: 'confirmLabel', type: 'string', default: `'Remove'`, description: 'Label on the destructive button.' },
            { name: 'cancelLabel', type: 'string', default: `'Cancel'`, description: 'Label on the dismissing button.' },
            { name: 'onConfirm', type: '() => void | Promise<unknown>', description: 'Runs on confirm. Return a promise to keep the popover open and spinning until it settles.' },
            { name: 'onCancel', type: '() => void', description: 'Called when dismissed without confirming.' },
            { name: 'placement', type: `'top' | 'bottom' | 'left' | 'right'`, default: `'bottom'`, description: 'Which side of the anchor the card sits on.' },
            { name: 'align', type: `'center' | 'start'`, default: `'center'`, description: 'Where the card sits on the cross axis. `start` pins its leading edge to the anchor’s — for a card taller than its anchor inside a scroll container, where centring would push half of it out of view and get it clipped.' },
            { name: 'open / defaultOpen', type: 'boolean', description: 'Controlled and uncontrolled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the popover opens or closes.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Renders the anchor with no confirmation at all.' },
            { name: 'width / radius / paddingX', type: 'number | string', description: "The card's own metrics. Figma draws 219px wide." },
            { name: 'titleFontSize / fontSize', type: 'number | string', description: 'Title and message type sizes.' },
            { name: 'background / titleColor / textColor', type: 'string', description: 'Card fill, title color, and message color.' },
            { name: 'offset', type: 'number', default: '8', description: 'Distance between the anchor and the card.' },
          ]}
        />
      </Section>
    </>
  );
}
