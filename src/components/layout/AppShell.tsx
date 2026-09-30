import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { IconRail } from './IconRail';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CreateDialogs } from './CreateDialogs';
import { Toasts } from '../ui/Toasts';

/** Responsive frame: bottom bar on phones, icon rail on tablets, sidebar on desktop. */
export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-lilac-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-lilac-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Sidebar />
      <IconRail />

      <div className="md:pl-19 lg:pl-72">
        <TopBar />
        <main
          id="main"
          key={location.pathname}
          className="mx-auto w-full max-w-6xl px-4 pt-4 pb-28 sm:px-6 md:pb-10 lg:px-8 motion-safe:animate-fade-in"
        >
          {children}
        </main>
      </div>

      <BottomNav />
      <CreateDialogs />
      <Toasts />
    </div>
  );
}
