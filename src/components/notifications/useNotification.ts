import { useState } from 'react';
import { NotificationSeverity, NotificationState } from '../../types/notifications';

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    severity: 'info',
    title: '',
    message: '',
  });

  const showNotification = (severity: NotificationSeverity, title: string, message: string) => {
    setNotification({
      open: true,
      severity,
      title,
      message,
    });
  };

  const closeNotification = () => {
    setNotification((current) => ({
      ...current,
      open: false,
    }));
  };

  return {
    notification,
    showNotification,
    closeNotification,
  };
};
