# @gigradar/ui

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

- 309c48e: Expose the avatar's CSS custom properties as typed component props.

  `Avatar` gains `diameter`, `radius`, `borderWidth`, `fontSize`, `badgeSize`,
  and `badgeRingWidth`; `AvatarGroup` gains `overlap` and `diameter`. Numbers are
  treated as px, so `radius={8}` and `radius="8px"` are the same, and any other
  unit passes through (`"30%"`, `"2rem"`).

  Each prop writes its matching `--gr-avatar-*` variable on the element rather
  than setting a concrete style, so a prop, a stylesheet rule, and the token
  default stay one mechanism instead of three. Writing variables is also what
  lets `badgeSize` reach the badge, which is a separate element further down the
  tree. Reach for a prop for a one-off; the variable still covers a whole surface.

  Deliberately scoped to the avatar's own metrics — there is no `margin`,
  `color`, or layout prop. Existing usage is unaffected: every prop is optional
  and omitting it falls through to the token default.

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

- 309c48e: Add `Box`, `HStack`, and `VStack` — layout as props instead of style objects.

      <HStack gap="s">
        <Avatar name="Ada Lovelace" />
      </HStack>

  rather than

      <div style={{ display: 'flex', gap: spacing.s }}>

  Spacing props take a token name — `gap="s"` resolves `spacing.s` — so app code
  stays on the scale without importing it, and `gap="nope"` is a type error
  rather than a silently missing gap. Numbers remain available as an escape
  hatch for genuinely one-off values (`gap={20}`), and are treated as px.

  `Box` covers flex layout (`display`, `flexDirection`, `alignItems`,
  `justifyContent`, `flexWrap`, `flex`), padding and margin with the usual
  shorthands (`p`, `px`, `py`, `pt`…), and sizing. `HStack` and `VStack` are
  `Box` with the flex defaults filled in. Anything not listed is forwarded to the
  element, so `onClick`, `id`, and ARIA attributes work as normal, and `as` picks
  the tag.

  Deliberately layout-only: no color, typography, or border props, because those
  belong to the components that own them.

  Why a component rather than props on a plain `div`: `display=` and `gap=` on a
  `div` are invalid DOM attributes — React warns and the browser ignores them.
  `Box` resolves the tokens and emits a single `style` attribute.

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

- 309c48e: Bring `Button` to the same prop surface as `Avatar` and `Box`.

  `Button` gains `background`, `textColor`, `borderColor`, and `fontWeight`,
  matching the color props added to `Avatar`. Each writes its `--gr-button-*`
  variable and falls back to the resolved variant/tone palette, so a prop
  overrides the pair without restating it — and `style` stays unaccepted, since
  the props are the customisation surface.

  Also documents the eight Figma button variants in the gallery. Each feature
  button (Meeting, Schedule, Laziza AI) is drawn as eight named variants — Main
  and 2nd, each in Active, Hover, Disable, and Syncing. Those are the two
  variants crossed with the four states, which the component already reaches
  through `variant` plus `disabled`/`loading`, so this is a documentation gap
  rather than a missing API. Hover is shown as a live button to point at rather
  than a frozen style, because it is a real pointer state.

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

- 309c48e: Expose the remaining CSS properties as typed props on `Avatar` and `Box`.

  `style` and `className` are not accepted on these components — the props are
  the customisation surface, so anything a caller needs to override has to be one.
  The metric props already covered sizing; the colors did not, which left
  "tint this one avatar outside the palette" with no supported answer.

  `Avatar` gains `background`, `borderColor`, `textColor`, `badgeRingColor`, and
  `fontWeight`. Like the existing style props, each writes its `--gr-avatar-*`
  variable and falls back to the tone, so a prop overrides the palette without
  the palette being restated at the call site.

  `Box` gains `background`, `textColor`, `borderColor`, `borderWidth`, `radius`,
  `position`, `overflow`, and `textAlign`. `radius` takes a token name
  (`radius="m"`) or a number. Setting `borderColor` or `borderWidth` applies
  `borderStyle: solid`, since a border with neither renders nothing —
  a silent no-op is worse than an opinionated default here.

- 1b7dc9d: Add the icon set — 163 icons extracted from the Figma icon set page, plus an
  `Icon` component.

      import { Icon, IconLockFill, IconSearch } from '@gigradar/ui';

      <Icon icon={IconSearch} size={16} />

  Icons are outlined 24×24 SVGs that follow `currentColor`. Each is a named
  export (`IconLockFill`, `IconSendPlaneStroke`, …), so bundles carry only the
  icons they name. Names match the Figma frame names exactly, with five
  exceptions where Figma had duplicate or unusable names — those carry their
  original name in `figmaName`.

- 31dcde0: Add the `popup` shadow and a matching Card variant.

  `shadow.popup` (`0 6px 12px rgba(0,0,0,0.05)`) is extracted from Figma's "Popup
  Border" style. It is deliberately tighter than `shadow.base` — a dropdown needs
  a crisp edge to read as detached, where `base`'s 78px spread makes a surface
  feel part of the layout.

  `<Card variant="popup">` uses it. The shadow emitter now iterates every
  elevation, so future additions need no change there.

  The gallery gains a CSS properties table per component with a live override
  editor, and generates the stylesheet snippet for whatever you change.

### Patch Changes

- Updated dependencies [03bea1e]
- Updated dependencies [309c48e]
- Updated dependencies [309c48e]
- Updated dependencies [309c48e]
- Updated dependencies [87724db]
- Updated dependencies [31dcde0]
- Updated dependencies [54c8a9b]
  - @gigradar/theme@1.0.0

## 0.2.0

### Minor Changes

- f70ac86: Initial release.

  - `@gigradar/theme` — design tokens extracted from the Figma guidebook, in two
    consumption formats: TS objects and CSS custom properties.
  - `@gigradar/ui` — Button, Badge (including the nine CRM pipeline stages), Card,
    and GigRadarProvider.
  - `@gigradar/eslint-plugin` — `no-hardcoded-values` and `no-direct-antd-import`.

### Patch Changes

- caae3aa: Encode the remaining Figma color styles.

  - `main.highlightSelect` — the selected match within a search result set
  - `navbar.hoverStrong` — high-contrast hover for dark nav surfaces
  - `badge.border` — a distinct badge outline, lighter than the foreground
  - `accent.laziza.hover`

  Badge now uses `badge.border` for its brand tone outline rather than reusing
  the foreground color.

- Updated dependencies [f70ac86]
- Updated dependencies [03667c9]
- Updated dependencies [9b1ba7e]
- Updated dependencies [caae3aa]
  - @gigradar/theme@0.2.0
