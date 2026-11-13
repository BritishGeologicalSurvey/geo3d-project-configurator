export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationState {
  open: boolean;
  severity: NotificationSeverity;
  title: string;
  message: string;
}
