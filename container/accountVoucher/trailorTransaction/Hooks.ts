import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { TrailorTransactionFormData } from "@/types/accountVoucher/TrailorTransactionTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { format } from "date-fns";
import {
  addTrailorTransactionAPI,
  getTrailorBalanceAPI,
  getTrailorUserAPI,
} from "./TrailorTransactionApis";
import { getTrailorUserData } from "./TrailorTransactionReducer";

export const useTrailorTransaction = () => {
  const dispatch = useDispatch();
  const [getUserLoading, setGetUserLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);
  const [finId, setFinId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
      setFinId(getCookieData<number | null>("waxCraftClientFinId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    date: yup.date().required("Date is required"),
    userId: yup.string().required("User is required"),
    balance: yup.string().default(""),
    transType: yup.string().required("Transaction type is required"),
    amount: yup.string().required("Amount is required"),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<TrailorTransactionFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      userId: "",
      balance: "",
      transType: "R",
      amount: "",
    },
  });

  const { date, userId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<TrailorTransactionFormData> = (values) => {
    if (orgId && finId) {
      addTrailorTransactionApiCall(values);
    } else {
      toast.error("Something went wrong");
    }
  };

  const addTrailorTransactionApiCall = async (
    item: TrailorTransactionFormData
  ) => {
    setLoading(true);

    const data = {
      org_id: orgId,
      trans_date: format(item.date, "yy-MM-dd"),
      user_id: item.userId,
      trans_type: item.transType,
      amount: item.amount,
      year_id: finId,
    };

    try {
      const res: ApiResponse = await addTrailorTransactionAPI(data);

      if (res.status === 200) {
        form.reset();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getTrailorUserApiCall = async (orgId: number) => {
    setGetUserLoading(true);

    try {
      const res: ApiResponse = await getTrailorUserAPI(orgId);

      if (res.status === 200) {
        dispatch(getTrailorUserData(res.data.details));
      } else {
        toast.error(res.data.message);
        dispatch(getTrailorUserData([]));
      }
    } catch (err) {
      toast.error("Something went wrong");
      dispatch(getTrailorUserData([]));
    } finally {
      setGetUserLoading(false);
    }
  };

  const getTrailorBalanceApiCall = async (
    orgId: number,
    userId: string,
    date: Date
  ) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getTrailorBalanceAPI(
        orgId,
        userId,
        format(date, "yyyy-MM-dd")
      );

      if (res.status === 200) {
        form.setValue("balance", res.data.details[0]?.Balance);
      } else {
        toast.error(res.data.message);
        form.setValue("balance", "");
      }
    } catch (err) {
      toast.error("Something went wrong");
      form.setValue("balance", "");
    } finally {
      setLoading(false);
    }
  };

  const prevDate = useRef<Date>(date);
  const prevUserId = useRef(userId);

  useEffect(() => {
    if (
      orgId &&
      userId &&
      date &&
      (userId !== prevUserId.current || date !== prevDate.current)
    ) {
      getTrailorBalanceApiCall(orgId, userId, date);
    }
    prevDate.current = date;
    prevUserId.current = userId;
    console.log(userId);
  }, [date, userId, orgId]);

  return {
    getUserLoading,
    loading,
    form,
    handleSubmit,
    getTrailorUserApiCall,
  };
};
