import { FieldError, FieldValues, UseFormRegister } from "react-hook-form"

export type InputFieldAttribute = {
  label: string
  type: string
  name: string
  placeholder: string
}

export type FormFieldAttribute<T extends FieldValues> = {
  type: string;
  name: string;
  label: string;
  register: UseFormRegister<T>;
  error: FieldError | undefined;  
  placeholder: string;
  value?: string | number;
  options?: any[];
  callback?: (value: string) => void;
  step?: number;
  
  //onChange: (value: string) => void;
  //onBlur: (value: string) => void;
}