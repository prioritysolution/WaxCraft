"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Palette } from "lucide-react";
import { FC } from "react";
import DesignTable from "./DesignTable";
import { DesignProps } from "@/types/master/DesignTypes";
import DesignForm from "./DesignForm";

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
  return (
    <PageShell>
      <PageHeader
        icon={Palette}
        title="Design"
        description="Manage design masters, photos, and related item mapping."
        badge={<PageCountBadge count={totalCount} singular="design" plural="designs" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Design
          </PageActionButton>
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
    </PageShell>
  );
};
export default Design;
