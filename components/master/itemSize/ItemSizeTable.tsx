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
import { Maximize2 } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  ItemSizeTableData,
  ItemSizeTableProps,
} from "@/types/master/ItemSizeTypes";
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

interface ItemSizeState {
  itemSizeData: ItemSizeTableData[];
}

interface RootState {
  itemSize: ItemSizeState;
}

const ItemSizeTable: FC<ItemSizeTableProps> = ({
  loading,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemSize,
  deleteItemSizeLoading,
  deleteWarning,
}) => {
  const itemSizeData: ItemSizeTableData[] = useSelector(
    (state: RootState) => state?.itemSize?.itemSizeData
  );

  const { search, setSearch, filtered } = useClientTableSearch(itemSizeData);

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
            title="All sizes"
            description="Search, review, and update existing sizes."
            value={search}
            onValueChange={setSearch}
            placeholder="Search size name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Category Name</TableColumn>
          <TableColumn align="center">Model Name</TableColumn>
          <TableColumn align="center">Size Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState icon={Maximize2} entity="sizes" search={search} />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell>{data.Cat_Name}</TableCell>
              <TableCell>{data.Model_Sh_Name}</TableCell>
              <TableCell>
                <TableNameCell name={data.Size_Name} />
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
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this size?"
        warning={deleteWarning}
        isBusy={deleteItemSizeLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteItemSize}
      />
    </>
  );
};
export default ItemSizeTable;
