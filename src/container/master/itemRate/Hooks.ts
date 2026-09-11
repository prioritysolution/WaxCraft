import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@/lib/yupResolver";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { ItemRateFormData } from "@/types/master/ItemRateTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { addItemRateAPI, getItemRateAPI } from "./ItemRateApis";
import { uptoThreeDigitDecimalRegex } from "@/utils/validationRegex";
import { toTwoDecimalString } from "@/utils/formatDecimal";

export const useItemRate = () => {
  const [addItemRateLoading, setAddItemRateLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState<number | null>(null);

  const [itemInput, setItemInput] = useState("");

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrgId(getCookieData<number | null>("waxCraftClientOrgId"));
    }
  }, []);

  // Form validation schema with yup
  const formSchema = yup.object({
    itemId: yup.string().required("Item is required"),
    previousRate: yup.string().default(""),
    currentRate: yup
      .string()
      .required("Rate is required")
      .test("is-valid-number", "Invalid rate", (value) => {
        if (!value) return false;
        return uptoThreeDigitDecimalRegex.test(value);
      }),
  });

  // Initialize the form with react-hook-form and yup resolver
  const form = useForm<ItemRateFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      itemId: "",
      previousRate: "",
      currentRate: "",
    },
  });

  const { itemId } = form.watch();

  // Handle form submission
  const handleSubmit: SubmitHandler<ItemRateFormData> = (values) => {
    if (orgId) {
      addItemRateApiCall(values);
    } else {
      toast.error("Something went wrong");
    }
  };

  const addItemRateApiCall = async (item: ItemRateFormData) => {
    setAddItemRateLoading(true);

    const data = {
      org_id: orgId,
      item_id: item.itemId,
      item_rate: toTwoDecimalString(item.currentRate),
    };

    try {
      const res: ApiResponse = await addItemRateAPI(data);

      if (res.status === 200) {
        form.reset();
        setItemInput("");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddItemRateLoading(false);
    }
  };

  const getItemRateApiCall = async (orgId: number, itemId: string) => {
    setLoading(true);

    try {
      const res: ApiResponse = await getItemRateAPI(orgId, itemId);

      if (res.status === 200) {
        form.setValue("previousRate", toTwoDecimalString(res.data.details));
      } else {
        form.setValue("previousRate", "");
      }
    } catch (err) {
      toast.error("Something went wrong");
      form.setValue("previousRate", "");
    } finally {
      setLoading(false);
    }
  };

  return {
    getItemRateApiCall,
    addItemRateLoading,
    loading,
    form,
    handleSubmit,
    itemId,
    itemInput,
    setItemInput,
  };
};
