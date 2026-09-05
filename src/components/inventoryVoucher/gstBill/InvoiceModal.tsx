"use client";

import { getModalClassNames } from "@/lib/uiStyles";

import { InvoiceModalProps } from "@/types/inventoryVoucher/GstBillTypes";
import getCookieData from "@/utils/getCookieData";
import convertToWords from "@/utils/numberToWords";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import { format } from "date-fns";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const InvoiceModal: FC<InvoiceModalProps> = ({
  showInvoice,
  setShowInvoice,
  invoiceData,
  setInvoiceData,
}) => {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgAddress, setOrgAddress] = useState<string | null>(null);
  const [orgGstNo, setOrgGstNo] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgName(getCookieData<string | null>("waxCraftClientOrgName"));
      setOrgAddress(getCookieData<string | null>("waxCraftClientOrgAddress"));
      setOrgGstNo(getCookieData<string | null>("waxCraftClientOrgGst"));
    }
  }, []);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "GST Bill Invoice",
    pageStyle: `
      @page { size: A4 portrait; margin: 8mm; }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
        }
        .invoice-print-sheet {
          background: #ffffff !important;
          min-height: 100% !important;
          width: 100% !important;
          max-width: none !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const grandTotal = useMemo(() => {
    const total =
      (Number(invoiceData?.Gross_Amt) || 0) +
      (Number(invoiceData?.Cgst_Amt) || 0) +
      (Number(invoiceData?.Sgst_Amt) || 0) +
      (Number(invoiceData?.Round_Amt) || 0) -
      (Number(invoiceData?.Discount) || 0);
    return Number.isFinite(total) ? total : 0;
  }, [invoiceData]);

  const itemRows = invoiceData?.ItemData ?? [];

  return (
    <Modal
      isOpen={showInvoice}
      scrollBehavior="inside"
      placement="center"
      onOpenChange={setShowInvoice}
      backdrop="blur"
      size="4xl"
      classNames={getModalClassNames("4xl")}
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        <ModalBody className="min-h-0 overflow-hidden pt-5">
          <div className="h-[min(70vh,720px)] w-full overflow-auto rounded-xl border border-black/[0.06] bg-white">
            <div className="flex w-full justify-center p-3 bg-white">
              <div
                ref={printRef}
                className="invoice-print-sheet w-full max-w-[210mm] min-h-[297mm] bg-white text-black"
              >
                <div className="flex min-h-0 w-full flex-col border-2 border-black">
                  <div className="flex h-8 shrink-0 items-center justify-center border-b-2 border-black">
                    <p className="text-sm font-semibold tracking-wide">
                      TAX INVOICE
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 border-b-2 border-black px-3 py-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
                      <Image
                        alt="Org Image"
                        src="/orgImg.png"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-center">
                      <h3 className="truncate text-lg font-semibold uppercase leading-tight">
                        {orgName}
                      </h3>
                      <p className="mt-0.5 text-[11px] uppercase leading-snug">
                        {orgAddress}
                      </p>
                      <p className="text-[11px] uppercase">
                        GSTIN No : {orgGstNo}
                      </p>
                    </div>
                  </div>

                  <div className="grid shrink-0 grid-cols-12 border-b-2 border-black text-[11px]">
                    <div className="col-span-5 border-r-2 border-black px-2 py-1.5">
                      <p className="font-semibold">Bill To</p>
                      <p className="mt-0.5 font-medium">
                        {invoiceData?.Party_Name || "—"}
                      </p>
                    </div>
                    <div className="col-span-4 border-r-2 border-black px-2 py-1.5">
                      <p className="font-semibold">Place Of Supply</p>
                      <p className="mt-0.5 font-medium">
                        {invoiceData?.Party_Name || "—"}
                      </p>
                    </div>
                    <div className="col-span-3 px-2 py-1.5">
                      <p className="font-semibold">
                        Invoice : {invoiceData?.Sales_No || "—"}
                      </p>
                      <p className="mt-1 font-semibold">
                        Date :{" "}
                        {invoiceData?.Sales_Date
                          ? format(invoiceData.Sales_Date, "dd-MM-yyyy")
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1">
                    <table className="w-full border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-black bg-[#F7F5F3]">
                          <th className="w-[8%] border-r border-black px-1.5 py-1.5 text-left font-semibold">
                            Sl. No
                          </th>
                          <th className="border-r border-black px-1.5 py-1.5 text-left font-semibold">
                            Name
                          </th>
                          <th className="w-[10%] border-r border-black px-1.5 py-1.5 text-right font-semibold">
                            HSN
                          </th>
                          <th className="w-[10%] border-r border-black px-1.5 py-1.5 text-right font-semibold">
                            Qty
                          </th>
                          <th className="w-[10%] border-r border-black px-1.5 py-1.5 text-left font-semibold">
                            Unit
                          </th>
                          <th className="w-[12%] border-r border-black px-1.5 py-1.5 text-right font-semibold">
                            Rate
                          </th>
                          <th className="w-[14%] px-1.5 py-1.5 text-right font-semibold">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemRows.map((item, index) => (
                          <tr
                            key={`${item.Item_Name}-${index}`}
                            className="border-b border-black/40"
                          >
                            <td className="border-r border-black px-1.5 py-1 align-top">
                              {index + 1}
                            </td>
                            <td className="border-r border-black px-1.5 py-1 align-top">
                              {item.Item_Name}
                            </td>
                            <td className="border-r border-black px-1.5 py-1 text-right align-top">
                              {item.Item_Hsn}
                            </td>
                            <td className="border-r border-black px-1.5 py-1 text-right align-top">
                              {item.Item_Qnty}
                            </td>
                            <td className="border-r border-black px-1.5 py-1 align-top">
                              {item.Item_Unit}
                            </td>
                            <td className="border-r border-black px-1.5 py-1 text-right align-top">
                              {item.Item_Rate}
                            </td>
                            <td className="px-1.5 py-1 text-right font-semibold align-top">
                              {item.Item_Tot}
                            </td>
                          </tr>
                        ))}
                        {itemRows.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-2 py-4 text-center text-muted-foreground"
                            >
                              No items
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid shrink-0 grid-cols-12 border-t-2 border-black text-[11px]">
                    <div className="col-span-7 flex flex-col justify-between gap-3 border-r-2 border-black px-2 py-2">
                      <div>
                        <p className="font-semibold">
                          Amount Chargeable (in words)
                        </p>
                        <p className="mt-0.5 text-sm font-medium leading-snug">
                          {convertToWords(Number(grandTotal.toFixed(0)))} Only
                        </p>
                      </div>
                      <p>
                        Note — Please make cheques in favor of &quot;{orgName}
                        &quot;
                      </p>
                      <div>
                        <h4 className="font-semibold">
                          Company Bank Account Details
                        </h4>
                        <p>Bank Name</p>
                        <p>Branch Name</p>
                        <p>IFSC</p>
                        <p>Account No.</p>
                      </div>
                    </div>
                    <div className="col-span-5">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-black/40">
                            <td className="border-r border-black px-2 py-1 font-semibold">
                              Taxable Total
                            </td>
                            <td className="px-2 py-1 text-right font-semibold">
                              {invoiceData?.Gross_Amt ?? 0}
                            </td>
                          </tr>
                          <tr className="border-b border-black/40">
                            <td className="border-r border-black px-2 py-1 font-semibold">
                              CGST
                            </td>
                            <td className="px-2 py-1 text-right font-semibold">
                              {invoiceData?.Cgst_Amt ?? 0}
                            </td>
                          </tr>
                          <tr className="border-b border-black/40">
                            <td className="border-r border-black px-2 py-1 font-semibold">
                              SGST
                            </td>
                            <td className="px-2 py-1 text-right font-semibold">
                              {invoiceData?.Sgst_Amt ?? 0}
                            </td>
                          </tr>
                          <tr className="border-b border-black/40">
                            <td className="border-r border-black px-2 py-1 font-semibold">
                              Round off
                            </td>
                            <td className="px-2 py-1 text-right font-semibold">
                              {invoiceData?.Round_Amt ?? 0}
                            </td>
                          </tr>
                          <tr className="border-b border-black/40">
                            <td className="border-r border-black px-2 py-1 font-semibold">
                              Discount
                            </td>
                            <td className="px-2 py-1 text-right font-semibold">
                              {invoiceData?.Discount ?? 0}
                            </td>
                          </tr>
                          <tr className="border-b-2 border-black">
                            <td className="border-r border-black px-2 py-1.5 font-semibold">
                              Grand Total
                            </td>
                            <td className="px-2 py-1.5 text-right font-semibold">
                              {grandTotal.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex h-[72px] flex-col items-end justify-between px-2 py-2 text-[11px]">
                        <p>For {orgName}</p>
                        <p>Authorised Signature</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-7 shrink-0 items-center justify-center border-t-2 border-black text-[11px] font-medium">
                    ** This is a computer generated Invoice **
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => {
              setShowInvoice(false);
              setInvoiceData(null);
            }}
            size="lg"
            radius="sm"
            className="w-32"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="lg"
            radius="sm"
            className="w-32"
            onPress={() => generatePDF()}
          >
            Print
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default InvoiceModal;
