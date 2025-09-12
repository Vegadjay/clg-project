"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  required?: boolean;
}

export function InputDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder = "",
  defaultValue = "",
  multiline = false,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  required = false,
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = () => {
    if (required && !value.trim()) return;
    onConfirm(value);
    setValue(defaultValue);
  };

  const handleCancel = () => {
    onCancel?.();
    setValue(defaultValue);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setValue(defaultValue);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-blue-500" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {multiline ? (
            <Textarea
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-[100px]"
            />
          ) : (
            <Input
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={required && !value.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easy input dialog usage
export function useInputDialog() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    description?: string;
    placeholder?: string;
    defaultValue?: string;
    multiline?: boolean;
    onConfirm?: (value: string) => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    required?: boolean;
  }>({
    open: false,
    title: "",
  });

  const showInputDialog = (config: Omit<typeof dialogState, "open">) => {
    setDialogState({ ...config, open: true });
  };

  const hideInputDialog = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const InputDialogComponent = () => (
    <InputDialog
      {...dialogState}
      onOpenChange={(open) => {
        if (!open) {
          hideInputDialog();
        }
      }}
      onConfirm={(value) => {
        dialogState.onConfirm?.(value);
        hideInputDialog();
      }}
      onCancel={() => {
        dialogState.onCancel?.();
        hideInputDialog();
      }}
    />
  );

  return {
    showInputDialog,
    hideInputDialog,
    InputDialogComponent,
  };
}
