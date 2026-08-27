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
import { Package } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { ItemTableData, ItemTableProps } from "@/types/master/ItemTypes";
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
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";

interface ItemState {
  itemData: ItemTableData[];
}

interface RootState {
  item: ItemState;
}

/** Item names follow: Category - Model - Size [- Colour] */
const getSizeFromItemName = (itemName: string): string => {
  const parts = (itemName || "").split(" - ");
  return parts.length >= 3 ? parts[2].trim() : "";
};

const compareItemsBySizeAsc = (a: ItemTableData, b: ItemTableData): number => {
  const sizeA = getSizeFromItemName(a.Item_Name);
  const sizeB = getSizeFromItemName(b.Item_Name);

  if (!sizeA && !sizeB) {
    return (a.Item_Name || "").localeCompare(b.Item_Name || "", undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }
  if (!sizeA) return 1;
  if (!sizeB) return -1;

  const numA = Number.parseFloat(sizeA);
  const numB = Number.parseFloat(sizeB);
  const isNumA =
    !Number.isNaN(numA) && /^-?\d+(\.\d+)?$/.test(sizeA);
  const isNumB =
    !Number.isNaN(numB) && /^-?\d+(\.\d+)?$/.test(sizeB);

  if (isNumA && isNumB && numA !== numB) return numA - numB;

  const sizeCompare = sizeA.localeCompare(sizeB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
  if (sizeCompare !== 0) return sizeCompare;

  return (a.Item_Name || "").localeCompare(b.Item_Name || "", undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const ItemTable: FC<ItemTableProps> = ({
  loading,
  handleEditData,
  itemTableInput,
  handleFilterTableData,
  currentPage,
  setCurrentPage,
  lastPage,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItem,
  deleteItemLoading,
  deleteWarning,
}) => {
  const itemData: ItemTableData[] = useSelector(
    (state: RootState) => state?.item?.itemData
  );

  const sortedItemData = useMemo(
    () => [...(itemData || [])].sort(compareItemsBySizeAsc),
    [itemData]
  );

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          sortedItemData.length > 0 && (
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
            title="All items"
            description="Search, review, and update existing items."
            value={itemTableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search by item name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Item Name</TableColumn>
          <TableColumn align="center">Item Short Name</TableColumn>
          <TableColumn align="center">Category Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Package}
              entity="items"
              search={itemTableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {sortedItemData.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell>
                <TableNameCell name={data.Item_Name} />
              </TableCell>
              <TableCell>{data.Item_Sh_Name}</TableCell>
              <TableCell>{data.Cat_Name}</TableCell>
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
        message="Are you sure to delete this item?"
        warning={deleteWarning}
        isBusy={deleteItemLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteItem}
      />
    </>
  );
};
export default ItemTable;
