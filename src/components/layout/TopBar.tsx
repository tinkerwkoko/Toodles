import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import { Cat } from '../Cat';
import { Button } from '../ui/Button';
import { useUi } from '../../store/useUi';
import { useToodles } from '../../store/useToodles';

/** Mobile brand row + desktop search box and "New task" button. */
export function TopBar() {
  const { openQuickCreate, searchTerm, setSearchTerm } = useUi();
  const { data } = useToodles();
  const navigate = useNavigate();
  const location = useLocation();

  const searching = searchTerm.trim().length > 0;

  function updateSearch(value: string): void {
    setSearchTerm(value);
    if (value.trim().length > 0 && location.pathname !== '/tasks') {
      navigate('/tasks');
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-lilac-200/80 bg-lilac-50/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 md:hidden"
          aria-label="Toodles — go to overview"
        >
          <Cat pose="curious" size={34} animated={false} />
          <span className="font-display text-xl text-lilac-700">Toodles</span>
        </Link>

        <div className="hidden flex-1 items-center gap-2 md:flex">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lilac-500"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search tasks, notes and tags"
              aria-label="Search everything"
              className="w-full rounded-full border border-lilac-200 bg-cream py-2.5 pr-10 pl-11 text-sm transition focus:border-lilac-400 focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-lilac-700 hover:bg-lilac-100"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="ml-auto hidden text-xs font-semibold text-ink-soft lg:block">
            {data.tasks.filter((task) => task.status === 'todo').length} open ·{' '}
            {data.projects.length} projects
          </p>
        </div>

        <Button
          className="hidden md:inline-flex lg:ml-0"
          onClick={openQuickCreate}
          icon={<Plus size={18} aria-hidden="true" />}
        >
          New
        </Button>
      </div>
    </header>
  );
}
