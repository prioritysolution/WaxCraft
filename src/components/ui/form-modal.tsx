"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Pencil, Plus, X } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  formActionsClassName,
  getModalClassNames,
  ModalSize,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "@/lib/uiStyles";
import { cn } from "@/lib/utils";

interface FormModalProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  size?: ModalSize;
  isBusy?: boolean;
  contentClassName?: string;
  children: ReactNode;
}

export function FormModal({
  isOpen,
  onOpenChange,
  size = "md",
  isBusy = false,
  contentClassName,
  children,
}: FormModalProps) {
  const modalClasses = getModalClassNames(size);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      hideCloseButton
      isDismissable={!isBusy}
      isKeyboardDismissDisabled={isBusy}
      scrollBehavior="inside"
      backdrop="blur"
      size={size}
      classNames={{
        ...modalClasses,
        wrapper: cn(modalClasses.wrapper, "overflow-hidden"),
        base: cn(
          modalClasses.base,
          "!max-h-[min(88dvh,calc(100dvh-1.5rem))] overflow-hidden",
        ),
        header: "p-0 shrink-0",
        body: "wc-form-modal-body min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-0",
        footer: "p-0 shrink-0",
      }}
    >
      <ModalContent
        className={cn(
          "wc-form-modal flex max-h-[min(88dvh,calc(100dvh-1.5rem))] min-h-0 w-full flex-col overflow-hidden",
          "[&>form]:flex [&>form]:max-h-[min(88dvh,calc(100dvh-1.5rem))] [&>form]:min-h-0 [&>form]:w-full [&>form]:flex-1 [&>form]:flex-col [&>form]:overflow-hidden",
          "[&_form]:flex [&_form]:max-h-[min(88dvh,calc(100dvh-1.5rem))] [&_form]:min-h-0 [&_form]:w-full [&_form]:flex-1 [&_form]:flex-col [&_form]:overflow-hidden",
          contentClassName,
        )}
      >
        {children}
      </ModalContent>
    </Modal>
  );
}

export function FormModalHeader({
  title,
  description,
  isEdit = false,
  onClose,
  isBusy = false,
}: {
  title: string;
  description?: string;
  isEdit?: boolean;
  onClose: () => void;
  isBusy?: boolean;
}) {
  return (
    <ModalHeader className="flex shrink-0 items-start gap-3 px-4 pb-1 pt-5 sm:px-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        {isEdit ? (
          <Pencil className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Plus className="h-4 w-4" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-sm font-normal text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        isIconOnly
        size="sm"
        radius="md"
        variant="light"
        aria-label="Close"
        className="h-8 w-8 min-w-8 text-muted-foreground transition-colors data-[hover=true]:bg-black/[0.06] data-[hover=true]:text-foreground"
        onPress={onClose}
        isDisabled={isBusy}
      >
        <X className="h-4 w-4" />
      </Button>
    </ModalHeader>
  );
}

export function FormModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ModalBody
      className={cn(
        "wc-form-modal-body min-h-0 flex-1 gap-4 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 [&>*]:shrink-0",
        className,
      )}
    >
      {children}
    </ModalBody>
  );
}

export function FormModalFooter({
  isBusy = false,
  onCancel,
  submitLabel = "Add",
  cancelLabel = "Cancel",
  submitType = "submit",
  onSubmitPress,
  showSubmit = true,
  confirmColor = "primary",
}: {
  isBusy?: boolean;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitType?: "submit" | "button";
  onSubmitPress?: () => void;
  showSubmit?: boolean;
  confirmColor?: "primary" | "danger";
}) {
  return (
    <ModalFooter
      className={cn(
        formActionsClassName,
        "shrink-0 border-t border-black/[0.06] px-4 py-4 sm:px-5",
      )}
    >
      <Button
        type="button"
        variant="bordered"
        radius="md"
        isDisabled={isBusy}
        className={cn(secondaryButtonClassName, "w-auto")}
        onPress={onCancel}
      >
        {cancelLabel}
      </Button>
      {showSubmit ? (
        <Button
          type={submitType}
          color={confirmColor}
          radius="md"
          className={cn(
            confirmColor === "danger"
              ? "h-9 min-w-[84px] px-4 text-sm font-medium"
              : primaryButtonClassName,
            "w-auto",
          )}
          isLoading={isBusy}
          isDisabled={isBusy}
          spinner={<Spinner size="sm" color="current" />}
          onPress={submitType === "button" ? onSubmitPress : undefined}
        >
          {submitLabel}
        </Button>
      ) : null}
    </ModalFooter>
  );
}
