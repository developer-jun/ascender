import { FieldError, UseFormRegister, FieldValues, Path } from "react-hook-form"

const labelCssClass = "text-sm font-medium";
const textInputCssClass = "h-10 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700";
const errorCssClass = "text-sm text-rose-500";

interface CustomFieldProps<T extends FieldValues, U> {
  type: string;
  placeholder: string;
  name: U;
  label: string;
  register: UseFormRegister<T>;
  error: FieldError | undefined;
};
export const CustomField = <T extends FieldValues, U extends string>({ 
  type, 
  placeholder, 
  name, 
  label, 
  register, 
  error,
  ...props
}: CustomFieldProps<T, U>) => (
  <>
    <div className="grid w-full items-center gap-1.5 mb-3">
      <label className={labelCssClass} htmlFor={name}>{label}</label>
      <input 
        className={textInputCssClass}
        type={type}
        placeholder={placeholder}
        id={name}
        {...register((name as unknown) as Path<T>)} 
        {...props} />        
      {error && <span className={errorCssClass}>{error.message}</span>}      
    </div>       
  </>
);