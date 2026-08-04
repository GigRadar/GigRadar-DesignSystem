import { color } from './tokens/color.js';
import { component } from './tokens/components.js';
import { radius, shadow, spacing } from './tokens/space.js';
import { fontFamily, fontSize, fontWeight, lineHeight } from './tokens/typography.js';

/**
 * CSS custom properties for every token.
 *
 * Why this exists: tokens must be reachable from places a React hook cannot go
 * — `.less` and `.css` files, chart config objects, utility functions outside a
 * render, and third-party widgets. Those are exactly the places where hardcoded
 * hex values creep in. Same source of truth, different consumption format.
 *
 * Naming: `--gr-<group>-<name>`, kebab-cased.
 */
export function buildCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  const set = (name: string, value: string | number) => {
    vars[`--gr-${name}`] = typeof value === 'number' ? `${value}px` : value;
  };

  // Colors — main
  for (const [key, value] of Object.entries(color.main)) {
    set(`color-${kebab(key)}`, value);
  }
  for (const [key, value] of Object.entries(color.disable)) {
    set(`color-disable-${kebab(key)}`, value);
  }
  for (const [key, value] of Object.entries(color.navbar)) {
    set(`color-navbar-${kebab(key)}`, value);
  }
  for (const [key, value] of Object.entries(color.badge)) {
    set(`color-badge-${kebab(key)}`, value);
  }

  // Colors — status + accent (two levels deep)
  for (const [group, values] of Object.entries(color.status)) {
    for (const [key, value] of Object.entries(values)) {
      set(`color-${kebab(group)}-${kebab(key)}`, value as string);
    }
  }
  for (const [group, values] of Object.entries(color.accent)) {
    for (const [key, value] of Object.entries(values)) {
      set(`color-${kebab(group)}-${kebab(key)}`, value as string);
    }
  }

  // Colors — CRM stages (flat, keyed by stage name)
  for (const [key, value] of Object.entries(color.stageFlat)) {
    set(`color-stage-${kebab(key)}`, value);
  }

  // Colors — proposal states
  for (const [key, value] of Object.entries(color.proposal)) {
    set(`color-proposal-${kebab(key)}`, value);
  }

  // Colors — external service brand colors
  for (const [service, values] of Object.entries(color.integration)) {
    for (const [key, value] of Object.entries(values)) {
      set(`color-${kebab(service)}-${kebab(key)}`, value as string);
    }
  }

  // Colors — avatar tones (background / border / text per hue)
  for (const [tone, values] of Object.entries(color.avatarTone)) {
    for (const [key, value] of Object.entries(values)) {
      set(`color-avatar-${kebab(tone)}-${kebab(key)}`, value as string);
    }
  }

  // Spacing / radius
  for (const [key, value] of Object.entries(spacing)) set(`space-${key}`, value);
  for (const [key, value] of Object.entries(radius)) set(`radius-${key}`, value);

  // Shadow — every elevation, so a new one does not need a change here
  for (const [key, value] of Object.entries(shadow)) {
    if (key === 'none') continue;
    set(`shadow-${kebab(key)}`, value);
  }

  // Typography
  set('font-family', fontFamily.base);
  set('font-family-mono', fontFamily.mono);
  for (const [key, value] of Object.entries(fontSize)) set(`font-size-${key}`, value);
  for (const [key, value] of Object.entries(fontWeight)) set(`font-weight-${key}`, String(value));
  for (const [key, value] of Object.entries(lineHeight)) set(`line-height-${key}`, String(value));

  // Component tokens — `--gr-<component>-<property>[-<variant>]`.
  // Emitted so an app can override one component's metrics in a stylesheet
  // without forking the component.
  for (const [name, tokens] of Object.entries(component)) {
    for (const [property, value] of Object.entries(tokens)) {
      if (typeof value === 'object' && value !== null) {
        for (const [variant, variantValue] of Object.entries(value)) {
          set(`${kebab(name)}-${kebab(property)}-${kebab(variant)}`, variantValue as string | number);
        }
      } else {
        set(`${kebab(name)}-${kebab(property)}`, value as string | number);
      }
    }
  }

  return vars;
}

function kebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Renders the tokens as a `:root { ... }` stylesheet.
 *
 * Inject once at app startup, or write to a `.css` file at build time so
 * stylesheets can reference `var(--gr-color-brand)`.
 */
export function renderCssVars(selector = ':root'): string {
  const vars = buildCssVars();
  const body = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}\n`;
}
