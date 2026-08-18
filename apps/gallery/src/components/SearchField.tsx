import { borderWidth, color, controlHeight, radius, spacing, textStyle } from '@gigradar/theme';
import { Icon, IconSearch, IconXClose } from '@gigradar/ui';

export type SearchFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name. The box carries no visible label. */
  label: string;
  placeholder?: string;
  /** Caps the box's width. Unset fills whatever it is given. */
  maxWidth?: number;
};

/**
 * The gallery's search box — a magnifier, a bare input, and a clear button.
 *
 * Gallery chrome rather than a design-system component: `TextField` has no
 * leading slot, and a search affordance is not yet a settled pattern in Figma.
 * Shared here so the nav's search and any in-page search stay the same control
 * rather than drifting into two lookalikes.
 *
 * The clear button appears only once there is something to clear — a dead
 * control sitting in the box reads as broken.
 */
export function SearchField({
  value,
  onValueChange,
  label,
  placeholder = 'Search',
  maxWidth,
}: SearchFieldProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth,
        height: controlHeight.medium,
        padding: `0 ${spacing.xs}px`,
        borderRadius: radius.xs,
        border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
        backgroundColor: color.main.white,
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          flexShrink: 0,
          width: 14,
          height: 14,
          color: color.navbar.text,
        }}
      >
        <Icon icon={IconSearch} size="100%" />
      </span>
      <input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{
          ...textStyle.mRegular,
          flex: '1 1 auto',
          minWidth: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: color.main.black,
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange('')}
          aria-label="Clear search"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 16,
            height: 16,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: color.navbar.text,
            cursor: 'pointer',
          }}
        >
          <Icon icon={IconXClose} size="100%" />
        </button>
      )}
    </label>
  );
}
