"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEditButton, TableNameCell, formatTableSerial } from "@/components/ui/table-edit-button";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { UserPlus } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import {
  AddUserTableData,
  AddUserTableProps,
} from "@/types/tools/AddUserTypes";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface UserRoleData {
  Id: number;
  Role_Name: string;
}

interface AddUserState {
  userListData: AddUserTableData[];
  userRolesData: UserRoleData[];
}

interface RootState {
  addUser: AddUserState;
}

const AddUserTable: FC<AddUserTableProps> = ({
  loading,
  handleEditData,
  //   currentPage,
  //   setCurrentPage,
  //   lastPage,
}) => {
  const addUserData: AddUserTableData[] = useSelector(
    (state: RootState) => state?.addUser?.userListData
  );

  const userRolesData: UserRoleData[] = useSelector(
    (state: RootState) => state?.addUser?.userRolesData
  );

  const { search, setSearch, filtered } = useClientTableSearch(addUserData);

  return (
    <Table
      removeWrapper
      aria-label="Example static collection table"
      //   bottomContent={
      //     addUserData?.length > 0 && (
      //       <Pagination
      //         isCompact
      //         showControls
      //         showShadow
      //         color="primary"
      //         page={currentPage}
      //         total={lastPage}
      //         onChange={(page) => setCurrentPage(page)}
      //       />
      //     )
      //   }
      topContent={
        <TableSearchInput
          title="All users"
          description="Search, review, and update existing users."
          value={search}
          onValueChange={setSearch}
          placeholder="Search user"
          />
      }

      classNames={tableClassNames}
    >
      <TableHeader>
        <TableColumn>Serial No.</TableColumn>
        <TableColumn align="center">Name</TableColumn>
        <TableColumn align="center">Email</TableColumn>
        <TableColumn align="center">Mobile</TableColumn>
        <TableColumn align="center">Role</TableColumn>
        <TableColumn align="end">Actions</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          <TableEmptyState icon={UserPlus} entity="users" search={search} />
        }
        loadingContent={<Spinner size="lg" color="primary" />}
        loadingState={loading ? "loading" : "idle"}
      >
        {filtered.map((data, index) => (
          <TableRow key={data.Id}>
            <TableCell>{formatTableSerial(index)}</TableCell>
            <TableCell><TableNameCell name={data.User_Name} /></TableCell>
            <TableCell>{data.User_Mail}</TableCell>
            <TableCell>{data.User_Mob}</TableCell>
            <TableCell>
              {data.Role_Id
                ? userRolesData.find((role) => role.Id === data.Role_Id)
                    ?.Role_Name
                : ""}
            </TableCell>
            <TableCell className="text-right">
              <TableEditButton onPress={() => handleEditData(data)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AddUserTable;
