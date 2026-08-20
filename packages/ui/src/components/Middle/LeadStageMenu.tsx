import { borderWidth, color, component, shadow, textStyle, type StageName } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { stageLabels } from './LeadStageButton.js';

const { menu } = component.middle.leadStage;

/**
 * Every stage, in pipeline order.
 *
 * The order is the order a lead moves through, not alphabetical: the menu is
 * read to answer "where has this got to", and a list sorted by name would put
 * Converted above New.
 */
export const stageOrder: StageName[] = [
  'new',
  'contactLater',
  'interested',
  'booked',
  'happened',
  'qualified',
  'converted',
  'unreachable',
  'notInterested',
  'wrongTarget',
  'alreadyEquipped',
];

/** Per-instance overrides for the menu's own metrics. */
export type LeadStageMenuStyleProps = {
  width?: CssLength;
  radius?: CssLength;
  padding?: CssLength;
  gap?: CssLength;
  background?: string;
  /** The drop shadow. Set to `'none'` to draw the list inline. */
  boxShadow?: string;
};

export type LeadStageMenuProps = {
  /** The stage currently set. Marked with an outline rather than a fill. */
  value?: StageName;
  onSelect?: (stage: StageName) => void;
  /**
   * Which stages to offer. Defaults to all eleven; pass a subset for a pipeline
   * that does not use every one.
   */
  stages?: StageName[];
} & LeadStageMenuStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onSelect'>;

/**
 * The stage picker — the menu the header's stage pill opens.
 *
 * Figma: CRM file, node 9897:1496682 ("Stage Variant").
 *
 * Each row is the stage's own pill stretched to the menu's full width, rather
 * than a pill hugging its label: stacked, the tints read as one column of
 * colour, and a ragged right edge would make the list harder to scan than the
 * thing it is listing.
 *
 * The current stage takes a border rather than a selected-row fill. Every row
 * already carries a fill of its own, so a highlight would read as a twelfth
 * colour instead of as "this is the one".
 */
export const LeadStageMenu = forwardRef<HTMLDivElement, LeadStageMenuProps>(
  function LeadStageMenu(
    {
      value,
      onSelect,
      stages = stageOrder,
      width,
      radius,
      padding,
      gap,
      background,
      boxShadow,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="listbox"
        aria-label="Lead stage"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: len(gap) ?? menu.gap,
          boxSizing: 'border-box',
          width: len(width) ?? menu.width,
          padding: len(padding) ?? menu.padding,
          borderRadius: len(radius) ?? menu.radius,
          backgroundColor: background ?? color.main.white,
          boxShadow: boxShadow ?? shadow.base,
        }}
        {...rest}
      >
        {stages.map((stage) => {
          const current = stage === value;

          return (
            <div
              key={stage}
              role="option"
              aria-selected={current}
              onClick={() => onSelect?.(stage)}
              style={{
                ...textStyle.mRegular,
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                width: '100%',
                paddingLeft: menu.rowPaddingX,
                paddingRight: menu.rowPaddingX,
                paddingTop: menu.rowPaddingY,
                paddingBottom: menu.rowPaddingY,
                borderRadius: menu.rowRadius,
                // Transparent rather than absent on the unselected rows: a border
                // that appears on selection would shift every other row by a
                // pixel as the choice moved down the list.
                border: `${borderWidth.thin}px solid ${
                  current ? color.stageSelectedBorder : 'transparent'
                }`,
                backgroundColor: color.stageFlat[stage],
                color: color.main.black,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {stageLabels[stage]}
            </div>
          );
        })}
      </div>
    );
  },
);
