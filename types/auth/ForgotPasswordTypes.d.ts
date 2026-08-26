import { UseFormReturn, SubmitHandler } from "react-hook-form";

// Define the types for form data and API response
export interface ForgotPasswordFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

// Define the structure of the body you expect for the forgotpassword API (adjust based on your API's requirements)
interface ForgotPasswordBody {
  user_mail: string;
  user_pass: string;
}

export interface ForgotPasswordProps {
  form: UseFormReturn<ForgotPasswordFormData>;
  loading: boolean;
  handleSubmit: SubmitHandler<ForgotPasswordFormData>;
  handleVerifyOtp: () => void;
  currentStep: number;
}
