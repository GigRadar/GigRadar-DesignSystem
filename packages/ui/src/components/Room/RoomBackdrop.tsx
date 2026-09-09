/* eslint-disable @gigradar/no-hardcoded-values --
 * The colours below are artwork, not design decisions.
 *
 * This is Figma's own SVG export of one illustration: three ink colours mixed
 * at a dozen opacities inside blurs and gradients. Naming them as tokens would
 * claim they are part of the palette — they are not, nothing else may use them,
 * and the next re-export would replace them wholesale. The rule is right about
 * every other file and wrong about this one.
 */
import { forwardRef, type HTMLAttributes } from 'react';

/**
 * The wash behind the chat room.
 *
 * Figma's own export, kept verbatim: four blurred colour fields, a faint grid,
 * and a handful of crosshair marks. Reproducing it in CSS would mean
 * approximating five `feGaussianBlur` filters and thirty-odd gradients, and the
 * result would drift from the frame the first time either was touched.
 *
 * Pinned to the room rather than scrolling with the thread: it is a backdrop the
 * conversation sits on, not a texture the messages carry, so a gradient sliding
 * past would make the whole column look like it was moving.
 *
 * `preserveAspectRatio="xMidYMid slice"` is what lets it crop rather than
 * squash: the artwork is 1600×1280 and the pane it fills is any shape at all, so
 * something has to give, and cropping the edges of a blur costs nothing while
 * stretching it would bend the circles into ovals.
 */
export type RoomBackdropProps = {
  /**
   * Fixes the wash to the viewport instead of to its container.
   *
   * The room fills the window in the product, so the two are the same thing
   * there. They are not the same when the room is embedded — a documentation
   * preview, a split screen — where a viewport-fixed wash escapes its frame and
   * tints everything around it.
   * @default false
   */
  fixed?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export const RoomBackdrop = forwardRef<HTMLDivElement, RoomBackdropProps>(function RoomBackdrop(
  { fixed = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      {...props}
    >
      <svg
        viewBox="0 0 1600 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <g opacity="0.5" clipPath="url(#gr-room-clip)">
          <rect width="1280" height="1600" transform="matrix(0 1 -1 0 1600 0)" fill="#EFF7FF" />
          <g opacity="0.1" filter="url(#gr-room-blur-0)">
            <circle cx="814" cy="1203" r="193" transform="rotate(90 814 1203)" fill="#216BEF" />
          </g>
          <rect opacity="0.1" x="564" y="596" width="5" height="5" transform="rotate(90 564 596)" fill="#1C3E8C" />
          <rect opacity="0.1" x="402" y="596" width="5" height="5" transform="rotate(90 402 596)" fill="#1C3E8C" />
          <rect opacity="0.1" x="807" y="434" width="5" height="5" transform="rotate(90 807 434)" fill="#1C3E8C" />
          <rect opacity="0.1" x="321" y="353" width="5" height="5" transform="rotate(90 321 353)" fill="#1C3E8C" />
          <path opacity="0.3" fillRule="evenodd" clipRule="evenodd" d="M479.985 680.015H463V678.985H479.985V662H481.015V678.985H498V680.015H481.015V697H479.985V680.015Z" fill="url(#gr-room-cross-0)" />
          <path opacity="0.3" fillRule="evenodd" clipRule="evenodd" d="M803.985 518.015H787V516.985H803.985V500H805.015V516.985H822V518.015H805.015V535H803.985V518.015Z" fill="url(#gr-room-cross-1)" />
          <path opacity="0.3" fillRule="evenodd" clipRule="evenodd" d="M884.985 356.015H868V354.985H884.985V338H886.015V354.985H903V356.015H886.015V373H884.985V356.015Z" fill="url(#gr-room-cross-2)" />
          <path opacity="0.3" fillRule="evenodd" clipRule="evenodd" d="M398.985 113.015H382V111.985H398.985V95H400.015V111.985H417V113.015H400.015V130H398.985V113.015Z" fill="url(#gr-room-cross-3)" />
          <g opacity="0.2" filter="url(#gr-room-blur-1)">
            <ellipse cx="615" cy="746.5" rx="190.5" ry="193" transform="rotate(90 615 746.5)" fill="#216BEF" />
          </g>
          <g opacity="0.2" filter="url(#gr-room-blur-2)">
            <circle cx="494" cy="1117" r="193" transform="rotate(90 494 1117)" fill="#FDCC4E" />
          </g>
          <g opacity="0.2" filter="url(#gr-room-blur-3)">
            <ellipse cx="804" cy="254.5" rx="184.5" ry="193" transform="rotate(90 804 254.5)" fill="#FDCC4E" />
          </g>
          <g opacity="0.1" filter="url(#gr-room-blur-4)">
            <circle cx="214" cy="237" r="193" transform="rotate(90 214 237)" fill="#216BEF" />
          </g>
          {/* The two grids — verticals then horizontals, each a gradient that
              fades at both ends so the lines dissolve rather than stopping. */}
          <g opacity="0.05">
            {[1017, 936, 855, 774, 693, 612, 531, 450, 369, 288, 207, 126, 45].map((x, i) => (
              <rect
                key={x}
                x={x}
                y={-197}
                width={1440}
                height={1}
                transform={`rotate(90 ${x} -197)`}
                fill={`url(#gr-room-vline-${i})`}
              />
            ))}
          </g>
          <g opacity="0.05">
            {[77, 158, 239, 320, 401, 482, 563, 644, 725, 806, 887, 968, 1049, 1130, 1211].map(
              (y, i) => (
                <rect
                  key={y}
                  x={1059}
                  y={y}
                  width={1}
                  height={996}
                  transform={`rotate(90 1059 ${y})`}
                  fill={`url(#gr-room-hline-${i})`}
                />
              ),
            )}
          </g>
        </g>
        <defs>
          {/* Figma exports each blur as its own filter with its own bounds. The
              stdDeviation is what matters; the bounds are widened to `-50%/200%`
              so a blur is never clipped by its own filter region. */}
          {[150.607, 150.607, 100.404, 100.404, 150.607].map((deviation, i) => (
            <filter
              key={i}
              id={`gr-room-blur-${i}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              filterUnits="objectBoundingBox"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation={deviation} />
            </filter>
          ))}
          {[
            [480.5, 679.5],
            [804.5, 517.5],
            [885.5, 355.5],
            [399.5, 112.5],
          ].map(([cx, cy], i) => (
            <radialGradient
              key={i}
              id={`gr-room-cross-${i}`}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${cx} ${cy}) rotate(180) scale(17.5)`}
            >
              <stop stopColor="#216BEF" />
              <stop offset="1" stopColor="#216BEF" stopOpacity="0" />
            </radialGradient>
          ))}
          {[1017, 936, 855, 774, 693, 612, 531, 450, 369, 288, 207, 126, 45].map((x, i) => (
            <linearGradient
              key={x}
              id={`gr-room-vline-${i}`}
              x1={x}
              y1="-196.5"
              x2={x + 1440}
              y2="-196.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1C3E8C" stopOpacity="0" />
              <stop offset="0.5" stopColor="#1C3E8C" />
              <stop offset="1" stopColor="#1C3E8C" stopOpacity="0" />
            </linearGradient>
          ))}
          {[77, 158, 239, 320, 401, 482, 563, 644, 725, 806, 887, 968, 1049, 1130, 1211].map(
            (y, i) => (
              <linearGradient
                key={y}
                id={`gr-room-hline-${i}`}
                x1="1059.5"
                y1={y}
                x2="1059.5"
                y2={y + 996}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1C3E8C" stopOpacity="0" />
                <stop offset="0.5" stopColor="#1C3E8C" />
                <stop offset="1" stopColor="#1C3E8C" stopOpacity="0" />
              </linearGradient>
            ),
          )}
          <clipPath id="gr-room-clip">
            <rect width="1280" height="1600" fill="white" transform="matrix(0 1 -1 0 1600 0)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
});
