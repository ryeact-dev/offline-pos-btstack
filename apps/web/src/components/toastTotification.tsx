import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastNotificationProps {
  title: string;
  description: string;
  toastType?: ToastType;
}

export const toastNotification = ({
  title,
  description,
  toastType = 'success',
}: ToastNotificationProps) => {
  return toast[toastType](title, { description, duration: 3000 });

  // switch (toastType) {
  //   case 'success':
  //     return toast.success(message, { toastId, duration: 3000 });
  //   case 'error':
  //     return toast.error(message, { toastId, duration: 3000 });
  //   case 'info':
  //     return toast.info(message, { toastId, duration: 3000 });
  //   case 'warning':
  //     return toast.warning(message, { toastId, duration: 3000 });
  //   default:
  //     return;
  // }
};
