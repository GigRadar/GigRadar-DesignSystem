# @gigradar/theme

## 2.0.0

### Major Changes

- 80a7d67: **Breaking:** the package scope is now `@gigradar`.

  The design system moved to the GigRadar organization, so the packages are
  renamed from `@uiuxjoseph/*` to `@gigradar/*`. The ESLint rule prefix follows
  the package name, so the rules become `@gigradar/no-hardcoded-values` and
  `@gigradar/no-direct-antd-import`.

  Consuming apps need one find-and-replace and an `.npmrc` routing line pointing
  `@gigradar` at GitHub Packages. The old `@uiuxjoseph/*` versions stay
  published, so nothing breaks until an app chooses to move.
  See docs/handoff-to-gigradar-org.md.

- 6ee8a64: Add the components CRM ▸ Settings ▸ Upwork API Key is built from.

  `TextField` is the system's single-line input — the first one the design system
  has — carrying its own label, a `secret` mode with a reveal control, and an
  `error` prop that takes either a flag or a message. It sits under Components ▸
  Main because nothing about it knows what a CRM is.

  `ApiStatus` is the card above the credential form: six states on one shape, with
  the detail rows passed as data so the divider, the spacing, and the secret
  masking are the component's job rather than each screen's. `TestStatus` reports
  what a key test came back with, `RemoveApiButton` is the strip that closes the
  card, and `ViewGuide` and `RentApiBanner` are the two reference cards.

  `UpworkApiKey` assembles them into the screen. `show` draws one column or both,
  mirroring `UpworkColumns` on the connected-accounts screen rather than inventing
  a second vocabulary for the same idea — each column is a coherent unit, and
  rendering one should not mean rendering the other and cropping it. Figma draws five states and all
  five are this one composition with parts switched off — `loading` swaps the
  blocks for skeletons, `hideForm` drops the form once a key is saved, and
  `testTone` drives both the result strip and whether the actions are live — so
  there is no variant prop.

  **Breaking:** `color.navbar.textActive` is renamed `color.navbar.text2`, matching
  Figma's "NavBar/Text-2". The old name described a nav state, but the color is
  drawn on plenty of things that are not nav items — a settings card's label, a
  detail row's value — so it named only the first place it was used.

  The old name is removed outright rather than kept as an alias, so an app reading
  `color.navbar.textActive` (or the `--gr-color-navbar-text-active` custom
  property) fails to compile until it is updated. Values are unchanged — `text`
  #6C82A4, `text2` #2D323E — so nothing repaints; the 43 usages in this repo are
  migrated.

  `RemoveApiButton` draws in `status.error` rather than the deprecated `errorAlt`
  red Figma paints it with, which shifts it one step. It is the only place these
  components depart from the drawing.

  Adds a `borderWidth` scale — `hairline` 0.5, `thin` 1, `medium` 1.5, `thick` 2 —
  and moves the twenty raw `1px solid` borders across the package onto `thin`.
  Not from the Figma guidebook, which documents no border scale; these are the
  widths the components were already drawing, given names, so retuning the
  hairline is one edit rather than twenty. No visual change.

  The status card's detail rows carry an accepted drift from the drawing: Figma
  paints them #516F90 / #33475B as raw hex bound to no style, and they are built
  from the nav text pair (#6C82A4 / #2D323E) instead — a step lighter in both
  cases. The design system is the authority, and a two-off pair does not earn
  tokens of its own.

### Minor Changes

- 0a177a0: Add the components CRM ▸ Settings ▸ AI Configuration is built from.

  `AutoReply` and its parts — `AutoReplyModeTab`, `AutoReplyButton`, `ModeBadge` —
  draw the reply-mode card. `MentionPreset` and `MentionPresetList` are the
  @-mention snippets and the card that orders them. `AiTool` and `AiToolBadge` are
  the capability rows. `Radio` is a separate control from `Checkbox` rather than a
  variant of it: the difference is the semantics, not the glyph.

  `useScrollbar` is a hook rather than a component, because a scrollbar belongs to
  whichever box actually scrolls and the only way to style it is CSS on that box —
  a `<Scrollbar />` element would have nothing to attach to. It returns the three
  pieces a scrolling element needs: a scoped data attribute, the Firefox
  properties, and the WebKit pseudo-element rules.

  `Button` gains the `third` variant — quiet chrome that fills with the nav grey
  on hover instead of tinting its border — and every size now sets `min-height`
  from `controlHeight`, so a row mixing inputs, pills, and buttons lines up without
  hand-derived padding. `ConfirmTooltip` gains
  `align`, which pins the card's leading edge to its anchor's: a card taller than
  its anchor centres half of itself outside a scroll container, which then clips
  it.

- 4481ae5: Add four badge components, each in three sizes.

  `CreditBadge` (Figma 1282:28608), `EyebrowBadge` (163:10), `CounterBadge`
  (313:6469), and `RankBadge` (333:15163). They are separate components rather
  than variants of one — a credit amount, an AI eyebrow, an unread count, and a
  rank with its direction of travel share a pill shape but nothing else.

  Figma draws only the medium step of each; small and large extend those scales
  proportionally.

  Also extracts the duplicated `len` / `CssLength` helper from Button and Avatar
  into a shared internal module.

- 7549c51: Fix the post-authorization "What Next?" copy and give the terminal states a
  route out (BF-3969).

  The success popup listed four things connecting an Upwork account would let you
  do — sync jobs and contracts, manage proposals, track earnings and time — none
  of which the CRM does. It now lists what connecting actually enables today.

  Both terminal states gain a footer action: success routes to the Inbox, failure
  offers a retry. A terminal state with nothing to press was the other half of the
  defect.

  The card now states its outcome once. It said it three times — in the head's
  title, again in a large centred status disc, and a third time in the description
  under that. The glyph and the heading carry the outcome, the description explains
  it, and the disc is gone. This drops `title`, `subtitle`, `countdown`, and the
  metrics that only positioned the disc; `heading`, `description`, `panelTitle`,
  and `steps` still override the copy.

  Panel rows are dotted rather than numbered. A numbered disc puts a row at a
  position in an order, which none of these lists claims: success offers two
  alternatives, failure lists candidate causes of one failure, and the progress
  rows are reminders rather than a checklist. Success also offers its second route
  as a button — `onConnectAnother`, drawn `secondary` beside `onGoToInbox` — and
  the retry takes the danger tone.

  Also adds `ModalCard`, `ModalHeader`, `ModalContent`, and `ModalFooter` —
  the dialog shell from Figma node 2077:8840, extracted so every dialog is built
  from the same three bands rather than each redrawing them.

- 7549c51: Add `LifecycleBadge`, and the modal header props the in-development proposals
  needed.

  `LifecycleBadge` marks how far along a component is — `stable`, `development`,
  or `deprecated` — so the gallery can show something that is built but not yet
  approved without it reading as ready to use.

  `ModalHeader` gains `closeSize`, `reserveCloseSpace`, and `titleWidth`. The
  first two keep a header the same height whether or not it carries a close
  button, which matters on a dialog that gains one as it resolves; the third lets
  a header whose title block carries its own right-aligned content reach the
  card's edge.

- 934c1e4: Add the components CRM ▸ Inbox is built from.

  `InboxList` is the left column — the header, the account picker, the search
  band, and the connection pill pinned to the foot — and takes the rooms as
  children. The six states Figma draws for the column (default, load rooms, empty,
  first load, searching, onboarding) are what the caller passes in rather than
  variants of the frame: they differ in what fills the list, not in how the frame
  is drawn.

  `InboxEmpty`, `InboxLoading`, and `InboxOnboarding` are those fillers, exported
  so a screen does not reinvent them. `InboxEmpty` covers both "no conversations"
  and "no matches" — the card is identical and only the words differ.
  `InboxLoading` draws its rows through `InboxRoom`'s own `loading` state, so the
  placeholder and the real card cannot drift in height, which is the entire point
  of a skeleton. `InboxOnboarding` is deliberately separate from `InboxLoading`:
  one waits on a request returning in a moment, the other on a job long enough to
  need its stages named, and skeleton rows there would promise rooms that are not
  coming yet.

  `InboxRoom` is one conversation. Every line is clamped to one row and the card's
  height is fixed, so a long job title and a long message cannot push the next
  room down the list — scanning depends on the rows staying where the eye expects
  them.

  Its Figma states (node 43:3835) are modelled as axes rather than a single
  union: how the card is being read (`selected`, plus hover), whether the list is
  picking (`selecting` and `checked`), and whether the room is unavailable
  (`disabled`, `error`, `loading`). A union would make "selected and scheduled" or
  "ticked while erroring" unrepresentable when both really occur. In selection
  mode the unread counter gives way to a round tick and the sender drops off the
  preview, because the row stops being about who spoke last. `scheduled` marks a
  room that already carries a queued message.

  Hover fills the card with the badge tint and drops its border — the border is
  matched to the fill rather than removed, so the card does not shift by a pixel
  as it lights up. Figma also draws two quick actions on hover (reply, open job
  post); those are left out until the screen has somewhere for them to go.

  `selecting` is a boolean rather than a mode. Figma draws a second, purple set
  for picking rooms to schedule a message to, but the column has no action that
  starts that flow, so shipping the mode would be shipping a state nothing can
  reach.

  `InboxRoom` takes an `account` — which connected account (the BM) handles the
  room — and draws it as a mini avatar in the client avatar's corner. That mark is
  what makes the combined "All accounts" inbox readable: with every account's
  rooms interleaved, it is the only thing saying who owns a conversation.
  Filtering the list to one account through the selector is the same question
  asked the other way round, so the two were built together. It is an object
  carrying a name rather than a bare URL, since a photo with no alt text tells a
  screen reader nothing about who is handling the room.

  `HighlightedText` marks the search query inside a string, and `InboxRoom` takes
  a `query` that runs the title and preview through it. The solid
  `color.main.highlightSolid` is used rather than the translucent `highlight`:
  these matches sit on cards whose own fill changes — white, hover grey, brand
  blue when selected — and a translucent wash would come out a different color on
  each. Rendered as `<mark>`, so the highlight carries to a screen reader instead
  of being decoration only sighted users can act on; the query is escaped before
  matching, so searching for "C++" finds something rather than throwing.

  `InboxSelector` and `InboxAccountRow` pick which connected account is showing.
  The combined "All accounts" view is a real option rather than the absence of a
  filter, so it appears in the list alongside the accounts. An account whose token
  has expired stays listed but grays out, and its unread count is replaced by a
  reconnect prompt — a count that cannot change is not worth showing.

  `AdvancedSearch` is the filter panel, with `InboxSearchField`, `MarkAsReadButton`,
  and `FilterChip` as its parts. It takes `defaultExpanded`, naming which of the
  three filter rows starts open — one name rather than a set, because only one row
  is open at a time. Applied filters are summarised as chips along the
  top rather than only inside the rows that set them: once a row is collapsed its
  selections are out of sight, and a filter you cannot see is one you forget is on.
  The chips are also where a filter is removed.

  The column's smaller marks are exported too, rather than living inline in
  whatever draws them: `StagePill` (a lead's pipeline stage, taking a tone from
  `color.stageFlat` so it stays presentational), `SelectTick` (the drawn checkbox
  every selectable row shows — round on a room card, square in the filter panel),
  `ScheduleMark` (the purple clock on a room with a queued message), and
  `NotificationToggle` (the header's bell switch, Figma node 1135:16742). Each was
  duplicated across two or three call sites before; each is now one definition
  that a screen outside the Inbox can also reach for.

  `SelectTick` is deliberately not `Checkbox`: every row it appears in is already
  a `<button>`, and a real `<input type="checkbox">` nested in a button is invalid
  markup whose click the row then swallows. The row carries `aria-pressed`, so the
  state still reaches a screen reader.

  `NotificationToggle` grows to 60×36 with a 28px handle, and draws the filled
  bell in both states — colour carries on/off, because an outline bell at that
  size reads as a smudge beside the filled one. The account dropdown's "Connect
  another account" row gains a hover state, taking the same nav tint the account
  rows above it use — it is the last row of that list, not a separate control.

  `PushNotificationToggle` wraps `NotificationToggle` with the two behaviours that
  only make sense together: a hover explainer (Figma node 2426:155901 in the CRM
  file) and asking the browser for permission on the way on. The bare toggle stays
  the right component wherever permission is already settled and no explanation is
  owed. If the browser blocks the request the switch returns to off rather than
  lying about a channel that will deliver nothing, and a newly granted permission
  fires one sample notification so the person sees what they just enabled.

  `Tooltip` gains `align` — `center` (the default, what Figma draws), `start`, or
  `end`. A card much wider than its anchor centres half its width past the
  anchor's edge, and against the side of a column that half is clipped; the new
  values pin the matching edges together instead. `ConfirmTooltip` already had a
  narrower version of this for the vertical axis.

  `PlanBadge` names the subscription the workspace is on — Figma node 4016:22052.
  Filed with the badges rather than with the Inbox because nothing about it is
  inbox-shaped; the header it sits in is just the only screen showing a plan today.

  `ConnectionIndicator` and `SignalIcon` report the websocket. Four states rather
  than a boolean, because "not receiving messages" means three different things to
  the person reading it: offline is expected, error is not, and syncing is
  temporary. Only error asks for action.

  `SelectionBar` is the row shown while the list is in selection mode. It reads off
  `selectedCount` rather than taking a state prop — Figma's three states are all
  derived from the count, and the count is what the caller already has.

  `DatePicker` is filed under the generic tier: a calendar knows nothing about
  conversations, even though the inbox's date filter is what prompted it. Figma's
  four variants are the halves of one interaction rather than four separate states
  — first click sets the start, second sets the end, third starts over — so that
  state machine lives in the component and every range filter behaves the same way.
  Two months by default, because the ranges people pick routinely straddle a month
  boundary.

- 7549c51: Add `LifecycleBadge` — the marker that says whether a component is part of the
  design system yet.

  Three stages (`stable`, `development`, `deprecated`) and three variants
  (`solid`, `subtle`, `outline`), one per place the marker appears: a page
  heading, a section inside an already-marked page, and a sidebar row.

  The gallery's `Section` takes a `stage` prop that draws it. A component shown
  as `development` is built and visible but not approved; it graduates when its
  pull request is reviewed and merged, and the marker comes off.

- 934c1e4: Add the chat room's header — the first components of CRM ▸ Inbox ▸ Middle.

  `ChatHeader` is the band across the top of the conversation (Figma node
  3523:37230). Figma draws it as four variants across two axes, and it is built as
  two independent props rather than one four-way union: `layout` (`desktop` /
  `mobile`) is decided by the shell, and `scheduled` by the surface. A single
  `variant` string would make every caller reassemble it from two facts it already
  holds separately, and would make "mobile and scheduled" a name to remember
  rather than a combination that falls out.

  `layout="mobile"` is not the desktop header narrowed. A back chevron replaces
  the sidebar toggle, the meta tags keep their glyph and drop their label, and the
  three trailing controls collapse to one info button — at 402px there is room for
  a mark but not for a name.

  The header draws none of its own controls. Each interactive part is its own
  exported component, because each is the same decision wherever a header band is
  drawn and a second copy would drift:

  `MenuButton` is one round control (node 3523:37499) — the same button draws
  filter-chat, view-message, and view-job-posting, differing only by glyph and by
  what it opens. Hover and selected are one fill rather than two, since what
  separates them is duration and not appearance: selected outlives the pointer,
  and reports that the surface it opened is still showing. Hover is tracked in
  state rather than left to CSS, because the component styles inline and the
  filled hover is a drawn state in Figma rather than a tint a browser would
  approximate. Its count badge is omitted at zero: a badge reading zero reports
  something where there is nothing to report.

  `LeadStageButton` is the lead's stage (node 3523:37527), in eleven stages and
  two sizes. Figma files it as a badge, but every instance carries a chevron and
  opens the stage menu, so it is built as a button and `interactive={false}` is the
  badge. Figma draws only the L size; `m` is added at 24px for rows that cannot
  spend 30px on a pill. The type size does not change between them — 12px is
  already the smallest step the label reads at, so `m` trims the box instead of
  the text.

  `FilterChat` is the popover the filter button opens (node 4486:31137). Figma's
  two frames are not variants: "Hide" is the same panel with nothing ticked, so the
  component takes the selection and both drawings fall out of it. The trailing
  action reads for the direction it would move — "Hide all" with everything on,
  "Show all" otherwise — so a mixed selection is one press from complete rather
  than two. `defaultChatFilters` ships the three kinds Figma draws, exported rather
  than baked in: the filterable kinds belong to the product.

  `AddBmInfo` is the band offering to add the Business Manager (node 3541:29473),
  which is also what the header's `addBusinessManager` prop draws under it. `adding`
  is a prop rather than internal state — whether the manager actually joined the
  room is known by whatever owns the room, and a spinner that cleared itself would
  clear before the room changed.

  `HeaderNavButton`, `HeaderMetaTag`, and `AutoCancelSwitch` are the three parts
  Figma does not file separately, exported anyway for the same reason. The nav
  button is bare where `MenuButton` is ringed, which is what separates them: this
  one leaves the surface, and the round buttons act on it. `HeaderMetaTag` renders
  as a `<button>` with `onClick` and a `<span>` without, because a focusable
  element that does nothing is worse than a plain one. `AutoCancelSwitch` is
  outlined in the Schedule Messages purple rather than the brand blue — it belongs
  to the scheduling surface, not to the room.

  Two stages are added to `color.stage.lost` and `color.stageFlat`: `wrongTarget`
  and `alreadyEquipped`, which the Lead Stage Badge draws and the palette did not
  carry. Figma gives all three lost stages the same fill and distinguishes them by
  label; they are named separately anyway so a screen can key off the stage it
  means, and so a later divergence is a token change rather than a new name.
  `accent.laziza.backgroundSoft` is added for the wash the filter popover gives its
  AI row — warmer than `background`, and drawn only there.

- e181982: Add `color.main.gigRadarLogoBackground`, and take the last two hardcoded colors
  out of `@gigradar/ui`.

  `#191D28` — the navy field sampled from the GigRadar logo asset, so any
  sub-pixel gap between the scaled artwork and its clip reads as part of the mark
  rather than as a white sliver — was a module-level literal inside `Avatar`. It
  is a real value with a real reason, so it becomes a token rather than an
  exception.

  The mention preset's character counter washed its background with a hardcoded
  `rgba(165, 166, 168, 0.1)`, which is `color.disable.text` at 10%. It now derives
  that with `color-mix`, so the wash tracks the token if the grey is ever retuned.

## 1.0.0

### Major Changes

- 54c8a9b: **Breaking:** remove `Button`, `Badge`, and `Card`.

  `@gigradar/ui` now exports `Avatar`, `AvatarGroup`, and `GigRadarProvider`.
  Their component tokens (`component.button`, `component.badge`, `component.card`,
  `component.input`) and the corresponding `--gr-*` CSS custom properties are
  removed from `@gigradar/theme`.

  Anything importing these will fail to compile after upgrading. They were built
  before component specs existed in Figma, so their metrics were inferred from
  the spacing and type scales rather than extracted; removing them clears the way
  to rebuild from real specs.

  Color, typography, spacing, radius, and shadow tokens are unaffected.

### Minor Changes

- 03bea1e: Add the Avatar and AvatarGroup components.

  Ports the Figma Avatar component (node 456:8607) in full: all 12 tinted
  initials variants, the photo variant, the three service marks (Upwork, Zoom,
  GigRadar), and both corner badges — the GigRadar mark and the blue Upwork
  "API" pill. The `badge` prop also accepts any node, so a presence dot or count
  uses the same slot.

  Omit `tone` and one is hashed from `name`, so a person keeps the same color on
  every screen without app code tracking a palette. Content resolves in one
  order — `service`, then `src`, then initials — with a grey placeholder when
  none are given.

  New in `@gigradar/theme`: the `avatarTone` palette (12 background/border/text
  triplets, kept separate from `status` and `accent` because they carry no
  semantic meaning) and `component.avatar` metrics. Unlike the other component
  tokens these are extracted from Figma — the component is drawn at 32px with a
  16px badge, which anchors the `medium` size.

  Image assets are inlined as data URIs rather than imported as files: the
  package builds with plain `tsc`, which copies no static files, so a `.png`
  import would resolve at build time but break at runtime for consumers.

- 309c48e: Drop the white ring from `AvatarGroup`, and express its overlap as a spacing token.

  The ring is gone — each avatar's own border now reads as its edge, rather than
  being wrapped in a second one.

  **Breaking for `AvatarGroup`:** the `overlap` prop is replaced by `gap`. Where
  `overlap` was a fraction of the avatar size (`overlap={0.2}`), `gap` is a
  spacing token whose negative form overlaps: `gap="-xs"` is the default, pulling
  each avatar 6px over the one before it. Positive tokens space them apart
  (`gap="s"`), and a raw number still works as an escape hatch.

  A fixed step rather than a ratio, so the overlap stays put when the avatars are
  resized — under the old scheme a `large` group overlapped more in absolute
  terms than a `small` one, for no reason anybody asked for.

  `component.avatar.groupOverlap` (0.2) is replaced by `component.avatar.groupGap`
  (-6). The `--gr-avatar-group-overlap` CSS variable is gone with it; the gap is
  now a prop rather than a variable, since it is a per-row decision.

- 309c48e: Name the six avatar types, and add tokens for the gallery's own chrome.

  `Avatar` gains a `type` prop covering the six kinds the component actually has:
  `default` (tinted initials), `image`, `placeholder` (the disabled grey state),
  and the three service marks `upwork`, `zoom`, and `gigradar`.

  The type is still inferred from whichever content prop was given — `src` makes
  an `image`, `service` makes that mark, a bare `<Avatar />` makes a
  `placeholder` — so existing usage is unchanged. Pass `type` when the design
  fixes the kind and it should not follow the data: a `placeholder` set
  explicitly stays grey and empty even once a name arrives, where the inferred
  one would switch to initials.

  New in `@gigradar/theme`: `component.docs`, holding the metrics for the
  gallery's preview panels and tables. These are documentation chrome, not
  product tokens — nothing in a GigRadar app should read them — but they keep the
  docs off bare numbers and on the same radius scale as the components.

- 309c48e: Add `Button` and `ComposerButton`, covering the eight Figma button components.

  `Button` mirrors the application button (nodes 2573:4267 and 2573:4294): 16px
  horizontal padding, 8px vertical, a 6px corner radius, an 8px gap between icon
  and label, and 14px medium text. Two variants — `primary` (filled) and
  `secondary` (outlined).

  Figma draws one button per feature — Meeting (4881:1023), Schedule (4881:1395),
  Laziza AI (4884:10597), Cancel (4881:1003) — and they are the same control in a
  different color: identical padding, radius, gap, and type. So the feature is a
  `tone` rather than a component, and a new one is a row in a table instead of a
  new file. Tones: `brand`, `meeting`, `schedule`, `laziza`, `danger`.

  Outlined feature buttons stay neutral at rest and pick up their tone on hover,
  border and label together, which is what Figma draws. `danger` is the exception
  and carries its red outline from the start, since a destructive action should
  read as destructive before it is hovered. Disabled outlined buttons are dimmed
  with opacity rather than restyled per part, again matching Figma.

  Every color comes from the theme tokens. Where the Figma buttons deviate
  slightly from the guidebook tokens — Schedule hovers to `#6321A0` vs the token
  `#763BAD`, Laziza to `#D57815` vs `#DE7B11`, and Schedule's resting outline is
  `#E4EAF5` where the other feature buttons use `#C3CBD3` — the tokens win, so
  the tones stay uniform and a token change reaches the buttons.

  Figma's "Syncing" is the `loading` prop: it shows a spinner, keeps the label so
  the button does not change width as work starts, takes the disabled palette, and
  marks the button inert and `aria-busy`. `startIcon` / `endIcon` render into fixed
  square slots that never shrink, so an icon cannot stretch the button.

  `ComposerButton` is the Message / Note toggle (nodes 100:4694 and 100:4695), kept
  separate because the shape differs rather than the color: no border, transparent
  until hovered or selected, 12px semibold rather than 14px medium, and its state
  is `selected` or not — no disabled or loading state is drawn for it. The two
  marks Figma draws are built in: `laziza` renders the Note tab's spark (orange at
  rest, white when selected) and `info` the circled-i badge (outlined at rest,
  inverting to a filled white circle with a blue glyph when selected). Both glyphs
  are SF Symbols in Figma, which do not exist on the web — the paths are Figma's
  own SVG exports of those text layers, tinted via `currentColor`.

  Metrics are exposed as typed style props — `paddingX`, `paddingY`, `radius`,
  `borderWidth`, `fontSize`, `gap`, and `iconSize` — each writing its matching
  `--gr-button-*` variable rather than a concrete style, the same mechanism
  `Avatar` uses. Numbers are treated as px and any other unit passes through.

  `@gigradar/theme` gains `component.button` and the `ButtonSize` type.

  Three sizes, with `medium` as the drawn one; `small` and `large` extend the scale
  proportionally and are the one part of the button tokens not traceable to Figma.

- 87724db: Add component-level design tokens and CSS custom properties.

  Every component now reads its metrics from a CSS variable with the design token
  as fallback — `height: var(--gr-button-height-medium, 36px)` — so an app can
  retune a component without forking it or overriding the `style` prop. Apps that
  set nothing are unaffected.

  New: `component` export from `@gigradar/theme`, and 42 component variables
  covering Button, Badge, Card, and Input (Input's tokens land ahead of the
  component). 143 CSS variables in total.

  Component sizes are derived from the spacing and type scales, not extracted
  from Figma — the guidebook contains no component specs. Replacing them later is
  a visual change, not an API change.

- 31dcde0: Add the `popup` shadow and a matching Card variant.

  `shadow.popup` (`0 6px 12px rgba(0,0,0,0.05)`) is extracted from Figma's "Popup
  Border" style. It is deliberately tighter than `shadow.base` — a dropdown needs
  a crisp edge to read as detached, where `base`'s 78px spread makes a surface
  feel part of the layout.

  `<Card variant="popup">` uses it. The shadow emitter now iterates every
  elevation, so future additions need no change there.

  The gallery gains a CSS properties table per component with a live override
  editor, and generates the stylesheet snippet for whatever you change.

## 0.2.0

### Minor Changes

- f70ac86: Initial release.

  - `@gigradar/theme` — design tokens extracted from the Figma guidebook, in two
    consumption formats: TS objects and CSS custom properties.
  - `@gigradar/ui` — Button, Badge (including the nine CRM pipeline stages), Card,
    and GigRadarProvider.
  - `@gigradar/eslint-plugin` — `no-hardcoded-values` and `no-direct-antd-import`.

- 03667c9: Add integration and proposal color tokens.

  - `color.integration.slack` and `color.integration.telegram` — brand colors for
    external services, deliberately separate from the semantic tokens.
  - `color.proposal.sent`

  Colors are now documented in six categories: Foundation, State, Surface,
  Domain, Integration, and Legacy.

- 9b1ba7e: Rename `accent.amber` to `accent.laziza`, matching Figma exactly so the name is
  searchable in both places.

  Encode the highlight colors at their Figma opacity. `main.highlight` and
  `main.highlightSelect` are now `rgba(…, 0.35)` rather than opaque hex; the
  underlying solid fills remain available as `main.highlightSolid` and
  `main.highlightSelectSolid`.

- caae3aa: Encode the remaining Figma color styles.

  - `main.highlightSelect` — the selected match within a search result set
  - `navbar.hoverStrong` — high-contrast hover for dark nav surfaces
  - `badge.border` — a distinct badge outline, lighter than the foreground
  - `accent.laziza.hover`

  Badge now uses `badge.border` for its brand tone outline rather than reusing
  the foreground color.
