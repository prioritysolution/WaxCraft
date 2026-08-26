import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";

import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import { AddUserFormData, AddUserTableData } from "@/types/tools/AddUserTypes";
import { ApiResponse } from "@/types/ApiTypes";
import {
  addUserAPI,
  getUserListAPI,
  getUserRolesAPI,
  updateUserAPI,
} from "./AddUserApis";
import { getUserListData, getUserRolesData } from "./AddUserReducer";

const emptyUserForm: AddUserFormData = {
  name: "",
  email: "",
  mobile: "",
  role: "",
  password: "",
};

// interface AddUserState {
//   userListData: AddUserTableData[];
// }

// interface RootState {
//   addUser: AddUserState;
// }

export const useAddUser = () => {
  const dispatch = useDispatch();

  const [addUserLoading, setAddUserLoading] = useState(false);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [getRolesLoading, setGetRolesLoading] = useState(false);

  // const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<AddUserTableData | null>(null);

  // const userListData: AddUserTableData[] = useSelector(
  //   (state: RootState) => state?.addUser?.userListData
  // );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobile: yup.string().required("Mobile is required"),
    role: yup.string().required("Role is required"),
    password: yup
      .string()
      .default("")
      .test("required-if-null", "Password is required", function (value) {
        return editData !== null || (!!value && value.trim().length > 0);
      }),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<AddUserFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: emptyUserForm,
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<AddUserFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateUserApiCall(editData.Id, values, orgId);
      } else {
        addUserApiCall(values, orgId);
      }
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleOpenAdd = () => {
    setEditData(null);
    form.reset(emptyUserForm);
    setIsOpen(true);
  };

  const handleEditData = (data: AddUserTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  // Function to call the login API
  const addUserApiCall = async (item: AddUserFormData, orgId: number) => {
    setAddUserLoading(true);

    const data = {
      org_id: orgId,
      user_name: item.name,
      user_mail: item.email,
      user_mob: item.mobile,
      user_role: item.role,
      user_pass: item.password,
    };

    try {
      const res: ApiResponse = await addUserAPI(data);

      if (res.status === 200) {
        form.reset(emptyUserForm);
        setEditData(null);
        setIsOpen(false);
        // setCurrentPage(1);
        getUserListApiCall(orgId);
        toast.success("User added successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddUserLoading(false);
    }
  };

  const updateUserApiCall = async (
    userId: number,
    item: AddUserFormData,
    orgId: number
  ) => {
    const data = {
      org_id: orgId,
      user_id: userId,
      user_name: item.name,
      user_mail: item.email,
      user_mob: item.mobile,
      user_role: item.role,
      user_pass: item.password || null,
    };

    setUpdateUserLoading(true);
    try {
      const res = await updateUserAPI(data);
      if (res.status === 200) {
        toast.success("User updated successfully.");
        form.reset(emptyUserForm);
        setEditData(null);
        // setCurrentPage(1);
        getUserListApiCall(orgId);
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateUserLoading(false);
    }
  };

  // Function to call the login API
  const getUserListApiCall = async (orgId: number) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getUserListAPI(orgId);

      if (res.status === 200) {
        dispatch(getUserListData(res.data.details));
        // setLastPage(res.data.details?.last_page);
      } else {
        dispatch(getUserListData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getUserListData([]));
    } finally {
      setLoading(false);
    }
  };

  const getUserRolesApiCall = async () => {
    setGetRolesLoading(true);

    try {
      const res: ApiResponse = await getUserRolesAPI();

      if (res.status === 200) {
        dispatch(getUserRolesData(res.data.details));
      } else {
        dispatch(getUserRolesData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getUserRolesData([]));
    } finally {
      setGetRolesLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        name: editData.User_Name || "",
        email: editData.User_Mail || "",
        mobile: editData.User_Mob || "",
        role: editData.Role_Id?.toString() || "",
        password: "",
      });
    } else {
      form.reset(emptyUserForm);
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (editData && !isOpen) {
      setEditData(null);
    }
  }, [isOpen, editData]);

  useResetFormOnModalClose(isOpen, () => {
    setEditData(null);
    form.reset(emptyUserForm);
  });

  return {
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
    handleOpenAdd,
    handleEditData,
    getRolesLoading,
    // currentPage,
    // setCurrentPage,
    // lastPage,
  };
};
