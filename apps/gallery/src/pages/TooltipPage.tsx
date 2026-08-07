import { color, spacing, textStyle } from '@gigradar/theme';
import {
  Button,
  ConfirmTooltip,
  HStack,
  Tooltip,
  VStack,
  type TooltipPlacement,
} from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const PLACEMENTS: TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];

/**
 * Space a pinned-open placement example reserves on the side it opens toward.
 *
 * A tooltip is absolutely positioned and contributes no layout space, so the
 * gallery has to hold the room open by hand or the cards collide.
 *
 * `block` clears a title + description card (~76px) plus its 8px offset;
 * `inline` clears the widest the card gets before `maxWidth` wraps it. Both are
 * docs-layout numbers rather than component metrics, which is why they live
 * here and not in the theme.
 */
const PLACEMENT_ROOM = { block: 96, inline: 200 } as const;

/**
 * A tooltip pinned open, for the gallery only.
 *
 * Every preview on this page stays open — a docs page whose examples are
 * invisible until you hover each one is a page you cannot scan.
 *
 * `open` rather than `defaultOpen`: the latter is only an INITIAL state, so a
 * stray click or Escape would dismiss the example and leave the section blank
 * for the rest of the visit. Passing `open` with no `onOpenChange` makes the
 * tooltip fully controlled by a value that never changes, so nothing can close
 * it. `trigger="click"` keeps the anchor from fighting it on hover.
 *
 * Product code should NOT do this: the real default is closed-on-hover, which
 * is what every snippet in the code blocks below shows.
 */
function Shown(props: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip trigger="click" {...props} open />;
}

/**
 * Reserves blank space on the side a pinned-open tooltip opens toward.
 *
 * The card is absolutely positioned and takes no layout space, so on this page
 * — where every example stays open — neighbouring previews would otherwise
 * overlap each other and the section headings. Wrapping an example in the
 * direction it opens holds that room open.
 */
function Room({ toward, children }: { toward: TooltipPlacement; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        paddingTop: toward === 'top' ? PLACEMENT_ROOM.block : 0,
        paddingBottom: toward === 'bottom' ? PLACEMENT_ROOM.block : 0,
        paddingLeft: toward === 'left' ? PLACEMENT_ROOM.inline : 0,
        paddingRight: toward === 'right' ? PLACEMENT_ROOM.inline : 0,
      }}
    >
      {children}
    </div>
  );
}

/** A caption below an example — for tooltips that open upward or sideways. */
function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <VStack gap="xs" alignItems="center">
      {children}
      <div style={{ ...textStyle.sSemibold, color: color.main.description }}>{label}</div>
    </VStack>
  );
}

/** A caption above an example — for tooltips that open downward. */
function Captioned({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <VStack gap="xs" alignItems="center">
      <div style={{ ...textStyle.sSemibold, color: color.main.description }}>{caption}</div>
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
          <HStack gap="xl" alignItems="center">
            <Room toward="top">
              <Shown content="Applies your filters to the search">
                <Button>Apply</Button>
              </Shown>
            </Room>
            <Room toward="bottom">
              <Shown content="Discards this draft. This cannot be undone." placement="bottom">
                <Button variant="secondary">Cancel</Button>
              </Shown>
            </Room>
          </HStack>
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
          <HStack gap="xl" alignItems="flex-start" flexWrap="wrap">
            <Captioned caption="No title — the default">
              <Room toward="bottom">
                <Shown content="Applies your filters to the search" placement="bottom">
                  <Button variant="secondary">Apply</Button>
                </Shown>
              </Room>
            </Captioned>
            <Captioned caption="With a title — the exception">
              <Room toward="bottom">
                <Shown
                  title="Smart Filters"
                  content="Narrows results using the criteria you saved earlier."
                  placement="bottom"
                >
                  <Button variant="secondary">Smart Filters</Button>
                </Shown>
              </Room>
            </Captioned>
          </HStack>
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
          {/* Each cell reserves room on the side its tooltip opens toward. The
              card is absolutely positioned, so it contributes no layout space
              of its own — without this the four overlap each other and their
              captions. The label sits BELOW the anchor for the same reason:
              above is where the `top` tooltip lands. */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing.l,
              width: '100%',
            }}
          >
            {PLACEMENTS.map((placement) => (
              <div
                key={placement}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Room toward={placement}>
                  <Labeled label={placement}>
                    <Shown content="Description" title="Title" placement={placement}>
                      <Button variant="secondary">{placement}</Button>
                    </Shown>
                  </Labeled>
                </Room>
              </div>
            ))}
          </div>
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
          {/* Taller than the other cards — title, body, and a row of buttons —
              so it reserves more room than the shared block step. */}
          <div style={{ paddingBottom: 170 }}>
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
          <HStack gap="xxl" alignItems="flex-start" flexWrap="wrap">
            <Captioned caption="Shown open">
              {/* The confirm card is taller than a tooltip — three bands plus a
                  footer — so it reserves more room than the shared step. */}
              <div style={{ paddingBottom: 150 }}>
                <ConfirmTooltip
                  title="Delete this proposal?"
                  description="This cannot be undone."
                  open
                  onConfirm={() => {}}
                >
                  <Button variant="secondary" tone="danger">
                    Delete proposal
                  </Button>
                </ConfirmTooltip>
              </div>
            </Captioned>

            <Captioned caption="Click it — async confirm">
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
            </Captioned>
          </HStack>
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
        title="Style props"
        description="The tooltip's own metrics and colors, as typed props — the same mechanism the other components use. Reach for size first; these are for genuine one-offs. Note the arrow follows background automatically, so recoloring a tooltip never leaves a white arrow behind."
      >
        <Preview>
          <HStack gap="xl" alignItems="flex-start" flexWrap="wrap">
            <Room toward="bottom">
              <Shown
                content="On a dark surface"
                placement="bottom"
                background={color.navbar.textActive}
                textColor={color.main.white}
              >
                <Button variant="secondary">Dark</Button>
              </Shown>
            </Room>
            <Room toward="bottom">
              <Shown
                content="A title in the heading color"
                title="Neutral"
                titleColor={color.navbar.textActive}
                placement="bottom"
              >
                <Button variant="secondary">Neutral title</Button>
              </Shown>
            </Room>
          </HStack>
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
