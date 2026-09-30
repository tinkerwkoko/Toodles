import type { Task } from '../../types';
import { PRIORITY_STYLES, accent } from '../../lib/color';
import { formatDay, formatEstimate, formatTime, isToday } from '../../lib/date';
import { REPEAT_SHORT, isTaskOverdue, subtaskProgress } from '../../lib/task';
import { AlarmClock, Bell, CalendarDays, Clock, Repeat } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { ProgressBar } from '../ui/ProgressBar';
import { cx } from '../../lib/cx';
import { useToodles } from '../../store/useToodles';

export interface TaskCardMetaProps {
  task: Task;
  showProject?: boolean;
}

/** The little chip row under a task title. Colour is always paired with an icon. */
export function TaskCardMeta({ task, showProject = true }: TaskCardMetaProps) {
  const { data } = useToodles();
  const done = task.status === 'done';
  const overdue = !done && isTaskOverdue(task);
  const progress = subtaskProgress(task);
  const project = data.projects.find((item) => item.id === task.projectId);
  const tone = accent(task.color);

  return (
    <>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {task.dueDate && (
          <Chip
            tone={
              overdue
                ? 'border-rose-200 bg-rose-100 text-rose-700'
                : isToday(task.dueDate)
                  ? 'border-lilac-300 bg-lilac-100 text-lilac-700'
                  : undefined
            }
          >
            {overdue ? (
              <AlarmClock size={13} aria-hidden="true" />
            ) : (
              <CalendarDays size={13} aria-hidden="true" />
            )}
            {overdue ? 'Overdue · ' : ''}
            {formatDay(task.dueDate)}
            {task.dueTime ? ` · ${formatTime(task.dueTime)}` : ''}
          </Chip>
        )}

        {!task.dueDate && task.startDate && (
          <Chip>
            <CalendarDays size={13} aria-hidden="true" /> Starts {formatDay(task.startDate)}
          </Chip>
        )}

        {showProject && project && (
          <Chip tone={cx(tone.soft, tone.border, tone.text)}>
            <span className={cx('h-2.5 w-2.5 rounded-full', tone.mid)} aria-hidden="true" />
            {project.emoji} {project.name}
          </Chip>
        )}

        {task.priority !== 'none' && (
          <Chip tone={PRIORITY_STYLES[task.priority].chip}>
            {PRIORITY_STYLES[task.priority].label} priority
          </Chip>
        )}

        {task.estimate ? (
          <Chip>
            <Clock size={13} aria-hidden="true" />
            {formatEstimate(task.estimate)}
          </Chip>
        ) : null}

        {task.repeat !== 'none' && (
          <Chip>
            <Repeat size={13} aria-hidden="true" />
            {REPEAT_SHORT[task.repeat]}
          </Chip>
        )}

        {task.reminder && (
          <Chip tone="border-butter-200 bg-butter-100 text-butter-700">
            <Bell size={13} aria-hidden="true" />
            Reminder
          </Chip>
        )}

        {task.tags.map((tag) => (
          <Chip key={tag}>#{tag}</Chip>
        ))}

        {done && task.completedAt && (
          <Chip tone="border-mint-200 bg-mint-100 text-mint-700">
            Finished {formatDay(task.completedAt.slice(0, 10))}
          </Chip>
        )}
      </div>

      {progress.total > 0 && (
        <div className="mt-2.5 flex items-center gap-2">
          <ProgressBar
            value={progress.percent}
            label={`Subtasks for ${task.title}`}
            tone={progress.done === progress.total ? 'bg-mint-500' : 'bg-lilac-500'}
            className="max-w-40"
          />
          <span className="text-xs font-bold text-ink-soft">
            {progress.done} / {progress.total} steps
          </span>
        </div>
      )}
    </>
  );
}
