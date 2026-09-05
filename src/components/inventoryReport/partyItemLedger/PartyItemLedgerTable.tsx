"use client";

import { tableClassNames } from "@/lib/uiStyles";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { ClipboardList } from "lucide-react";

import { PartyItemLedgerTableProps } from "@/types/inventoryReport/PartyItemLedgerTypes";
import {
  Card,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";
import { FC } from "react";

const PartyItemLedgerTable: FC<PartyItemLedgerTableProps> = ({
  loading,
  partyItemLedgerData,
}) => {
  const itemData = partyItemLedgerData[0]?.ItemData || [];

  return (
    <div className="w-full">
      <div className="mb-3">
        <h2 className="text-[15px] font-semibold text-foreground">
          Party item ledger
        </h2>
        <p className="text-sm text-muted-foreground">
          Search and review item ledger entries.
        </p>
      </div>
      {partyItemLedgerData.length > 0 && (
        <Card
          radius="sm"
          className="w-full  p-2 px-5 mb-2 grid grid-cols-1 sm:grid-cols-2 text-sm gap-y-3 "
          classNames={{ base: "bg-blue-100" }}
          shadow="none"
        >
          <p>
            <span className="font-semibold">Party Name :</span>{" "}
            {partyItemLedgerData[0]?.Party_Name}
          </p>
          <p>
            <span className="font-semibold">Party Address :</span>{" "}
            {partyItemLedgerData[0]?.Party_Add}
          </p>
          <p>
            <span className="font-semibold">Party GSTIN :</span>{" "}
            {partyItemLedgerData[0]?.Party_Gst}
          </p>
          <p>
            <span className="font-semibold">Party Mobile :</span>{" "}
            {partyItemLedgerData[0]?.Party_Mob}
          </p>
        </Card>
      )}
      {itemData.map(
        ({ Item_Name, Trans_Details }, i) => (
          <div key={i}>
            <h3 className="w-full text-center text-lg py-2 font-medium">
              {Item_Name}
            </h3>
            <Table
              removeWrapper
              aria-label="Example static collection table"
              // bottomContent={
              //   partyItemLedgerData?.length > 0 && (
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
              classNames={tableClassNames}
            >
              <TableHeader>
                <TableColumn className="w-[50px]">Sl. No.</TableColumn>
                <TableColumn align="center">Trans. Date</TableColumn>
                <TableColumn align="center">Particular</TableColumn>
                <TableColumn align="center">Issue</TableColumn>
                <TableColumn align="center">Refund</TableColumn>
                <TableColumn align="center">Balance</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={
                  <TableEmptyState
                    icon={ClipboardList}
                    entity="item ledger records"
                  />
                }
                loadingContent={<Spinner size="lg" color="primary" />}
                loadingState={loading ? "loading" : "idle"}
              >
                {Trans_Details.length > 0 ? (
                  <>
                    {Trans_Details.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[100px]">{index + 1}</TableCell>
                        <TableCell>
                          {data?.Trans_Date
                            ? format(new Date(data?.Trans_Date), "dd-MM-yyyy")
                            : ""}
                        </TableCell>
                        <TableCell>{data?.Particular}</TableCell>
                        <TableCell>{data?.Issue}</TableCell>
                        <TableCell>{data?.Refund}</TableCell>
                        <TableCell>{data?.Balance}</TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell className="w-[100px] hidden"> </TableCell>
                      <TableCell colSpan={3} className="font-semibold">
                        Total
                      </TableCell>
                      <TableCell className="hidden"> </TableCell>
                      <TableCell>
                        {Trans_Details.reduce((sum, entry) => {
                          return sum + (entry.Issue || 0); // Convert Debit to float, default to 0 if null
                        }, 0)}
                      </TableCell>
                      <TableCell>
                        {Trans_Details.reduce((sum, entry) => {
                          return sum + (entry.Refund || 0); // Convert Debit to float, default to 0 if null
                        }, 0)}
                      </TableCell>
                      <TableCell> </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10">
                      <TableEmptyState
                        icon={ClipboardList}
                        entity="item ledger records"
                      />
                    </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                    <TableCell className="hidden"> </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )
      )}
    </div>
  );
};
export default PartyItemLedgerTable;
