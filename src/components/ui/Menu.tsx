import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface MenuItem {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  label: string;
  items: MenuItem[];
  children: ReactNode;
  align?: 'left' | 'right';
  buttonClassName?: string;
  /** Optional heading shown at the top of the popover. */
  header?: string;
}

/**
 * Small accessible popover menu. Used for task actions and the mobile
 * "Move to…" alternative to dragging kanban cards.
 */
export function Menu({
  label,
  items,
  children,
  align = 'right',
  buttonClassName,
  header,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent | TouchEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={label}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        className={cx(
          'grid h-11 w-11 place-items-center rounded-full text-lilac-700 transition hover:bg-lilac-100',
          buttonClassName,
        )}
      >
        {children}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={header ?? label}
          className={cx(
            'absolute z-30 mt-1 min-w-48 overflow-hidden rounded-2xl border border-lilac-200 bg-cream shadow-lift motion-safe:animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {header && (
            <p className="border-b border-lilac-100 px-4 py-2 text-xs font-bold tracking-wide text-ink-soft uppercase">
              {header}
            </p>
          )}
          <ul className="max-h-72 overflow-y-auto py-1">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpen(false);
                    item.onSelect();
                  }}
                  className={cx(
                    'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold transition disabled:opacity-40',
                    item.danger
                      ? 'text-rose-700 hover:bg-rose-100'
                      : 'text-ink hover:bg-lilac-100',
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
