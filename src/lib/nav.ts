import {
  AlarmClock,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  FolderHeart,
  Home,
  ListChecks,
  Settings,
  Smile,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Short label used in tight spots like the tablet icon rail. */
  shortLabel: string;
}

/** Desktop sidebar order — also the order used by the tablet rail. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Overview', shortLabel: 'Home', icon: Home },
  { to: '/today', label: 'Today', shortLabel: 'Today', icon: CalendarDays },
  { to: '/upcoming', label: 'Upcoming', shortLabel: 'Soon', icon: AlarmClock },
  { to: '/tasks', label: 'All tasks', shortLabel: 'Tasks', icon: ListChecks },
  { to: '/completed', label: 'Completed', shortLabel: 'Done', icon: CheckCircle2 },
  { to: '/projects', label: 'Projects', shortLabel: 'Projects', icon: FolderHeart },
  { to: '/diary', label: 'Notes & diary', shortLabel: 'Notes', icon: BookOpenText },
  { to: '/wellbeing', label: 'Mood & habits', shortLabel: 'Mood', icon: Smile },
  { to: '/settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
];

/** Overdue lives one tap away from Upcoming, so it is not in the main rail. */
export const OVERDUE_ITEM: NavItem = {
  to: '/overdue',
  label: 'Overdue',
  shortLabel: 'Late',
  icon: AlarmClock,
};

/** Phone bottom bar: Home · Tasks · + · Projects · Settings. */
export const MOBILE_ITEMS: NavItem[] = [
  NAV_ITEMS[0] as NavItem,
  NAV_ITEMS[3] as NavItem,
  NAV_ITEMS[5] as NavItem,
  NAV_ITEMS[8] as NavItem,
];
