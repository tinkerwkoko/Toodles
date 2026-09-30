import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Project } from '../../types';
import { accent } from '../../lib/color';
import { ProgressBar } from '../ui/ProgressBar';
import { cx } from '../../lib/cx';

export interface ProjectHeaderProps {
  project: Project;
  doneCount: number;
  totalCount: number;
  /** Buttons and toggles rendered under the progress bar. */
  children?: ReactNode;
}

/** Project name, colour, progress and the way back to the project list. */
export function ProjectHeader({ project, doneCount, totalCount, children }: ProjectHeaderProps) {
  const tone = accent(project.color);
  const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const openCount = totalCount - doneCount;

  return (
    <header className="mb-5">
      <Link
        to="/projects"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-bold text-lilac-700 hover:bg-lilac-100"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        All projects
      </Link>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          aria-hidden="true"
          className={cx(
            'grid h-14 w-14 shrink-0 place-items-center rounded-3xl border text-3xl',
            tone.soft,
            tone.border,
          )}
        >
          {project.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="wrap-break-word text-3xl leading-tight sm:text-4xl">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-[0.95rem] text-ink-soft">{project.description}</p>
          )}

          <div className="mt-3 max-w-xl">
            <ProgressBar
              value={percent}
              label={`${project.name} progress`}
              size="md"
              tone={percent === 100 && totalCount > 0 ? 'bg-mint-500' : 'bg-lilac-500'}
            />
            <p className="mt-1.5 text-sm font-semibold text-ink-soft">
              {totalCount === 0
                ? 'No tasks yet — add the first one to get going.'
                : `${doneCount} of ${totalCount} done · ${openCount} still open`}
            </p>
          </div>

          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </header>
  );
}
