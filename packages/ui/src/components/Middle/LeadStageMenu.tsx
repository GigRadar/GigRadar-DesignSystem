import { color, component, shadow, textStyle, type StageName } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconXClose } from '../../icons/defs.js';
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
  /**
   * Draws a remove control on the stage currently set, and calls this when it is
   * used — Figma's `removeButton` (node 357:8228). For a screen where a lead can
   * be taken out of the pipeline rather than only moved along it.
   */
  onRemove?: () => void;
} & LeadStageMenuStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onSelect'>;

/**
 * The stage picker — the menu the header's stage pill opens.
 *
 * Figma: CRM file, node 9897:1496682 ("Stage Variant").
 *
 * The menu hugs its widest label — "Already Equipped" — and every row then fills
 * that width rather than hugging its own text: stacked, the colours read as one
 * column, where a ragged right edge would make the list harder to scan than the
 * thing it is listing.
 *
 * Nothing marks the current stage. Figma draws no selected state here, and the
 * pill that opened the menu is still on screen carrying that stage's own tint —
 * so the answer is already in view, and a tick would restate it. `value` is
 * still taken, because the remove control belongs to the row for the stage the
 * lead is actually in.
 */
export const LeadStageMenu = forwardRef<HTMLDivElement, LeadStageMenuProps>(
  function LeadStageMenu(
    {
      value,
      onSelect,
      stages = stageOrder,
      onRemove,
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
          display: 'inline-flex',
          flexDirection: 'column',
          // `stretch` is what makes every row take the width of the longest one:
          // the menu sizes itself to "Already Equipped", and the shorter tints
          // then fill that same box rather than each hugging its own label.
          alignItems: 'stretch',
          gap: len(gap) ?? menu.gap,
          boxSizing: 'border-box',
          width: len(width),
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
                justifyContent: 'space-between',
                gap: menu.rowPaddingX,
                boxSizing: 'border-box',
                paddingLeft: menu.rowPaddingX,
                paddingRight: menu.rowPaddingX,
                paddingTop: menu.rowPaddingY,
                paddingBottom: menu.rowPaddingY,
                borderRadius: menu.rowRadius,
                backgroundColor: color.stageFlat[stage],
                color: color.main.black,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {stageLabels[stage]}
              {/* Only the current stage can be removed — the control means "take
                  the lead out of this", which has no meaning on a stage it is
                  not in. Rendered as a span, since the row is already clickable
                  and a nested button would swallow its own click. */}
              {onRemove && current && (
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove from ${stageLabels[stage]}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemove();
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon icon={IconXClose} size={menu.removeSize} color={color.status.error.main} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);
