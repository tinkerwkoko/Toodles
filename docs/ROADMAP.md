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

## 4. Layout and navigation
- Header runs the full width above the sidebar. Left to right: cat-head button that opens and closes the sidebar, the Toodles wordmark, search, and a profile icon that opens a small menu (display name saved locally, theme, export data, settings). No New task button in the header.
- Sidebar (no Toodles heading, no footer text): My Nook, Tasks, Calendar, Focus, Projects, Tags, Diary, Mood and habits, Analytics, Settings. Pages that do not exist yet may be hidden until their round. Remove Today, Upcoming, Overdue and Completed from the sidebar, and remove any duplicate Overdue link. Old routes /today, /upcoming, /overdue and /completed redirect to /tasks with the matching tab.
- Sidebar open or closed animates over about 250ms while the content area resizes without breaking. Save the state in settings.
- Below the md breakpoint: no sidebar. Use a bottom nav with My Nook, Tasks, a raised center plus button, Projects and More. The plus opens a quick-create sheet (Task, Project, Diary entry, Habit, Mood). More opens a sheet with the remaining pages.
- Tabs component: text tabs with a thin underline that slides to the active tab. Inactive tabs are faint (text-faint) and darken on hover.