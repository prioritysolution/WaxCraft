"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { Receipt } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

import {
  GstBillTableData,
  GstBillTableProps,
} from "@/types/inventoryVoucher/GstBillTypes";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
// import { format } from "date-fns";
import { FC, Fragment } from "react";
// import { FaChevronRight } from "react-icons/fa";
import { TableDeleteButton } from "@/components/ui/table-edit-button";
import { useSelector } from "react-redux";

interface GstBillState {
  gstBillData: GstBillTableData[];
}

interface RootState {
  gstBill: GstBillState;
}

const GstBillTable: FC<GstBillTableProps> = ({
  loading,
  handleShowDeleteDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleDeleteGst,
  deleteGstBillLoading,
  currentPage,
  setCurrentPage,
  lastPage,
}) => {
  const gstBillData: GstBillTableData[] = useSelector(
    (state: RootState) => state?.gstBill?.gstBillData
  );

  const { search, setSearch, filtered } = useClientTableSearch(gstBillData);

  return (
    <div className="w-full">
      <Table
        removeWrapper
        aria-label="Example static collection table"
        bottomContent={
          filtered.length > 0 && (
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
          )
        }
        topContent={
          <TableSearchInput
            title="Active GST bills"
            description="Search, review, and manage existing GST bills."
            value={search}
            onValueChange={setSearch}
            placeholder="Search GST bill"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          {/* <TableColumn className="w-[100px]"> </TableColumn> */}
          <TableColumn className="w-[70px]">Serial No.</TableColumn>
          {/* <TableColumn align="center" className="w-[100px]">
            Order Date
          </TableColumn>
          <TableColumn align="center">Order No.</TableColumn>
          <TableColumn align="center">Party Name</TableColumn>
          <TableColumn align="center" className="w-[100px]">
            {" "}
          </TableColumn>
          <TableColumn align="center">Order Amount</TableColumn>
          <TableColumn align="center">Order Status</TableColumn>
          <TableColumn align="center" className="w-[100px]">
            {" "}
          </TableColumn> */}
          <TableColumn align="center" className="w-[180px]">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Receipt}
              entity="GST bills"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data) => (
            <Fragment key={data.Id}>
              <TableRow>
                {/* <TableCell>
                  <FaChevronRight
                    onClick={() => toggleRow(index)}
                    className={`transition-all duration-200 text-medium cursor-pointer ${
                      openRows[index] ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </TableCell> */}
                {/* <TableCell className="w-[100px]">{index + 1}</TableCell>
                <TableCell>{format(data.Order_Date, "dd-MM-yyyy")}</TableCell>
                <TableCell>{data.Order_No}</TableCell>
                <TableCell>{data.Party_Name}</TableCell>
                <TableCell> </TableCell>
                <TableCell>{data.Total_Order}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={
                      data.Order_Status !== "Ordered" ? "success" : "warning"
                    }
                    size="md"
                    variant="flat"
                  >
                    {data.Order_Status}
                  </Chip>
                </TableCell>
                <TableCell className="w-[100px]"> </TableCell> */}
                <TableCell
                  align="center"
                  className=" flex justify-center w-[180px]"
                >
                  <TableDeleteButton
                    onPress={() => handleShowDeleteDialog(data.Id)}
                  />
                </TableCell>
              </TableRow>
              {/* {openRows[index] && (
                <Fragment key={`expanded-${index}`}>
                  <TableRow className="border-x border-t">
                    <TableCell className="font-medium w-[100px]">
                      Design Name
                    </TableCell>
                    <TableCell className="font-medium w-[70px]">
                      Design No
                    </TableCell>
                    <TableCell className="font-medium w-[100px]">
                      Order Quantity
                    </TableCell>
                    <TableCell className="font-medium">Design Rate</TableCell>
                    <TableCell className="font-medium">WT</TableCell>
                    <TableCell className="font-medium">WT Rate</TableCell>
                    <TableCell className="font-medium">Total Wt</TableCell>
                    <TableCell className="font-medium">Polish</TableCell>
                    <TableCell className="font-medium w-[100px]">
                      Total Polish
                    </TableCell>
                    <TableCell className="font-medium w-[180px]">
                      Image
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-x">
                    <TableCell>{data.DesignRow[0].Design_Name}</TableCell>
                    <TableCell>{data.DesignRow[0].Design_No}</TableCell>
                    <TableCell>{data.DesignRow[0].Order_Qnty}</TableCell>
                    <TableCell>{data.DesignRow[0].Design_Rate}</TableCell>
                    <TableCell>{data.DesignRow[0].Wt}</TableCell>
                    <TableCell>{data.DesignRow[0].Wt_Rate}</TableCell>
                    <TableCell>{data.DesignRow[0].Tot_Wt}</TableCell>
                    <TableCell>{data.DesignRow[0].Polish}</TableCell>
                    <TableCell className="w-[100px]">
                      {data.DesignRow[0].Tot_Polish}
                    </TableCell>
                    <TableCell className="w-[180px]">
                      <div className="w-full flex justify-center">
                        <Image
                          src={data.DesignRow[0].Image}
                          alt="Design"
                          height={100}
                          width={100}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-x">
                    <TableCell colSpan={2} className="w-[100px] font-medium">
                      Item Name
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="font-medium">Item Quantity</TableCell>
                    <TableCell className="font-medium">Item Rate</TableCell>
                    <TableCell className="font-medium">Making Rate</TableCell>
                    <TableCell className="font-medium">Item Total</TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                  {data.DesignRow[0].ItemRow.map((child, i) => (
                    <TableRow
                      key={`child-${index}-${i}`}
                      className={cn("border-x", {
                        "border-b": data.DesignRow[0].ItemRow.length === i + 1,
                      })}
                    >
                      <TableCell colSpan={2} className="w-[100px]">
                        {child.Item_Name}
                      </TableCell>
                      <TableCell className="hidden"> </TableCell>
                      <TableCell>{child.Item_Qnty}</TableCell>
                      <TableCell>{child.Item_Rate}</TableCell>
                      <TableCell>{child.Making_Rate}</TableCell>
                      <TableCell>{child.Item_Tot}</TableCell>
                      <TableCell className="hidden"> </TableCell>
                      <TableCell className="hidden"> </TableCell>
                      <TableCell className="hidden"> </TableCell>
                      <TableCell className="hidden"> </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              )} */}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this gst ?"
        isBusy={deleteGstBillLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteGst}
      />
    </div>
  );
};
export default GstBillTable;
