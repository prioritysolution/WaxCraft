"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { cn } from "@/lib/utils";
import { secondaryButtonClassName } from "@/lib/uiStyles";
import { DesignProps, DesignTableData } from "@/types/master/DesignTypes";
import { Button } from "@heroui/react";
import { Palette, Printer } from "lucide-react";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import DesignForm from "./DesignForm";
import DesignTable from "./DesignTable";
import PreviewModal from "./PreviewModal";

interface DesignState {
  designData: DesignTableData[];
}

interface RootState {
  design: DesignState;
}

const Design: FC<DesignProps> = ({
  addDesignLoading,
  updateDesignLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  handleDeleteFormTableData,
  designFormTableData,
  handleAddDesign,
  photoPreview,
  handlePhotoChange,
  handleSearchCategory,
  handleScrollCategory,
  currentPage,
  setCurrentPage,
  lastPage,
  designTableInput,
  handleFilterTableData,
  categoryInput,
  setCategoryInput,
  itemInput,
  setItemInput,
  getCategoryLoading,
  getItemLoading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteDesign,
  deleteDesignLoading,
  deleteWarning,
  totalCount,
  perPage,
  onPerPageChange,
}) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const designData: DesignTableData[] = useSelector(
    (state: RootState) => state?.design?.designData,
  );
  const safeDesignData = Array.isArray(designData) ? designData : [];

  return (
    <PageShell>
      <PageHeader
        icon={Palette}
        title="Design"
        description="Manage design masters, photos, and related item mapping."
        badge={<PageCountBadge count={totalCount} singular="design" plural="designs" />}
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              radius="md"
              variant="bordered"
              className={cn(secondaryButtonClassName)}
              startContent={<Printer className="h-4 w-4" />}
              onPress={() => setShowPrintDialog(true)}
              isDisabled={loading || safeDesignData.length === 0}
              aria-label="Print design list"
            >
              Print
            </Button>
            <PageActionButton onPress={() => setIsOpen(true)}>
              Add Design
            </PageActionButton>
          </div>
        }
      />

      <DesignForm
        addDesignLoading={addDesignLoading}
        updateDesignLoading={updateDesignLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        designFormTableData={designFormTableData}
        handleDeleteFormTableData={handleDeleteFormTableData}
        handleAddDesign={handleAddDesign}
        photoPreview={photoPreview}
        handlePhotoChange={handlePhotoChange}
        handleSearchCategory={handleSearchCategory}
        handleScrollCategory={handleScrollCategory}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
        itemInput={itemInput}
        setItemInput={setItemInput}
        getCategoryLoading={getCategoryLoading}
        getItemLoading={getItemLoading}
      />
      <DesignTable
        handleEditData={handleEditData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        designTableInput={designTableInput}
        handleFilterTableData={handleFilterTableData}
        loading={loading}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setTempDeleteId={setTempDeleteId}
        handleShowDeleteDialog={handleShowDeleteDialog}
        handleDeleteDesign={handleDeleteDesign}
        deleteDesignLoading={deleteDesignLoading}
        deleteWarning={deleteWarning}
      />

      <PreviewModal
        designData={safeDesignData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
        currentPage={currentPage}
        perPage={perPage}
      />
    </PageShell>
  );
};
export default Design;
