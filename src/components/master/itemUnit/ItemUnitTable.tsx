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
import { Ruler } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  ItemUnitTableData,
  ItemUnitTableProps,
} from "@/types/master/ItemUnitTypes";
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

interface ItemUnitState {
  itemUnitData: ItemUnitTableData[];
}

interface RootState {
  itemUnit: ItemUnitState;
}

const ItemUnitTable: FC<ItemUnitTableProps> = ({
  loading,
  handleEditData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemUnit,
  deleteItemUnitLoading,
  deleteWarning,
}) => {
  const itemUnitData: ItemUnitTableData[] = useSelector(
    (state: RootState) => state?.itemUnit?.itemUnitData
  );

  const { search, setSearch, filtered } = useClientTableSearch(itemUnitData);

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
        topContent={
          <TableSearchInput
            title="All units"
            description="Search, review, and update existing units."
            value={search}
            onValueChange={setSearch}
            placeholder="Search unit name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Unit Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState icon={Ruler} entity="units" search={search} />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell>
                <TableNameCell name={data.Unit_Name} />
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
        message="Are you sure to delete this unit?"
        warning={deleteWarning}
        isBusy={deleteItemUnitLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteItemUnit}
      />
    </>
  );
};
export default ItemUnitTable;
