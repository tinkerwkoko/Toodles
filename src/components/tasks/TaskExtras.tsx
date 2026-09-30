import type { AccentColor } from '../../types';
import { ACCENT_KEYS, ACCENT_LABELS, accent } from '../../lib/color';
import { Field } from '../ui/Field';
import { cx } from '../../lib/cx';
import type { TaskFormValues } from './taskFormValues';

export interface TaskExtrasProps {
  values: TaskFormValues;
  patch: (next: Partial<TaskFormValues>) => void;
  tagDraft: string;
  onTagDraftChange: (value: string) => void;
  onCommitTag: () => void;
}

/** Colour, reminder and tags — the "nice to have" half of the grid. */
export function TaskExtras({
  values,
  patch,
  tagDraft,
  onTagDraftChange,
  onCommitTag,
}: TaskExtrasProps) {
  return (
    <>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-bold text-lilac-700">Colour</legend>
        <div className="flex flex-wrap items-center gap-2 py-1.5">
          {ACCENT_KEYS.map((key: AccentColor) => (
            <button
              key={key}
              type="button"
              aria-label={ACCENT_LABELS[key]}
              aria-pressed={values.color === key}
              onClick={() => patch({ color: key })}
              className={cx(
                'h-9 w-9 rounded-full border-2 transition',
                accent(key).mid,
                values.color === key
                  ? 'scale-105 border-lilac-700'
                  : 'border-transparent hover:scale-105',
              )}
            />
          ))}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-lilac-200 bg-cream px-4 py-2.5">
          <input
            type="checkbox"
            checked={values.reminder}
            onChange={(event) => patch({ reminder: event.target.checked })}
            className="h-5 w-5 accent-lilac-500"
          />
          <span className="text-sm font-semibold text-ink">
            Remind me on this device
            <span className="block text-xs font-normal text-ink-soft">
              Only while Toodles is open, and only after you allow notifications.
            </span>
          </span>
        </label>
      </div>

      <div className="sm:col-span-2">
        <Field label="Tags" htmlFor="task-tags" hint="Press Enter or type a comma to add a tag.">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-lilac-200 bg-cream p-2">
            {values.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-lilac-100 px-2.5 py-1 text-xs font-bold text-lilac-700"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => patch({ tags: values.tags.filter((item) => item !== tag) })}
                  className="grid h-5 w-5 place-items-center rounded-full hover:bg-lilac-200"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            ))}
            <input
              id="task-tags"
              value={tagDraft}
              onChange={(event) => onTagDraftChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  onCommitTag();
                }
              }}
              onBlur={onCommitTag}
              placeholder={values.tags.length === 0 ? 'study, home, later' : 'Add another'}
              className="min-w-32 flex-1 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-ink-soft/70"
            />
          </div>
        </Field>
      </div>
    </>
  );
}
