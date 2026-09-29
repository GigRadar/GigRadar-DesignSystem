import { borderWidth, color, component, shadow, typography } from '@gigradar/theme';
import { forwardRef, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown, IconDropdownArrowUp } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { useInDevelopmentWarning } from '../Lifecycle/inDevelopment.js';

const { templatePicker } = component.autoReply;

/** One starting point for the all-other-replies prompt. */
export type ReplyTemplate = {
  /** Stable identity, echoed back by `onChange`. */
  id: string;
  /** What the menu and the button say — "Answer, then book a call". */
  name: string;
  /** The prompt text picking it fills in. Empty for "write my own". */
  prompt: string;
};

export type ReplyTemplatePickerProps = {
  /** The templates on offer, in menu order. */
  templates: ReplyTemplate[];
  /** Id of the chosen template. Falls back to the first. */
  value?: string;
  /** Called with the picked template — fill the prompt field from `template.prompt`. */
  onChange?: (template: ReplyTemplate) => void;
  /** The label above the button. Pass `null` to drop it. */
  label?: ReactNode;
  disabled?: boolean;
};

/**
 * The reply-template picker on the all-other-replies tab — BF-4113.
 *
 * A button naming the current template, and a list under it. Picking one
 * hands the template back so the caller can fill the prompt field below; the
 * field stays editable, so a template is a starting point rather than a lock.
 *
 * Deliberately minimal. BF-4111 is building the custom prompt's template
 * picker, and this one is swapped for that component once it ships — so
 * nothing here tries to be more than a menu.
 *
 * @experimental In development (BF-4113): published so apps can build against it,
 * but the design is not signed off yet, so props and look may change in a minor release.
 */
export const ReplyTemplatePicker = forwardRef<HTMLDivElement, ReplyTemplatePickerProps>(
  function ReplyTemplatePicker(
    { templates, value, onChange, label = 'Reply template', disabled = false },
    ref,
  ) {
    useInDevelopmentWarning('ReplyTemplatePicker', 'BF-4113');
    const [open, setOpen] = useState(false);
    const anchor = useRef<HTMLDivElement>(null);
    const listId = useId();
    const current = templates.find((t) => t.id === value) ?? templates[0];

    // A menu closes on a click anywhere else and on Escape, as any menu does.
    useEffect(() => {
      if (!open) return undefined;
      const onPointer = (event: PointerEvent) => {
        if (!anchor.current?.contains(event.target as Node)) setOpen(false);
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOpen(false);
      };
      document.addEventListener('pointerdown', onPointer);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('pointerdown', onPointer);
        document.removeEventListener('keydown', onKey);
      };
    }, [open]);

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: templatePicker.gap,
          fontFamily: typography.fontFamily.base,
        }}
      >
        {label !== null && (
          <span style={{ ...typography.textStyle.mMedium, color: color.main.black }}>{label}</span>
        )}
        <div ref={anchor} style={{ position: 'relative', alignSelf: 'flex-start' }}>
          <Button
            variant="secondary"
            size="medium"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            endIcon={<Icon icon={open ? IconDropdownArrowUp : IconDropdownArrowDown} size="100%" />}
            onClick={() => setOpen((v) => !v)}
          >
            {current?.name}
          </Button>

          {open && (
            <div
              id={listId}
              role="listbox"
              style={{
                position: 'absolute',
                top: `calc(100% + ${templatePicker.menuOffset}px)`,
                left: 0,
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: templatePicker.menuGap,
                minWidth: templatePicker.menuMinWidth,
                padding: templatePicker.menuPadding,
                borderRadius: templatePicker.menuRadius,
                border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
                backgroundColor: color.main.white,
                boxShadow: shadow.popup,
              }}
            >
              {templates.map((template) => {
                const selected = template.id === current?.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange?.(template);
                      setOpen(false);
                    }}
                    style={{
                      ...typography.textStyle.mRegular,
                      fontFamily: typography.fontFamily.base,
                      textAlign: 'left',
                      padding: `${templatePicker.itemPaddingY}px ${templatePicker.itemPaddingX}px`,
                      border: 'none',
                      borderRadius: templatePicker.itemRadius,
                      cursor: 'pointer',
                      backgroundColor: selected ? color.badge.background : 'transparent',
                      color: selected ? color.main.black : color.navbar.text2,
                    }}
                  >
                    {template.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  },
);
