import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Cat } from './components/Cat';
import { AppShell } from './components/layout/AppShell';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomePage } from './pages/HomePage';
import { TasksPage } from './pages/TasksPage';
import { ToodlesProvider } from './store/ToodlesProvider';
import { UiProvider } from './store/UiProvider';

/**
 * Toodles: a private, local-first planner.
 * Splash screen -> providers -> responsive shell -> routes.
 */
export default function App() {
  const [splash, setSplash] = useState(true);

  return (
    <BrowserRouter>
      <ToodlesProvider>
        <UiProvider>
          {splash && <WelcomeScreen onDone={() => setSplash(false)} />}
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tasks" element={<TasksPage scope="all" />} />
              <Route path="/today" element={<TasksPage scope="today" />} />
              <Route path="/upcoming" element={<TasksPage scope="upcoming" />} />
              <Route path="/overdue" element={<TasksPage scope="overdue" />} />
              <Route path="/completed" element={<TasksPage scope="completed" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </UiProvider>
      </ToodlesProvider>
    </BrowserRouter>
  );
}

/** Friendly landing spot for routes that are not wired up in this build. */
function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Cat pose="curious" size={132} />
      <h1 className="text-2xl">This corner is still being built</h1>
      <p className="max-w-md text-ink-soft">
        The section you are looking for is not part of this build yet. The overview and all task
        views are ready to use.
      </p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-full bg-lilac-500 px-5 font-semibold text-white shadow-soft transition hover:bg-lilac-600"
      >
        Back to the overview
      </Link>
    </div>
  );
}
