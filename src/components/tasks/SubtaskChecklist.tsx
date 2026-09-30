import { useState } from 'react';
import { Palette, Plus, Trash2 } from 'lucide-react';
import type { AccentColor, Subtask, Task } from '../../types';
import { ACCENT_KEYS, ACCENT_LABELS, accent } from '../../lib/color';
import { subtaskProgress } from '../../lib/task';
import { Button } from '../ui/Button';
import { Menu, type MenuItem } from '../ui/Menu';
import { ProgressBar } from '../ui/ProgressBar';
import { TaskCheckbox } from '../ui/TaskCheckbox';
import { cx } from '../../lib/cx';
import { useToodles } from '../../store/useToodles';

export interface SubtaskChecklistProps {
  task: Task;
}

/** Live subtasks with progress, colours and one-tap adding. */
export function SubtaskChecklist({ task }: SubtaskChecklistProps) {
  const { actions } = useToodles();
  const [draft, setDraft] = useState('');
  const progress = subtaskProgress(task);

  function add(): void {
    const title = draft.trim();
    if (title.length === 0) return;
    actions.addSubtask(task.id, title, task.color);
    setDraft('');
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-base">Little steps</h3>
        <span className="text-xs font-bold text-ink-soft">
          {progress.done} / {progress.total} completed
        </span>
      </div>

      {progress.total > 0 && <ProgressBar value={progress.percent} label="Subtask progress" />}

      {task.subtasks.length > 0 && (
        <ul className="space-y-2">
          {task.subtasks.map((subtask) => (
            <SubtaskRow key={subtask.id} taskId={task.id} subtask={subtask} />
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          placeholder="Add another step..."
          aria-label="Add a subtask"
          className="min-h-11 flex-1 rounded-2xl border border-lilac-200 bg-cream px-3 text-sm focus:border-lilac-400 focus:outline-none focus:ring-4 focus:ring-lilac-200/60"
        />
        <Button
          variant="soft"
          onClick={add}
          disabled={draft.trim().length === 0}
          icon={<Plus size={17} aria-hidden="true" />}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

interface SubtaskRowProps {
  taskId: string;
  subtask: Subtask;
}

function SubtaskRow({ taskId, subtask }: SubtaskRowProps) {
  const { actions } = useToodles();
  const tone = accent(subtask.color);

  const items: MenuItem[] = ACCENT_KEYS.map((key: AccentColor) => ({
    label: ACCENT_LABELS[key],
    icon: <span className={cx('h-3 w-3 rounded-full', accent(key).mid)} aria-hidden="true" />,
    onSelect: () => actions.updateSubtask(taskId, subtask.id, { color: key }),
  }));
  items.push({
    label: 'Remove step',
    icon: <Trash2 size={16} aria-hidden="true" />,
    danger: true,
    onSelect: () => actions.deleteSubtask(taskId, subtask.id),
  });

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-lilac-200 bg-cream px-3 py-2">
      <TaskCheckbox
        size="sm"
        color={subtask.color}
        checked={subtask.done}
        onChange={() => actions.toggleSubtask(taskId, subtask.id)}
        label={subtask.done ? `Reopen ${subtask.title}` : `Complete ${subtask.title}`}
      />
      <span
        className={cx(
          'min-w-0 flex-1 truncate text-sm',
          subtask.done ? 'text-ink-soft line-through' : 'text-ink',
        )}
      >
        {subtask.title}
      </span>
      <Menu label={`Options for ${subtask.title}`} header="Step colour" items={items}>
        <Palette size={17} aria-hidden="true" />
      </Menu>
      <span className={cx('sr-only', tone.text)}>{ACCENT_LABELS[subtask.color]}</span>
    </li>
  );
}
