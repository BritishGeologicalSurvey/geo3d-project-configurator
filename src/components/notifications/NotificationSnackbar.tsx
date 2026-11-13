import { Alert, Snackbar, Typography } from '@mui/material';
import { NotificationState } from '../../types/notifications';

interface Props {
  notification: NotificationState;
  onClose: () => void;
}

export const NotificationSnackbar = ({ notification, onClose }: Props) => {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}>
      <Alert
        severity={notification.severity}
        variant="filled"
        onClose={onClose}
        sx={{
          whiteSpace: 'pre-line',
          maxWidth: 700,
        }}>
        <Typography fontWeight={600}>{notification.title}</Typography>

        {notification.message}
      </Alert>
    </Snackbar>
  );
};
