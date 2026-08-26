"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { FileInput } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  PurchaseVoucherTableData,
  PurchaseVoucherTableProps,
} from "@/types/inventoryVoucher/PurchaseVoucherTypes";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { FC, Fragment, useState } from "react";
import { TableDeleteButton } from "@/components/ui/table-edit-button";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";

interface PurchaseVoucherState {
  purchaseVoucherData: PurchaseVoucherTableData[];
}

interface RootState {
  purchaseVoucher: PurchaseVoucherState;
}

const PurchaseVoucherTable: FC<PurchaseVoucherTableProps> = ({
  loading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeletePurchase,
  deletePurchaseVoucherLoading,
  currentPage,
  setCurrentPage,
  lastPage,
}) => {
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});

  // Toggle row visibility
  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const purchaseVoucherData: PurchaseVoucherTableData[] = useSelector(
    (state: RootState) => state?.purchaseVoucher?.purchaseVoucherData
  );

  const { search, setSearch, filtered } = useClientTableSearch(purchaseVoucherData);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          filtered.length > 0 && (
            <div className="flex w-full justify-end">
              <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={lastPage}
              onChange={(page) => setCurrentPage(page)}
              />
            </div>
          )
        }
        topContent={
          <TableSearchInput
            title="Active purchases"
            description="Search, review, and manage existing purchases."
            value={search}
            onValueChange={setSearch}
            placeholder="Search purchase"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn> </TableColumn>
          <TableColumn className="w-[100px]">Serial No.</TableColumn>
          <TableColumn align="center" className="w-[100px]">
            Purchase Date
          </TableColumn>
          <TableColumn align="center">Purchase No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Purchase Type</TableColumn>
          <TableColumn align="center">Purchase Amount</TableColumn>
          <TableColumn className="w-[120px]"> </TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={FileInput}
              entity="purchase vouchers"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data, index) => (
            <Fragment key={data.Id}>
              <TableRow>
                <TableCell>
                  <FaChevronRight
                    onClick={() => toggleRow(index)}
                    className={`transition-all duration-200 text-medium cursor-pointer ${
                      openRows[index] ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </TableCell>
                <TableCell className="w-[100px]">{index + 1}</TableCell>
                <TableCell>
                  {format(data.Purchase_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell>{data.Purchase_No}</TableCell>
                <TableCell>{data.Party_Name}</TableCell>
                <TableCell>
                  {(() => {
                    const raw = String(
                      data.Purchase_Type ?? data.Pur_Type ?? data.Is_Order ?? ""
                    ).trim();
                    if (
                      raw === "O" ||
                      raw === "1" ||
                      raw.toLowerCase().includes("order")
                    ) {
                      return "Ordered Purchase";
                    }
                    if (
                      raw === "R" ||
                      raw === "0" ||
                      raw.toLowerCase().includes("regular")
                    ) {
                      return "Regular Purchase";
                    }
                    return raw || "—";
                  })()}
                </TableCell>
                <TableCell>{data.Total_Amount}</TableCell>
                <TableCell> </TableCell>
                <TableCell align="center" className=" flex justify-center">
                  <TableDeleteButton
                    onPress={() => handleShowDeleteDialog(data.Id)}
                  />
                </TableCell>
              </TableRow>
              {openRows[index] && (
                <Fragment>
                  <TableRow>
                    <TableCell className=""> </TableCell>
                    <TableCell className="w-[100px] font-medium">
                      Item Name
                    </TableCell>
                    <TableCell className="font-medium">Item Quantity</TableCell>
                    <TableCell className="font-medium">Item Rate</TableCell>
                    <TableCell className="font-medium">Item Total</TableCell>
                    <TableCell className="font-medium">CGST</TableCell>
                    <TableCell className="font-medium">SGST</TableCell>
                    <TableCell className="font-medium">IGST</TableCell>
                    <TableCell className=""> </TableCell>
                  </TableRow>
                  {data?.ItemRow?.map((child, i) => (
                    <TableRow key={i}>
                      <TableCell className=""> </TableCell>
                      <TableCell className="w-[100px]">
                        {child.Item_Name}
                      </TableCell>
                      <TableCell>{child.Item_Qnty}</TableCell>
                      <TableCell>{child.Item_Rate}</TableCell>
                      <TableCell>{child.Item_Rate}</TableCell>
                      <TableCell>{child.Item_CGST}</TableCell>
                      <TableCell>{child.Item_SGST}</TableCell>
                      <TableCell>{child.Item_IGST || "0"}</TableCell>
                      <TableCell className=""> </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this purchase ?"
        isBusy={deletePurchaseVoucherLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeletePurchase}
      />
    </div>
  );
};
export default PurchaseVoucherTable;
