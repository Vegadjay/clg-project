"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

interface AlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function CustomAlert({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  showCancel = false,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}: AlertProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getButtonVariant = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  if (showCancel) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {getIcon()}
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
            {description && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={getButtonVariant()}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onConfirm} className={getButtonVariant()}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easy alert usage
export function useAlert() {
  const [alertState, setAlertState] = React.useState<{
    open: boolean;
    title: string;
    description?: string;
    type?: "success" | "error" | "warning" | "info";
    showCancel?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    open: false,
    title: "",
  });

  const showAlert = (config: Omit<typeof alertState, "open">) => {
    setAlertState({ ...config, open: true });
  };

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
  };

  const AlertComponent = () => (
    <CustomAlert
      {...alertState}
      onOpenChange={(open) => {
        if (!open) {
          hideAlert();
        }
      }}
      onConfirm={() => {
        alertState.onConfirm?.();
        hideAlert();
      }}
      onCancel={() => {
        alertState.onCancel?.();
        hideAlert();
      }}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
}
