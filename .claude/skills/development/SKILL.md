---
name: development
description: "Run the design-system development flow for a new surface: open a PR, build three competing proposals into the gallery behind a DevelopmentPlaceholder, and publish a review Artifact showing the real screen with the proposals live inside it. Use whenever new design work starts — a ticket, a Figma node, a Slack thread — or when the user says 'development', '/development', 'three variants', 'proposals', or asks to design something that does not exist yet. Not for editing a component that already ships."
disable-model-invocation: false
---

# The development flow

New design work is **proposed before it is built**. Three competing proposals go
up for review; one wins; only then does it become a component. This skill runs
that flow end to end.

The rule that generates everything else: **only what is being proposed is new
code. Everything around it is the shipped components.** A hand-built copy of the
surrounding screen means the reviewer is reviewing the copy.

## The five steps

1. **Branch and open a PR** — `design/<ticket>-<slug>`, no changeset, so merging
   publishes nothing.
2. **Build three proposals** in `apps/gallery/src/proposals/<Name>Proposals.tsx`.
3. **Place them in the gallery**, inside a `DevelopmentPlaceholder`, in the real
   screen where they would live.
4. **Publish a review Artifact** — the screen as screenshots, proposals live
   inside it.
5. **After the pick** — the winner moves into `packages/ui` and takes the section
   over; the losers are deleted with the proposals file.

## 1 · Branch and PR

```
git checkout -b design/bf-1234-thing
```

No changeset. `packages/theme` tokens the proposals need are fine to add — they
publish with the winner later, and a design PR that publishes nothing can be
merged or closed freely.

PR body: the problem in the reporter's own words, what is deliberately *not*
being proposed and why, and what happens after the pick. One comment per
decision, each carrying its three proposals with screenshots.

## 2 · Three proposals that actually compete

In `apps/gallery/src/proposals/<Name>Proposals.tsx`, exporting a manifest:

```tsx
export const PROPOSALS: {
  number: number;
  approach: string;    // one line: what makes this one different
  rationale: string;   // why a reviewer might pick it — and what it costs
  render: () => ReactNode;
}[] = [ /* ... */ ];
```

**They must share their data.** One `ACCOUNTS`, one set of copy, one fixture,
used by all three. Proposals that each invent their own content are not
comparable — the reviewer ends up picking between datasets.

**They must differ on one real question.** Name it in the file's doc comment
before writing any of them. "Where does the field live", "how is an account
reached" — a question the reviewer can answer by looking. Three proposals that
differ only in decoration are not a choice.

**Cut proposals that solve problems this user does not have.** A shape that
answers "what if we scale later" against a ticket that says "this is wrong now"
costs the reviewer real attention for nothing.

**Draw each against the sizes it will really meet.** Three accounts and fifty.
What works at three and collapses at fifty is a layout, not a design — a tab
strip and a stack of cards both died this way on BF-4280.

**Nothing new below the proposal itself.** Build from shipped components and
tokens. If a proposal seems to need a new primitive, that is usually a sign the
proposal is inventing a concept rather than arranging existing ones.

**State the honest cost in every `rationale`.** The proposal that reads as
free is the one nobody trusts.

## 3 · Place them in the real screen

Never on a page of their own. Where a section falls is part of what is being
reviewed — an account prompt sits under the team prompt it appends to.

Assemble the screen from shipped components. `apps/gallery/src/demos/settingsScreen.tsx`
is the pattern: `SettingsPanel` for the rail, `SettingsHeader`, one
`SettingsSection` per block, and an `after` prop taking the blocks under review:

```tsx
<SettingsScreen after={{ prompt: <ProposalBlock /> }} />
```

Before writing any surrounding chrome, search for what already ships:

```
grep -n "^export {" packages/ui/src/index.ts | grep -i <thing>
```

Watch for **name collisions with shipped components** — a local helper named
`SettingsPanel` will shadow the real one and send you rebuilding a rail that
already exists. Prefix gallery-local helpers (`ListPanel`, `ListRow`).

Each block under review is a `DevelopmentPlaceholder`, collapsed by default, so
the screen first reads as it will once one proposal has won:

```tsx
<SettingsSection
  title={<HStack gap="xs" alignItems="center">
    Account Prompt<LifecycleBadge stage="development" />
  </HStack>}
  description="…"
>
  <DevelopmentPlaceholder title="…" problem="…" proposalCount={PROPOSALS.length}>
    <VStack gap="l">
      {PROPOSALS.map((p) => (
        <Proposal key={p.number} number={p.number} approach={p.approach} rationale={p.rationale}>
          {p.render()}
        </Proposal>
      ))}
    </VStack>
  </DevelopmentPlaceholder>
</SettingsSection>
```

`SettingsSection` has no `stage` prop — it would be swallowed into a DOM spread.
Put `LifecycleBadge` in the `title`, which takes a `ReactNode`.

## 4 · The review Artifact

Devs review without a checkout, so the Artifact carries the same structure as
the gallery page — **the whole screen, left rail through right pane**.

**BF-4280 is the template.** It is the worked reference for everything below:
`https://claude.ai/code/artifact/a2973812-cb55-44e6-a3ba-9af17f6ccb7a`. Read it
before building a new one rather than re-deriving the shape.

An Artifact cannot import `@gigradar/ui`. So:

- **Every shipped section is a screenshot** of the gallery rendering the real
  components, drawn back slightly (`opacity: .78; filter: saturate(.9)`).
- **Only the blocks under review are live HTML**, in their real positions,
  outlined in the brand colour with a small flag.
- **The proposal switcher sits outside the screen**, in a control bar above it,
  alongside what each proposal buys, costs, and does at scale. Inside the screen
  it would read as a control the product ships.

### The shape

One screen shell, with the frozen sections and the live blocks **interleaved in
their real order**. Not five separate pictures stacked — the reviewer should be
looking at one continuous screen that happens to have holes cut in it:

```html
<div class="controls">      <!-- one control per decision, outside the screen -->
  <div id="ctl-prompt"></div>
  <div id="ctl-autoreply"></div>
</div>

<div class="screen">        <!-- grid: 258px rail + 1fr pane -->
  <aside class="screen-rail"><img class="frozen" src="data:…" alt="…"></aside>
  <div class="screen-pane">
    <img class="frozen" src="data:…" alt="…">   <!-- shipped section -->
    <div class="live" id="sec-account-prompt">  <!-- under review -->
      <div class="live-flag">1 · Account Prompt</div>
      <div class="live-body" id="pane-prompt"></div>
    </div>
    <img class="frozen" src="data:…" alt="…">   <!-- shipped section -->
  </div>
</div>
```

The rail image keeps `opacity: 1` — it is chrome the reader navigates by, and
dimming it makes the screen look disabled rather than photographed.

A `.screen-note` under the shell names which components drew the grey sections
and says plainly that the outlined blocks are live and clickable.

### Each proposal is an object

One array per decision, each entry carrying the three things a reviewer needs
and a `render` that builds into a host element:

```js
var PROMPT = [
  { n: 1, name: 'Opens in the row',
    good:  'The account stays directly above its own field…',
    cost:  'An open prompt pushes the accounts below it off the fold.',
    scale: 'Fifty rows is a long list — but a list is what fifty should look like.',
    render: function (host) { /* build DOM into host */ } },
];
```

`good` / `cost` / `scale` are not optional. A proposal with no stated cost is
the one nobody trusts, and `scale` is what catches the layout that works at
three accounts and dies at fifty.

### They must actually work

The live blocks are prototypes, not pictures: rows open, the search filters, the
mode menus change, the textarea takes input, tabs switch. A reviewer picking
between three shapes has to be able to *use* all three. Keep one tiny `el()`
helper and build with plain DOM — no framework, no CDN.

### Capture

Anchor on a stable hook rather than guessing the DOM — the gallery's own nav
also looks like "narrow rail beside wide pane":

```tsx
<div data-settings-screen="" style={{ /* … */ }}>
```

Then, over CDP: set `shell.style.height = 'auto'` and the pane's `overflowY` to
`visible` so nothing is clipped, screenshot each pane child by index, and inline
them as `data:` URIs — the Artifact CSP blocks external images.

Watch the clip rectangle: a frame wider than the reading well overflows its
wrapper, so clip to the **frame element**, not the wrapper around it, or every
shot comes back cropped to the well's width.

**Shoot at `deviceScaleFactor: 2`.** A shot captured at 1x and displayed near
its natural width is visibly soft — the screenshots sit beside live HTML, and
blurred chrome next to crisp text reads as a broken image rather than a
photograph.

**Squeeze the dead space out before shooting, never crop it after.** A room with
a short thread is mostly empty wash with the composer pinned at the bottom: the
Inbox draws 1588px for about 560px of messages. Cropping to fit the page loses
the composer, which is the part that says the thread can be written into. Set
the screen's own height instead — `frame.style.height = 'auto'` and the screen
to ~900px — and the header, the messages and the composer all survive while only
the blank middle goes.

JPEG at quality 84 rather than PNG — none of these are line art. At 2x a
five-screen page lands around 4 MB, comfortably under the 16 MB cap.

### Chrome

- **Type**: IBM Plex Sans + IBM Plex Mono from Google Fonts, the one host the
  CSP admits. Mono carries the eyebrows, ticket numbers and prop names.
- **Tokens**: lift the palette from `@gigradar/theme` so the live blocks match
  the screenshots beside them. Define the full light set on bare `:root`, then
  redefine only the tokens under `prefers-color-scheme: dark` guarded as
  `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.
- **Header**: ticket eyebrow, title, one-paragraph lede, then pills linking
  JIRA, the PR and the Figma node.
- **Close with `## What happens after the pick`** and an open-questions block —
  what none of the proposals answers, so it gets settled before the pick rather
  than after.

Link the Artifact from the PR body and from each decision comment.

## 5 · After the pick

The winning proposal moves into `packages/ui`, gets a changeset, and takes the
section over with the usual live example, usage snippet and props table — the
way `AccountSafetyNotice` is documented. Delete the losers with the proposals
file and remove the `DevelopmentPlaceholder`.

## Checks before handing it over

- `npx tsc --build` clean.
- `npm run lint` at the repo baseline — currently 30 warnings, 0 errors. The
  `@gigradar/no-hardcoded-values` rule covers `packages/` only, so gallery code
  is on you.
- Every proposal rendered and looked at, not just compiled.
- No changeset on the design PR.

## Worked example

BF-4280 — per-account AI prompt and auto-reply. Two decisions, three proposals
each: `apps/gallery/src/proposals/AccountPromptProposals.tsx`,
`AccountAutoReplyProposals.tsx`, placed by
`apps/gallery/src/pages/ai/PerAccountPromptPage.tsx`.

Its Artifact is the template step 4 points at:
`https://claude.ai/code/artifact/a2973812-cb55-44e6-a3ba-9af17f6ccb7a`

A second one, built to the same flow but for a set of states rather than a
screen of sections: "Stage Update in Room" (Figma 8945:23018) —
`apps/gallery/src/pages/middle/StageUpdatePage.tsx`,
`apps/gallery/src/proposals/StageEventNameProposals.tsx`.

**Not every ticket is a whole flow.** Check what already ships before proposing:
three of that node's five states were already drawn correctly by `RoomEvent`, so
only the two real gaps were worth a reviewer's attention, and only one of those
had a genuine question behind it. Mark the settled states as such on the page —
a reviewer who cannot tell which are open spends their attention re-approving
work that was never in doubt.
