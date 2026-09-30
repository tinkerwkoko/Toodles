import { Plus, Trash2 } from 'lucide-react';
import { accent } from '../../lib/color';
import { Button } from '../ui/Button';
import { cx } from '../../lib/cx';
import type { TaskFormValues } from './taskFormValues';

export interface SubtaskDraftProps {
  values: TaskFormValues;
  draft: string;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

/** Inline subtask editing while a task is still being created or edited. */
export function SubtaskDrafts({
  values,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
  onRename,
}: SubtaskDraftProps) {
  return (
    <fieldset className="space-y-2 rounded-2xl border border-lilac-200 bg-cream/70 p-3">
      <legend className="px-1 text-sm font-bold text-lilac-700">
        Little steps {values.subtasks.length > 0 && `(${values.subtasks.length})`}
      </legend>

      {values.subtasks.length > 0 && (
        <ul className="space-y-2">
          {values.subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cx('h-2.5 w-2.5 rounded-full', accent(subtask.color).mid)}
              />
              <input
                value={subtask.title}
                onChange={(event) => onRename(subtask.id, event.target.value)}
                aria-label="Subtask title"
                className="min-h-11 flex-1 rounded-xl border border-lilac-200 bg-cream px-3 text-sm focus:border-lilac-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onRemove(subtask.id)}
                aria-label={`Remove subtask ${subtask.title}`}
                className="grid h-11 w-11 place-items-center rounded-full text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder="Break it into small steps..."
          aria-label="Add a subtask"
          className="min-h-11 flex-1 rounded-xl border border-lilac-200 bg-cream px-3 text-sm focus:border-lilac-400 focus:outline-none"
        />
        <Button
          variant="soft"
          onClick={onAdd}
          disabled={draft.trim().length === 0}
          icon={<Plus size={17} aria-hidden="true" />}
        >
          Add
        </Button>
      </div>
    </fieldset>
  );
}
