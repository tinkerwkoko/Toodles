import type { Project, Task } from '../../types';
import { groupByDate } from '../../lib/archive';
import { formatDay } from '../../lib/date';
import { EmptyState } from '../ui/EmptyState';
import { CompletedRow } from './CompletedRow';
import { cx } from '../../lib/cx';

export interface CompletedByDateProps {
  tasks: Task[];
  projects: Project[];
  selectedYear: string;
  onOpen: (task: Task) => void;
  /** Called when the chosen year has nothing in it. */
  onBackToProjects: () => void;
}

/** Archive grouped Year → Month → Day → tasks, for one chosen year. */
export function CompletedByDate({
  tasks,
  projects,
  selectedYear,
  onOpen,
  onBackToProjects,
}: CompletedByDateProps) {
  const year = groupByDate(tasks).find((group) => group.year === selectedYear) ?? null;

  if (!year) {
    return (
      <EmptyState
        pose="sleepy"
        title={`Nothing finished in ${selectedYear}`}
        sentence="That year is still blank. Finish a task and it will show up here on its own."
        actionLabel="Back to projects"
        onAction={onBackToProjects}
      />
    );
  }

  return (
    <div className="space-y-6">
      {year.months.map((month) => (
        <section key={`${year.year}-${month.month}`} className="space-y-3">
          <h2 className="text-lg text-lilac-700">
            {month.label}{' '}
            <span className="text-sm font-semibold text-ink-soft">{year.year}</span>
            <span className="ml-2 rounded-full bg-lilac-100 px-2 py-0.5 text-xs font-bold text-lilac-700">
              {month.days.reduce((sum, day) => sum + day.tasks.length, 0)}
            </span>
          </h2>

          {month.days.map((day) => (
            <div key={day.date} className="space-y-2">
              <h3 className={cx('text-sm font-bold text-ink-soft')}>{formatDay(day.date)}</h3>
              <ul className="space-y-2">
                {day.tasks.map((task) => (
                  <CompletedRow
                    key={task.id}
                    task={task}
                    project={projects.find((project) => project.id === task.projectId) ?? null}
                    onOpen={onOpen}
                  />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
