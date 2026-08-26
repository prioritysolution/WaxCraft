"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { FileSpreadsheet } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  InvoiceListData,
  InvoiceTableProps,
} from "@/types/inventoryVoucher/SalesVoucherTypes";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { format } from "date-fns";
import { FC } from "react";
import { TableDeleteButton } from "@/components/ui/table-edit-button";
import { MdLocalPrintshop } from "react-icons/md";
import { useSelector } from "react-redux";
import InvoiceModal from "./process/InvoiceModal";

interface InvoiceState {
  invoiceListData: InvoiceListData[];
}

interface RootState {
  salesVoucher: InvoiceState;
}

const InvoiceTable: FC<InvoiceTableProps> = ({
  loading,
  deleteInvoiceLoading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteInvoiceData,
  showInvoiceDialog,
  setShowInvoiceDialog,
  handleShowInvoiceDialog,
  currentPage,
  setCurrentPage,
  lastPage,
}) => {
  const invoiceData: InvoiceListData[] = useSelector(
    (state: RootState) => state?.salesVoucher?.invoiceListData
  );

  const { search, setSearch, filtered } = useClientTableSearch(invoiceData);

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
            title="Active invoices"
            description="Search, review, and manage existing invoices."
            value={search}
            onValueChange={setSearch}
            placeholder="Search invoice"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn>Serial No.</TableColumn>
          <TableColumn align="center">Sales Date</TableColumn>
          <TableColumn align="center">Sales No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Party Address</TableColumn>
          <TableColumn align="center">Party GST</TableColumn>
          <TableColumn align="center">Party Mobile</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={FileSpreadsheet}
              entity="invoices"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{format(data.Sales_Date, "dd-MM-yyyy")}</TableCell>
              <TableCell>{data.Sales_No}</TableCell>
              <TableCell>{data.Party_Name}</TableCell>
              <TableCell>{data.Party_Add}</TableCell>
              <TableCell>{data.Party_Gst}</TableCell>
              <TableCell>{data.Party_Mob}</TableCell>
              <TableCell align="center" className=" flex justify-center">
                <div className="relative flex items-center gap-3">
                  <Tooltip color="primary" content="Print">
                    <span
                      onClick={() => handleShowInvoiceDialog(data.Id)}
                      className="text-xl text-primary cursor-pointer active:opacity-50"
                    >
                      <MdLocalPrintshop />
                    </span>
                  </Tooltip>
                  <TableDeleteButton
                    onPress={() => handleShowDeleteDialog(data.Id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this invoice ?"
        isBusy={deleteInvoiceLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteInvoiceData}
      />

      <InvoiceModal
        showInvoiceDialog={showInvoiceDialog}
        setShowInvoiceDialog={setShowInvoiceDialog}
      />
    </div>
  );
};
export default InvoiceTable;
