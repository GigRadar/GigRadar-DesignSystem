---
'@gigradar/eslint-plugin': major
'@gigradar/theme': major
'@gigradar/ui': major
---

**Breaking:** the package scope is now `@gigradar`.

The design system moved to the GigRadar organization, so the packages are
renamed from `@uiuxjoseph/*` to `@gigradar/*`. The ESLint rule prefix follows
the package name, so the rules become `@gigradar/no-hardcoded-values` and
`@gigradar/no-direct-antd-import`.

Consuming apps need one find-and-replace and an `.npmrc` routing line pointing
`@gigradar` at GitHub Packages. The old `@uiuxjoseph/*` versions stay
published, so nothing breaks until an app chooses to move.
See docs/handoff-to-gigradar-org.md.
