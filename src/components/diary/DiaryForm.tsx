import { useState, type FormEvent } from 'react';
import type { DiaryEntry, MoodLevel } from '../../types';
import { todayString } from '../../lib/date';
import { Button } from '../ui/Button';
import { Field, Input, Select, Textarea } from '../ui/Field';
import { MoodPicker } from '../habits/MoodPicker';
import { useToodles } from '../../store/useToodles';
import { parseTags } from '../tasks/taskFormValues';

export interface DiaryFormValues {
  date: string;
  title: string;
  body: string;
  mood: MoodLevel | null;
  projectId: string;
  tags: string[];
}

export function emptyDiaryForm(date = todayString()): DiaryFormValues {
  return { date, title: '', body: '', mood: null, projectId: '', tags: [] };
}

export function diaryToFormValues(entry: DiaryEntry): DiaryFormValues {
  return {
    date: entry.date,
    title: entry.title,
    body: entry.body,
    mood: entry.mood,
    projectId: entry.projectId ?? '',
    tags: entry.tags,
  };
}

export interface DiaryFormProps {
  initial?: DiaryFormValues;
  submitLabel: string;
  onSubmit: (values: DiaryFormValues) => void;
  onDelete?: () => void;
}

export function DiaryForm({ initial, submitLabel, onSubmit, onDelete }: DiaryFormProps) {
  const { data } = useToodles();
  const [values, setValues] = useState<DiaryFormValues>(initial ?? emptyDiaryForm());
  const [tagDraft, setTagDraft] = useState(initial?.tags.join(', ') ?? '');
  const canSubmit = values.title.trim().length > 0 || values.body.trim().length > 0;

  function patch(next: Partial<DiaryFormValues>): void {
    setValues((current) => ({ ...current, ...next }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({ ...values, tags: parseTags(tagDraft) });
    if (!initial) {
      setValues(emptyDiaryForm());
      setTagDraft('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Day" htmlFor="diary-date">
          <Input
            id="diary-date"
            type="date"
            value={values.date}
            onChange={(event) => patch({ date: event.target.value })}
          />
        </Field>

        <Field label="Project (optional)" htmlFor="diary-project">
          <Select
            id="diary-project"
            value={values.projectId}
            onChange={(event) => patch({ projectId: event.target.value })}
          >
            <option value="">Not linked</option>
            {data.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.emoji} {project.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Title" htmlFor="diary-title">
        <Input
          id="diary-title"
          data-autofocus
          value={values.title}
          onChange={(event) => patch({ title: event.target.value })}
          placeholder="A small title for today"
        />
      </Field>

      <Field
        label="Notes"
        htmlFor="diary-body"
        hint="Nobody else can read this. It only lives in this browser."
      >
        <Textarea
          id="diary-body"
          rows={7}
          value={values.body}
          onChange={(event) => patch({ body: event.target.value })}
          placeholder="What happened today? What is on your mind?"
        />
      </Field>

      <MoodPicker
        value={values.mood}
        onChange={(mood) => patch({ mood })}
        label="Mood for this day (optional)"
      />

      <Field label="Tags" htmlFor="diary-tags" hint="Separate with commas: study, family, ideas">
        <Input
          id="diary-tags"
          value={tagDraft}
          onChange={(event) => setTagDraft(event.target.value)}
          placeholder="study, family, ideas"
        />
      </Field>

      <div className="flex items-center justify-end gap-2 border-t border-lilac-200 pt-4">
        {onDelete && (
          <Button variant="ghost" className="text-rose-700 hover:bg-rose-100" onClick={onDelete}>
            Delete entry
          </Button>
        )}
        <Button type="submit" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
