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
import { Workflow } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  WorkProcessTableData,
  WorkProcessTableProps,
} from "@/types/master/WorkProcessTypes";
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

interface WorkProcessState {
  workProcessData: WorkProcessTableData[];
}

interface RootState {
  workProcess: WorkProcessState;
}

const WorkProcessTable: FC<WorkProcessTableProps> = ({
  loading,
  handleEditData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteWorkProcess,
  deleteWorkProcessLoading,
  deleteWarning,
}) => {
  const workProcessData: WorkProcessTableData[] = useSelector(
    (state: RootState) => state?.workProcess?.workProcessData
  );

  const { search, setSearch, filtered } = useClientTableSearch(workProcessData);

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
        // bottomContent={
        //   workProcessData?.length > 0 && (
        //     <Pagination
        //       isCompact
        //       showControls
        //       showShadow
        //       color="primary"
        //       page={1}
        //       total={10}
        //       // onChange={(page) => setPage(page)}
        //     />
        //   )
        // }
        topContent={
          <TableSearchInput
            title="All processes"
            description="Search, review, and update existing work processes."
            value={search}
            onValueChange={setSearch}
            placeholder="Search process name"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Process Name</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState icon={Workflow} entity="processes" search={search} />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell><TableNameCell name={data.Process_Name} /></TableCell>
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
        message="Are you sure to delete this work process?"
        warning={deleteWarning}
        isBusy={deleteWorkProcessLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteWorkProcess}
      />
    </>
  );
};
export default WorkProcessTable;
