import { NavLink } from 'react-router-dom';
import { Cat } from '../Cat';
import { NAV_ITEMS, OVERDUE_ITEM } from '../../lib/nav';
import { cx } from '../../lib/cx';
import { useToodles } from '../../store/useToodles';

/** Full desktop sidebar (lg and up): brand, navigation, privacy note. */
export function Sidebar() {
  const { data } = useToodles();
  const overdueCount = data.tasks.filter(
    (task) =>
      task.status === 'todo' &&
      !!task.dueDate &&
      task.dueDate < new Date().toISOString().slice(0, 10),
  ).length;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-lilac-200 bg-lilac-100 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <Cat pose="curious" size={54} animated={false} />
        <div className="min-w-0">
          <p className="font-display text-2xl leading-none text-ink">Toodles</p>
          <p className="truncate text-xs font-semibold text-ink-soft">Small tasks, big calm.</p>
        </div>
      </div>

      <nav aria-label="Sections" className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <SidebarLink
                to={item.to}
                label={item.label}
                icon={item.icon}
                badge={item.to === '/upcoming' && overdueCount > 0 ? overdueCount : undefined}
              />
            </li>
          ))}
          <li className="pt-1 pl-2">
            <SidebarLink
              to={OVERDUE_ITEM.to}
              label={OVERDUE_ITEM.label}
              icon={OVERDUE_ITEM.icon}
              subtle
            />
          </li>
        </ul>
      </nav>

      <p className="border-t border-lilac-200 px-5 py-4 text-xs leading-relaxed text-ink-soft">
        Everything you write stays in this browser. Nothing is uploaded anywhere.
      </p>
    </aside>
  );
}

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: (typeof NAV_ITEMS)[number]['icon'];
  badge?: number;
  subtle?: boolean;
}

function SidebarLink({ to, label, icon: Icon, badge, subtle = false }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cx(
          'flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2 text-[0.95rem] font-bold transition',
          isActive
            ? 'bg-lilac-300 text-ink'
            : 'text-ink hover:bg-lilac-200/60',
          subtle && 'text-sm font-semibold text-ink-soft',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={19} aria-hidden="true" className={isActive ? 'text-ink' : 'text-ink-soft'} />
          <span className="flex-1 truncate">{label}</span>
          {typeof badge === 'number' && badge > 0 && (
            <span
              className={cx(
                'rounded-full px-2 py-0.5 text-xs font-bold',
                isActive ? 'bg-cream/70 text-ink' : 'bg-rose-100 text-ink',
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
