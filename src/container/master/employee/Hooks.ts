import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useResetFormOnModalClose } from "@/lib/useResetFormOnModalClose";
import getCookieData from "@/utils/getCookieData";
import { useDispatch, useSelector } from "react-redux";
import {
  EmployeeFormData,
  EmployeeTableData,
} from "@/types/master/EmployeeTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { getEmployeeData } from "./EmployeeReducer";
import {
  addEmployeeAPI,
  deleteEmployeeAPI,
  getEmployeeAPI,
  updateEmployeeAPI,
} from "./EmployeeApis";
import {
  getMasterDeleteWarningMessage,
  isMasterDeleteDependencyResponse,
} from "@/lib/masterDelete";
import { resolveListTotalCount } from "@/lib/listTotalCount";
import { useListPerPage } from "@/lib/useListPerPage";

interface EmployeeState {
  employeeData: EmployeeTableData[];
}

interface RootState {
  employee: EmployeeState;
}

export const useEmployee = () => {
  const dispatch = useDispatch();

  const [addEmployeeLoading, setAddEmployeeLoading] = useState(false);
  const [updateEmployeeLoading, setUpdateEmployeeLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { perPage, handlePerPageChange } = useListPerPage(() =>
    setCurrentPage(1),
  );
  const [totalCount, setTotalCount] = useState(0);
  const [input, setInput] = useState("");

  const [employeeTableInput, setEmployeeTableInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<EmployeeTableData | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tempDeleteId, setTempDeleteId] = useState<number | null>(null);
  const [deleteEmployeeLoading, setDeleteEmployeeLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const employeeData: EmployeeTableData[] = useSelector(
    (state: RootState) => state?.employee?.employeeData
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    employeeType: yup.string().required("Employee Type is required"),
    employeeName: yup.string().required("Employee name is required"),
    address: yup.string().required("Address is required"),
    mobileNo: yup
      .string()
      .required("Mobile no. required")
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: yup.string().email("Invalid email").default(""),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<EmployeeFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      employeeType: "",
      employeeName: "",
      address: "",
      mobileNo: "",
      email: "",
    },
  });

  // Handle form submission
  const handleSubmit: SubmitHandler<EmployeeFormData> = (values) => {
    if (orgId) {
      if (editData && Object.keys(editData).length > 0) {
        updateEmployeeApiCall(editData.Id, values, orgId);
      } else {
        addEmployeeApiCall(values, orgId);
      }
    } else {
      toast.error("Somthing went wrong");
    }
  };

  const handleEditData = (data: EmployeeTableData) => {
    setEditData(data);
    setIsOpen(true);
  };

  const handleShowDeleteDialog = (id: number) => {
    setTempDeleteId(id);
    setDeleteWarning(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteEmployee = () => {
    if (orgId && tempDeleteId) {
      deleteEmployeeApiCall(orgId, tempDeleteId);
    }
  };

  const handleFilterTableData = (value: string) => {
    setEmployeeTableInput(value);
    setCurrentPage(1);
    if (orgId) getEmployeeApiCall(orgId, 1, value, "TABLE");
  };

  const addEmployeeApiCall = async (item: EmployeeFormData, orgId: number) => {
    setAddEmployeeLoading(true);

    const data = {
      org_id: orgId,
      emp_type: item.employeeType,
      emp_name: item.employeeName,
      emp_add: item.address,
      emp_mobile: item.mobileNo,
      emp_mail: item.email || "",
    };

    try {
      const res: ApiResponse = await addEmployeeAPI(data);

      if (res.status === 200) {
        form.reset();
        setIsOpen(false);
        setCurrentPage(1);
        setEmployeeTableInput("");
        getEmployeeApiCall(orgId, 1, "", "TABLE");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddEmployeeLoading(false);
    }
  };

  const updateEmployeeApiCall = async (
    employeeId: number,
    item: EmployeeFormData,
    orgId: number
  ) => {
    let data = {
      org_id: orgId,
      emp_id: employeeId,
      emp_type: item.employeeType,
      emp_name: item.employeeName,
      emp_add: item.address,
      emp_mobile: item.mobileNo,
      emp_mail: item.email || "",
    };
    setUpdateEmployeeLoading(true);
    try {
      const res = await updateEmployeeAPI(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        form.reset();
        setCurrentPage(1);
        setEmployeeTableInput("");
        getEmployeeApiCall(orgId, 1, "", "TABLE");
        setIsOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdateEmployeeLoading(false);
    }
  };

  const getEmployeeApiCall = async (
    orgId: number,
    page: number,
    keyword: string,
    type: string
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getEmployeeAPI(
        orgId,
        page,
        keyword,
        type === "TABLE" ? perPage : undefined,
      );

      if (res.status === 200) {
        const newData =
          type === "TABLE" || page === 1
            ? res.data.details?.data
            : [...employeeData, ...res.data.details?.data];
        dispatch(getEmployeeData(newData));
        setLastPage(res.data.details?.last_page);
        if (type === "TABLE" && !keyword) {
          setTotalCount(resolveListTotalCount(res.data.details));
        }
      } else {
        dispatch(getEmployeeData([]));
        if (type === "TABLE" && !keyword) {
          setTotalCount(0);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getEmployeeData([]));
      if (type === "TABLE" && !keyword) {
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployeeApiCall = async (
    orgId: number,
    employeeId: number) => {
    setDeleteEmployeeLoading(true);

    const data = {
      org_id: orgId,
      emp_id: employeeId,
    };

    try {
      const res: ApiResponse = await deleteEmployeeAPI(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        setShowDeleteDialog(false);
        setTempDeleteId(null);
        setDeleteWarning(null);
        setCurrentPage(1);
        setEmployeeTableInput("");
        getEmployeeApiCall(orgId, 1, "", "TABLE");
      } else if (isMasterDeleteDependencyResponse(res)) {
        setDeleteWarning(getMasterDeleteWarningMessage(res));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteEmployeeLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        employeeType: editData.Emp_Type.toString() || "",
        employeeName: editData.Emp_Name || "",
        address: editData.Emp_Address || "",
        mobileNo: editData.Emp_Mobile || "",
        email: editData.Emp_Mail || "",
      });
    } else {
      form.reset({
        employeeType: "",
        employeeName: "",
        address: "",
        mobileNo: "",
        email: "",
      });
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (editData && !isOpen) {
      setEditData(null);
    }
  }, [isOpen, editData]);

  useResetFormOnModalClose(isOpen, () => {
    form.reset();
  });

  return {
    getEmployeeApiCall,
    addEmployeeLoading,
    updateEmployeeLoading,
    loading,
    form,
    handleSubmit,
    isOpen,
    setIsOpen,
    editData,
    handleEditData,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    handlePerPageChange,
    totalCount,
    employeeTableInput,
    handleFilterTableData,
    input,
    setInput,
    showDeleteDialog,
    setShowDeleteDialog,
    setTempDeleteId,
    handleShowDeleteDialog,
    handleDeleteEmployee,
    deleteEmployeeLoading,
    deleteWarning,
  };
};
