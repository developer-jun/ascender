import { FieldError, FieldValues, UseFormRegister } from "react-hook-form"

export type InputData = {
  label: string
  type: string
  name: string
  placeholder: string
}

export type FormData = {
  name: string;
  email: string;  
  password: string;
  confirmPassword: string;
};
export type ValidFieldNames =
  | "name"
  | "email"  
  | "password"
  | "confirmPassword";

export type CustomInputData<T extends FieldValues> = {
  type: string;
  name: string;
  label: string;
  register: UseFormRegister<T>;
  error: FieldError | undefined;  
  placeholder: string;
  value?: string;
  
  //onChange: (value: string) => void;
  //onBlur: (value: string) => void;
}