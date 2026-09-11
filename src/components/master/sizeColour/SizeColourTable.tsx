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
import { Droplet } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  SizeColourTableData,
  SizeColourTableProps,
} from "@/types/master/SizeColourTypes";
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

interface SizeColourState {
  sizeColourData: SizeColourTableData[];
}

interface RootState {
  sizeColour: SizeColourState;
}

const SizeColourTable: FC<SizeColourTableProps> = ({
  loading,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  sizeColourTableInput,
  handleFilterTableData,
  colourOptions,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteSizeColour,
  deleteSizeColourLoading,
  deleteWarning,
}) => {
  const sizeColourData: SizeColourTableData[] = useSelector(
    (state: RootState) => state?.sizeColour?.sizeColourData
  );

  const resolveColourName = (value: string) => {
    const exactName = colourOptions.find((option) => {
      const optionName = option.Color_Name || option.Colour_Name || "";
      return optionName === value;
    });

    if (exactName) return exactName.Color_Name || exactName.Colour_Name || value;

    const byId = colourOptions.find(
      (option) => String(option.Id) === String(value)
    );

    if (byId) return byId.Color_Name || byId.Colour_Name || value;

    return value;
  };

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
            title="All size colours"
            description="Search, review, and update existing size colours."
            value={sizeColourTableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search by item name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Category Name</TableColumn>
          <TableColumn align="center">Model Name</TableColumn>
          <TableColumn align="center">Size Name</TableColumn>
          <TableColumn align="center">Colour Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Droplet}
              entity="size colours"
              search={sizeColourTableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(sizeColourData, loading).map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index, { currentPage, perPage })}</TableCell>
              <TableCell>{data.Cat_Name}</TableCell>
              <TableCell>{data.Model_Sh_Name}</TableCell>
              <TableCell>
                <TableNameCell name={data.Size_Name} />
              </TableCell>
              <TableCell>
                {resolveColourName(
                  String(
                    data.Color_Id ?? data.Color_Name ?? data.Colour_Name ?? "",
                  ),
                )}
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
        message="Are you sure to delete this size colour?"
        warning={deleteWarning}
        isBusy={deleteSizeColourLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteSizeColour}
      />
    </>
  );
};
export default SizeColourTable;
