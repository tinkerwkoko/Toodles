import type { Priority, RepeatRule } from '../../types';
import { PRIORITY_KEYS, PRIORITY_STYLES } from '../../lib/color';
import { REPEAT_LABELS } from '../../lib/task';
import { Field, Input, Select } from '../ui/Field';
import type { TaskFormValues } from './taskFormValues';

export interface TaskFieldsProps {
  values: TaskFormValues;
  patch: (next: Partial<TaskFormValues>) => void;
  projects: Array<{ id: string; name: string; emoji: string }>;
  /** When set, the project picker is hidden (we are already inside it). */
  lockedProjectId?: string | null;
}

const ESTIMATE_SUGGESTIONS = [15, 30, 45, 60, 90, 120, 180];

/** Priority, project, dates, time and estimate — the tidy two-column grid. */
export function TaskFields({ values, patch, projects, lockedProjectId }: TaskFieldsProps) {
  return (
    <>
      <Field label="Priority" htmlFor="task-priority">
        <Select
          id="task-priority"
          value={values.priority}
          onChange={(event) => patch({ priority: event.target.value as Priority })}
        >
          {PRIORITY_KEYS.map((key) => (
            <option key={key} value={key}>
              {PRIORITY_STYLES[key].label}
            </option>
          ))}
        </Select>
      </Field>

      {lockedProjectId === undefined && (
        <Field label="Project" htmlFor="task-project">
          <Select
            id="task-project"
            value={values.projectId}
            onChange={(event) => patch({ projectId: event.target.value })}
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.emoji} {project.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field label="Start date" htmlFor="task-start">
        <Input
          id="task-start"
          type="date"
          value={values.startDate}
          onChange={(event) => patch({ startDate: event.target.value })}
        />
      </Field>

      <Field label="Due date" htmlFor="task-due">
        <Input
          id="task-due"
          type="date"
          value={values.dueDate}
          onChange={(event) => patch({ dueDate: event.target.value })}
        />
      </Field>

      <Field label="Time" htmlFor="task-time">
        <Input
          id="task-time"
          type="time"
          value={values.dueTime}
          onChange={(event) => patch({ dueTime: event.target.value })}
        />
      </Field>

      <Field label="Estimate (minutes)" htmlFor="task-estimate">
        <Input
          id="task-estimate"
          type="number"
          min={5}
          step={5}
          list="task-estimate-options"
          value={values.estimate}
          onChange={(event) => patch({ estimate: event.target.value })}
          placeholder="30"
        />
        <datalist id="task-estimate-options">
          {ESTIMATE_SUGGESTIONS.map((minutes) => (
            <option key={minutes} value={minutes} />
          ))}
        </datalist>
      </Field>

      <Field label="Repeat" htmlFor="task-repeat">
        <Select
          id="task-repeat"
          value={values.repeat}
          onChange={(event) => patch({ repeat: event.target.value as RepeatRule })}
        >
          {(Object.keys(REPEAT_LABELS) as RepeatRule[]).map((key) => (
            <option key={key} value={key}>
              {REPEAT_LABELS[key]}
            </option>
          ))}
        </Select>
      </Field>
    </>
  );
}
