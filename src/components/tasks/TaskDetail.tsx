import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, FolderHeart, Repeat, Trash2 } from 'lucide-react';
import type { Task } from '../../types';
import { PRIORITY_STYLES, accent } from '../../lib/color';
import { formatDay, formatEstimate, formatTimestamp } from '../../lib/date';
import { REPEAT_LABELS } from '../../lib/task';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { TaskCheckbox } from '../ui/TaskCheckbox';
import { SubtaskChecklist } from './SubtaskChecklist';
import { TaskForm } from './TaskForm';
import { formValuesToTaskPatch, taskToFormValues } from './taskFormValues';
import { cx } from '../../lib/cx';
import { useToodles } from '../../store/useToodles';
import { useUi } from '../../store/useUi';

export interface TaskDetailProps {
  task: Task;
  onDeleted?: () => void;
}

/** Everything about one task: status, subtasks and editable fields. */
export function TaskDetail({ task, onDeleted }: TaskDetailProps) {
  const { data, actions } = useToodles();
  const { pushToast, celebrate } = useUi();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = data.projects.find((item) => item.id === task.projectId);
  const tone = accent(task.color);
  const done = task.status === 'done';

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <TaskCheckbox
          checked={done}
          color={task.color}
          label={done ? `Reopen ${task.title}` : `Complete ${task.title}`}
          onChange={() => {
            actions.toggleTaskDone(task.id);
            if (!done) {
              celebrate(task.id);
              pushToast(`“${task.title}” done ✨`, 'success');
            }
          }}
          className="mt-1"
        />
        <div className="min-w-0 flex-1">
          <h2
            className={cx(
              'font-display text-2xl leading-snug wrap-break-word',
              done ? 'text-ink-soft line-through' : 'text-lilac-700',
            )}
          >
            {task.title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Chip tone={cx(tone.soft, tone.border, tone.text)}>
              {done ? 'Completed' : 'Still open'}
            </Chip>
            {project && (
              <Chip tone={cx(tone.soft, tone.border, tone.text)}>
                <FolderHeart size={13} aria-hidden="true" />
                {project.emoji} {project.name}
              </Chip>
            )}
            {task.dueDate && (
              <Chip>
                <CalendarDays size={13} aria-hidden="true" />
                {formatDay(task.dueDate, { withYear: 'auto' })}
              </Chip>
            )}
            {task.estimate ? (
              <Chip>
                <Clock size={13} aria-hidden="true" />
                {formatEstimate(task.estimate)}
              </Chip>
            ) : null}
            {task.priority !== 'none' && (
              <Chip tone={PRIORITY_STYLES[task.priority].chip}>
                {PRIORITY_STYLES[task.priority].label} priority
              </Chip>
            )}
            {task.repeat !== 'none' && (
              <Chip>
                <Repeat size={13} aria-hidden="true" />
                {REPEAT_LABELS[task.repeat]}
              </Chip>
            )}
          </div>

          <p className="mt-2 text-xs text-ink-soft">
            Added {formatTimestamp(task.createdAt)}
            {task.completedAt ? ` · Completed ${formatTimestamp(task.completedAt)}` : ''}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-lilac-200 bg-lilac-50/70 p-4">
        <SubtaskChecklist task={task} />
      </div>

      {project && (
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-lilac-700 hover:underline"
        >
          <FolderHeart size={16} aria-hidden="true" />
          Open {project.name}
        </Link>
      )}

      <section className="rounded-3xl border border-lilac-200 bg-cream p-4">
        <h3 className="mb-3 text-base">Edit details</h3>
        <TaskForm
          key={task.id}
          initial={taskToFormValues(task)}
          submitLabel="Save changes"
          hint="Changes are saved into this browser only."
          onSubmit={(values) => {
            actions.updateTask(task.id, formValuesToTaskPatch(values, task));
            pushToast('Changes saved', 'success');
          }}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-3xl border border-dashed border-rose-200 bg-rose-100/40 p-3">
        <p className="text-sm text-ink-soft">Done with this one for good?</p>
        <Button
          variant="ghost"
          className="text-rose-700 hover:bg-rose-100"
          icon={<Trash2 size={16} aria-hidden="true" />}
          onClick={() => setConfirmDelete(true)}
        >
          Delete task
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Tuck this task away for good?"
        body={<p>“{task.title}” and its steps will be removed. This cannot be undone.</p>}
        confirmLabel="Delete task"
        tone="danger"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          actions.deleteTask(task.id);
          setConfirmDelete(false);
          onDeleted?.();
          pushToast('Task deleted');
        }}
      />
    </div>
  );
}
