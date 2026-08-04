# Adopting the theme in an antd v4 app

antd v4 themes at **build time** through Less variables. There is no runtime
`ConfigProvider` theming and no `theme.useToken()` hook — both are antd v5
features. This means adopting the theme requires a build-config change in each
app, not just an npm install.

Each of the four apps (home, dashboard, crm, inbound) adopts independently, so
this can be rolled out one app at a time.

## 1. Install

```bash
npm install @gigradar/theme @gigradar/ui
```

## 2. Wire the Less variables (umi)

In `.umirc.ts` or `config/config.ts`:

```ts
import { getAntdV4ModifyVars } from '@gigradar/theme';

export default defineConfig({
  theme: getAntdV4ModifyVars(),
});
```

For a raw webpack setup, pass the same object to less-loader's `modifyVars`:

```js
{
  loader: 'less-loader',
  options: {
    lessOptions: {
      modifyVars: getAntdV4ModifyVars(),
      javascriptEnabled: true,
    },
  },
}
```

This restyles the antd components you are keeping — Table, DatePicker, Select,
Form, Upload.

## 3. Mount the provider

At the app root:

```tsx
import { GigRadarProvider } from '@gigradar/ui';

export function Layout({ children }) {
  return <GigRadarProvider>{children}</GigRadarProvider>;
}
```

This injects the token CSS custom properties, making `var(--gr-color-brand)`
available in `.less` and `.css` files.

For production, prefer emitting the stylesheet at build time to avoid a flash of
unstyled content:

```ts
import { renderCssVars } from '@gigradar/theme';
import { writeFileSync } from 'node:fs';

writeFileSync('src/tokens.css', renderCssVars());
```

Then import `tokens.css` directly and pass `injectCssVars={false}` to the
provider.

## 4. Migrate imports

Replace antd imports with `@gigradar/ui` for components we own:

```diff
- import { Button } from 'antd';
+ import { Button } from '@gigradar/ui';
```

Components not yet in `@gigradar/ui` continue to come from antd. That is
expected during the transition.

> Note: our `Button` is not API-compatible with antd's. antd's `type="primary"`
> is our `variant="primary"`; antd's `danger` boolean is our
> `variant="danger"`. TypeScript will flag every call site that needs updating —
> which is the point.

## Staged rollout

Nothing here is all-or-nothing. An app can:

1. Install the packages and mount the provider (no visual change)
2. Wire the Less variables (antd components restyle)
3. Migrate imports component by component (identity components change)

Each step is independently revertable.
