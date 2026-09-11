"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { getPaginatedTableRows, getTableSerialIndex } from "@/components/ui/table-edit-button";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { Printer } from "lucide-react";
import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import {
  SamplePrintTableData,
  SamplePrintTableProps,
} from "@/types/inventoryVoucher/SamplePrintTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Button,
} from "@heroui/react";
import { format, parseISO, isValid } from "date-fns";
import { FC } from "react";
import { TableDeleteButton } from "@/components/ui/table-edit-button";
import { useSelector } from "react-redux";

interface SamplePrintState {
  samplePrintData: SamplePrintTableData[];
}

interface RootState {
  samplePrint: SamplePrintState;
}

const formatPrintDate = (value?: string) => {
  if (!value) return "";
  const parsed = value.includes("T") ? parseISO(value) : new Date(value);
  return isValid(parsed) ? format(parsed, "dd-MM-yyyy") : value;
};

const itemTypeLabel = (value?: string | number) => {
  const normalized = String(value ?? "").trim();
  if (normalized === "1") return "Own Item";
  if (normalized === "0") return "Party Item";
  return normalized || "—";
};

const SamplePrintTable: FC<SamplePrintTableProps> = ({
  loading,
  handleShowPrintFromHistory,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteSamplePrint,
  deleteSamplePrintLoading,
  printLoading = false,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
}) => {
  const samplePrintData: SamplePrintTableData[] = useSelector(
    (state: RootState) => state?.samplePrint?.samplePrintData
  );

  const { search, setSearch, filtered } = useClientTableSearch(samplePrintData);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Sample print history"
        bottomContent={
          <TablePaginationBar
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setCurrentPage}
            perPage={perPage}
            onPerPageChange={onPerPageChange}
          />
        }
        topContent={
          <TableSearchInput
            title="Sample print history"
            description="Saved sample PDFs for previously generated proposals."
            value={search}
            onValueChange={setSearch}
            placeholder="Search sample print"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn>Serial No.</TableColumn>
          <TableColumn align="center">Print Date</TableColumn>
          <TableColumn align="center">Sample No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Design Name</TableColumn>
          <TableColumn align="center">Design No.</TableColumn>
          <TableColumn align="center">Item Type</TableColumn>
          <TableColumn align="center">Total</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Printer}
              entity="sample prints"
              search={search}
              emptyHint="Generate a sample PDF to see it listed here."
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(filtered, loading).map((data, index) => (
            <TableRow key={data.Id || index}>
              <TableCell>
                {getTableSerialIndex(index, currentPage, perPage) + 1}
              </TableCell>
              <TableCell>{formatPrintDate(data.Print_Date)}</TableCell>
              <TableCell>{data.Sample_No || "—"}</TableCell>
              <TableCell>{data.Party_Name || "—"}</TableCell>
              <TableCell>
                {(() => {
                  const names = (data.DesignRow || [])
                    .map((row) => String(row.Design_Name || "").trim())
                    .filter(Boolean);
                  if (names.length > 0) return names.join(", ");
                  return data.Design_Name || "—";
                })()}
              </TableCell>
              <TableCell>
                {(() => {
                  const nos = (data.DesignRow || [])
                    .map((row) => String(row.Design_No || "").trim())
                    .filter(Boolean);
                  if (nos.length > 0) return nos.join(", ");
                  return data.Design_No || "—";
                })()}
              </TableCell>
              <TableCell>{itemTypeLabel(data.Item_Type)}</TableCell>
              <TableCell>{formatTwoDecimals(data.Total)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Tooltip content="Print" delay={200}>
                    <span className="inline-flex">
                      <Button
                        type="button"
                        isIconOnly
                        size="sm"
                        radius="md"
                        aria-label="Print"
                        className="h-8 w-8 min-w-8 bg-primary/10 text-primary shadow-none data-[hover=true]:bg-primary/20"
                        isLoading={printLoading}
                        isDisabled={printLoading}
                        onPress={() => handleShowPrintFromHistory(data)}
                      >
                        <Printer className="h-3.5 w-3.5" strokeWidth={2} />
                      </Button>
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
        message="Are you sure to delete this sample print?"
        isBusy={deleteSamplePrintLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteSamplePrint}
      />
    </div>
  );
};

export default SamplePrintTable;
