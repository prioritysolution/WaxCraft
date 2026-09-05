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
import { cn } from "@/lib/utils";
import { tableClassNames } from "@/lib/uiStyles";
import {
  ChildRow,
  DesignTableData,
  DesignTableProps,
} from "@/types/master/DesignTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ChevronRight, Palette, X } from "lucide-react";
import { FC, useState } from "react";
import { useSelector } from "react-redux";

interface DesignState {
  designData: DesignTableData[];
}

interface RootState {
  design: DesignState;
}

interface DesignImagePreview {
  src: string;
  name: string;
}

/** Item names follow: Category - Model - Size [- Colour] */
const getSizeFromItemName = (itemName: string): string => {
  const parts = (itemName || "").split(" - ");
  return parts.length >= 3 ? parts[2].trim() : "";
};

const getChildItemName = (child: ChildRow): string =>
  child.Item_Sh_Name || child.Item_Name || "";

const compareChildRowsBySizeAsc = (a: ChildRow, b: ChildRow): number => {
  const nameA = getChildItemName(a);
  const nameB = getChildItemName(b);
  const sizeA = getSizeFromItemName(nameA);
  const sizeB = getSizeFromItemName(nameB);

  if (!sizeA && !sizeB) {
    return nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }
  if (!sizeA) return 1;
  if (!sizeB) return -1;

  const numA = Number.parseFloat(sizeA);
  const numB = Number.parseFloat(sizeB);
  const isNumA =
    !Number.isNaN(numA) && /^-?\d+(\.\d+)?$/.test(sizeA);
  const isNumB =
    !Number.isNaN(numB) && /^-?\d+(\.\d+)?$/.test(sizeB);

  if (isNumA && isNumB && numA !== numB) return numA - numB;

  const sizeCompare = sizeA.localeCompare(sizeB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
  if (sizeCompare !== 0) return sizeCompare;

  return nameA.localeCompare(nameB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const DesignTable: FC<DesignTableProps> = ({
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  designTableInput,
  handleFilterTableData,
  loading,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteDesign,
  deleteDesignLoading,
  deleteWarning,
}) => {
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
  const [imagePreview, setImagePreview] = useState<DesignImagePreview | null>(
    null,
  );

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const designData: DesignTableData[] = useSelector(
    (state: RootState) => state?.design?.designData,
  );

  const safeDesignData = Array.isArray(designData) ? designData : [];

  return (
    <>
      <Table
        removeWrapper
        aria-label="Design list"
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
            title="All designs"
            description="Search, review, and update existing designs."
            value={designTableInput}
            onValueChange={handleFilterTableData}
            placeholder="Search by design name"
          />
        }
        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center" className="w-[56px]">
            {" "}
          </TableColumn>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Design Name</TableColumn>
          <TableColumn align="center">Design No</TableColumn>
          <TableColumn align="center">WT</TableColumn>
          <TableColumn align="center">Polish</TableColumn>
          <TableColumn align="center">Design Image</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Palette}
              entity="designs"
              search={designTableInput}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {getPaginatedTableRows(safeDesignData, loading).flatMap((data, index) => {
            const isOpen = Boolean(openRows[data.Id]);
            const rows = [
              <TableRow key={data.Id}>
                <TableCell className="w-[56px]">
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    radius="md"
                    variant="light"
                    aria-label={isOpen ? "Collapse items" : "Expand items"}
                    className="h-8 w-8 min-w-8 text-muted-foreground"
                    onPress={() => toggleRow(data.Id)}
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-90",
                      )}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  {formatTableSerial(index, { currentPage, perPage })}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <TableNameCell name={data.Design_Name} />
                  </div>
                </TableCell>
                <TableCell>{data.Design_No}</TableCell>
                <TableCell>{formatTwoDecimals(data.WT)}</TableCell>
                <TableCell>{formatTwoDecimals(data.Polish)}</TableCell>
                <TableCell>
                  {data.image ? (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        aria-label={`View ${data.Design_Name || "design"} image`}
                        className="cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        onClick={() =>
                          setImagePreview({
                            src: data.image,
                            name: data.Design_Name || "Design",
                          })
                        }
                      >
                        <Image
                          src={data.image}
                          alt={data.Design_Name || "Design"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
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
              </TableRow>,
            ];

            if (isOpen) {
              rows.push(
                <TableRow key={`${data.Id}-details`}>
                  <TableCell
                    colSpan={8}
                    className="bg-[#F7F5F3]/70 px-5 py-3"
                  >
                    <div className="w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                      <table className="w-full table-fixed border-collapse text-center">
                        <thead>
                          <tr className="bg-[#F7F5F3]">
                            <th className="w-[50%] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Item Name
                            </th>
                            <th className="w-[25%] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Quantity
                            </th>
                            <th className="w-[25%] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Making Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.childrow?.length ? (
                            [...data.childrow]
                              .sort(compareChildRowsBySizeAsc)
                              .map((child, i) => (
                              <tr
                                key={`${data.Id}-${child.Item_Id}-${i}`}
                                className="border-b border-black/[0.05] last:border-b-0"
                              >
                                <td className="px-4 py-2.5 text-center text-sm text-foreground">
                                  {child.Item_Sh_Name || child.Item_Name}
                                </td>
                                <td className="px-4 py-2.5 text-center text-sm text-foreground">
                                  {child.Qnty}
                                </td>
                                <td className="px-4 py-2.5 text-center text-sm text-foreground">
                                  {formatTwoDecimals(child.Making_Rate)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-6 text-center text-sm text-muted-foreground"
                              >
                                No items found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TableCell>
                </TableRow>,
              );
            }

            return rows;
          })}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this design?"
        warning={deleteWarning}
        isBusy={deleteDesignLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteDesign}
      />

      <Modal
        isOpen={Boolean(imagePreview)}
        onOpenChange={(open) => {
          if (!open) setImagePreview(null);
        }}
        placement="center"
        hideCloseButton
        backdrop="blur"
        size="lg"
        classNames={{
          wrapper: "items-center justify-center p-4",
          base: "mx-auto w-full max-w-[560px] overflow-hidden rounded-[20px] border border-[#D1D1D1] bg-white shadow-none",
          backdrop: "bg-black/35",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-4 p-6 sm:p-8">
              <button
                type="button"
                aria-label="Close image preview"
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-black/[0.05] hover:text-foreground"
                onClick={() => setImagePreview(null)}
              >
                <X className="h-4 w-4" />
              </button>
              {imagePreview ? (
                <>
                  <p className="max-w-full truncate text-center text-sm font-medium text-foreground">
                    {imagePreview.name}
                  </p>
                  <div className="flex w-full items-center justify-center">
                    <Image
                      src={imagePreview.src}
                      alt={imagePreview.name}
                      className="max-h-[min(70vh,480px)] w-auto max-w-full rounded-xl object-contain"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DesignTable;
