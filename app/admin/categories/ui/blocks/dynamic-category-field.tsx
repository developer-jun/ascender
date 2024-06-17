import { ReactNode, useMemo } from 'react';
import { FormFieldData } from "../../../category/ui/inputs-data-types"
import FormFieldContext, { useCustomInput } from "../../../category/ui/formFieldContext";
import { FieldValues, Path } from 'react-hook-form';
import { useCustomForm } from '@/app/admin/contexts/customFormContext';

type FormFieldProps<T extends FieldValues> = {
  inputData: FormFieldData<T>;
  label?: ReactNode;
  field?: ReactNode;
  error?: ReactNode;
  loader?: ReactNode;
}

const FormField = <T extends FieldValues>({ inputData, label, field, error, loader }: FormFieldProps<T>) => {  
  const contextValues = useMemo(() => inputData, [inputData]);
  return (
    <FormFieldContext.Provider value={ contextValues }>
      <div>
        {label}
        {field}
        <div>
          {error}            
        </div>
        {loader}
      </div>
    </FormFieldContext.Provider>
  );
}

const Input = () => {
  const { type, placeholder, name, callback } = useCustomInput();
  const { useForm: { register } } = useCustomForm();

  //console.log('callback['+name+']: ', callback);
  return (
    <>
      <input 
        className="h-10 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        type={type}
        placeholder={placeholder}
        id={name}
        {...register((name as unknown) as Path<FieldValues>,{
          onChange: (e)=>{
            if(callback) {
              callback(e.target.value, name);
              console.log('onchange triggered for '+name+ ': ', e.target.value)
            }
            
          }
        })} 
        />
    </>
  )
}

const Textarea = () => {
  const { placeholder, name } = useCustomInput();
  const { useForm: { register } } = useCustomForm();
  return (
    <>
      <textarea 
        className="h-20 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        placeholder={placeholder}
        id={name}
        {...register((name as unknown) as Path<FieldValues>)} 
      ></textarea>
    </>
  )
}

const Select = () => {
  const { placeholder, name, options } = useCustomInput();
  const { useForm: { register } } = useCustomForm();
  console.log('options: ', options);
  return (
    <>
      <select
        className="h-10 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        placeholder={placeholder}
        id={name}
        {...register((name as unknown) as Path<T>)}
      >
        {options && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

const Labels = () => {
  const inputContext = useCustomInput();
  return (
    <>
      <label className="text-sm font-medium" htmlFor={inputContext.name}>{inputContext.label}</label>    
    </>
  )
}

const Button =  ({ 
  className, type, title, onClick, children 
}: { 
  className?: string, type?: string, title?: string, onClick?: () => void, children: React.ReactNode 
}) => {
  let buttonType = 'button';
  if(type === 'submit' 
    || type === 'reset' 
    || type === 'button') {
    buttonType = type;
  }
  return (
    <>
      <button className={className} type={buttonType} title={title} onClick={onClick}>
        {children}
      </button>
    </>
  )
}
              
const Error = () => {
  const inputContext = useCustomInput();
  const { useForm: { formState: { errors,  } } } = useCustomForm();
  
  if(errors && inputContext.name) {
    return (
      <>
        {errors[inputContext.name] 
          && <span key={inputContext.name} className="text-sm text-rose-500">{errors[inputContext.name].message}</span>}
      </>
    )
  } else {
    return;
  }  
}

import Loader from "@/components/blocks/loader";

const FormLoader = () => {
  const { isProcessing } = useCustomForm();
  // let isProcessing = false;
  console.log('isProcessing: ', isProcessing);
  return (
    <>
      {isProcessing && <div className="form-overlay">
        <Loader />
      </div>}
    </>
  );
}


FormField.Button = Button;
FormField.Label = Labels;
FormField.Input = Input;
FormField.Select = Select;
FormField.Textarea = Textarea;
FormField.Error = Error;
FormField.Loader = FormLoader;

export default FormField;