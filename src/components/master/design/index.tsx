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
import DesignForm from "./DesignForm";
import DesignTable from "./DesignTable";
import PreviewModal from "./PreviewModal";

const Design: FC<DesignProps> = ({
  refreshDesignDetails,
  handlePrintDesigns,
  printLoading = false,
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
  getUnitLoading,
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
  const [printDesignData, setPrintDesignData] = useState<DesignTableData[]>(
    [],
  );

  const handlePrintPress = async () => {
    if (!handlePrintDesigns) return;
    const rows = await handlePrintDesigns();
    if (rows.length > 0) {
      setPrintDesignData(rows);
      setShowPrintDialog(true);
    }
  };

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
              onPress={() => {
                void handlePrintPress();
              }}
              isLoading={printLoading}
              isDisabled={
                printLoading || loading || totalCount === 0 || !handlePrintDesigns
              }
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
        getUnitLoading={getUnitLoading}
      />
      <DesignTable
        handleEditData={handleEditData}
        refreshDesignDetails={refreshDesignDetails}
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
        designData={printDesignData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
      />
    </PageShell>
  );
};
export default Design;
