"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Workflow } from "lucide-react";
import { FC } from "react";
import WorkProcessTable from "./WorkProcessTable";
import { WorkProcessProps } from "@/types/master/WorkProcessTypes";
import WorkProcessForm from "./WorkProcessForm";

const WorkProcess: FC<WorkProcessProps> = ({
  addWorkProcessLoading,
  updateWorkProcessLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteWorkProcess,
  deleteWorkProcessLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Workflow}
        title="Work Process"
        description="Define production processes used in order processing."
        badge={<PageCountBadge count={totalCount} singular="process" plural="processes" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Work Process
          </PageActionButton>
        }
      />

      <WorkProcessForm
        addWorkProcessLoading={addWorkProcessLoading}
        updateWorkProcessLoading={updateWorkProcessLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
      />
      <WorkProcessTable
        loading={loading}
        handleEditData={handleEditData}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeleteWorkProcess={handleDeleteWorkProcess}
        deleteWorkProcessLoading={deleteWorkProcessLoading}
        deleteWarning={deleteWarning}
      />
    </PageShell>
  );
};
export default WorkProcess;
