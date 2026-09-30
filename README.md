# Toodles

**Small tasks, big calm.**

Toodles is a private, local-first planner: tasks and subtasks, projects with a
kanban board, a diary, mood and habit tracking, and an archive of everything you
have finished. There is no account, no server and no cloud — everything you write
stays in the browser you wrote it in.

## Features

- **Tasks and subtasks** — due dates, priorities, tags, estimates, repeating rules and step-by-step subtasks.
- **Views** — Today, Upcoming, Overdue, All tasks and Completed, with search, filters and sorting.
- **Projects** — colour and emoji per project, a task list, and a kanban board with custom columns.
- **Board** — drag cards between columns on desktop and tablet; on phones the columns scroll sideways and every card has a “Move to…” menu.
- **Completed archive** — group finished work **by project** or **by date** (year → month → day), with a year picker built from your real completion dates.
- **Diary** — dated entries with an optional mood and tags, searchable, with month navigation.
- **Mood & habits** — a five-level mood log with a month calendar, plus habits with a weekly grid and streaks.
- **Quick create** — the big `+` opens task, project, diary, habit and mood in one tap.
- **Settings** — export your data as JSON, import a backup, erase everything, and see notification status.
- **Welcome screen** — a short, skippable splash with the sleepy Toodles cat.

## Tech stack

- [Vite](https://vite.dev) + [React](https://react.dev) 19 + [TypeScript](https://www.typescriptlang.org) (strict)
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` (tokens live in `src/index.css`)
- [react-router-dom](https://reactrouter.com) for routing
- [lucide-react](https://lucide.dev) for icons
- [@dnd-kit](https://dndkit.com) for kanban drag and drop

## Local-first architecture

- Everything is stored under **one** `localStorage` key: `toodles`.
- The value is a versioned object (`{ version, tasks, projects, … }`), read and written only through `src/store/storage.ts`, always inside `try/catch`.
- Reads are defensive: a corrupt or partial payload is repaired, and unparsable data is set aside instead of crashing the app.
- IDs come from `crypto.randomUUID()`; dates are ISO strings.
- No personal data ever goes into a URL, query string or route.
- **If you open the deployed URL in another browser, device or private window, you get an empty Toodles of your own.** Nobody sees your data but you.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # development server on http://localhost:5173
npm run typecheck# TypeScript, no emit
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build locally
```

## Deployment

Toodles is a fully static site. Build it and host the `dist/` folder anywhere —
for example Vercel, Netlify, GitHub Pages or any static file server. The included
`vercel.json` rewrites every path to `index.html` so client-side routes such as
`/projects/:id` and `/diary` work on a hard refresh.

## Notifications and reminders

Toodles has no server, so there is no push notification service. A task with
**“Remind me on this device”** can only notify you while the app is open in that
tab, and only after you explicitly allow notifications in Settings. The Settings
screen always shows the current permission state.

## Limitations

- Data lives in one browser profile. Clearing site data deletes it — export a backup first.
- There is no sync, no multi-device support and no account recovery by design.
- Importing a backup replaces the current workspace.
- The archive only contains tasks you actually finished; Toodles never invents history.

## Privacy

No analytics, no tracking, no network calls. Google Fonts is the only external
request, and it only downloads typefaces.
