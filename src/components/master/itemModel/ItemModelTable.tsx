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
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { Shapes } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  ItemModelTableData,
  ItemModelTableProps,
} from "@/types/master/ItemModelTypes";
import {
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

interface ItemModelState {
  itemModelData: ItemModelTableData[];
}

interface RootState {
  itemModel: ItemModelState;
}

const ItemModelTable: FC<ItemModelTableProps> = ({
  loading,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemModel,
  deleteItemModelLoading,
  deleteWarning,
}) => {
  const itemModelData: ItemModelTableData[] = useSelector(
    (state: RootState) => state?.itemModel?.itemModelData
  );

  const { search, setSearch, filtered } = useClientTableSearch(itemModelData);

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
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
            title="All models"
            description="Search, review, and update existing models."
            value={search}
            onValueChange={setSearch}
            placeholder="Search model name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Category Name</TableColumn>
          <TableColumn align="center">Model Name</TableColumn>
          <TableColumn align="center">Model Short Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState icon={Shapes} entity="models" search={search} />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(filtered, loading).map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index, { currentPage, perPage })}</TableCell>
              <TableCell>{data.Cat_Name}</TableCell>
              <TableCell>
                <TableNameCell name={data.Model_Name} />
              </TableCell>
              <TableCell>{data.Model_Sh_Name}</TableCell>
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
        message="Are you sure to delete this model?"
        warning={deleteWarning}
        isBusy={deleteItemModelLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteItemModel}
      />
    </>
  );
};
export default ItemModelTable;
