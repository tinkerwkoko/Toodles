import { Search, X } from 'lucide-react';
import type { Priority, Project } from '../../types';
import { PRIORITY_KEYS, PRIORITY_STYLES } from '../../lib/color';
import { TASK_SORT_LABELS, type TaskSort } from '../../lib/task';
import { Card } from '../ui/Card';
import { Select } from '../ui/Field';
import { cx } from '../../lib/cx';

export interface TaskFilterState {
  projectId: string;
  priority: Priority | 'all';
  tag: string;
  sort: TaskSort;
}

export const DEFAULT_FILTERS: TaskFilterState = {
  projectId: 'all',
  priority: 'all',
  tag: 'all',
  sort: 'smart',
};

export interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (patch: Partial<TaskFilterState>) => void;
  projects: Project[];
  tags: string[];
  query: string;
  onQueryChange: (value: string) => void;
  /** Hidden on desktop where the top bar already has a search box. */
  showSearch?: boolean;
}

export function TaskFilters({
  filters,
  onChange,
  projects,
  tags,
  query,
  onQueryChange,
  showSearch = true,
}: TaskFiltersProps) {
  const active =
    filters.projectId !== 'all' ||
    filters.priority !== 'all' ||
    filters.tag !== 'all' ||
    filters.sort !== 'smart';

  return (
    <Card padding="sm" className="mb-4 md:mb-5">
      <div className="flex flex-col gap-2">
        {showSearch && (
          <div className="relative">
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lilac-500"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search your tasks"
              aria-label="Search your tasks"
              className="w-full rounded-2xl border border-lilac-200 bg-cream py-2.5 pr-10 pl-10 text-sm focus:border-lilac-400 focus:outline-none focus:ring-4 focus:ring-lilac-200/60"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-lilac-700 hover:bg-lilac-100"
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <label className="sr-only" htmlFor="filter-project">
            Filter by project
          </label>
          <Select
            id="filter-project"
            compact
            value={filters.projectId}
            onChange={(event) => onChange({ projectId: event.target.value })}
          >
            <option value="all">All projects</option>
            <option value="none">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.emoji} {project.name}
              </option>
            ))}
          </Select>

          <label className="sr-only" htmlFor="filter-priority">
            Filter by priority
          </label>
          <Select
            id="filter-priority"
            compact
            value={filters.priority}
            onChange={(event) =>
              onChange({ priority: event.target.value as Priority | 'all' })
            }
          >
            <option value="all">Any priority</option>
            {PRIORITY_KEYS.filter((key) => key !== 'none').map((key) => (
              <option key={key} value={key}>
                {PRIORITY_STYLES[key].label}
              </option>
            ))}
          </Select>

          <label className="sr-only" htmlFor="filter-tag">
            Filter by tag
          </label>
          <Select
            id="filter-tag"
            compact
            value={filters.tag}
            onChange={(event) => onChange({ tag: event.target.value })}
            disabled={tags.length === 0}
          >
            <option value="all">{tags.length === 0 ? 'No tags yet' : 'Any tag'}</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </Select>

          <label className="sr-only" htmlFor="filter-sort">
            Sort tasks
          </label>
          <Select
            id="filter-sort"
            compact
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as TaskSort })}
          >
            {(Object.keys(TASK_SORT_LABELS) as TaskSort[]).map((key) => (
              <option key={key} value={key}>
                {TASK_SORT_LABELS[key]}
              </option>
            ))}
          </Select>
        </div>

        {active && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className={cx(
              'self-start rounded-full px-3 py-1.5 text-xs font-bold text-lilac-700',
              'bg-lilac-100 transition hover:bg-lilac-200',
            )}
          >
            Clear filters
          </button>
        )}
      </div>
    </Card>
  );
}
