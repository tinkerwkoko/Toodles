import type { AccentColor, NewTaskInput, Priority, RepeatRule, Task } from '../../types';
import { newId } from '../../lib/factories';

/** Form-friendly shape: empty strings instead of nulls, estimate as text. */
export interface TaskFormValues {
  title: string;
  description: string;
  projectId: string;
  priority: Priority;
  startDate: string;
  dueDate: string;
  dueTime: string;
  estimate: string;
  repeat: RepeatRule;
  reminder: boolean;
  tags: string[];
  color: AccentColor;
  subtasks: Array<{ id: string; title: string; color: AccentColor }>;
}

export const EMPTY_TASK_FORM: TaskFormValues = {
  title: '',
  description: '',
  projectId: '',
  priority: 'none',
  startDate: '',
  dueDate: '',
  dueTime: '',
  estimate: '',
  repeat: 'none',
  reminder: false,
  tags: [],
  color: 'lilac',
  subtasks: [],
};

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    projectId: task.projectId ?? '',
    priority: task.priority,
    startDate: task.startDate ?? '',
    dueDate: task.dueDate ?? '',
    dueTime: task.dueTime ?? '',
    estimate: task.estimate ? String(task.estimate) : '',
    repeat: task.repeat,
    reminder: task.reminder,
    tags: task.tags,
    color: task.color,
    subtasks: task.subtasks.map((subtask) => ({
      id: subtask.id,
      title: subtask.title,
      color: subtask.color,
    })),
  };
}

export function formValuesToInput(
  values: TaskFormValues,
  projectId?: string | null,
): NewTaskInput {
  const estimate = Number.parseInt(values.estimate, 10);
  return {
    title: values.title.trim(),
    description: values.description,
    projectId: projectId ?? (values.projectId === '' ? null : values.projectId),
    priority: values.priority,
    startDate: values.startDate === '' ? null : values.startDate,
    dueDate: values.dueDate === '' ? null : values.dueDate,
    dueTime: values.dueTime === '' ? null : values.dueTime,
    estimate: Number.isFinite(estimate) && estimate > 0 ? estimate : null,
    repeat: values.repeat,
    reminder: values.reminder,
    tags: values.tags,
    color: values.color,
    subtasks: values.subtasks.map((subtask) => ({
      title: subtask.title,
      color: subtask.color,
    })),
  };
}

export function formValuesFromDefaults(defaults?: Partial<NewTaskInput>): TaskFormValues {
  if (!defaults) return EMPTY_TASK_FORM;
  return {
    ...EMPTY_TASK_FORM,
    title: defaults.title ?? '',
    description: defaults.description ?? '',
    projectId: defaults.projectId ?? '',
    priority: defaults.priority ?? 'none',
    startDate: defaults.startDate ?? '',
    dueDate: defaults.dueDate ?? '',
    dueTime: defaults.dueTime ?? '',
    estimate: defaults.estimate ? String(defaults.estimate) : '',
    repeat: defaults.repeat ?? 'none',
    reminder: defaults.reminder ?? false,
    tags: defaults.tags ?? [],
    color: defaults.color ?? 'lilac',
    subtasks: (defaults.subtasks ?? []).map((subtask) => ({
      id: newId(),
      title: subtask.title,
      color: subtask.color ?? defaults.color ?? 'lilac',
    })),
  };
}

export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * Diff for saving an edited task: keeps existing subtasks (and their done
 * state) so ticking a little step does not get lost when you save.
 */
export function formValuesToTaskPatch(
  values: TaskFormValues,
  original: Task,
): Partial<Task> {
  const estimate = Number.parseInt(values.estimate, 10);
  return {
    title: values.title.trim().length > 0 ? values.title.trim() : original.title,
    description: values.description,
    projectId: values.projectId === '' ? null : values.projectId,
    priority: values.priority,
    startDate: values.startDate === '' ? null : values.startDate,
    dueDate: values.dueDate === '' ? null : values.dueDate,
    dueTime: values.dueTime === '' ? null : values.dueTime,
    estimate: Number.isFinite(estimate) && estimate > 0 ? estimate : null,
    repeat: values.repeat,
    reminder: values.reminder,
    tags: values.tags,
    color: values.color,
    subtasks: values.subtasks.map((subtask) => {
      const existing = original.subtasks.find((item) => item.id === subtask.id);
      return existing
        ? { ...existing, title: subtask.title, color: subtask.color }
        : { id: subtask.id, title: subtask.title, done: false, color: subtask.color };
    }),
  };
}
