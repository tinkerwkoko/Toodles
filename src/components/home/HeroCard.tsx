import { Cat } from '../Cat';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useUi } from '../../store/useUi';

/** Warm welcome for a brand-new workspace. Never fakes any data. */
export function HeroCard() {
  const { openCreate } = useUi();

  return (
    <Card padding="lg" className="mb-6 overflow-hidden border-lilac-200 bg-lilac-100">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <Cat pose="wave" size={150} className="shrink-0" />
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl">Your cozy corner is ready</h2>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            Nothing here yet — which is a lovely way to start. Write down one small thing and
            Toodles will help you keep track of it. Everything stays in this browser.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button onClick={() => openCreate('task')}>Create your first task</Button>
            <Button variant="soft" onClick={() => openCreate('project')}>
              Create a project
            </Button>
            <Button variant="soft" onClick={() => openCreate('diary')}>
              Write a diary entry
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
