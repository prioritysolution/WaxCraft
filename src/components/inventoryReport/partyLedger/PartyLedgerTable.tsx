"use client";

import { tableClassNames } from "@/lib/uiStyles";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { BookUser } from "lucide-react";

import { PartyLedgerTableProps } from "@/types/inventoryReport/PartyLedgerTypes";
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

const PartyLedgerTable: FC<PartyLedgerTableProps> = ({
  loading,
  partyLedgerData,
}) => {
  const ledgerData = partyLedgerData[0]?.Ledger_Data || [];

  return (
    <div className="w-full">
      {partyLedgerData.length > 0 && (
        <Card
          radius="sm"
          className="w-full  p-2 px-5 mb-2 grid grid-cols-1 sm:grid-cols-2 text-sm gap-y-3 "
          classNames={{ base: "bg-blue-100" }}
        >
          <p>
            <span className="font-semibold">Party Name :</span>{" "}
            {partyLedgerData[0]?.Party_Name}
          </p>
          <p>
            <span className="font-semibold">Party Address :</span>{" "}
            {partyLedgerData[0]?.Party_Add}
          </p>
          <p>
            <span className="font-semibold">Party GSTIN :</span>{" "}
            {partyLedgerData[0]?.Party_Gst}
          </p>
          <p>
            <span className="font-semibold">Party Mobile :</span>{" "}
            {partyLedgerData[0]?.Party_Mob}
          </p>
        </Card>
      )}
      <Table
        removeWrapper
        aria-label="Example static collection table"
        // bottomContent={
        //   partyLedgerData?.length > 0 && (
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
        topContent={
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              Party ledger
            </h2>
            <p className="text-sm text-muted-foreground">
              Search and review party ledger entries.
            </p>
          </div>
        }
      >
        <TableHeader>
          <TableColumn className="w-[50px]">Sl. No.</TableColumn>
          <TableColumn align="center">Trans. Date</TableColumn>
          <TableColumn align="center">Particular</TableColumn>
          <TableColumn align="center">Debit</TableColumn>
          <TableColumn align="center">Credit</TableColumn>
          <TableColumn align="center">Balance</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={BookUser}
              entity="ledger entries"
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {ledgerData.length > 0 ? (
            <>
              {ledgerData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[100px]">{index + 1}</TableCell>
                  <TableCell>
                    {data?.Trans_Date
                      ? format(new Date(data?.Trans_Date), "dd-MM-yyyy")
                      : ""}
                  </TableCell>
                  <TableCell>{data?.Particular}</TableCell>
                  <TableCell>{data?.Debit}</TableCell>
                  <TableCell>{data?.Credit}</TableCell>
                  <TableCell>
                    {data?.Balance} {data?.Balance_Type === "C" ? "Cr" : "Dr"}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Total
                </TableCell>
                <TableCell>
                  {partyLedgerData[0]?.Ledger_Data.reduce((sum, entry) => {
                    return sum + (parseFloat(entry.Debit) || 0); // Convert Debit to float, default to 0 if null
                  }, 0)}
                </TableCell>
                <TableCell>
                  {partyLedgerData[0]?.Ledger_Data.reduce((sum, entry) => {
                    return sum + (parseFloat(entry.Credit) || 0); // Convert Debit to float, default to 0 if null
                  }, 0)}
                </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-10">
                <TableEmptyState
                  icon={BookUser}
                  entity="ledger entries"
                  search=""
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default PartyLedgerTable;
