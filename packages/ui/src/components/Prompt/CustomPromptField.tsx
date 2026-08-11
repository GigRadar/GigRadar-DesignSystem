import { color, component, typography } from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type TextareaHTMLAttributes,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconCopyDocumentStroke, IconExpandCorner } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';

const { prompt } = component;

/** Floor for a corner drag, so the field cannot be collapsed to nothing. */
const MIN_DRAG_HEIGHT = 48;

/** What the copy button gets when a caller replaces it. */
export type CopyButtonRenderProps = WithDefaultRender & {
  /** Puts the field's current text on the clipboard. */
  copy: () => void;
  /** True for a moment after a successful copy, for a "Copied" label. */
  copied: boolean;
};

/** Per-instance overrides for the field's own metrics. */
export type CustomPromptFieldStyleProps = {
  /** Horizontal padding inside the box. */
  paddingX?: CssLength;
  /** Vertical padding inside the box. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Mono type size. */
  fontSize?: CssLength;
  /** Ratio between lines of prompt text. */
  lineHeight?: number;
  /** Visible height before the text scrolls. */
  minHeight?: CssLength;
  /** Box fill. */
  background?: string;
  /** Text color. */
  textColor?: string;
  /** Border color. Set `borderWidth` to 0 to remove the border entirely. */
  borderColor?: string;
  /** Border thickness. */
  borderWidth?: CssLength;
};

/**
 * The handle a caller gets from `ref`, for the one thing a plain textarea ref
 * cannot do on its own.
 *
 * The textarea itself is still reachable as `.element`, so nothing is hidden —
 * this only adds the operation the variable chips need.
 */
export type CustomPromptFieldHandle = {
  /** The underlying textarea, for focus, selection, or measurement. */
  element: HTMLTextAreaElement | null;
  /**
   * Drops `text` at the caret, replacing any selection, and leaves the caret
   * after what was inserted.
   *
   * This is why the handle exists. Insertion has to happen against the live
   * DOM selection — a caller working only from `value` has no caret to insert
   * at, so every app would otherwise reimplement the same selection math.
   */
  insertAtCursor: (text: string) => void;
  /** Moves focus into the field. */
  focus: () => void;
};

export type CustomPromptFieldProps = {
  /** The prompt text. Controlled. */
  value?: string;
  /** Initial text when the field manages its own state. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * Whether the field shows the corner grip and can be dragged taller.
   *
   * Figma draws the grip at 30% opacity on every variant, so this is on by
   * default. `false` renders a fixed-height box with no corner.
   *
   * @default true
   */
  resizable?: boolean;
  /**
   * Shows a copy button pinned to the top-right corner.
   *
   * Figma's `copyButton` variant. Off by default — the settings card does not
   * draw it, only the standalone field does.
   *
   * @default false
   */
  copyButton?: boolean;
  /**
   * Replaces the copy button. Call `defaultRender()` to decorate rather than
   * replace it.
   *
   * The field draws a working button on its own, so `copyButton` alone is
   * enough — this is for changing the label, swapping in a different control,
   * or wrapping it in a tooltip.
   */
  renderCopyButton?: RenderProp<CopyButtonRenderProps>;
} & CustomPromptFieldStyleProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'className' | 'style' | 'value' | 'defaultValue' | 'onChange'
  >;

/**
 * The custom prompt field — a mono textarea that scrolls and can be dragged
 * taller.
 *
 * Figma: node 3770:117 ("Custom Prompt Field"). A pale blue box, 12px padding,
 * 11px Menlo text, with a scrollbar down the right edge and a resize corner
 * bottom-right.
 *
 * The corner is `IconExpandCorner` over a pointer-drag handler rather than the
 * textarea's native `resize` grip. The native one is painted by the browser,
 * cannot be styled, and differs per engine — so the one thing it could never do
 * is match the icon Figma draws.
 *
 * Figma draws its own 8px scrollbar thumb because Figma has no native
 * scrollbars. The browser does, so this styles the real one — `scrollbar-width:
 * thin` plus the WebKit pseudo-elements — instead of shipping a custom scroll
 * container. A hand-built scrollbar would have to reimplement wheel physics,
 * keyboard paging, and touch momentum to match what is already there, and it
 * would drop the caret-follows-scroll behavior a textarea needs.
 *
 * The scrollbar rules live in a per-instance `<style>` tag keyed to a data
 * attribute, since WebKit's scrollbar pseudo-elements cannot be expressed in
 * the inline `style` object every other component in this package uses.
 */
export const CustomPromptField = forwardRef<CustomPromptFieldHandle, CustomPromptFieldProps>(
  function CustomPromptField(
    {
      value,
      defaultValue = '',
      onChange,
      resizable = true,
      copyButton = false,
      renderCopyButton,
      paddingX,
      paddingY,
      radius,
      fontSize,
      lineHeight,
      minHeight,
      background,
      textColor,
      borderColor,
      borderWidth,
      ...rest
    },
    ref,
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [copied, setCopied] = useState(false);

    const isControlled = value !== undefined;
    const text = isControlled ? value : uncontrolled;

    const commit = useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolled(next);
        onChange?.(next);
      },
      [isControlled, onChange],
    );

    useImperativeHandle(
      ref,
      () => ({
        element: textareaRef.current,
        focus: () => textareaRef.current?.focus(),
        insertAtCursor: (insert: string) => {
          const node = textareaRef.current;
          if (!node) return;

          // Read the caret off the DOM, not off `text`: with a controlled
          // value the two agree, but the selection is the only place the caret
          // exists at all.
          const start = node.selectionStart ?? node.value.length;
          const end = node.selectionEnd ?? start;
          const next = `${node.value.slice(0, start)}${insert}${node.value.slice(end)}`;

          commit(next);

          // The caret has to be restored after React writes the new value,
          // otherwise the browser parks it at the end of the field.
          const caret = start + insert.length;
          requestAnimationFrame(() => {
            node.focus();
            node.setSelectionRange(caret, caret);
          });
        },
      }),
      [commit],
    );

    const copy = useCallback(() => {
      void navigator.clipboard?.writeText(text).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      });
    }, [text]);

    /**
     * Starts a corner drag.
     *
     * The native `resize` handle is switched off and this replaces it, because
     * the browser paints that grip itself — it cannot be styled, and it looks
     * different in every engine, so the one thing it could not do is match the
     * icon Figma draws.
     *
     * Pointer capture means the drag survives the cursor leaving the corner,
     * which it immediately does; without it a fast drag stops the moment the
     * pointer outruns the 24px hit area.
     */
    const startResize = useCallback((event: React.PointerEvent<HTMLElement>) => {
      const node = textareaRef.current;
      if (!node) return;

      event.preventDefault();
      const startY = event.clientY;
      const startHeight = node.getBoundingClientRect().height;
      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);

      const onMove = (move: PointerEvent) => {
        // Floored at one line, so the field cannot be dragged shut.
        node.style.height = `${Math.max(MIN_DRAG_HEIGHT, startHeight + move.clientY - startY)}px`;
      };
      const onUp = () => {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
      };

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    }, []);

    const scopeId = useRef(`gr-prompt-${Math.random().toString(36).slice(2, 9)}`).current;

    const wrapperStyle: CSSProperties = {
      position: 'relative',
      display: 'flex',
      boxSizing: 'border-box',
      width: '100%',
      borderRadius: len(radius) ?? `${prompt.field.radius}px`,
      backgroundColor: background ?? color.main.background,
      // The field's fill is the page background, so without an edge of its own
      // it disappears into any surface it sits on. Inside the AI Configuration
      // card the card draws the edge and passes `borderWidth={0}`; everywhere
      // else the field has to draw its own.
      border: `${len(borderWidth) ?? '1px'} solid ${borderColor ?? color.navbar.hover}`,
      overflow: 'hidden',
    };

    const textareaStyle: CSSProperties = {
      flex: '1 1 auto',
      boxSizing: 'border-box',
      width: '100%',
      minHeight: len(minHeight) ?? `${prompt.field.minHeight}px`,
      padding: `${len(paddingY) ?? `${prompt.field.paddingY}px`} ${
        len(paddingX) ?? `${prompt.field.paddingX}px`
      }`,
      border: 'none',
      outline: 'none',
      // Always off — the corner grip below replaces it, so the browser's own
      // unstyleable handle would only draw a second one.
      resize: 'none',
      backgroundColor: 'transparent',
      color: textColor ?? color.main.description,
      fontFamily: typography.fontFamily.mono,
      fontSize: len(fontSize) ?? `${prompt.field.fontSize}px`,
      lineHeight: lineHeight ?? prompt.field.lineHeight,
      // The design's tab stops are meaningful in a prompt, so the text wraps
      // rather than scrolling sideways.
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
      scrollbarWidth: 'thin',
      scrollbarColor: `${SCROLLBAR_THUMB} transparent`,
    };

    return (
      <div style={wrapperStyle} data-gr-prompt-field={scopeId}>
        <style>{scrollbarCss(scopeId)}</style>
        <textarea
          {...rest}
          ref={textareaRef}
          value={text}
          onChange={(event) => commit(event.target.value)}
          style={textareaStyle}
          spellCheck={rest.spellCheck ?? false}
        />
        {resizable && (
          <span
            onPointerDown={startResize}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize the prompt field"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              width: prompt.field.resizeHandleSize,
              height: prompt.field.resizeHandleSize,
              // Figma draws the grip at 30% — present, but never competing
              // with the prompt text for attention.
              opacity: 0.3,
              color: textColor ?? color.main.description,
              cursor: 'ns-resize',
              touchAction: 'none',
            }}
          >
            <Icon icon={IconExpandCorner} size={prompt.field.resizeHandleSize} />
          </span>
        )}
        {copyButton && (
          <div style={{ position: 'absolute', top: prompt.field.paddingY, right: prompt.field.paddingX }}>
            {(() => {
              const defaultRender = () => (
                <Button
                  variant="secondary"
                  size="small"
                  // Sized by Button's own `iconSize` step, not a literal here.
                  startIcon={<Icon icon={IconCopyDocumentStroke} size="100%" />}
                  onClick={copy}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              );
              return renderCopyButton
                ? renderCopyButton({ copy, copied, defaultRender })
                : defaultRender();
            })()}
          </div>
        )}
      </div>
    );
  },
);

/** Figma's thumb gray (#C1C1C1), the one color in this file with no token. */
const SCROLLBAR_THUMB = '#C1C1C1';

/**
 * WebKit scrollbar rules, scoped to one field instance.
 *
 * Chrome and Safari ignore `scrollbar-width`/`scrollbar-color`, so the pale
 * 8px pill Figma draws needs these pseudo-elements. Firefox uses the standard
 * properties set inline above and ignores this block.
 */
function scrollbarCss(scopeId: string): string {
  const selector = `[data-gr-prompt-field="${scopeId}"] textarea`;
  return `
${selector}::-webkit-scrollbar { width: ${prompt.field.scrollbarWidth}px; }
${selector}::-webkit-scrollbar-track { background: transparent; }
${selector}::-webkit-scrollbar-thumb {
  background-color: ${SCROLLBAR_THUMB};
  border-radius: ${prompt.field.scrollbarWidth / 2}px;
}
`.trim();
}
