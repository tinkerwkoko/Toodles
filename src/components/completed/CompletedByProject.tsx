import type { Project, Task } from '../../types';
import { accent } from '../../lib/color';
import { groupByProject } from '../../lib/archive';
import { CompletedRow } from './CompletedRow';
import { cx } from '../../lib/cx';

export interface CompletedByProjectProps {
  tasks: Task[];
  projects: Project[];
  onOpen: (task: Task) => void;
}

/** Archive grouped by project, with a friendly group for projectless tasks. */
export function CompletedByProject({ tasks, projects, onOpen }: CompletedByProjectProps) {
  const groups = groupByProject(tasks, projects);

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const tone = accent(group.project?.color ?? 'lilac');
        const name = group.project ? `${group.project.emoji} ${group.project.name}` : 'No project';
        return (
          <section key={group.project?.id ?? 'no-project'} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cx('h-3 w-3 rounded-full', group.project ? tone.mid : 'bg-lilac-200')}
              />
              <h2 className={cx('text-lg', group.project ? tone.text : 'text-lilac-700')}>{name}</h2>
              <span className="rounded-full bg-lilac-100 px-2 py-0.5 text-xs font-bold text-lilac-700">
                {group.tasks.length}
              </span>
            </div>
            <ul className="space-y-2">
              {group.tasks.map((task) => (
                <CompletedRow
                  key={task.id}
                  task={task}
                  project={group.project}
                  onOpen={onOpen}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
