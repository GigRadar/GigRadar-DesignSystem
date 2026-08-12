import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { HStack, LifecycleBadge, VStack } from '@gigradar/ui';
import { useState, type ReactNode } from 'react';

/**
 * What stands in for a component that is not part of the system yet.
 *
 * A component can be built and visible here long before it is approved, and a
 * reader with no way to tell will use whatever they can see. So an
 * in-development component does not get its usual page — no live example, no
 * usage snippet, no props table, since all three read as "this is ready".
 *
 * What it gets instead is this card: a name, a line on the problem, and the
 * marker. Opening it reveals the proposals competing to solve that problem,
 * which is the thing actually under review.
 *
 * When the pull request is approved the card comes out and the winning
 * proposal takes its place as an ordinary component section.
 */
export function DevelopmentPlaceholder({
  title,
  problem,
  proposalCount,
  children,
}: {
  /** What the component will be called. */
  title: string;
  /** The problem it solves — what the proposals are competing on. */
  problem: string;
  /** How many proposals are inside, so the reader knows before opening. */
  proposalCount: number;
  /** The proposals. Hidden until the card is opened. */
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <VStack gap="m">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          textAlign: 'left',
          padding: spacing.l,
          borderRadius: radius.m,
          // Dashed rather than solid: the placeholder is a hole in the page
          // where a component will go, and a solid card would read as one.
          border: `1px dashed ${color.main.border}`,
          backgroundColor: color.main.background,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <VStack gap="s">
          <HStack gap="s" alignItems="center" flexWrap="wrap">
            <span style={{ ...textStyle.lSemibold, color: color.navbar.textActive }}>{title}</span>
            <LifecycleBadge stage="development" />
          </HStack>

          <span style={{ ...textStyle.mRegular, color: color.main.description }}>{problem}</span>

          <HStack gap="xxs" alignItems="center">
            <span style={{ ...textStyle.mMedium, color: color.main.brand }}>
              {open ? 'Hide' : 'View'} {proposalCount} proposals
            </span>
            <span
              aria-hidden
              style={{
                color: color.main.brand,
                display: 'inline-block',
                transform: open ? 'rotate(90deg)' : 'none',
                transition: 'transform 120ms ease',
                fontSize: 11,
              }}
            >
              ▶
            </span>
          </HStack>
        </VStack>
      </button>

      {open && children}
    </VStack>
  );
}

/**
 * One proposal inside the card.
 *
 * Numbered rather than named, so the reviewer picks by number and nobody has to
 * argue about what to call a thing that may not survive the review. The
 * approach line is the point: three proposals that only differ in decoration
 * are not a choice.
 */
export function Proposal({
  number,
  approach,
  rationale,
  children,
}: {
  number: number;
  /** The one-line description of what makes this layout different. */
  approach: string;
  /** Why a reviewer might pick this one — and what it costs. */
  rationale: string;
  children: ReactNode;
}) {
  return (
    <VStack
      gap="m"
      p="l"
      radius="m"
      borderWidth={1}
      borderColor={color.navbar.border}
      background={color.main.white}
    >
      <VStack gap="xxs">
        <HStack gap="s" alignItems="center">
          <span
            style={{
              ...textStyle.sSemibold,
              color: color.main.white,
              backgroundColor: color.navbar.textActive,
              borderRadius: 9999,
              minWidth: 22,
              height: 22,
              padding: `0 ${spacing.xxs}px`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {number}
          </span>
          <span style={{ ...textStyle.lSemibold, color: color.navbar.textActive }}>{approach}</span>
        </HStack>
        <span style={{ ...textStyle.mRegular, color: color.main.description }}>{rationale}</span>
      </VStack>
      {children}
    </VStack>
  );
}
