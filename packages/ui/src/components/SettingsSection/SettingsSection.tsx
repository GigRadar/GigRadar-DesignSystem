import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';

const { settingsSection } = component;

/** Per-instance overrides for the section's own metrics. */
export type SettingsSectionStyleProps = {
  /** Horizontal inset. */
  paddingX?: CssLength;
  /** Space between the title block and the content. */
  gap?: CssLength;
  /** Heading type size. */
  fontSize?: CssLength;
  /** Heading color. */
  titleColor?: string;
  /** Description color. */
  descriptionColor?: string;
};

/** What the title block gets when a caller replaces it. */
export type SettingsSectionTitleRenderProps = WithDefaultRender & {
  title: ReactNode;
  description?: ReactNode;
};

export type SettingsSectionProps = {
  /** The heading. Figma draws 14px Medium in black. */
  title: ReactNode;
  /** The line under it explaining what the section does. */
  description?: ReactNode;
  /** The section's content — a card, a list, a row of controls. */
  children?: ReactNode;
  /**
   * Replaces the title block, keeping the section's spacing and inset.
   *
   * Call `defaultRender()` to decorate rather than replace — a section that
   * needs a badge or a link beside its heading is the common case.
   */
  renderTitle?: RenderProp<SettingsSectionTitleRenderProps>;
} & SettingsSectionStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'title'>;

/**
 * One titled block of a settings screen.
 *
 * Figma: node 3770:886 ("Custom Prompt") and the three siblings beside it on
 * the AI Configuration page — Mention Presets, Auto Reply, Agent Tools. All
 * four are the same shape: a 14px Medium heading, a 14px regular description
 * in the nav grey, and the section's content below.
 *
 * Note the heading is NOT a heading type style — Figma draws it at the
 * paragraph size, the same as its own description. That is deliberate: these
 * are blocks within one screen, and a heading step would compete with the
 * screen's own title above them.
 */
export const SettingsSection = forwardRef<HTMLElement, SettingsSectionProps>(
  function SettingsSection(
    {
      title,
      description,
      children,
      renderTitle,
      paddingX,
      gap,
      fontSize,
      titleColor,
      descriptionColor,
      ...rest
    },
    ref,
  ) {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: len(gap) ?? `${settingsSection.gap}px`,
      boxSizing: 'border-box',
      width: '100%',
      padding: `0 ${len(paddingX) ?? `${settingsSection.paddingX}px`}`,
      fontFamily: typography.fontFamily.base,
    };

    const defaultTitle = () => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: settingsSection.titleGap,
          width: '100%',
        }}
      >
        <span
          style={{
            ...typography.textStyle.mMedium,
            fontSize: len(fontSize) ?? settingsSection.fontSize,
            color: titleColor ?? color.main.black,
          }}
        >
          {title}
        </span>
        {description && (
          <span
            style={{
              ...typography.textStyle.mRegular,
              color: descriptionColor ?? color.navbar.text,
            }}
          >
            {description}
          </span>
        )}
      </div>
    );

    return (
      <section {...rest} ref={ref} style={style}>
        {renderTitle
          ? renderTitle({ title, description, defaultRender: defaultTitle })
          : defaultTitle()}
        {children}
      </section>
    );
  },
);
