import { Check } from 'lucide-react';
import type { AccentColor } from '../../types';
import { accent } from '../../lib/color';
import { cx } from '../../lib/cx';

export interface TaskCheckboxProps {
  checked: boolean;
  onChange: () => void;
  /** Required: describes the thing being ticked. */
  label: string;
  color?: AccentColor;
  size?: 'sm' | 'md';
  className?: string;
}

/** Round tick box. State is shown with a tick and strikethrough, not colour alone. */
export function TaskCheckbox({
  checked,
  onChange,
  label,
  color = 'lilac',
  size = 'md',
  className,
}: TaskCheckboxProps) {
  const tone = accent(color);
  const dimension = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7';
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onChange();
      }}
      className={cx(
        'grid shrink-0 place-items-center rounded-full border-2 transition duration-200',
        dimension,
        checked ? cx(tone.solid, 'border-transparent') : 'border-lilac-300 bg-cream hover:border-lilac-500',
        className,
      )}
    >
      {checked && (
        <Check
          size={size === 'sm' ? 14 : 16}
          strokeWidth={3.5}
          aria-hidden="true"
          className="motion-safe:animate-pop"
        />
      )}
    </button>
  );
}
