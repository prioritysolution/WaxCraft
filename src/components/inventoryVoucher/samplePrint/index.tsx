"use client";

import { SamplePrintProps } from "@/types/inventoryVoucher/SamplePrintTypes";
import { Tab, Tabs } from "@heroui/react";
import {
  FormCard,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { tabsClassNames } from "@/lib/uiStyles";
import { Printer } from "lucide-react";
import { FC } from "react";
import SamplePrintForm from "./SamplePrintForm";
import SamplePrintTable from "./SamplePrintTable";
import DesignModal from "./DesignModal";
import PrintModal from "./PrintModal";

const SamplePrint: FC<SamplePrintProps> = ({
  loading,
  addSamplePrintLoading,
  deleteSamplePrintLoading,
  form,
  handleSubmit,
  selected,
  setSelected,
  showDesignDialog,
  setShowDesignDialog,
  handleAddDesign,
  designTableData,
  handleDeleteDesignTableData,
  showPrintDialog,
  setShowPrintDialog,
  printData,
  handleSearchOrderParty,
  handleScrollOrderParty,
  handleSearchOrderDesign,
  handleScrollOrderDesign,
  orderPartyInput,
  setOrderPartyInput,
  orderDesignInput,
  setOrderDesignInput,
  handleShowPrintFromHistory,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteSamplePrint,
  printLoading,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={Printer}
        title="Sample Print"
        description="Generate sample prints for selected designs and parties."
      />
      <Tabs
        aria-label="Sample print sections"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(String(key))}
        color="primary"
        size="md"
        radius="lg"
        classNames={tabsClassNames}
      >
        <Tab key="form" title="New Sample Print">
          <FormCard>
            <SamplePrintForm
              form={form}
              handleSubmit={handleSubmit}
              addSamplePrintLoading={addSamplePrintLoading}
              handleSearchOrderParty={handleSearchOrderParty}
              handleScrollOrderParty={handleScrollOrderParty}
              handleSearchOrderDesign={handleSearchOrderDesign}
              handleScrollOrderDesign={handleScrollOrderDesign}
              orderPartyInput={orderPartyInput}
              setOrderPartyInput={setOrderPartyInput}
              orderDesignInput={orderDesignInput}
              setOrderDesignInput={setOrderDesignInput}
              designTableData={designTableData}
              handleDeleteDesignTableData={handleDeleteDesignTableData}
            />
          </FormCard>
        </Tab>

        <Tab key="table" title="Sample Print History">
          <SamplePrintTable
            loading={loading}
            handleShowPrintFromHistory={handleShowPrintFromHistory}
            handleShowDeleteDialog={handleShowDeleteDialog}
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            setTempDeleteId={setTempDeleteId}
            handleDeleteSamplePrint={handleDeleteSamplePrint}
            deleteSamplePrintLoading={deleteSamplePrintLoading}
            printLoading={printLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            lastPage={lastPage}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
          />
        </Tab>
      </Tabs>

      <DesignModal
        showDesignDialog={showDesignDialog}
        setShowDesignDialog={setShowDesignDialog}
        form={form}
        handleAddDesign={handleAddDesign}
        setDesignInput={setOrderDesignInput}
      />

      <PrintModal
        printData={printData}
        showPrintDialog={showPrintDialog}
        setShowPrintDialog={setShowPrintDialog}
      />
    </PageShell>
  );
};
export default SamplePrint;
