import { borderWidth, color, radius, spacing, textStyle } from '@gigradar/theme';
import {
  Icon,
  IconDropdownArrowDown,
  IconDropdownArrowUp,
  IconGoToExternal,
  LifecycleBadge,
} from '@gigradar/ui';
import { useState } from 'react';
import { DEVELOPMENT_ARTIFACTS } from '../developmentArtifacts';

/**
 * The way into the reviews that are still open.
 *
 * Surfaces under development are deliberately not in the nav: every entry there
 * is something a reader may build against, and a set of competing proposals is
 * the opposite of that. But they still have to be findable, or a review nobody
 * opens is a decision nobody makes — so they sit here, under the search, as a
 * count the reader can open rather than a branch they can wander into.
 *
 * Closed by default. The list is short and it is not what most visits are for;
 * a permanently open panel would push the nav down for a reader who came to
 * look up a component.
 */
export function DevelopmentLinks() {
  const [open, setOpen] = useState(false);
  const count = DEVELOPMENT_ARTIFACTS.length;

  if (count === 0) return null;

  return (
    <div style={{ marginBottom: spacing.m }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          boxSizing: 'border-box',
          width: '100%',
          padding: `${spacing.xs}px ${spacing.s}px`,
          borderRadius: radius.s,
          // Dashed, like the DevelopmentPlaceholder it leads to: what is inside
          // is not part of the system yet, and a solid card would say it was.
          border: `${borderWidth.thin}px dashed ${color.main.border}`,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <LifecycleBadge stage="development" />
        <span style={{ ...textStyle.sMedium, color: color.navbar.text2, flex: 1, minWidth: 0 }}>
          {count} in review
        </span>
        <Icon
          icon={open ? IconDropdownArrowUp : IconDropdownArrowDown}
          size={14}
          color={color.main.description}
        />
      </button>

      {open && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xxs,
            marginTop: spacing.xxs,
          }}
        >
          {DEVELOPMENT_ARTIFACTS.map((artifact) => (
            <a
              key={artifact.url}
              href={artifact.url}
              target="_blank"
              rel="noreferrer"
              title={artifact.question}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: `${spacing.xs}px ${spacing.s}px`,
                borderRadius: radius.s,
                backgroundColor: color.main.white,
                border: `${borderWidth.thin}px solid ${color.navbar.border}`,
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xxs,
                  ...textStyle.sMedium,
                  color: color.navbar.text2,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {artifact.title}
                </span>
                <Icon icon={IconGoToExternal} size={12} color={color.main.brand} />
              </span>
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>
                {artifact.ticket ? `${artifact.ticket} · ` : ''}
                {artifact.decisions} {artifact.decisions === 1 ? 'decision' : 'decisions'} open
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
