/* eslint-disable @gigradar/no-hardcoded-values --
 * The colours below are artwork, not design decisions.
 *
 * Figma's own SVG export of one illustration: a blurred blue field, a set of
 * concentric rings on linear gradients, and three crosshair marks. Naming them
 * as tokens would claim they are part of the palette — they are not, nothing
 * else may use them, and the next re-export would replace them wholesale. The
 * rule is right about every other file and wrong about this one.
 */
import { forwardRef, type HTMLAttributes } from 'react';

export type PaywallBackdropProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
>;

/**
 * The wash behind the paywall.
 *
 * Figma: the modal's `bg` layer at 5117:20946.
 *
 * Kept as Figma's export rather than rebuilt in CSS: the rings are seven
 * circles on seven different linear gradients inside a 200px Gaussian blur,
 * and an approximation would drift from the frame the first time either was
 * touched.
 *
 * Positioned rather than tiled, and cropped rather than squashed. The artwork
 * is anchored to the modal's bottom-right — where the rings sit in the frame —
 * so a taller modal grows away from them instead of stretching them into
 * ovals.
 *
 * Its gradient ids are suffixed `_gr_pw` because SVG ids are document-global:
 * two paywalls on one page with Figma's own `_0_425` ids would have the second
 * one's gradients silently resolve to the first one's.
 */
export const PaywallBackdrop = forwardRef<HTMLDivElement, PaywallBackdropProps>(
  function PaywallBackdrop(props, ref) {
    return (
      <div
        ref={ref}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          /*
           * Behind everything, without needing each section above it to claim
           * a layer. The modal isolates itself, so this cannot sink below the
           * page it sits on.
           */
          zIndex: -1,
        }}
        {...props}
      >
        <svg
          viewBox="0 0 1785.92 1393.73"
          width="1785.92"
          height="1393.73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            // Anchored bottom-right, where the rings live in the frame.
            right: '-8%',
            bottom: '-13%',
            width: '175%',
            height: 'auto',
          }}
        >
          <g id="bg">
          <path id="plus" opacity="0.5" d="M401.017 743.633V696.867M377.633 720.25L424.4 720.25" stroke="url(#paint0_radial_gr_pw)" strokeWidth="0.75"/>
          <path id="plus_2" opacity="0.5" d="M917.483 865.633V818.867M894.1 842.25L940.866 842.25" stroke="url(#paint1_radial_gr_pw)" strokeWidth="0.75"/>
          <path id="plus_3" opacity="0.5" d="M837.166 623.667V607.4M829.033 615.533L845.3 615.533" stroke="url(#paint2_radial_gr_pw)" strokeWidth="0.75"/>
          <g id="bg_2">
          <circle id="Ellipse 104" opacity="0.1" cx="1412.17" cy="1009.41" r="373.75" fill="url(#paint3_linear_gr_pw)"/>
          <circle id="Ellipse 103" opacity="0.2" cx="1412.17" cy="1009.41" r="322.395" fill="url(#paint4_linear_gr_pw)" stroke="#91CAFF"/>
          <circle id="Ellipse 102" opacity="0.2" cx="1412.17" cy="1009.41" r="272.467" fill="url(#paint5_linear_gr_pw)" stroke="#91CAFF"/>
          <circle id="Ellipse 101" opacity="0.2" cx="1412.17" cy="1009.41" r="226.818" fill="url(#paint6_linear_gr_pw)" stroke="#91CAFF"/>
          <circle id="Ellipse 100" opacity="0.2" cx="1412.17" cy="1009.41" r="185.448" fill="url(#paint7_linear_gr_pw)" stroke="#91CAFF"/>
          <circle id="Ellipse 99" opacity="0.2" cx="1412.17" cy="1009.41" r="154.065" fill="url(#paint8_linear_gr_pw)" stroke="#91CAFF"/>
          <circle id="Ellipse 98" opacity="0.2" cx="1412.17" cy="1009.41" r="128.387" fill="url(#paint9_linear_gr_pw)" stroke="#91CAFF"/>
          </g>
          <g id="Ellipse 124" opacity="0.3" filter="url(#filter0_f_gr_pw)">
          <circle cx="696.867" cy="696.867" r="296.867" fill="#378AFA"/>
          </g>
          </g>
          <defs>
          <filter id="filter0_f_gr_pw" x="-5.72205e-06" y="0" width="1393.73" height="1393.73" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_gr_pw"/>
          </filter>
          <radialGradient id="paint0_radial_gr_pw" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(401.017 720.25) rotate(90) scale(23.3833)">
          <stop stopColor="#1852D3"/>
          <stop offset="1" stopColor="#1852D3" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="paint1_radial_gr_pw" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(917.483 842.25) rotate(90) scale(23.3833)">
          <stop stopColor="#1852D3"/>
          <stop offset="1" stopColor="#1852D3" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="paint2_radial_gr_pw" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(837.166 615.533) rotate(90) scale(8.13333)">
          <stop stopColor="#1852D3"/>
          <stop offset="1" stopColor="#1852D3" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="paint3_linear_gr_pw" x1="1140.98" y1="1012.85" x2="1785.92" y2="1012.85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BED8FF"/>
          <stop offset="1" stopColor="#EBF1FE"/>
          </linearGradient>
          <linearGradient id="paint4_linear_gr_pw" x1="1178.24" y1="1012.38" x2="1734.56" y2="1012.38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DAE3F1"/>
          <stop offset="1" stopColor="#EBF1FE"/>
          </linearGradient>
          <linearGradient id="paint5_linear_gr_pw" x1="1214.47" y1="1011.92" x2="1684.63" y2="1011.92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DAE3F1"/>
          <stop offset="1" stopColor="#EBF1FE"/>
          </linearGradient>
          <linearGradient id="paint6_linear_gr_pw" x1="1247.59" y1="1011.5" x2="1638.98" y2="1011.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DAE3F1"/>
          <stop offset="1" stopColor="#EBF1FE"/>
          </linearGradient>
          <linearGradient id="paint7_linear_gr_pw" x1="1277.61" y1="1011.12" x2="1597.61" y2="1011.12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DAE3F1"/>
          <stop offset="1" stopColor="#EBF1FE"/>
          </linearGradient>
          <linearGradient id="paint8_linear_gr_pw" x1="1300.38" y1="1010.83" x2="1566.23" y2="1010.83" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DAE3F1"/>
          <stop offset="1" stopColor="#EBF1FE"/>
          </linearGradient>
          <linearGradient id="paint9_linear_gr_pw" x1="1319.01" y1="1010.59" x2="1540.55" y2="1010.59" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BED8FF"/>
          <stop offset="1" stopColor="#EBF1FE"/>
          </linearGradient>
          </defs>
          
        </svg>
      </div>
    );
  },
);
