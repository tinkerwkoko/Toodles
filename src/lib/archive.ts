import type { DateString, Project, Task } from '../types';
import { monthName } from './date';

/** Only tasks that really are done, with a usable completion date. */
export function completedTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => task.status === 'done' && typeof task.completedAt === 'string')
    .map((task) => ({ ...task, completedAt: task.completedAt as string }))
    .sort((a, b) => (a.completedAt ?? '').localeCompare(b.completedAt ?? ''));
}

/** Local calendar day a task was finished, or null if it is not finished. */
export function completedDate(task: Task): DateString | null {
  if (task.status !== 'done' || !task.completedAt) return null;
  return task.completedAt.slice(0, 10);
}

export function yearOf(date: DateString): string {
  return date.slice(0, 4);
}

export function monthOf(date: DateString): string {
  return date.slice(5, 7);
}

/** Years that actually contain completed work, newest first. Never invented. */
export function completionYears(tasks: Task[]): string[] {
  const years = new Set<string>();
  tasks.forEach((task) => {
    const date = completedDate(task);
    if (date) years.add(yearOf(date));
  });
  return [...years].sort((a, b) => b.localeCompare(a));
}

export interface ProjectGroup {
  /** null means the task has no project. */
  project: Project | null;
  tasks: Task[];
}

/** Completed tasks grouped by project; projectless tasks land in their own group. */
export function groupByProject(tasks: Task[], projects: Project[]): ProjectGroup[] {
  const groups = new Map<string, ProjectGroup>();
  const none: Task[] = [];

  tasks.forEach((task) => {
    if (!task.projectId) {
      none.push(task);
      return;
    }
    const existing = groups.get(task.projectId);
    if (existing) existing.tasks.push(task);
    else groups.set(task.projectId, { project: projects.find((p) => p.id === task.projectId) ?? null, tasks: [task] });
  });

  const ordered = [...groups.values()].sort((a, b) =>
    (a.project?.name ?? '').localeCompare(b.project?.name ?? ''),
  );
  if (none.length > 0) ordered.push({ project: null, tasks: none });
  return ordered;
}

export interface DayGroup {
  date: DateString;
  tasks: Task[];
}

export interface MonthGroup {
  /** 1-based month number. */
  month: number;
  label: string;
  days: DayGroup[];
}

export interface YearGroup {
  year: string;
  count: number;
  months: MonthGroup[];
}

/** Year → month → day → tasks, built only from real completion dates. */
export function groupByDate(tasks: Task[]): YearGroup[] {
  const years = new Map<string, Map<number, Map<DateString, Task[]>>>();

  tasks.forEach((task) => {
    const date = completedDate(task);
    if (!date) return;
    const year = yearOf(date);
    const month = Number(monthOf(date));
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year) as Map<number, Map<DateString, Task[]>>;
    if (!months.has(month)) months.set(month, new Map());
    const days = months.get(month) as Map<DateString, Task[]>;
    if (!days.has(date)) days.set(date, []);
    (days.get(date) as Task[]).push(task);
  });

  return [...years.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, months]) => {
      const monthGroups: MonthGroup[] = [...months.entries()]
        .sort(([a], [b]) => b - a)
        .map(([month, days]) => ({
          month,
          label: monthName(month - 1),
          days: [...days.entries()]
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, items]) => ({ date, tasks: items })),
        }));
      return {
        year,
        count: monthGroups.reduce(
          (total, group) => total + group.days.reduce((sum, day) => sum + day.tasks.length, 0),
          0,
        ),
        months: monthGroups,
      };
    });
}
