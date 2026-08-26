"use client";

import { getModalClassNames } from "@/lib/uiStyles";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { FC, useEffect, useRef, useState } from "react";
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

  const printRef = useRef(null);

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
  });

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
          <div className="h-[min(70vh,600px)] w-full overflow-auto rounded-xl border border-black/[0.06] bg-[#F7F5F3]/40">
            <div className="w-full min-w-[210mm]" ref={printRef}>
              <div className="w-full min-w-[210mm] max-w-[210mm] min-h-[297mm] p-2">
                <div className=" border-2 border-black flex flex-col w-full h-full">
                  <div className="border-b-2 border-black h-10 flex items-center justify-center w-full">
                    <p className="font-semibold">TAX INVOICE</p>
                  </div>
                  <div className="border-b-2 border-black h-[120px] w-full flex items-center justify-center px-5 ">
                    <div className=" aspect-square h-[100px] w-[100px] relative overflow-hidden items-center justify-center flex">
                      <Image
                        alt="Org Image"
                        src="/orgImg.png"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-grow flex flex-col items-center h-full text-center gap-2 text-sm w-full font-semibold">
                      <h3 className="text-2xl font-medium uppercase">
                        {orgName}
                      </h3>
                      <div className="space-y-[2px] uppercase">
                        <p>{orgAddress}</p>
                        <p>GSTIN No : {orgGstNo}</p>
                      </div>
                    </div>
                  </div>
                  <div className=" h-full w-full flex-grow">
                    <Table className=" border-b h-full w-full">
                      <TableHeader>
                        <TableRow className="h-[50px] font-semibold">
                          <TableCell colSpan={3} rowSpan={2} className="">
                            <div className="flex flex-col justify-between w-full h-full text-sm">
                              <div>
                                <p className="font-medium">Bill To</p>
                                <p>{invoiceData?.Party_Name}</p>
                              </div>
                              <div>
                                {/* <p>{invoiceData?.Cgst_Rate}</p> */}
                                {/* <p>GSTIN : {invoiceData?.Party_GST}</p> */}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            rowSpan={2}
                            className="border-x border-black"
                          >
                            <div className="flex flex-col justify-between w-full h-full text-sm">
                              <div>
                                <p>Place Of Supply</p>
                                <p>{invoiceData?.Party_Name}</p>
                              </div>
                              {/* <p>{invoiceData?.Party_Add}</p> */}
                            </div>
                          </TableCell>
                          <TableCell className="border-black">
                            Invoice : {invoiceData?.Sales_No}
                          </TableCell>
                        </TableRow>
                        <TableRow className="h-[50px] font-semibold">
                          <TableCell className="border-black">
                            Date :{" "}
                            {invoiceData?.Sales_Date &&
                              format(invoiceData?.Sales_Date, "dd-MM-yyyy")}
                          </TableCell>
                        </TableRow>
                        <TableRow className="h-[50px]">
                          <TableHead className="border-r border-black font-semibold">
                            Sl. No
                          </TableHead>
                          <TableHead className="border-r border-black font-semibold">
                            Name
                          </TableHead>
                          <TableHead className="border-r border-black font-semibold">
                            HSN
                          </TableHead>
                          <TableHead className="border-r border-black font-semibold">
                            Quantity
                          </TableHead>
                          <TableHead className="border-r border-black font-semibold">
                            Unit
                          </TableHead>
                          <TableHead className="border-r border-black w-[150px] font-semibold">
                            Rate
                          </TableHead>
                          <TableHead className="w-[150px] font-semibold">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="h-full">
                        {invoiceData?.ItemData?.map((item, index) => (
                          <TableRow key={index} className="h-12">
                            <TableCell className="border-r border-black">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border-r border-black">
                              {item.Item_Name}
                            </TableCell>
                            <TableCell className="border-r border-black text-right">
                              {item.Item_Hsn}
                            </TableCell>
                            <TableCell className="border-r border-black text-right">
                              {item.Item_Qnty}
                            </TableCell>
                            <TableCell className="border-r border-black">
                              {item.Item_Unit}
                            </TableCell>
                            <TableCell className="border-r border-black text-right">
                              {item.Item_Rate}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {item.Item_Tot}
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Empty row taking remaining space */}
                        {(() => {
                          const emptyRowHeight = Math.max(
                            0,
                            1122 -
                              683 -
                              (invoiceData?.ItemData?.length || 0) * 48,
                          );
                          return emptyRowHeight > 0 ? (
                            <TableRow style={{ height: `${emptyRowHeight}px` }}>
                              <TableCell className="border-r border-black h-full"></TableCell>
                              <TableCell className="border-r border-black h-full"></TableCell>
                              <TableCell className="border-r border-black h-full"></TableCell>
                              <TableCell className="border-r border-black h-full"></TableCell>
                              <TableCell className="border-r border-black h-full"></TableCell>
                              <TableCell className="border-r border-black h-full"></TableCell>
                              <TableCell className="h-full"></TableCell>
                            </TableRow>
                          ) : null;
                        })()}

                        {/* Taxable Total row */}

                        <TableRow className="h-8">
                          <TableCell
                            rowSpan={6}
                            colSpan={5}
                            className="border-r border-b-0"
                          >
                            <div className="w-full flex flex-col justify-between text-sm h-full ">
                              <div>
                                <p className="font-medium">
                                  Amount Chargable (in words)
                                </p>
                                <p className="text-lg font-medium">
                                  {convertToWords(
                                    Number(
                                      (
                                        (invoiceData?.Gross_Amt || 0) +
                                        (invoiceData?.Cgst_Amt || 0) +
                                        (invoiceData?.Sgst_Amt || 0) +
                                        (invoiceData?.Round_Amt || 0) -
                                        (invoiceData?.Discount || 0)
                                      ).toFixed(0)
                                    )
                                  )}{" "}
                                  Only
                                </p>
                              </div>
                              <p>
                                Note-Please make cheques in favor of &#34;
                                {orgName}&#34;
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="border-r font-semibold">
                            Taxable Total
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {invoiceData?.Gross_Amt}
                          </TableCell>
                        </TableRow>

                        <TableRow className="h-8">
                          <TableCell className="border-r font-semibold">
                            CGST
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {invoiceData?.Cgst_Amt}
                          </TableCell>
                        </TableRow>

                        <TableRow className="h-8">
                          <TableCell className="border-r font-semibold">
                            SGST
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {invoiceData?.Sgst_Amt}
                          </TableCell>
                        </TableRow>

                        <TableRow className="h-8">
                          <TableCell className="border-r font-semibold">
                            Round off
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {invoiceData?.Round_Amt}
                          </TableCell>
                        </TableRow>

                        <TableRow className="h-8">
                          <TableCell className="border-r font-semibold">
                            Discount
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {invoiceData?.Discount}
                          </TableCell>
                        </TableRow>

                        <TableRow className="h-8">
                          <TableCell className="border-r font-semibold">
                            Grand Total
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {(
                              (invoiceData?.Gross_Amt || 0) +
                              (invoiceData?.Cgst_Amt || 0) +
                              (invoiceData?.Sgst_Amt || 0) +
                              (invoiceData?.Round_Amt || 0) -
                              (invoiceData?.Discount || 0)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>

                        <TableRow className="h-[120px]">
                          <TableCell colSpan={5} className="border-r">
                            <h4 className="font-semibold">
                              Company Bank Account Details
                            </h4>
                            <p>Bank Name</p>
                            <p>Branch Name</p>
                            <p>IFSC</p>
                            <p>Account No.</p>
                          </TableCell>
                          <TableCell colSpan={2} className="">
                            <div className="w-full flex flex-col justify-between items-end text-sm h-full">
                              <p>For {orgName}</p>
                              <p>Authorised Signature</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="border-t-2 border-black h-10 text-center w-full flex justify-center items-center font-medium text-sm">
                    ** This is an computer generated Invoice **
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
