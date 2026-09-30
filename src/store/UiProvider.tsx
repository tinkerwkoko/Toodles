import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { UiContext, type CreateIntent, type CreateKind, type Toast, type UiContextValue } from './uiContext';
import { useToodles } from './useToodles';

/** Local, in-memory UI state. Never persisted, never shared between devices. */
export function UiProvider({ children }: { children: ReactNode }) {
  const { data } = useToodles();
  const [create, setCreate] = useState<CreateIntent>({ kind: null });
  const [quickOpen, setQuickOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [celebratedTaskId, setCelebratedTaskId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const openCreate = useCallback<UiContextValue['openCreate']>(
    (kind: Exclude<CreateKind, null>, options) => {
      setQuickOpen(false);
      setCreate({ kind, defaults: options?.defaults, diaryDate: options?.diaryDate ?? null });
    },
    [],
  );

  const closeCreate = useCallback(() => setCreate({ kind: null }), []);

  // Opening a real form closes the chooser so only one overlay is ever shown.
  const openQuickCreate = useCallback(() => {
    setCreate({ kind: null });
    setQuickOpen(true);
  }, []);

  const closeQuickCreate = useCallback(() => setQuickOpen(false), []);

  const pushToast = useCallback<UiContextValue['pushToast']>((message, tone = 'default') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((current) => [...current, { id, message, tone }].slice(-3));
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const celebrate = useCallback((id: string) => {
    setCelebratedTaskId(id);
    window.setTimeout(() => {
      setCelebratedTaskId((current) => (current === id ? null : current));
    }, 900);
  }, []);

  const detailTask = useMemo(
    () => data.tasks.find((task) => task.id === detailTaskId) ?? null,
    [data.tasks, detailTaskId],
  );

  const value = useMemo<UiContextValue>(
    () => ({
      create,
      openCreate,
      closeCreate,
      quickOpen,
      openQuickCreate,
      closeQuickCreate,
      searchTerm,
      setSearchTerm,
      detailTask,
      setDetailTaskId,
      celebratedTaskId,
      celebrate,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      create,
      openCreate,
      closeCreate,
      quickOpen,
      openQuickCreate,
      closeQuickCreate,
      searchTerm,
      detailTask,
      celebratedTaskId,
      celebrate,
      toasts,
      pushToast,
      dismissToast,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}
