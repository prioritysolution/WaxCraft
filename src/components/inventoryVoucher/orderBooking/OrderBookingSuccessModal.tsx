"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import { CheckCircle2 } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ModalActionIcon } from "@/lib/modalActionIcons";

interface OrderBookingSuccessModalProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  message?: string;
  orderIds: string[];
  onClose: () => void;
  idLabel?: string;
  fallbackMessage?: string;
}

const cleanSuccessMessage = (
  message?: string,
  fallback = "Order booked successfully",
) => {
  const raw = String(message || "").trim();
  if (!raw) return fallback;

  const cleaned = raw
    .replace(/invoise/gi, "Invoice")
    .replace(
      /\s*(order|invoice|sales|purchase)\s*(no|nos|number|numbers|id|ids)?\s*(is|are|:)?\s*[\w\-\/, ]+$/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[,:\-–—]+$/, "")
    .trim();

  return cleaned || fallback;
};

export function OrderBookingSuccessModal({
  isOpen,
  onOpenChange,
  message,
  orderIds,
  onClose,
  idLabel,
  fallbackMessage = "Order booked successfully",
}: OrderBookingSuccessModalProps) {
  const hasMultiple = orderIds.length > 1;
  const orderLabel =
    idLabel || (hasMultiple ? "Order IDs" : "Order ID");
  const orderValue = orderIds.length ? orderIds.join(", ") : "—";
  const title = useMemo(
    () => cleanSuccessMessage(message, fallbackMessage),
    [message, fallbackMessage],
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      hideCloseButton
      isDismissable
      backdrop="blur"
      size="sm"
      classNames={{
        wrapper: "items-center justify-center p-4",
        base: "mx-auto w-full max-w-[460px] overflow-hidden rounded-[20px] border border-[#D1D1D1] bg-white shadow-none",
        backdrop: "bg-black/35",
        body: "px-8 pt-9 pb-5 sm:px-10",
        footer:
          "flex flex-row !justify-center gap-2.5 px-8 pb-8 pt-2 sm:px-10",
      }}
    >
      <ModalContent>
        <ModalBody>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-[18px] font-semibold leading-7 text-[#212121] sm:text-[20px]">
              {title}
            </p>
            <div className="w-full rounded-xl border border-black/[0.08] bg-[#F7F5F3] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {orderLabel}
              </p>
              <p className="mt-1 break-all text-base font-semibold text-[#212121]">
                {orderValue}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            radius="md"
            color="primary"
            className="h-10 min-w-[92px] rounded-lg px-5 text-sm font-medium shadow-none"
            startContent={<ModalActionIcon label="OK" />}
            onPress={onClose}
          >
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
