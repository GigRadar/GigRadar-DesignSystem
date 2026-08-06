---
'@uiuxjoseph/ui': minor
---

Add the icon set — 163 icons extracted from the Figma icon set page, plus an
`Icon` component.

    import { Icon, IconLockFill, IconSearch } from '@uiuxjoseph/ui';

    <Icon icon={IconSearch} size={16} />

Icons are outlined 24×24 SVGs that follow `currentColor`. Each is a named
export (`IconLockFill`, `IconSendPlaneStroke`, …), so bundles carry only the
icons they name. Names match the Figma frame names exactly, with five
exceptions where Figma had duplicate or unusable names — those carry their
original name in `figmaName`.
