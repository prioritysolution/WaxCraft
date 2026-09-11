"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Spinner,
} from "@heroui/react";
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
            <p className="w-full rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-center text-sm leading-5 text-[#B91C1C]">
              {warning}
            </p>
          ) : (
            <p className="w-full text-center text-[18px] font-medium leading-7 text-[#212121] sm:text-[20px]">
              {message}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            radius="md"
            isDisabled={isBusy}
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
