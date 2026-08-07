---
'@gigradar/ui': minor
---

Add render props to the higher-level components.

`Tooltip` and `ConfirmTooltip` take `renderCard`; `Pagination` takes
`renderPage`. Each replaces the composed part while the component keeps its
positioning, hover and focus wiring, keyboard handling, and ARIA
relationships. Every payload carries `defaultRender()`, so decorating the
default is a wrapper rather than a reimplementation.

Low-level components — Button, Badge, Avatar, Checkbox, Switch, Spinner —
deliberately do not take render props.

Purely additive: components with no render prop passed render exactly as before.
