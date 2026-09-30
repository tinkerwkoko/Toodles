import { NavLink, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { MOBILE_ITEMS } from '../../lib/nav';
import { cx } from '../../lib/cx';
import { useUi } from '../../store/useUi';

/** Phone navigation: Home · Tasks · + · Projects · Settings. */
export function BottomNav() {
  const { openQuickCreate } = useUi();
  const location = useLocation();
  const [home, tasks, projects, settings] = MOBILE_ITEMS;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-lilac-200 bg-cream/95 pb-safe backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-1">
        {[home, tasks].map((item) => (
          <MobileLink key={item.to} item={item} active={isActive(location.pathname, item.to)} />
        ))}

        <li className="relative flex flex-1 items-start justify-center">
          <button
            type="button"
            onClick={openQuickCreate}
            aria-label="Create something"
            className="-mt-6 grid h-15 w-15 place-items-center rounded-full border-4 border-lilac-50 bg-lilac-300 text-ink shadow-lift transition active:scale-95 hover:bg-lilac-600"
          >
            <Plus size={28} strokeWidth={2.6} aria-hidden="true" />
          </button>
        </li>

        {[projects, settings].map((item) => (
          <MobileLink key={item.to} item={item} active={isActive(location.pathname, item.to)} />
        ))}
      </ul>
    </nav>
  );
}

function isActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

interface MobileLinkProps {
  item: (typeof MOBILE_ITEMS)[number];
  active: boolean;
}

function MobileLink({ item, active }: MobileLinkProps) {
  const Icon = item.icon;
  return (
    <li className="flex-1">
      <NavLink
        to={item.to}
        className={cx(
          'flex min-h-15 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[0.7rem] font-bold transition',
          active ? 'text-lilac-700' : 'text-ink-soft',
        )}
      >
        <span
          className={cx(
            'grid h-8 w-12 place-items-center rounded-full transition',
            active ? 'bg-lilac-100 text-lilac-700' : 'text-ink-soft',
          )}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
        {item.shortLabel}
      </NavLink>
    </li>
  );
}
