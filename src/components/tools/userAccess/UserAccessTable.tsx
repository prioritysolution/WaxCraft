"use client";

import { TableSearchInput } from "@/components/ui/table-search-input";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { useClientTableSearch } from "@/lib/useClientTableSearch";
import { ShieldCheck } from "lucide-react";

import { tableClassNames } from "@/lib/uiStyles";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  UserAccessTableData,
  UserAccessTableProps,
} from "@/types/tools/UserAccessTypes";
import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface UserAccessState {
  userAccessData: UserAccessTableData[];
}

interface RootState {
  userAccess: UserAccessState;
}

const UserAccessTable: FC<UserAccessTableProps> = ({
  // loading,
  form,
  handleToggleAccess,
}) => {
  const userAccessData: UserAccessTableData[] = useSelector(
    (state: RootState) => state?.userAccess?.userAccessData
  );

  const { search, setSearch, filtered } = useClientTableSearch(userAccessData);

  return (
    <Form {...form}>
      <form>
        <Table
          removeWrapper
          aria-label="Example static collection table"
          // bottomContent={
          //   userAccessData?.length > 0 && (
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
        topContent={
          <TableSearchInput
            title="User access"
            description="Search users and update access status."
            value={search}
            onValueChange={setSearch}
            placeholder="Search user"
            />
        }

          classNames={tableClassNames}
        >
          <TableHeader>
            <TableColumn className="w-[50px]">Sl. No.</TableColumn>
            <TableColumn align="center">Name</TableColumn>
            <TableColumn align="center">Email</TableColumn>
            <TableColumn align="center">Status</TableColumn>
          </TableHeader>
          <TableBody emptyContent={<TableEmptyState icon={ShieldCheck} entity="users" search={search} />}>
            {filtered.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[50px]">{index + 1}</TableCell>
                  <TableCell>{data?.User_Name}</TableCell>
                  <TableCell>{data?.User_Mail}</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`access.${String(data.Id)}`} // Correctly references nested field
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              size="lg"
                              color="primary"
                              isSelected={!!field.value || data.Status === 1} // Ensure boolean type
                              onValueChange={(value) => {
                                field.onChange(value); // Update form state
                                handleToggleAccess(data.Id);
                                // updateUserAccessAPI(item.Id, value); // Call API on toggle
                              }}
                            />
                          </FormControl>
                          {/* <pre>{JSON.stringify( null, 4)}</pre> */}
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </form>
    </Form>
  );
};
export default UserAccessTable;
