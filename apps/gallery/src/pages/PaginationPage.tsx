import { color, textStyle } from '@gigradar/theme';
import {
  HStack,
  PageNumber,
  Pagination,
  PaginationDots,
  VStack,
  type PaginationSize,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const SIZES: PaginationSize[] = ['small', 'medium', 'large'];

/** A caption above an example, so variants can be compared side by side. */
function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <VStack gap="xs" alignItems="center">
      <div style={{ ...textStyle.sSemibold, color: color.main.description }}>{label}</div>
      {children}
    </VStack>
  );
}

/** A live bar — the examples are interactive so the states are real, not mocked. */
function LiveBar({ pageCount = 10, ...rest }: Partial<React.ComponentProps<typeof Pagination>>) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} {...rest} />;
}

export function PaginationPage() {
  const [dotPage, setDotPage] = useState(1);

  return (
    <>
      <PageHeader
        title="Pagination"
        description="Two controls that both say where you are in a sequence. The numbered bar (Figma node 189:504) is for navigating a list you are reading through; the dot indicator (node 527:13264) shows position in a short carousel. Both are built from the page number cell (node 189:701)."
      />

      <Section
        title="Quick start"
        description="The bar is stateless — it renders whatever page says and reports clicks through onPageChange. That keeps the page number wherever it already lives (a URL, a query cache, a parent's state) rather than duplicating it here and having the two disagree. Every example on this page is live: click them."
      >
        <Preview>
          <LiveBar />
        </Preview>
        <CodeBlock
          code={`import { Pagination } from '@gigradar/ui';

const [page, setPage] = useState(1);

<Pagination page={page} pageCount={10} onPageChange={setPage} />

// Usually the page lives in the URL, so a refresh keeps your place:
<Pagination
  page={Number(searchParams.get('page') ?? 1)}
  pageCount={Math.ceil(total / perPage)}
  onPageChange={(p) => setSearchParams({ page: String(p) })}
/>`}
        />
      </Section>

      <Section
        title="Truncation"
        description="Once the range is longer than the row, the bar keeps the first page, the last page, and a window around the current one — so both ends stay reachable however deep you are. The row is always exactly siblingCount cells wide, ellipses included: if it were not, the bar would change width as you paged through and shift everything beside it."
      >
        <Preview>
          <VStack gap="m" alignItems="flex-start">
            <Labeled label="10 pages — click through to watch the window travel">
              <LiveBar pageCount={10} />
            </Labeled>
            <Labeled label="200 pages — same width, wherever you are">
              <LiveBar pageCount={200} />
            </Labeled>
            <Labeled label="4 pages — nothing to truncate">
              <LiveBar pageCount={4} />
            </Labeled>
          </VStack>
        </Preview>
        <CodeBlock
          code={`// The default of 6 is what Figma draws — at page 1 of 10 the row reads
// 1 2 3 4 … 10. Widen it if you have the room.
<Pagination page={page} pageCount={200} onPageChange={setPage} />
<Pagination page={page} pageCount={200} onPageChange={setPage} siblingCount={9} />

// The slot maths is exported if you are building a bespoke bar:
pageSlots(1, 10)    // [1, 2, 3, 4, 'gap', 10]
pageSlots(50, 200)  // [1, 'gap', 49, 50, 'gap', 200]`}
        />
      </Section>

      <Section
        title="Sizes"
        description="Three steps. Medium is the 24px cell Figma draws; the others extend the scale proportionally."
      >
        <Preview>
          <VStack gap="m" alignItems="flex-start">
            {SIZES.map((size) => (
              <Labeled key={size} label={size}>
                <LiveBar size={size} />
              </Labeled>
            ))}
          </VStack>
        </Preview>
        <CodeBlock
          code={`<Pagination size="small" … />
<Pagination size="medium" … />   // the drawn size
<Pagination size="large" … />`}
        />
      </Section>

      <Section
        title="Without the pill, or the arrows"
        description="bare drops the white fill and padding, for a bar sitting on a surface that already provides them — the footer of a table, say. hideArrows leaves just the numbers."
      >
        <Preview>
          <HStack gap="xl" alignItems="center" flexWrap="wrap">
            <Labeled label="bare">
              <LiveBar bare />
            </Labeled>
            <Labeled label="hideArrows">
              <LiveBar hideArrows />
            </Labeled>
          </HStack>
        </Preview>
        <CodeBlock
          code={`<Pagination bare … />         // no fill, no padding
<Pagination hideArrows … />   // numbers only`}
        />
      </Section>

      <Section
        title="Dots — a different control"
        description="Figma calls this one 'Pagination Auto', but it shows dots rather than numbers, so it is its own component. Reach for it when the page NUMBERS are not meaningful and there are only a handful of them: a carousel, an onboarding flow, a tour. It deliberately does not truncate — past roughly ten dots the row stops reading as a position and starts reading as a smear, which is exactly when the numbered bar is the right control instead."
      >
        <Preview>
          <VStack gap="m" alignItems="flex-start">
            <Labeled label="Interactive — pass onPageChange">
              <PaginationDots page={dotPage} pageCount={3} onPageChange={setDotPage} />
            </Labeled>
            <Labeled label="Read-only — a pure readout">
              <PaginationDots page={2} pageCount={5} />
            </Labeled>
            <Labeled label="bare, on the surface it sits on">
              <PaginationDots page={dotPage} pageCount={3} onPageChange={setDotPage} bare />
            </Labeled>
          </VStack>
        </Preview>
        <CodeBlock
          code={`import { PaginationDots } from '@gigradar/ui';

// Interactive — the dots become buttons.
<PaginationDots page={slide} pageCount={3} onPageChange={setSlide} />

// Read-only. Without onPageChange the dots are not focusable, because a row
// of buttons that do nothing is worse than a row of divs — it puts stops in
// the tab order that lead nowhere.
<PaginationDots page={slide} pageCount={3} />`}
        />
      </Section>

      <Section
        title="Which one?"
        description="Numbers when the user is working through a list and the page number means something — search results, a table, an inbox. Dots when they are being carried through a short sequence and only position matters."
      >
        <CodeBlock
          code={`// ✓ A list you page through. The number is information.
<Pagination page={page} pageCount={48} onPageChange={setPage} />

// ✓ Three onboarding slides. "Page 2 of 3" is all that matters.
<PaginationDots page={step} pageCount={3} onPageChange={setStep} />

// ✗ 48 dots. Unreadable — this wants numbers.
<PaginationDots page={page} pageCount={48} />`}
        />
      </Section>

      <Section
        title="The page number cell"
        description="Both controls are built from PageNumber, the component Figma draws at node 189:701 in its three states. It is exported for the rare case of building a bespoke bar; most code should reach for Pagination. The ellipsis uses the same cell with static, which renders it as plain text rather than a button — a gap marker is not a destination, and it should not land in the tab order."
      >
        <Preview>
          <HStack gap="l" alignItems="center">
            <Labeled label="Default">
              <PageNumber>1</PageNumber>
            </Labeled>
            <Labeled label="Selected">
              <PageNumber selected>1</PageNumber>
            </Labeled>
            <Labeled label="Hover me">
              <PageNumber>2</PageNumber>
            </Labeled>
            <Labeled label="Static (the ellipsis)">
              <PageNumber static>…</PageNumber>
            </Labeled>
            <Labeled label="Disabled">
              <PageNumber disabled>3</PageNumber>
            </Labeled>
          </HStack>
        </Preview>
        <CodeBlock
          code={`<PageNumber onClick={() => go(1)}>1</PageNumber>
<PageNumber selected>1</PageNumber>
<PageNumber static>…</PageNumber>   {/* not a button, not focusable */}`}
        />
      </Section>

      <Section
        title="Accessibility"
        description="The bar is a nav with an accessible name, the current page carries aria-current='page', and each cell names itself ('Page 3', 'Next page') — so the blue disc is not the only thing saying where you are."
      >
        <CodeBlock
          code={`// Name the nav when there is more than one on a page.
<Pagination label="Search results pages" … />
<Pagination label="Comment pages" … />`}
        />
      </Section>

      <Section title="Pagination props">
        <PropsTable
          rows={[
            { name: 'page', type: 'number', description: 'The current page, 1-based. Clamped into range.' },
            { name: 'pageCount', type: 'number', description: 'How many pages there are in total.' },
            { name: 'onPageChange', type: '(page: number) => void', description: 'Called with the page the user picked.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Cell size, type size, and bar padding.' },
            { name: 'siblingCount', type: 'number', default: '6', description: 'Cells the number row may use, ellipses included. Minimum 5.' },
            { name: 'hideArrows', type: 'boolean', default: 'false', description: 'Drops the ‹ › arrows.' },
            { name: 'bare', type: 'boolean', default: 'false', description: 'No fill or padding, for an existing surface.' },
            { name: 'label', type: 'string', default: `'Pagination'`, description: "The nav's accessible name." },
            { name: 'paddingX / paddingY / radius / gap', type: 'number | string', description: "The bar's own metrics." },
            { name: 'itemSize / itemGap / fontSize / iconSize', type: 'number | string', description: 'Cell size, spacing, and type.' },
            { name: 'background', type: 'string', description: "The bar's fill." },
          ]}
        />
      </Section>

      <Section title="PaginationDots props">
        <PropsTable
          rows={[
            { name: 'page', type: 'number', description: 'The current page, 1-based.' },
            { name: 'pageCount', type: 'number', description: 'How many dots to draw.' },
            { name: 'onPageChange', type: '(page: number) => void', description: 'Passing this makes the dots interactive. Omit for a read-only indicator.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Dot diameter, gap, and padding.' },
            { name: 'bare', type: 'boolean', default: 'false', description: 'No fill or padding.' },
            { name: 'label', type: 'string', default: `'Pagination'`, description: "The nav's accessible name." },
            { name: 'dotSize / gap / paddingX / paddingY / radius', type: 'number | string', description: 'The row’s own metrics.' },
            { name: 'background / activeColor / dotColor', type: 'string', description: 'Pill fill, the current dot, and the rest.' },
          ]}
        />
      </Section>

      <Section title="PageNumber props">
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', description: 'What the cell shows — a number, an arrow, or the ellipsis.' },
            { name: 'selected', type: 'boolean', default: 'false', description: 'Draws the brand-blue disc with white text, and sets aria-current.' },
            { name: 'static', type: 'boolean', default: 'false', description: 'Renders as plain text: no hover, no pointer, not focusable. This is the ellipsis.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Fades and blocks the cell. The arrows take this at the ends of the range.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Cell edge and type size.' },
            { name: 'itemSize / radius / fontSize', type: 'number | string', description: "The cell's own metrics." },
            { name: 'selectedBackground / hoverBackground', type: 'string', description: 'The selected disc, and the hover fill.' },
            { name: 'selectedTextColor / textColor', type: 'string', description: 'Label color when selected, and at rest.' },
          ]}
        />
      </Section>
    </>
  );
}
