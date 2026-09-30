import { useState, type FormEvent, type ReactNode } from 'react';
import type { AccentColor } from '../../types';
import { ACCENT_KEYS, ACCENT_LABELS, accent } from '../../lib/color';
import { Button } from '../ui/Button';
import { Field, Input, Textarea } from '../ui/Field';
import { cx } from '../../lib/cx';

export interface ProjectFormValues {
  name: string;
  description: string;
  color: AccentColor;
  emoji: string;
}

export const EMPTY_PROJECT_FORM: ProjectFormValues = {
  name: '',
  description: '',
  color: 'lilac',
  emoji: '🌱',
};

const EMOJI_CHOICES = ['🌱', '📚', '🎨', '🏡', '✨', '🎓', '🧺', '💼', '🍵', '🧶'];

export interface ProjectFormProps {
  initial?: ProjectFormValues;
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => void;
  onDelete?: () => void;
  extra?: ReactNode;
}

export function ProjectForm({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
  extra,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(initial ?? EMPTY_PROJECT_FORM);
  const canSubmit = values.name.trim().length > 0;

  function patch(next: Partial<ProjectFormValues>): void {
    setValues((current) => ({ ...current, ...next }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit(values);
    if (!initial) setValues(EMPTY_PROJECT_FORM);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Project name" htmlFor="project-name">
        <Input
          id="project-name"
          data-autofocus
          value={values.name}
          onChange={(event) => patch({ name: event.target.value })}
          placeholder="Final year project"
        />
      </Field>

      <Field label="What is it about?" htmlFor="project-description">
        <Textarea
          id="project-description"
          rows={3}
          value={values.description}
          onChange={(event) => patch({ description: event.target.value })}
          placeholder="A few words so future you remembers why this mattered."
        />
      </Field>

      <fieldset className="space-y-2">
        <legend className="text-sm font-bold text-lilac-700">Icon</legend>
        <div className="flex flex-wrap gap-2">
          {EMOJI_CHOICES.map((emoji) => (
            <button
              key={emoji}
              type="button"
              aria-label={`Use ${emoji} as the project icon`}
              aria-pressed={values.emoji === emoji}
              onClick={() => patch({ emoji })}
              className={cx(
                'grid h-11 w-11 place-items-center rounded-2xl border text-xl transition',
                values.emoji === emoji
                  ? 'border-lilac-500 bg-lilac-100'
                  : 'border-lilac-200 bg-cream hover:bg-lilac-50',
              )}
            >
              <span aria-hidden="true">{emoji}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-bold text-lilac-700">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {ACCENT_KEYS.map((key) => (
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

      {extra}

      <div className="flex items-center justify-end gap-2 border-t border-lilac-200 pt-4">
        {onDelete && (
          <Button variant="ghost" className="text-rose-700 hover:bg-rose-100" onClick={onDelete}>
            Delete project
          </Button>
        )}
        <Button type="submit" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
