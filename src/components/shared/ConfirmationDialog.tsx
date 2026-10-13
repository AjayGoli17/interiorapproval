import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? 'destructive' : 'default'}
          size="sm"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
