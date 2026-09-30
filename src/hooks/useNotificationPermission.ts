import { useEffect, useState } from 'react';

/** Live notification permission, or 'unsupported' where the API is missing. */
export type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function useNotificationPermission(): {
  permission: PermissionState;
  request: () => Promise<PermissionState>;
} {
  const [permission, setPermission] = useState<PermissionState>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission as PermissionState);
  }, []);

  async function request(): Promise<PermissionState> {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    // Only ever called from an explicit button press.
    const result = (await Notification.requestPermission()) as PermissionState;
    setPermission(result);
    return result;
  }

  return { permission, request };
}
