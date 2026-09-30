import type {
  AccentColor,
  BoardColumn,
  DiaryEntry,
  Habit,
  HabitCheck,
  MoodLevel,
  MoodLog,
  Project,
  Subtask,
  Task,
  TaskStatus,
  ToodlesData,
} from '../types';
import {
  createDefaultBoardColumns,
  createSubtask,
  newId,
} from '../lib/factories';
import { nowTimestamp, todayString } from '../lib/date';
import { nextOccurrence } from '../lib/task';

/**
 * Pure data transformations. Every function returns a brand new ToodlesData so
 * React state updates stay predictable and the provider stays tiny.
 */

/* --------------------------------------------------------------- projects */

export function columnsForProject(data: ToodlesData, projectId: string | null): BoardColumn[] {
  if (!projectId) return [];
  return data.boardColumns
    .filter((column) => column.projectId === projectId)
    .sort((a, b) => a.order - b.order);
}

export function insertProject(data: ToodlesData, project: Project): ToodlesData {
  return {
    ...data,
    projects: [...data.projects, project],
    boardColumns: [...data.boardColumns, ...createDefaultBoardColumns(project.id)],
  };
}

export function replaceProject(data: ToodlesData, id: string, patch: Partial<Project>): ToodlesData {
  return {
    ...data,
    projects: data.projects.map((project) =>
      project.id === id ? { ...project, ...patch } : project,
    ),
  };
}

/** Deletes a project and decides the fate of its tasks with the user. */
export function removeProject(
  data: ToodlesData,
  id: string,
  options: { mode: 'delete' | 'move'; moveTo?: string | null },
): ToodlesData {
  return refreshBoardColumnIds({
    ...data,
    projects: data.projects.filter((project) => project.id !== id),
    boardColumns: data.boardColumns.filter((column) => column.projectId !== id),
    tasks: data.tasks
      .filter((task) => !(options.mode === 'delete' && task.projectId === id))
      .map((task) =>
        task.projectId === id
          ? { ...task, projectId: options.moveTo ?? null, boardColumnId: null }
          : task,
      ),
  });
}


/* ------------------------------------------------------------------ tasks */

export function insertTask(data: ToodlesData, task: Task): ToodlesData {
  const columns = columnsForProject(data, task.projectId);
  const normalized: Task =
    columns.length === 0
      ? { ...task, boardColumnId: null }
      : task.boardColumnId && columns.some((column) => column.id === task.boardColumnId)
        ? task
        : { ...task, boardColumnId: columns[0]?.id ?? null };
  return { ...data, tasks: [normalized, ...data.tasks] };
}

export function replaceTask(data: ToodlesData, id: string, patch: Partial<Task>): ToodlesData {
  return {
    ...data,
    tasks: data.tasks.map((task) => {
      if (task.id !== id) return task;
      const next: Task = { ...task, ...patch };
      if (patch.projectId !== undefined && patch.projectId !== task.projectId) {
        const columns = columnsForProject(data, patch.projectId ?? null);
        next.boardColumnId = columns.length > 0 ? columns[0]?.id ?? null : null;
      }
      if (patch.status !== undefined && patch.status !== task.status) {
        next.completedAt = patch.status === 'done' ? nowTimestamp() : null;
      }
      return next;
    }),
  };
}

export function removeTask(data: ToodlesData, id: string): ToodlesData {
  return { ...data, tasks: data.tasks.filter((task) => task.id !== id) };
}

/**
 * Completes or reopens a task. Completing a repeating task leaves the finished
 * one in the archive and quietly queues the next occurrence.
 */
export function setTaskStatus(data: ToodlesData, id: string, status: TaskStatus): ToodlesData {
  const source = data.tasks.find((task) => task.id === id);
  if (!source || source.status === status) return data;

  let next: ToodlesData = {
    ...data,
    tasks: data.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status,
            completedAt: status === 'done' ? nowTimestamp() : null,
            subtasks:
              status === 'done'
                ? task.subtasks.map((subtask) => ({ ...subtask, done: true }))
                : task.subtasks,
          }
        : task,
    ),
  };

  if (status === 'done' && source.repeat !== 'none') {
    const base = source.dueDate ?? source.startDate ?? todayString();
    const nextDue = nextOccurrence(base, source.repeat);
    if (nextDue) {
      next = insertTask(next, {
        ...source,
        id: newId(),
        status: 'todo',
        completedAt: null,
        createdAt: nowTimestamp(),
        startDate: source.startDate ? nextOccurrence(source.startDate, source.repeat) : null,
        dueDate: nextDue,
        subtasks: source.subtasks.map((subtask) => ({ ...subtask, id: newId(), done: false })),
      });
    }
  }

  return next;
}

/** The last column of a board counts as "done" so the archive stays truthful. */
function isDoneColumn(data: ToodlesData, column: BoardColumn): boolean {
  const columns = columnsForProject(data, column.projectId);
  return columns.length > 0 && columns[columns.length - 1]?.id === column.id;
}

export function moveTaskToColumn(
  data: ToodlesData,
  taskId: string,
  columnId: string | null,
): ToodlesData {
  const column = columnId ? data.boardColumns.find((item) => item.id === columnId) : undefined;
  return {
    ...data,
    tasks: data.tasks.map((task) => {
      if (task.id !== taskId) return task;
      const status: TaskStatus = column && isDoneColumn(data, column) ? 'done' : 'todo';
      return {
        ...task,
        boardColumnId: column?.id ?? null,
        projectId: column?.projectId ?? task.projectId,
        status,
        completedAt: status === 'done' ? task.completedAt ?? nowTimestamp() : null,
      };
    }),
  };
}

/** Keeps every task's board column pointing at a column that still exists. */
export function refreshBoardColumnIds(data: ToodlesData): ToodlesData {
  return {
    ...data,
    tasks: data.tasks.map((task) => {
      if (!task.projectId) {
        return task.boardColumnId === null ? task : { ...task, boardColumnId: null };
      }
      const columns = columnsForProject(data, task.projectId);
      if (columns.some((column) => column.id === task.boardColumnId)) return task;
      return { ...task, boardColumnId: columns[0]?.id ?? null };
    }),
  };
}

/* --------------------------------------------------------------- subtasks */

export function addSubtaskToTask(
  data: ToodlesData,
  taskId: string,
  title: string,
  color: AccentColor = 'lilac',
): ToodlesData {
  const clean = title.trim();
  if (clean.length === 0) return data;
  return {
    ...data,
    tasks: data.tasks.map((task) =>
      task.id === taskId
        ? { ...task, subtasks: [...task.subtasks, createSubtask(clean, color)] }
        : task,
    ),
  };
}

export function replaceSubtask(
  data: ToodlesData,
  taskId: string,
  subtaskId: string,
  patch: Partial<Subtask>,
): ToodlesData {
  return {
    ...data,
    tasks: data.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId ? { ...subtask, ...patch } : subtask,
            ),
          }
        : task,
    ),
  };
}


export function toggleSubtaskDone(
  data: ToodlesData,
  taskId: string,
  subtaskId: string,
): ToodlesData {
  return {
    ...data,
    tasks: data.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask,
            ),
          }
        : task,
    ),
  };
}

export function removeSubtask(data: ToodlesData, taskId: string, subtaskId: string): ToodlesData {
  return {
    ...data,
    tasks: data.tasks.map((task) =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) }
        : task,
    ),
  };
}

/* ---------------------------------------------------------- board columns */

export function insertColumn(data: ToodlesData, column: BoardColumn): ToodlesData {
  return { ...data, boardColumns: [...data.boardColumns, column] };
}

export function replaceColumn(
  data: ToodlesData,
  id: string,
  patch: Partial<BoardColumn>,
): ToodlesData {
  return {
    ...data,
    boardColumns: data.boardColumns.map((column) =>
      column.id === id ? { ...column, ...patch } : column,
    ),
  };
}

/** Removing a column never loses cards: they slide into the first column left. */
export function removeColumn(data: ToodlesData, id: string): ToodlesData {
  const target = data.boardColumns.find((column) => column.id === id);
  if (!target) return data;
  const remaining = data.boardColumns
    .filter((column) => column.projectId === target.projectId && column.id !== id)
    .sort((a, b) => a.order - b.order);
  const fallbackId = remaining[0]?.id ?? null;
  return refreshBoardColumnIds({
    ...data,
    boardColumns: data.boardColumns.filter((column) => column.id !== id),
    tasks: data.tasks.map((task) =>
      task.boardColumnId === id ? { ...task, boardColumnId: fallbackId } : task,
    ),
  });
}

export function moveColumn(data: ToodlesData, id: string, direction: -1 | 1): ToodlesData {
  const column = data.boardColumns.find((item) => item.id === id);
  if (!column) return data;
  const siblings = columnsForProject(data, column.projectId);
  const index = siblings.findIndex((item) => item.id === id);
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= siblings.length) return data;
  const reordered = [...siblings];
  const [moved] = reordered.splice(index, 1);
  if (!moved) return data;
  reordered.splice(targetIndex, 0, moved);
  const refreshed = reordered.map((item, position) => ({ ...item, order: position }));
  const byId = new Map(refreshed.map((item) => [item.id, item]));
  return {
    ...data,
    boardColumns: data.boardColumns.map((item) => byId.get(item.id) ?? item),
  };
}

/* -------------------------------------------------------------------- diary */

export function insertDiaryEntry(data: ToodlesData, entry: DiaryEntry): ToodlesData {
  return { ...data, diaryEntries: [entry, ...data.diaryEntries] };
}

export function replaceDiaryEntry(
  data: ToodlesData,
  id: string,
  patch: Partial<DiaryEntry>,
): ToodlesData {
  return {
    ...data,
    diaryEntries: data.diaryEntries.map((entry) =>
      entry.id === id ? { ...entry, ...patch, updatedAt: nowTimestamp() } : entry,
    ),
  };
}

export function removeDiaryEntry(data: ToodlesData, id: string): ToodlesData {
  return { ...data, diaryEntries: data.diaryEntries.filter((entry) => entry.id !== id) };
}

/* -------------------------------------------------------------------- moods */

export function setMood(
  data: ToodlesData,
  date: string,
  mood: MoodLevel,
  note = '',
): ToodlesData {
  const existing = data.moods.find((log) => log.date === date);
  const log: MoodLog = { date, mood, note, updatedAt: nowTimestamp() };
  return {
    ...data,
    moods: existing
      ? data.moods.map((item) => (item.date === date ? log : item))
      : [...data.moods, log],
  };
}

/* -------------------------------------------------------------------- board */

/**
 * Moves a task to a column (optionally before another card) and keeps the
 * underlying array order matching what the board shows.
 */
export function placeTaskInColumn(
  data: ToodlesData,
  taskId: string,
  columnId: string,
  beforeTaskId: string | null,
): ToodlesData {
  const column = data.boardColumns.find((item) => item.id === columnId);
  if (!column) return data;
  const source = data.tasks.find((task) => task.id === taskId);
  if (!source) return data;

  const status: TaskStatus = isDoneColumn(data, column) ? 'done' : 'todo';
  const updated: Task = {
    ...source,
    boardColumnId: column.id,
    projectId: column.projectId,
    status,
    completedAt: status === 'done' ? source.completedAt ?? nowTimestamp() : null,
  };

  const rest = data.tasks.filter((task) => task.id !== taskId);
  const insertAt = beforeTaskId ? rest.findIndex((task) => task.id === beforeTaskId) : -1;
  if (insertAt >= 0) {
    rest.splice(insertAt, 0, updated);
  } else {
    // Column moves land on top, so a freshly moved card is easy to spot.
    rest.unshift(updated);
  }
  return { ...data, tasks: rest };
}

export function clearMood(data: ToodlesData, date: string): ToodlesData {
  return { ...data, moods: data.moods.filter((log) => log.date !== date) };
}

/* ------------------------------------------------------------------- habits */

export function insertHabit(data: ToodlesData, habit: Habit): ToodlesData {
  return { ...data, habits: [...data.habits, habit] };
}

export function replaceHabit(data: ToodlesData, id: string, patch: Partial<Habit>): ToodlesData {
  return {
    ...data,
    habits: data.habits.map((habit) => (habit.id === id ? { ...habit, ...patch } : habit)),
  };
}

export function removeHabit(data: ToodlesData, id: string): ToodlesData {
  return {
    ...data,
    habits: data.habits.filter((habit) => habit.id !== id),
    habitChecks: data.habitChecks.filter((check) => check.habitId !== id),
  };
}

export function toggleHabitCheck(data: ToodlesData, habitId: string, date: string): ToodlesData {
  const exists = data.habitChecks.some((check) => check.habitId === habitId && check.date === date);
  if (exists) {
    return {
      ...data,
      habitChecks: data.habitChecks.filter(
        (check) => !(check.habitId === habitId && check.date === date),
      ),
    };
  }
  const check: HabitCheck = { habitId, date };
  return { ...data, habitChecks: [...data.habitChecks, check] };
}
