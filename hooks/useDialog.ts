import { useState } from 'react';

interface DialogState {
  visible: boolean;
  title: string;
  message: string;
  icon?: {
    name: string;
    color?: string;
    backgroundColor?: string;
  };
  actions?: Array<{
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onPress: () => void;
  }>;
}

const initialState: DialogState = {
  visible: false,
  title: '',
  message: '',
};

export function useDialog() {
  const [dialog, setDialog] = useState<DialogState>(initialState);

  const hideDialog = () => setDialog(d => ({ ...d, visible: false }));

  const showDialog = (params: Omit<DialogState, 'visible'>) => {
    setDialog({
      ...params,
      visible: true,
    });
  };

  const showErrorDialog = (title: string, message: string) => {
    showDialog({
      title,
      message,
      icon: { name: 'alert-circle', backgroundColor: '#EF4444' },
      actions: [{ label: 'OK', variant: 'primary', onPress: hideDialog }],
    });
  };

  const showSuccessDialog = (title: string, message: string) => {
    showDialog({
      title,
      message,
      icon: { name: 'check-circle', backgroundColor: '#10B981' },
      actions: [{ label: 'OK', variant: 'primary', onPress: hideDialog }],
    });
  };

  const showWarningDialog = (title: string, message: string) => {
    showDialog({
      title,
      message,
      icon: { name: 'alert', backgroundColor: '#F59E0B' },
      actions: [{ label: 'OK', variant: 'primary', onPress: hideDialog }],
    });
  };

  const showConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmLabel: string = 'Confirm'
  ) => {
    showDialog({
      title,
      message,
      icon: { name: 'help-circle', backgroundColor: '#3B82F6' },
      actions: [
        {
          label: confirmLabel,
          variant: 'primary',
          onPress: () => {
            hideDialog();
            onConfirm();
          },
        },
        {
          label: 'Cancel',
          variant: 'secondary',
          onPress: hideDialog,
        },
      ],
    });
  };

  return {
    dialog,
    showDialog,
    hideDialog,
    showErrorDialog,
    showSuccessDialog,
    showWarningDialog,
    showConfirmDialog,
  };
}