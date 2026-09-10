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

An Artifact cannot import `@gigradar/ui`. So:

- **Every shipped section is a screenshot** of the gallery rendering the real
  components, drawn back slightly (`opacity: .78`).
- **Only the blocks under review are live HTML**, in their real positions,
  outlined in the brand colour with a small flag.
- **The proposal switcher sits outside the screen**, in a control bar above it,
  alongside what each proposal buys, costs, and does at scale. Inside the screen
  it would read as a control the product ships.

Capture by anchoring on a stable hook rather than guessing the DOM — the
gallery's own nav also looks like "narrow rail beside wide pane":

```tsx
<div data-settings-screen="" style={{ /* … */ }}>
```

Then, over CDP: set `shell.style.height = 'auto'` and the pane's `overflowY` to
`visible` so nothing is clipped, screenshot each pane child by index, and inline
them as `data:` URIs — the Artifact CSP blocks external images. Keep the page
comfortably under 16 MB (`sips -Z 1340` per shot is about right).

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
