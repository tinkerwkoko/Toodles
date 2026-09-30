import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { TaskList } from '../components/tasks/TaskList';
import { HeroCard } from '../components/home/HeroCard';
import { HomeStats, HomeTiles } from '../components/home/HomeStats';
import { HabitsSnapshot, MoodSnapshot, RecentEntry } from '../components/home/TodayPanel';
import { formatLongDay, greetingTimeOfDay, todayString } from '../lib/date';
import { completionStreak, filterByScope, isTaskCompletedToday, sortTasks } from '../lib/task';
import { useToodles } from '../store/useToodles';
import { useUi } from '../store/useUi';

const GREETINGS: Record<ReturnType<typeof greetingTimeOfDay>, string> = {
  morning: 'Good morning ✨',
  afternoon: 'Good afternoon 🌤️',
  evening: 'Good evening 🌙',
  night: 'Still awake? 🌌',
};

export function HomePage() {
  const { data } = useToodles();
  const { openCreate, setDetailTaskId } = useUi();
  const today = todayString();

  const todaysTasks = useMemo(
    () => sortTasks(filterByScope(data.tasks, 'today'), 'smart'),
    [data.tasks],
  );
  const [latestEntry] = [...data.diaryEntries].sort((a, b) => b.date.localeCompare(a.date));

  const isBrandNew =
    data.tasks.length === 0 &&
    data.projects.length === 0 &&
    data.diaryEntries.length === 0 &&
    data.habits.length === 0 &&
    data.moods.length === 0;

  return (
    <div className="pb-4">
      <PageHeader
        title={GREETINGS[greetingTimeOfDay()]}
        subtitle={formatLongDay(today)}
        pose={isBrandNew ? undefined : 'sleepy'}
        actions={
          <Button
            className="hidden sm:inline-flex"
            onClick={() => openCreate('task')}
            icon={<Plus size={18} aria-hidden="true" />}
          >
            New task
          </Button>
        }
      />

      {isBrandNew ? (
        <>
          <HeroCard />
          <Card padding="lg" className="text-center">
            <h2 className="text-lg">A gentle start</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-soft">
              Toodles keeps tasks, projects, boards, your diary, moods and habits in one quiet
              place. There is no account and no cloud — what you write stays in this browser.
            </p>
          </Card>
        </>
      ) : (
        <>
          <HomeStats
            dueToday={todaysTasks.length}
            completedToday={data.tasks.filter((task) => isTaskCompletedToday(task, today)).length}
            streak={completionStreak(data.tasks)}
            openCount={filterByScope(data.tasks, 'all').length}
            projectCount={data.projects.length}
          />

          <HomeTiles
            upcoming={filterByScope(data.tasks, 'upcoming').length}
            overdue={filterByScope(data.tasks, 'overdue').length}
            projectCount={data.projects.length}
            diaryCount={data.diaryEntries.length}
            recentDiaryDate={latestEntry ? formatLongDay(latestEntry.date) : null}
            habitCount={data.habits.filter((habit) => !habit.archived).length}
            completed={filterByScope(data.tasks, 'completed').length}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <section aria-label="Today's tasks" className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg">Today&rsquo;s list</h2>
                <Link to="/tasks" className="text-xs font-bold text-lilac-700 hover:underline">
                  See everything
                </Link>
              </div>
              <TaskList
                tasks={todaysTasks.slice(0, 8)}
                onOpen={(task) => setDetailTaskId(task.id)}
                emptyState={
                  <EmptyState
                    small
                    pose="happy"
                    sentence="Nothing is due today. Add something small if you feel like it."
                    actionLabel="Add a task"
                    onAction={() => openCreate('task')}
                  />
                }
              />
              {todaysTasks.length > 8 && (
                <Link
                  to="/today"
                  className="inline-block text-sm font-bold text-lilac-700 hover:underline"
                >
                  + {todaysTasks.length - 8} more for today
                </Link>
              )}
            </section>

            <div className="space-y-4">
              <MoodSnapshot />
              <HabitsSnapshot />
              <RecentEntry />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
