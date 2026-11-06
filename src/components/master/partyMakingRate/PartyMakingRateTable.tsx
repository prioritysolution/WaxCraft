"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import {
  TableEditButton,
  TableNameCell,
  formatTableSerial,
  getPaginatedTableRows,
} from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { TablePaginationBar } from "@/components/ui/table-pagination";
import { searchInputClassNames, tableClassNames } from "@/lib/uiStyles";
import { PartyMakingRateTableProps } from "@/types/master/PartyMakingRateTypes";
import { formatRate } from "@/utils/formatDecimal";
import {
  Autocomplete,
  AutocompleteItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Percent } from "lucide-react";
import { FC, useState } from "react";

const PartyMakingRateTable: FC<PartyMakingRateTableProps> = ({
  loading,
  rows,
  filterPartyOptions,
  filterPartyLoading,
  partyFilterId,
  onPartyFilterChange,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  perPage,
  onPerPageChange,
  tableInput,
  handleFilterTableData,
}) => {
  const [partyFilterInput, setPartyFilterInput] = useState("");
  const selectedParty = filterPartyOptions.find(
    (party) => String(party.Id) === partyFilterId,
  );

  return (
    <Table
      removeWrapper
      aria-label="Party making rate table"
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
          title="All parties"
          description="Each party is listed once. Edit to update WT rate, ghat, polish, and model making rates."
          value={tableInput}
          onValueChange={handleFilterTableData}
          placeholder="Search party name"
          filters={
            <Autocomplete
              aria-label="Filter by party"
              placeholder="Filter party"
              size="md"
              radius="full"
              variant="bordered"
              items={filterPartyOptions}
              isLoading={filterPartyLoading}
              selectedKey={partyFilterId || null}
              inputValue={
                partyFilterId
                  ? selectedParty?.Party_Name || partyFilterInput
                  : partyFilterInput
              }
              onInputChange={(value) => {
                setPartyFilterInput(value);
                if (
                  partyFilterId &&
                  value !== (selectedParty?.Party_Name || "")
                ) {
                  onPartyFilterChange("");
                }
              }}
              onSelectionChange={(key) => {
                const next = key == null ? "" : String(key);
                onPartyFilterChange(next);
                const match = filterPartyOptions.find(
                  (party) => String(party.Id) === next,
                );
                setPartyFilterInput(match?.Party_Name || "");
              }}
              onClear={() => {
                onPartyFilterChange("");
                setPartyFilterInput("");
              }}
              className="w-[220px] shrink-0 sm:w-[240px]"
              inputProps={{ classNames: searchInputClassNames }}
              listboxProps={{
                emptyContent: filterPartyLoading
                  ? "Loading parties..."
                  : "No party found",
              }}
              endContent={
                filterPartyLoading ? (
                  <Spinner size="sm" color="primary" />
                ) : null
              }
            >
              {(party) => (
                <AutocompleteItem
                  key={String(party.Id)}
                  textValue={party.Party_Name || ""}
                >
                  {party.Party_Name || "-"}
                </AutocompleteItem>
              )}
            </Autocomplete>
          }
        />
      }
      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn align="center">Serial No.</TableColumn>
        <TableColumn align="center">Party Name</TableColumn>
        <TableColumn align="center">WT Rate</TableColumn>
        <TableColumn align="center">Ghat</TableColumn>
        <TableColumn align="center">Polish</TableColumn>
        <TableColumn align="center">Actions</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          <TableEmptyState
            icon={Percent}
            entity="parties"
            search={tableInput || partyFilterInput}
          />
        }
        loadingContent={<Spinner size="lg" color="primary" />}
        loadingState={loading ? "loading" : "idle"}
      >
        {getPaginatedTableRows(rows, loading).map((data, index) => (
          <TableRow key={data.Party_Id || data.Id}>
            <TableCell>
              {formatTableSerial(index, { currentPage, perPage })}
            </TableCell>
            <TableCell>
              <TableNameCell name={data.Party_Name || "-"} />
            </TableCell>
            <TableCell className="text-center">
              {formatRate(data.Wt_Rate)}
            </TableCell>
            <TableCell className="text-center">{formatRate(data.Ghat)}</TableCell>
            <TableCell className="text-center">
              {formatRate(data.Polish)}
            </TableCell>
            <TableCell className="text-center">
              <TableEditButton
                label="Edit party rates"
                onPress={() => handleEditData(data)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PartyMakingRateTable;
