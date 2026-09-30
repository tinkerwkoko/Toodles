import { createContext } from 'react';
import type { DateString, NewTaskInput, Task } from '../types';

export type CreateKind = 'task' | 'project' | 'diary' | 'habit' | 'mood' | null;

export interface CreateIntent {
  kind: CreateKind;
  /** Pre-filled values: e.g. the project you are standing in when you tap +. */
  defaults?: Partial<NewTaskInput>;
  /** Diary entries can be started for a specific day. */
  diaryDate?: DateString | null;
}

export interface Toast {
  id: string;
  message: string;
  tone: 'default' | 'success';
}

/**
 * UI-only state: which create sheet is open, the desktop search box, the
 * selected task in the two-pane view and small confirmation toasts.
 * Nothing here is persisted or shared — see AGENTS.md §3.
 */
export interface UiContextValue {
  create: CreateIntent;
  openCreate: (kind: Exclude<CreateKind, null>, options?: Omit<CreateIntent, 'kind'>) => void;
  closeCreate: () => void;

  /** The quick-create chooser behind the big `+` button. */
  quickOpen: boolean;
  openQuickCreate: () => void;
  closeQuickCreate: () => void;

  searchTerm: string;
  setSearchTerm: (value: string) => void;

  detailTask: Task | null;
  setDetailTaskId: (id: string | null) => void;
  /** Set when a task was just completed so the card can pop. */
  celebratedTaskId: string | null;
  celebrate: (id: string) => void;

  toasts: Toast[];
  pushToast: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: string) => void;
}

export const UiContext = createContext<UiContextValue | null>(null);
