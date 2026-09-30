import { useEffect, useRef } from 'react';
import { formatTime, todayString } from '../lib/date';
import { useToodles } from '../store/useToodles';

/**
 * In-app reminders only. Toodles has no server and no push service, so a
 * reminder can only fire while this tab is open — which is exactly what the
 * Settings screen tells the user.
 */
export function useReminders(): void {
  const { data } = useToodles();
  const notified = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const interval = window.setInterval(() => {
      const today = todayString();
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      data.tasks.forEach((task) => {
        if (task.status !== 'todo' || !task.reminder || task.dueDate !== today || !task.dueTime) {
          return;
        }
        const [hours, minutes] = task.dueTime.split(':').map(Number);
        const due = (hours ?? 0) * 60 + (minutes ?? 0);
        if (nowMinutes < due || due > nowMinutes + 1) return;
        if (notified.current.has(task.id)) return;
        notified.current.add(task.id);
        new Notification('Toodles', {
          body: `${task.title} is due at ${formatTime(task.dueTime)}`,
          tag: `toodles-${task.id}`,
        });
      });
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [data.tasks]);
}
