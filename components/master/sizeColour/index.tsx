"use client";

import {
  PageActionButton,
  PageCountBadge,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { Droplet } from "lucide-react";
import { FC } from "react";
import SizeColourTable from "./SizeColourTable";
import { SizeColourProps } from "@/types/master/SizeColourTypes";
import SizeColourForm from "./SizeColourForm";

const SizeColour: FC<SizeColourProps> = ({
  addSizeColourLoading,
  updateSizeColourLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  categoryId,
  modelId,
  handleSearchCategory,
  handleScrollCategory,
  getCategoryLoading,
  getModelLoading,
  getSizeLoading,
  categoryInput,
  setCategoryInput,
  colourOptions,
  getColourLoading,
  currentPage,
  setCurrentPage,
  lastPage,
  sizeColourTableInput,
  handleFilterTableData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteSizeColour,
  deleteSizeColourLoading,
  deleteWarning,
  totalCount,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Droplet}
        title="Size Colour"
        description="Map colours against category, model, and size combinations."
        badge={<PageCountBadge count={totalCount} singular="size colour" plural="size colours" />}
        action={
          <PageActionButton onPress={() => setIsOpen(true)}>
            Add Size Colour
          </PageActionButton>
        }
      />

      <SizeColourForm
        addSizeColourLoading={addSizeColourLoading}
        updateSizeColourLoading={updateSizeColourLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        categoryId={categoryId}
        modelId={modelId}
        handleSearchCategory={handleSearchCategory}
        handleScrollCategory={handleScrollCategory}
        getCategoryLoading={getCategoryLoading}
        getModelLoading={getModelLoading}
        getSizeLoading={getSizeLoading}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
        colourOptions={colourOptions}
        getColourLoading={getColourLoading}
      />

      <SizeColourTable
          handleEditData={handleEditData}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
          sizeColourTableInput={sizeColourTableInput}
          handleFilterTableData={handleFilterTableData}
          colourOptions={colourOptions}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          setTempDeleteId={setTempDeleteId}
          handleShowDeleteDialog={handleShowDeleteDialog}
          handleDeleteSizeColour={handleDeleteSizeColour}
          deleteSizeColourLoading={deleteSizeColourLoading}
          deleteWarning={deleteWarning}
        />
    </PageShell>
  );
};
export default SizeColour;
