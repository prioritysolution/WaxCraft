"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import {
  TableDeleteButton,
  TableEditButton,
  TableNameCell,
  formatTableSerial,
  getPaginatedTableRows,
} from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import { tableClassNames } from "@/lib/uiStyles";
import {
  PartyMakingRateTableData,
  PartyMakingRateTableProps,
} from "@/types/master/PartyMakingRateTypes";
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
import { Percent } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface PartyMakingRateState {
  partyMakingRateData: PartyMakingRateTableData[];
}

interface RootState {
  partyMakingRate: PartyMakingRateState;
}

const PartyMakingRateTable: FC<PartyMakingRateTableProps> = ({
  loading,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  tableInput,
  handleFilterTableData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeletePartyMakingRate,
  deletePartyMakingRateLoading,
  deleteWarning,
}) => {
  const partyMakingRateData: PartyMakingRateTableData[] = useSelector(
    (state: RootState) => state?.partyMakingRate?.partyMakingRateData,
  );

  return (
    <>
      <Table
        removeWrapper
        aria-label="Party making rate table"
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
            title="All party making rates"
            description="Search, review, and update party making rates."
            value={tableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search party name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Making Rate</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Percent}
              entity="party making rates"
              search={tableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(partyMakingRateData, loading).map(
            (data, index) => (
              <TableRow key={data.Id}>
                <TableCell>
                  {formatTableSerial(index, { currentPage, perPage })}
                </TableCell>
                <TableCell>
                  <TableNameCell name={data.Party_Name || "-"} />
                </TableCell>
                <TableCell className="text-center">
                  {formatRate(data.Making_Rate)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-2">
                    <TableEditButton onPress={() => handleEditData(data)} />
                    <TableDeleteButton
                      onPress={() => handleShowDeleteDialog(data.Id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this party making rate?"
        warning={deleteWarning}
        isBusy={deletePartyMakingRateLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeletePartyMakingRate}
      />
    </>
  );
};

export default PartyMakingRateTable;
