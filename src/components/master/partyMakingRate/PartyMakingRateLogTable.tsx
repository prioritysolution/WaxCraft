"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import {
  formatTableSerial,
  getPaginatedTableRows,
} from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import { tableClassNames } from "@/lib/uiStyles";
import { PartyMakingRateLogTableProps } from "@/types/master/PartyMakingRateTypes";
import { formatRate } from "@/utils/formatDecimal";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { History } from "lucide-react";
import { FC } from "react";

const formatLogDate = (value: string) => {
  if (!value) return "—";
  const parsed = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return value;
  return format(parsed, "dd MMM yyyy, hh:mm a");
};

const actionLabel: Record<string, string> = {
  ADD: "Add",
  UPDATE: "Update",
  DELETE: "Delete",
};

const actionClassName: Record<string, string> = {
  ADD: "bg-[#E7F6EA] text-[#1B7A3D]",
  UPDATE: "bg-[#FFF4E5] text-[#B45309]",
  DELETE: "bg-[#FDECEC] text-[#DC2626]",
};

const RateChange: FC<{ previous: string; next: string }> = ({
  previous,
  next,
}) => {
  const from = formatRate(previous, "");
  const to = formatRate(next, "");
  if (!from && !to) return <>—</>;
  if (!from || from === to) return <>{to || "—"}</>;
  if (!to) {
    return <span className="text-muted-foreground line-through">{from}</span>;
  }
  return (
    <span className="inline-flex items-center justify-center gap-1">
      <span className="text-muted-foreground line-through">{from}</span>
      <span aria-hidden="true">→</span>
      <span>{to}</span>
    </span>
  );
};

const PartyMakingRateLogTable: FC<PartyMakingRateLogTableProps> = ({
  loading,
  rows,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  tableInput,
  handleFilterTableData,
  unavailable,
}) => {
  return (
    <Table
      removeWrapper
      aria-label="Party making rate change log"
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
          title="Change log"
          description="Making rate changes are kept per item model. WT rate, ghat, and polish changes are kept once per party."
          value={tableInput}
          onValueChange={handleFilterTableData}
          placeholder="Search party or model"
        />
      }
      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn align="center">Serial No.</TableColumn>
        <TableColumn align="center">Date</TableColumn>
        <TableColumn align="center">Party</TableColumn>
        <TableColumn align="center">Item Model</TableColumn>
        <TableColumn align="center">Action</TableColumn>
        <TableColumn align="center">Making Rate</TableColumn>
        <TableColumn align="center">WT Rate</TableColumn>
        <TableColumn align="center">Ghat</TableColumn>
        <TableColumn align="center">Polish</TableColumn>
        <TableColumn align="center">Changed By</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          <TableEmptyState
            icon={History}
            entity="change logs"
            search={tableInput}
            emptyHint={
              unavailable
                ? "Rate changes will appear here after the log API is available."
                : "Saved rate changes will appear here."
            }
          />
        }
        loadingContent={<Spinner size="lg" color="primary" />}
        loadingState={loading ? "loading" : "idle"}
      >
        {getPaginatedTableRows(rows, loading).map((data, index) => (
          <TableRow key={`${data.id}-${index}`}>
            <TableCell>
              {formatTableSerial(index, { currentPage, perPage })}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatLogDate(data.changedAt)}
            </TableCell>
            <TableCell>{data.partyName || "—"}</TableCell>
            <TableCell>
              {data.modelName ||
                (data.oldWtRate ||
                data.newWtRate ||
                data.oldGhat ||
                data.newGhat ||
                data.oldPolish ||
                data.newPolish
                  ? "Party"
                  : "—")}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  actionClassName[data.action] ||
                  "bg-[#F7F5F3] text-foreground"
                }`}
              >
                {actionLabel[data.action] || data.action || "—"}
              </span>
            </TableCell>
            <TableCell>
              <RateChange previous={data.oldMakingRate} next={data.newMakingRate} />
            </TableCell>
            <TableCell>
              <RateChange previous={data.oldWtRate} next={data.newWtRate} />
            </TableCell>
            <TableCell>
              <RateChange previous={data.oldGhat} next={data.newGhat} />
            </TableCell>
            <TableCell>
              <RateChange previous={data.oldPolish} next={data.newPolish} />
            </TableCell>
            <TableCell>{data.changedBy || "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PartyMakingRateLogTable;
