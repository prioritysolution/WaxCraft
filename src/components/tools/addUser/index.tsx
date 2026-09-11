"use client";

import {
  PageActionButton,
  PageHeader,
  PageShell,
} from "@/components/ui/page-shell";
import { UserPlus } from "lucide-react";
import { FC } from "react";
import AddUserForm from "./AddUserForm";
import AddUserTable from "./AddUserTable";
import { AddUserProps } from "@/types/tools/AddUserTypes";

const AddUser: FC<AddUserProps> = ({
  addUserLoading,
  updateUserLoading,
  loading,
  form,
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  handleEditData,
  handleOpenAdd,
  getRolesLoading,
  // currentPage,
  // setCurrentPage,
  // lastPage,
}) => {
  return (
    <PageShell>
      <PageHeader
        icon={UserPlus}
        title="Users"
        description="Create users and assign roles for the WaxCraft workspace."
        action={
          <PageActionButton onPress={handleOpenAdd}>
            Add New User
          </PageActionButton>
        }
      />

      <AddUserForm
        addUserLoading={addUserLoading}
        updateUserLoading={updateUserLoading}
        form={form}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        getRolesLoading={getRolesLoading}
        editData={editData}
      />
      <AddUserTable
          handleEditData={handleEditData}
          // currentPage={currentPage}
          // setCurrentPage={setCurrentPage}
          // lastPage={lastPage}
          loading={loading}
        />
    </PageShell>
  );
};
export default AddUser;
