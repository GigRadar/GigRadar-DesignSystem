---
'@uiuxjoseph/theme': minor
'@uiuxjoseph/ui': minor
---

Add the Avatar and AvatarGroup components.

Ports the Figma Avatar component (node 456:8607) in full: all 12 tinted
initials variants, the photo variant, the three service marks (Upwork, Zoom,
GigRadar), and both corner badges — the GigRadar mark and the blue Upwork
"API" pill. The `badge` prop also accepts any node, so a presence dot or count
uses the same slot.

Omit `tone` and one is hashed from `name`, so a person keeps the same color on
every screen without app code tracking a palette. Content resolves in one
order — `service`, then `src`, then initials — with a grey placeholder when
none are given.

New in `@uiuxjoseph/theme`: the `avatarTone` palette (12 background/border/text
triplets, kept separate from `status` and `accent` because they carry no
semantic meaning) and `component.avatar` metrics. Unlike the other component
tokens these are extracted from Figma — the component is drawn at 32px with a
16px badge, which anchors the `medium` size.

Image assets are inlined as data URIs rather than imported as files: the
package builds with plain `tsc`, which copies no static files, so a `.png`
import would resolve at build time but break at runtime for consumers.
