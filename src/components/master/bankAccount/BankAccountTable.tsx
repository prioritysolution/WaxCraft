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
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { Landmark } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  BankAccountTableData,
  BankAccountTableProps,
} from "@/types/master/BankAccountTypes";
import { formatTwoDecimals } from "@/utils/formatDecimal";
import {
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
import { useSelector } from "react-redux";

interface BankLedger {
  Id: number;
  Ledger_Name: string;
}

interface BankAccountState {
  bankAccountData: BankAccountTableData[];
  bankLedgerData: BankLedger[];
}

interface RootState {
  bankAccount: BankAccountState;
}

const BankAccountTable: FC<BankAccountTableProps> = ({
  loading,
  handleEditData,
  showDeleteDialog,
  setShowDeleteDialog,
  setTempDeleteId,
  handleShowDeleteDialog,
  handleDeleteBankAccount,
  deleteBankAccountLoading,
  deleteWarning,
}) => {
  const bankAccountData: BankAccountTableData[] = useSelector(
    (state: RootState) => state?.bankAccount?.bankAccountData
  );

  const bankLedgerData: BankLedger[] = useSelector(
    (state: RootState) => state?.bankAccount?.bankLedgerData
  );

  const { search, setSearch, filtered } = useClientTableSearch(bankAccountData);

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example static collection table"
        topContent={
          <TableSearchInput
            title="All bank accounts"
            description="Search, review, and update existing bank accounts."
            value={search}
            onValueChange={setSearch}
            placeholder="Search bank account"
            />
        }

        classNames={tableClassNames}
      >
        <TableHeader>
          <TableColumn align="center">Serial No.</TableColumn>
          <TableColumn align="center">Bank Name</TableColumn>
          <TableColumn align="center">Branch Name</TableColumn>
          <TableColumn align="center">IFSC</TableColumn>
          <TableColumn align="center">Account No.</TableColumn>
          <TableColumn align="center">Ledger</TableColumn>
          <TableColumn align="center">Opening Date</TableColumn>
          <TableColumn align="center">Opening Balance</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <TableEmptyState
              icon={Landmark}
              entity="bank accounts"
              search={search}
            />
          }
          loadingContent={<Spinner size="lg" color="primary" />}
          loadingState={loading ? "loading" : "idle"}
        >
          {filtered.map((data, index) => (
            <TableRow key={data.Id}>
              <TableCell>{formatTableSerial(index)}</TableCell>
              <TableCell><TableNameCell name={data.Bank_Name} /></TableCell>
              <TableCell>{data.Branch_Name}</TableCell>
              <TableCell>{data.Bank_IFSC}</TableCell>
              <TableCell>{data.Account_No}</TableCell>
              <TableCell>
                {
                  bankLedgerData.find((ledger) => ledger.Id === data.Under_Ledger)
                    ?.Ledger_Name
                }
              </TableCell>
              <TableCell>
                {data.Opening_Date ? format(data.Opening_Date, "dd-MM-yyyy") : ""}
              </TableCell>
              <TableCell>
                {formatTwoDecimals(data.Opening_Balance)}
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
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message="Are you sure to delete this bank account?"
        warning={deleteWarning}
        isBusy={deleteBankAccountLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setTempDeleteId(null);
        }}
        onConfirm={handleDeleteBankAccount}
      />
    </>
  );
};
export default BankAccountTable;
