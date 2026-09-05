"use client";

import AddUser from "@/components/tools/addUser";
import { useAddUser } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const AddUserContainer = () => {
  const token = getCookieData<string | null>("waxCraftClientToken");
  const orgId = getCookieData<number | null>("waxCraftClientOrgId");

  const {
    getUserListApiCall,
    getUserRolesApiCall,
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
  } = useAddUser();

  useEffect(() => {
    if (token && orgId) {
      getUserListApiCall(orgId);
      getUserRolesApiCall();
    }
  }, [token, orgId]);

  return (
    <AddUser
      addUserLoading={addUserLoading}
      updateUserLoading={updateUserLoading}
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editData={editData}
      handleEditData={handleEditData}
      handleOpenAdd={handleOpenAdd}
      getRolesLoading={getRolesLoading}
      // currentPage={currentPage}
      // setCurrentPage={setCurrentPage}
      // lastPage={lastPage}
    />
  );
};
export default AddUserContainer;
