import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowLeft } from '../../icons/defs.js';

const { settingsHeader } = component;

/** Per-instance overrides for the header's own metrics. */
export type SettingsHeaderStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  /**
   * Overrides the bottom padding alone.
   *
   * For a header stacked with a gap below it, where `paddingY` would double
   * the room. Set it to 0 and let the stack own that space.
   */
  paddingBottom?: CssLength;
  /** Title type size. */
  fontSize?: CssLength;
  /** Title color. */
  titleColor?: string;
  /** Description color. */
  descriptionColor?: string;
};

/** What the title block gets when a caller replaces it. */
export type SettingsHeaderTitleRenderProps = WithDefaultRender & {
  title: ReactNode;
  description?: ReactNode;
};

export type SettingsHeaderProps = {
  /** The screen's name. Figma draws 24px in black. */
  title: ReactNode;
  /** The line under it. Figma draws 16px in the nav grey. */
  description?: ReactNode;
  /**
   * Shows a back chevron before the title, and fires when it is pressed.
   *
   * Omitted when absent — Figma hides the chevron on a screen reached from the
   * rail, and shows it on one pushed over another.
   */
  onBack?: () => void;
  /** Accessible name for the back control. */
  backLabel?: string;
  /** Trailing content — actions that belong to the whole screen. */
  actions?: ReactNode;
  /** Replaces the title block. Call `defaultRender()` to decorate it. */
  renderTitle?: RenderProp<SettingsHeaderTitleRenderProps>;
} & SettingsHeaderStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'title'>;

/**
 * The band at the top of a settings screen.
 *
 * Figma: node 3767:1258, drawn on CRM ▸ Settings ▸ AI Configuration and every
 * screen beside it. A 24px title over a 16px description, inset 24px with 32px
 * of vertical room, and an optional back chevron to its left.
 *
 * Distinct from `SettingsSection`, which titles a block *inside* the screen:
 * that one draws at the paragraph size deliberately, so it does not compete
 * with this. This is the screen's own heading and takes a real heading step.
 */
export const SettingsHeader = forwardRef<HTMLElement, SettingsHeaderProps>(function SettingsHeader(
  {
    title,
    description,
    onBack,
    backLabel = 'Back',
    actions,
    renderTitle,
    paddingX,
    paddingY,
    paddingBottom,
    fontSize,
    titleColor,
    descriptionColor,
    ...rest
  },
  ref,
) {
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: settingsHeader.gap,
    boxSizing: 'border-box',
    width: '100%',
    paddingTop: len(paddingY) ?? `${settingsHeader.paddingY}px`,
    paddingBottom: len(paddingBottom) ?? len(paddingY) ?? `${settingsHeader.paddingY}px`,
    paddingLeft: len(paddingX) ?? `${settingsHeader.paddingX}px`,
    paddingRight: len(paddingX) ?? `${settingsHeader.paddingX}px`,
    fontFamily: typography.fontFamily.base,
  };

  const defaultTitle = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: settingsHeader.titleGap,
        flex: '1 1 auto',
        minWidth: 0,
      }}
    >
      <span
        style={{
          ...typography.textStyle.h4,
          fontSize: len(fontSize) ?? typography.fontSize.h4,
          color: titleColor ?? color.main.black,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>
      {description && (
        <span
          style={{
            ...typography.textStyle.lRegular,
            color: descriptionColor ?? color.navbar.text,
          }}
        >
          {description}
        </span>
      )}
    </div>
  );

  return (
    <header {...rest} ref={ref} style={style}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: settingsHeader.iconSize,
            height: settingsHeader.iconSize,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: color.navbar.text,
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <Icon icon={IconDropdownArrowLeft} size="100%" />
        </button>
      )}
      {renderTitle
        ? renderTitle({ title, description, defaultRender: defaultTitle })
        : defaultTitle()}
      {actions}
    </header>
  );
});
