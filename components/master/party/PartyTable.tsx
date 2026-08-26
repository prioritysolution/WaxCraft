"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import {
  TableDeleteButton,
  TableEditButton,
  TableNameCell,
  formatTableSerial,
} from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Users } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { PartyTableData, PartyTableProps } from "@/types/master/PartyTypes";
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
import { FC } from "react";
import { useSelector } from "react-redux";

interface PartyState {
  partyData: PartyTableData[];
}

interface RootState {
  party: PartyState;
}

const PartyTable: FC<PartyTableProps> = ({
  handleEditData,
  partyTableInput,
  handleFilterTableData,
  currentPage,
  setCurrentPage,
  lastPage,
  loading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteParty,
  deletePartyLoading,
  deleteWarning,
}) => {
  const partyData: PartyTableData[] = useSelector(
    (state: RootState) => state?.party?.partyData
  );

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          partyData?.length > 0 && (
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
            title="All parties"
            description="Search, review, and update existing parties."
            value={partyTableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search by party name"
            />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center">Party Type</TableColumn>
          <TableColumn align="center">Address</TableColumn>
          <TableColumn align="center">Phone No.</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Users}
              entity="parties"
              search={partyTableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {partyData?.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell><TableNameCell name={data.Party_Name} /></TableCell>
              <TableCell>{data.Party_Tp}</TableCell>
              <TableCell>{data.Party_Add}</TableCell>
              <TableCell>{data.Party_Mob}</TableCell>
              <TableCell className="text-center">
                <div className="inline-flex items-center gap-2">
                  <TableEditButton onPress={() => handleEditData(data)} />
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
        message="Are you sure to delete this party?"
        warning={deleteWarning}
        isBusy={deletePartyLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteParty}
      />
    </>
  );
};
export default PartyTable;
