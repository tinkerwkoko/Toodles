/**
 * All shared Toodles types. This file is the single source of truth for the
 * local data model — see AGENTS.md §6.
 */

export const SCHEMA_VERSION = 1;

/** Local calendar day, `YYYY-MM-DD`. */
export type DateString = string;
/** Full ISO 8601 timestamp, e.g. `2026-09-29T08:12:03.104Z`. */
export type Timestamp = string;

export type Priority = 'none' | 'low' | 'medium' | 'high';
export type RepeatRule = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';
export type TaskStatus = 'todo' | 'done';
export type MoodLevel = 'happy' | 'good' | 'okay' | 'low' | 'difficult';
export type HabitFrequency = 'daily' | 'weekly';
/** Palette keys shared by projects, columns, cards, subtasks and habits. */
export type AccentColor = 'lilac' | 'peach' | 'mint' | 'butter' | 'sky' | 'rose';

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  color: AccentColor;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: AccentColor;
  emoji: string;
  createdAt: Timestamp;
  archived: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string | null;
  priority: Priority;
  startDate: DateString | null;
  dueDate: DateString | null;
  dueTime: string | null;
  /** Estimated effort in minutes. */
  estimate: number | null;
  repeat: RepeatRule;
  reminder: boolean;
  tags: string[];
  status: TaskStatus;
  /** Set when the task lives on a project board. */
  boardColumnId: string | null;
  color: AccentColor;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
  subtasks: Subtask[];
}

export interface BoardColumn {
  id: string;
  projectId: string;
  name: string;
  color: AccentColor;
  order: number;
}

export interface DiaryEntry {
  id: string;
  date: DateString;
  title: string;
  body: string;
  mood: MoodLevel | null;
  projectId: string | null;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MoodLog {
  date: DateString;
  mood: MoodLevel;
  note: string;
  updatedAt: Timestamp;
}

export interface Habit {
  id: string;
  name: string;
  color: AccentColor;
  frequency: HabitFrequency;
  /** 0 (Sunday) – 6 (Saturday); used when frequency is 'weekly'. */
  weekdays: number[];
  createdAt: Timestamp;
  archived: boolean;
}

export interface HabitCheck {
  habitId: string;
  date: DateString;
}

export interface AppSettings {
  displayName: string;
  /** 0 = Sunday, 1 = Monday. Habit and mood grids start on this day. */
  weekStartsOn: 0 | 1;
  splashSeenAt: Timestamp | null;
}

export interface ToodlesData {
  version: number;
  settings: AppSettings;
  projects: Project[];
  tasks: Task[];
  boardColumns: BoardColumn[];
  diaryEntries: DiaryEntry[];
  moods: MoodLog[];
  habits: Habit[];
  habitChecks: HabitCheck[];
}

/** Everything needed to create a task; the rest gets friendly defaults. */
export interface NewTaskInput {
  title: string;
  description?: string;
  projectId?: string | null;
  priority?: Priority;
  startDate?: DateString | null;
  dueDate?: DateString | null;
  dueTime?: string | null;
  estimate?: number | null;
  repeat?: RepeatRule;
  reminder?: boolean;
  tags?: string[];
  color?: AccentColor;
  boardColumnId?: string | null;
  subtasks?: Array<{ title: string; color?: AccentColor }>;
}

export interface NewProjectInput {
  name: string;
  description?: string;
  color?: AccentColor;
  emoji?: string;
}

export interface NewDiaryEntryInput {
  date: DateString;
  title: string;
  body: string;
  mood?: MoodLevel | null;
  projectId?: string | null;
  tags?: string[];
}

export interface NewHabitInput {
  name: string;
  color?: AccentColor;
  frequency?: HabitFrequency;
  weekdays?: number[];
}

export type TaskScope = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed';
