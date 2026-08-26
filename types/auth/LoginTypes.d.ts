import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface LoginFormData {
  email: string;
  password: string;
}

// Define the structure of the body you expect for the login API (adjust based on your API's requirements)
interface LoginBody {
  email: string;
  password: string;
  date: string;
}

export interface LoginProps {
  form: UseFormReturn<LoginFormData>;
  loading: boolean;
  afterLoginLoading: boolean;
  handleSubmit: SubmitHandler<LoginFormData>;
}
