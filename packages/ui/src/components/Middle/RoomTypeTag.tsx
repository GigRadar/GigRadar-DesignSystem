import { component, radius } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconConnectedPeopleStroke, IconRoom2peopleClientStroke } from '../../icons/defs.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { HeaderMetaTag } from './HeaderMetaTag.js';
import { useInDevelopmentWarning } from '../Lifecycle/inDevelopment.js';

const { roomType: tokens } = component.middle;

/**
 * What kind of room this is.
 *
 * `oneToOne` holds only the freelancer and the client. Upwork will not add a
 * third person to it, so it cannot book meetings or carry attachments.
 * `businessManager` has GigRadar's Business Manager in it, which is what
 * unlocks both.
 */
export type RoomType = 'oneToOne' | 'businessManager';

/**
 * The label each type reads as, unless the caller passes its own.
 *
 * @experimental In development (BF-3481): published so apps can build against it,
 * but the design is not signed off yet, so props and look may change in a minor release.
 */
export const roomTypeLabels: Record<RoomType, string> = {
  oneToOne: 'One-to-one',
  businessManager: 'Business Manager',
};

export type RoomTypeTagProps = {
  /** The room's type. Ignored while `loading`. */
  type?: RoomType;
  /**
   * Whether the room's participants are still arriving, so its type is not
   * known yet. Draws a grey bar the size of the tag rather than a guess — a
   * one-to-one tag that turns out to be wrong is worse than a beat of grey.
   * @default false
   */
  loading?: boolean;
  /** Overrides the label. Defaults to `roomTypeLabels[type]`. */
  children?: ReactNode;
  /**
   * The tooltip naming what the tag is. Pass `null` to drop it.
   * @default 'Room type'
   */
  tooltip?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children' | 'onClick'>;

/**
 * The room's type, as a tag on the chat header's meta row.
 *
 * BF-3481. A `HeaderMetaTag` rather than a new pill: it sits in a row of
 * them, and a second kind of tag in that row would be a difference the reader
 * has to learn for nothing. The one-to-one tag is the plain outline; the
 * Business Manager tag takes the meetings green, because meetings are what
 * the type unlocks.
 *
 * Unlike the preset and assignee tags it keeps its label on mobile. The label
 * is the whole point, it is short, and a bare glyph of two people versus three
 * is not something anyone reads at a glance.
 *
 * @experimental In development (BF-3481): published so apps can build against it,
 * but the design is not signed off yet, so props and look may change in a minor release.
 */
export const RoomTypeTag = forwardRef<HTMLElement, RoomTypeTagProps>(function RoomTypeTag(
  { type = 'oneToOne', loading = false, children, tooltip = 'Room type', ...rest },
  ref,
) {
  useInDevelopmentWarning('RoomTypeTag', 'BF-3481');
  if (loading) {
    return (
      <Skeleton
        variant="block"
        width={tokens.skeletonWidth}
        height={tokens.skeletonHeight}
        radius={radius.round}
        aria-label="Loading room type"
      />
    );
  }

  const bm = type === 'businessManager';
  const label = children ?? roomTypeLabels[type];
  const tag = (
    <HeaderMetaTag
      ref={ref}
      icon={bm ? IconConnectedPeopleStroke : IconRoom2peopleClientStroke}
      variant={bm ? 'meeting' : 'outline'}
      label={typeof label === 'string' ? label : roomTypeLabels[type]}
      {...rest}
    >
      {label}
    </HeaderMetaTag>
  );

  return tooltip == null ? tag : <Tooltip content={tooltip}>{tag}</Tooltip>;
});
