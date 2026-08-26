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
import { tableClassNames } from "@/lib/uiStyles";
import {
  ItemColourTableData,
  ItemColourTableProps,
} from "@/types/master/ItemColourTypes";
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
import { Palette } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface ItemColourState {
  itemColourData: ItemColourTableData[];
}

interface RootState {
  itemColour: ItemColourState;
}

const ItemColourTable: FC<ItemColourTableProps> = ({
  loading,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  colourTableInput,
  handleFilterTableData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteItemColour,
  deleteItemColourLoading,
  deleteWarning,
}) => {
  const itemColourData: ItemColourTableData[] = useSelector(
    (state: RootState) => state?.itemColour?.itemColourData,
  );

  return (
    <>
      <Table
        removeWrapper
        aria-label="Item colour table"
        bottomContent={
          itemColourData?.length > 0 && (
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
            title="All colours"
            description="Search, review, and update existing colours."
            value={colourTableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search colour name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Colour Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Palette}
              entity="colours"
              search={colourTableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {(itemColourData || []).map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell>
                <TableNameCell
                  name={data.Color_Name || data.Colour_Name || "-"}
                />
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
        message="Are you sure to delete this colour?"
        warning={deleteWarning}
        isBusy={deleteItemColourLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteItemColour}
      />
    </>
  );
};

export default ItemColourTable;
