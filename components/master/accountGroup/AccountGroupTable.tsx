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
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { FolderTree } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  AccountGroupTableData,
  AccountGroupTableProps,
} from "@/types/master/AccountGroupTypes";
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

interface AccountGroupState {
  accountGroupData: AccountGroupTableData[];
}

interface RootState {
  accountGroup: AccountGroupState;
}

const AccountGroupTable: FC<AccountGroupTableProps> = ({
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  loading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteAccountGroup,
  deleteAccountGroupLoading,
  deleteWarning,
}) => {
  const accountGroupData: AccountGroupTableData[] = useSelector(
    (state: RootState) => state?.accountGroup?.accountGroupData
  );

  const { search, setSearch, filtered } = useClientTableSearch(accountGroupData);

  return (
    <>
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
            title="All account groups"
            description="Search, review, and update existing account groups."
            value={search}
            onValueChange={setSearch}
            placeholder="Search account group"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Main Head</TableColumn>
          <TableColumn align="center">Sub Head Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={FolderTree}
              entity="account groups"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell>{data.Head_Name}</TableCell>
              <TableCell><TableNameCell name={data.Sub_Head_Name} /></TableCell>
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
        message="Are you sure to delete this account group?"
        warning={deleteWarning}
        isBusy={deleteAccountGroupLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteAccountGroup}
      />
    </>
  );
};
export default AccountGroupTable;
