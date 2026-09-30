import { useRef, useState } from 'react';
import { Bell, Download, Trash2, Upload } from 'lucide-react';
import { Cat } from '../components/Cat';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { PageHeader } from '../components/ui/PageHeader';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import { useToodles } from '../store/useToodles';
import { useUi } from '../store/useUi';

type ImportState = { tone: 'success' | 'error'; message: string } | null;

/** `/settings` — local data export, import, erase, and reminder status. */
export function SettingsPage() {
  const { data, actions, storageBlocked } = useToodles();
  const { pushToast } = useUi();
  const { permission, request } = useNotificationPermission();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [confirmErase, setConfirmErase] = useState(false);
  const [message, setMessage] = useState<ImportState>(null);

  const counts = [
    `${data.tasks.length} task${data.tasks.length === 1 ? '' : 's'}`,
    `${data.projects.length} project${data.projects.length === 1 ? '' : 's'}`,
    `${data.diaryEntries.length} diary entr${data.diaryEntries.length === 1 ? 'y' : 'ies'}`,
    `${data.moods.length} mood log${data.moods.length === 1 ? '' : 's'}`,
    `${data.habits.length} habit${data.habits.length === 1 ? '' : 's'}`,
  ];

  function download(): void {
    const blob = new Blob([actions.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `toodles-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    pushToast('Backup downloaded', 'success');
  }

  async function importFile(file: File): Promise<void> {
    try {
      const text = await file.text();
      // parseImport throws a friendly Error for anything that is not Toodles JSON,
      // so nothing is written unless the file really is a backup.
      const result = actions.importData(text);
      setMessage({ tone: 'success', message: `Imported ${result.tasks} tasks.` });
      pushToast('Backup restored', 'success');
    } catch (error) {
      setMessage({
        tone: 'error',
        message: error instanceof Error ? error.message : 'That file could not be read.',
      });
    }
  }

  return (
    <div className="pb-4">
      <PageHeader
        title="Settings"
        subtitle="Everything lives in this browser. Nothing is uploaded, ever."
        pose="curious"
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Card padding="lg" className="space-y-3">
          <h2 className="text-lg">Your data</h2>
          <p className="text-sm text-ink-soft">{counts.join(' · ')}</p>
          {storageBlocked && (
            <p className="rounded-2xl bg-rose-100 px-3 py-2 text-sm text-ink">
              This browser is blocking local storage, so changes will not be saved.
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={download} icon={<Download size={17} aria-hidden="true" />}>
              Export as JSON
            </Button>
            <Button
              variant="soft"
              onClick={() => fileInput.current?.click()}
              icon={<Upload size={17} aria-hidden="true" />}
            >
              Import a backup
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              aria-label="Choose a Toodles backup file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importFile(file);
                event.target.value = '';
              }}
            />
          </div>

          {message && (
            <p
              role="status"
              className={
                message.tone === 'success'
                  ? 'rounded-2xl bg-mint-100 px-3 py-2 text-sm text-ink'
                  : 'rounded-2xl bg-rose-100 px-3 py-2 text-sm text-ink'
              }
            >
              {message.message}
            </p>
          )}

          <p className="text-xs text-ink-soft">
            Importing replaces the current workspace, so export a backup first if you want to keep
            it.
          </p>
        </Card>

        <Card padding="lg" className="space-y-3">
          <h2 className="text-lg">Reminders</h2>
          <p className="text-sm text-ink-soft">
            Reminders work while Toodles is open on this device. There is no server, so nothing can
            be delivered after you close the tab.
          </p>
          <p className="text-sm font-bold text-ink">Status: {permissionLabel(permission)}</p>
          {permission !== 'granted' && permission !== 'unsupported' && (
            <Button
              variant="soft"
              onClick={() => {
                void request().then((result) => {
                  pushToast(
                    result === 'granted' ? 'Reminders are on 🔔' : 'Reminders stay off',
                    result === 'granted' ? 'success' : 'default',
                  );
                });
              }}
              icon={<Bell size={17} aria-hidden="true" />}
            >
              Allow notifications
            </Button>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
        <Card padding="lg" className="space-y-3">
          <h2 className="text-lg">Privacy</h2>
          <div className="flex items-start gap-4">
            <Cat pose="curious" size={72} animated={false} className="shrink-0" />
            <p className="text-sm text-ink-soft">
              Toodles keeps everything in this browser&rsquo;s local storage. There is no account,
              no cloud and no tracking. Open it in another browser or a private window and you get
              an empty Toodles of your own.
            </p>
          </div>
        </Card>

        <Card padding="lg" className="space-y-3 border-rose-200">
          <h2 className="text-lg text-ink">Erase everything</h2>
          <p className="text-sm text-ink-soft">
            This deletes every task, project, diary entry, mood and habit stored in this browser. It
            cannot be undone.
          </p>
          <Button
            variant="danger"
            onClick={() => setConfirmErase(true)}
            icon={<Trash2 size={17} aria-hidden="true" />}
          >
            Erase all data
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmErase}
        title="Erase all Toodles data?"
        tone="danger"
        confirmLabel="Erase everything"
        body={
          <p>
            You are about to delete {counts.join(', ')} from this browser. Export a backup first if
            you might want any of it later.
          </p>
        }
        onCancel={() => setConfirmErase(false)}
        onConfirm={() => {
          actions.eraseAll();
          setConfirmErase(false);
          setMessage(null);
          pushToast('All data erased');
        }}
      />
    </div>
  );
}

function permissionLabel(permission: string): string {
  switch (permission) {
    case 'granted':
      return 'allowed';
    case 'denied':
      return 'blocked in this browser';
    case 'unsupported':
      return 'not supported here';
    default:
      return 'not asked yet';
  }
}
