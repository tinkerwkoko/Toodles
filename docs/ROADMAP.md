# Toodles redesign roadmap

## 0. Working rules (apply to every round)
- Read this file and AGENTS.md first, then inspect the real code in src/. Trust the code over chat memory.
- Visual and feature changes only. Keep the existing Cat and CatFace components. Their shapes, poses, expressions and animations must not change. Only their colors may change, through CSS variables.
- No new dependencies. Build popovers, dropdowns, date pickers and charts by hand with React, Tailwind and lucide-react.
- Every color comes from CSS variables. No hardcoded hex values in components.
- Keep each file under 500 lines, measured in lines. Use small targeted edits on long files. Write any large new file in two or three parts so it is never cut off.
- Do not run npm run dev. Do not run git commands. Do not start the next round on your own.
- End every round with: npx tsc --noEmit, then npm run build, fix every error, update the Progress section in AGENTS.md (Done, Partly done, Not started), list what to test, then stop.
- Timers must be built on timestamps (Date.now), never on a ticking counter.
- Accessibility: semantic HTML, labels, visible focus states, aria labels on icon buttons, keyboard support in every popover (arrows, Enter, Escape), prefers-reduced-motion respected.

## 1. Design language
- Flat and quiet. No shadows, no gradients. Hairline 1px borders only where a border is needed. Radius 12px on cards, 9px on buttons and inputs, pill shape only for tags. Controls are 30px tall on desktop and 40px on touch. Tight padding.
- Use fewer containers. Lists are plain rows separated by 1px dividers, not stacks of cards. The only cards are: the Today's list card, the dashboard right-column cards (mood, habits, diary), and modals. The greeting banner is a flat tinted block with no border.
- Icons: lucide-react everywhere, chosen to match meaning (Bell for reminders, Calendar, Clock, Timer, Folder, Tag, Flag for priority, Repeat, BookOpen for study, Target for Focus, BarChart3 for Analytics, Sun, Moon and Monitor for themes, User for profile).
- Remove the sparkle next to the greeting.

## 2. Tokens (light)
bg #F8F2EF, sidebar #F1E7E6, card #FFFCFA, primary #D9BFCC, primary-hover #CFAFBF, border #E4D0D9, divider #EFE3E1, text #4A3540, text-2 #85697A, text-faint #A58C99, accent #B592A4 (active tab underline, checkbox outline), peach #F4C3A8, peach-ink #5A4238, peach-deep #E59F7C (progress fill), cream #FFF6EF (banner, project cards), cream-border #EBD3C4.
Stat tints: focused #F4C3A8, upcoming #D3E2EC, overdue #F0D5D5, projects #DCE6D3, completed #EADFEA.
Mood tints (Difficult, Low, Okay, Good, Happy): #EADFEA, #D3E2EC, #F6EAC2, #DCE6D3, #F4D5C4.
Cat colors as variables: body #FFFCFA, outline #B592A4.
Tokens (dark, starting values): bg #1F1A20, sidebar #261F27, card #2B242D, primary #C9A6B8 with dark ink #2A1F27, primary-hover #D6B5C5, border #3B3039, divider #332A32, text #F1E6EC, text-2 #B79CAA, text-faint #8F7783, accent #C9A6B8, peach #F4C3A8 with ink #3A2519, cream #302630, cream-border #4A3B45, tints darkened to muted versions of the light ones, cat body #EADFE6 and outline #C9A6B8.

## 3. Fonts and sizes
Chewy: greeting, wordmark, section headings, button labels, big numbers. Handlee: body text, date line, sidebar labels, stat labels, tags, helper text, placeholders. Fredoka (500): task titles, project names, habit names; subtasks 400.
Sizes: greeting 30px, section headings 18px, task titles 15px, body 14px, tags and meta 12px.

## 5. Home / My Nook
- Greeting: "Good morning" in Chewy 30px, no sparkle emoji next to it.
- Greeting banner: flat cream (#FFF6EF) background, peach border (#EBD3C4), no shadow.
- Stat tiles: 4 tiles in a 2x2 grid on mobile, 4-across on desktop. Each tile has a tinted background (stat-1 through stat-4), a lucide icon, a big Fredoka 500 number, and a Handlee label below. No card borders.
- Quick tiles: 6 tiles below stats, each a flat cream card with cream border, lucide icon, Fredoka number, Handlee label. Tinted backgrounds match their meaning (upcoming = sky tint, overdue = rose tint, etc.).
- Today's list: plain rows separated by 1px dividers, not cards. Each row: checkbox, title (Fredoka 500, 15px), due date meta (Handlee 12px, text-2), priority dot. Completed rows get peach tint background and strikethrough title.
- Empty state: cat illustration (sleepy pose), gentle sentence, CTA button.

## 6. Task pages (All / Today / Upcoming / Overdue)
- Full-width header above the sidebar (same as home).
- Search bar in the header: flat cream card, peach border when focused, no shadow.
- Filter bar: text tabs (All/Today/Upcoming/Overdue/Completed) with sliding underline.
- Task list: plain rows, 1px dividers. Each row: checkbox (accent color outline when not done, filled peach when done), title (Fredoka 500), due date (Handlee 12px, text-2), priority dot, tags as small pill tags.
- Overdue rows: rose tint background (#F0D5D5), small alarm icon, no red text.
- Task detail modal/sheet: cream background, peach border, Fredoka title, Handlee body. Subtasks as checklist rows. Edit form inline.
- No red anywhere on the page.

## 7. Projects / Kanban
- Projects list: flat cream cards with cream border, each card has emoji, project name (Fredoka 500), task count (Handlee), progress bar (peach track #F4C3A8, peach-deep fill #E59F7C).
- Project detail: header with project name, edit/delete buttons, List/Board toggle tabs.
- Board: columns are flat cream cards with 1px cream-border. Column header: column name (Fredoka 500), task count. Cards inside columns: flat cream, 1px cream-border, title in Fredoka 500, subtask progress bar, due date meta.
- Column dialog: add/rename/reorder columns with color picker (peach, mint, butter, sky, rose, lilac).
- Mobile board: horizontal scroll with snap, "Move to..." menu on each card.

## 8. Diary / Mood / Habits
- Diary list: plain rows, each row has date (Handlee 12px), title (Fredoka 500), mood indicator (colored dot).
- Diary editor: cream card, peach border, title input, body textarea, mood picker, tags.
- Mood calendar: monthly grid, each day is a small circle. Mood colors: Difficult #EADFEA, Low #D3E2EC, Okay #F6EAC2, Good #DCE6D3, Happy #F4D5C4.
- Habits: weekly grid (7 columns), each cell is a small square. Checked cells have peach fill (#F4C3A8). Streak indicator below each habit name.
- Empty states: cat illustration, gentle sentence, CTA.

## 9. Settings / Export
- Settings page: flat cream cards with cream borders, sections stacked vertically.
- Export: button that downloads JSON, card has document icon and description.
- Import: file input that reads JSON, validates, shows error if invalid.
- Erase all: danger-toned card with rose border, confirmation dialog.
- Notifications: permission status, request button. Note: reminders work only while app is open.
- Profile menu: display name, theme toggle (light only now).

## 10. Accessibility and responsive pass
- Semantic HTML: nav, main, header, ul/li, button, label. One h1 per page.
- All icon-only buttons have aria-label.
- Focus rings: 2px solid #85697A with 2px outline-offset.
- Keyboard: tabs use arrow keys, Escape to close modals, Enter to select.
- Touch targets: minimum 44x44px on mobile, 30px desktop controls.
- Reduced motion: animations disabled when prefers-reduced-motion is set.
- No horizontal scroll at any width. Bottom nav on mobile, sidebar on desktop.
- Status communicated with icons + text + strikethrough, not color alone.

## 11. Cat mascot (color only)
- Cat.tsx and CatFace.tsx: shapes, paths, poses, expressions, animations, timing, stroke widths, dimensions, viewBox must not change.
- Only color values change via CSS variables.
- Body/head fill: #FFFCFA
- Outline/whiskers: #B592A4
- Inner ears/cheeks/nose/pink accents: #F4C3A8
- Eyes/mouth/dark details: #4A3540

## 12. Welcome screen
- Background: #F8F2EF (flat, no gradient).
- Progress bar: track #F1E7E6, fill #D9BFCC.
- Text: #4A3540.
- Cat illustration, Toodles wordmark, tagline.
- Rotate supporting line, tap to skip, ~2 second auto-dismiss.

## 13. Final validation
- Run npx tsc --noEmit and npm run build. Fix all errors.
- Verify no old lilac hex values remain in src/ (#EDE3FA, #DCCBF4, #C6ADEC, #A484DA, #6E4FA8).
- Verify no Nunito font references.
- Verify all files under 500 lines.
- Verify no duplicates, dead routes, fake data, localStorage regression.
- Update AGENTS.md with final state.

## 14. README
- Create README.md with: project description, features, tech stack, local-first architecture, localStorage behavior, installation, dev/build commands, deployment guidance, notification limitation, known limitations.
- No false feature claims.