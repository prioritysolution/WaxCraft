"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import { AlertTriangle, Ban, Check, Trash2, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  message: string;
  warning?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  isBusy?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onOpenChange,
  message,
  warning,
  onCancel,
  onConfirm,
  isBusy = false,
  cancelLabel,
  confirmLabel = "Delete",
}: DeleteConfirmModalProps) {
  const isBlocked = Boolean(warning);
  const resolvedCancelLabel = cancelLabel ?? (isBlocked ? "OK" : "Cancel");
  const isCancelAction = confirmLabel.trim().toLowerCase() === "cancel";
  const ConfirmIcon = isCancelAction ? Ban : Trash2;
  const MessageIcon = isCancelAction ? AlertTriangle : Trash2;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      hideCloseButton
      isDismissable={!isBusy}
      isKeyboardDismissDisabled={isBusy}
      backdrop="blur"
      size="sm"
      classNames={{
        wrapper: "items-center justify-center p-4",
        base: "mx-auto w-full max-w-[460px] overflow-hidden rounded-[20px] border border-[#D1D1D1] bg-white shadow-none",
        backdrop: "bg-black/35",
        body: "px-8 pt-9 pb-5 sm:px-10",
        footer: "flex flex-row justify-end gap-2.5 px-8 pb-8 pt-2 sm:px-10",
      }}
    >
      <ModalContent>
        <ModalBody>
          {isBlocked ? (
            <div className="flex w-full items-start gap-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-[#B91C1C]"
                aria-hidden="true"
              />
              <p className="text-sm leading-5 text-[#B91C1C]">{warning}</p>
            </div>
          ) : (
            <div className="flex w-full items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE7F0] text-[#E91E63]">
                <MessageIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="min-w-0 flex-1 pt-1.5 text-left text-[18px] font-medium leading-7 text-[#212121] sm:text-[20px]">
                {message}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            radius="md"
            isDisabled={isBusy}
            startContent={
              isBlocked ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <X className="h-4 w-4" aria-hidden="true" />
              )
            }
            className="h-10 min-w-[92px] rounded-lg bg-[#E9EAEE] px-5 text-sm font-medium text-[#30475E] shadow-none data-[hover=true]:!bg-[#DCDDE3]"
            onPress={onCancel}
          >
            {resolvedCancelLabel}
          </Button>
          {isBlocked ? null : (
            <Button
              type="button"
              color="danger"
              radius="md"
              startContent={
                isBusy ? null : (
                  <ConfirmIcon className="h-4 w-4" aria-hidden="true" />
                )
              }
              className="h-10 min-w-[92px] rounded-lg bg-[#E91E63] px-5 text-sm font-medium text-white shadow-none data-[hover=true]:!bg-[#C2185B]"
              isLoading={isBusy}
              isDisabled={isBusy}
              spinner={<Spinner size="sm" color="current" />}
              onPress={onConfirm}
            >
              {confirmLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
