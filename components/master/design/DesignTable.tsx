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
import { cn } from "@/lib/utils";
import { tableClassNames } from "@/lib/uiStyles";
import { DesignTableData, DesignTableProps } from "@/types/master/DesignTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
  Button,
  Image,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ChevronRight, Palette } from "lucide-react";
import { FC, Fragment, useState } from "react";
import { useSelector } from "react-redux";

interface DesignState {
  designData: DesignTableData[];
}

interface RootState {
  design: DesignState;
}

const DesignTable: FC<DesignTableProps> = ({
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
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
          safeDesignData.length > 0 && lastPage > 1 ? (
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
          ) : null
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
          {safeDesignData.map((data, index) => {
            const isOpen = Boolean(openRows[data.Id]);
            const serialIndex =
              (Math.max(currentPage, 1) - 1) * perPage + index;

            return (
              <Fragment key={data.Id}>
                <TableRow>
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
                  <TableCell>{formatTableSerial(serialIndex)}</TableCell>
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
                        <Image
                          src={data.image}
                          alt={data.Design_Name || "Design"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
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
                </TableRow>
                {isOpen ? (
                  <TableRow>
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
                              data.childrow.map((child, i) => (
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
                  </TableRow>
                ) : null}
              </Fragment>
            );
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
    </>
  );
};
export default DesignTable;
