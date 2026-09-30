import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Cat } from '../Cat';
import { NAV_ITEMS } from '../../lib/nav';
import { cx } from '../../lib/cx';
import { useUi } from '../../store/useUi';

/** Slim icon rail for tablets (md → lg), so the phone bar never stretches. */
export function IconRail() {
  const { openCreate } = useUi();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-y-0 left-0 z-30 hidden w-19 flex-col items-center gap-1 border-r border-lilac-200 bg-lilac-100/70 py-4 md:flex lg:hidden"
    >
      <span className="mb-2">
        <Cat pose="sleepy" size={40} animated={false} title="Toodles" />
      </span>

      <button
        type="button"
        onClick={() => openCreate('task')}
        aria-label="Create a task"
        className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-lilac-500 text-white shadow-soft transition hover:bg-lilac-600 active:scale-95"
      >
        <Plus size={22} strokeWidth={2.6} aria-hidden="true" />
      </button>

      <ul className="flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="w-full px-2">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              title={item.label}
              className={({ isActive }) =>
                cx(
                  'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.62rem] font-bold transition',
                  isActive
                    ? 'bg-lilac-500 text-white shadow-soft'
                    : 'text-ink-soft hover:bg-lilac-200/60',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={19} aria-hidden="true" className={isActive ? 'text-white' : ''} />
                  <span className="truncate">{item.shortLabel}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
