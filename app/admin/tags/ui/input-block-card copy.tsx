import { ReactNode } from 'react';
import { CustomInputData } from "../types/Inputs"
import CustomInputContext, { useCustomInput } from "../../category/ui/formFieldContext";
import { FieldValues, Path } from 'react-hook-form';

type InputBlockCardProps<T extends FieldValues> = {
  inputData: CustomInputData<T>;
  label?: ReactNode;
  input?: ReactNode;
  error?: ReactNode;
}
const InputBlockCard = <T extends FieldValues>({ inputData, label, input, error }: InputBlockCardProps<T>) => {  
  return (
    <CustomInputContext.Provider value={ inputData }>
      <div>
        {label}
        {input}
        <div>
          {error}            
        </div>
      </div>
    </CustomInputContext.Provider>
  );
}


const Label = () => {
  const inputContext = useCustomInput();
  return (
    <>
      <label className="text-sm font-medium" htmlFor={inputContext.name}>{inputContext.label}</label>    
    </>
  )
}
const Input = () => {
  const inputContext = useCustomInput();
  return (
    <>
      <input 
        className="h-10 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        type={inputContext.type}
        placeholder={inputContext.placeholder}
        id={inputContext.name}
        {...inputContext.register((inputContext.name as unknown) as Path<FieldValues>)} 
        />
    </>
  )
}
              
const Error = () => {
  const inputContext = useCustomInput();
  return (
    <>
      {inputContext.error && <span className="text-sm text-rose-500">{inputContext.error.message}</span>}      
    </>
  )
}



InputBlockCard.Label = Label;
InputBlockCard.Input = Input;
InputBlockCard.Error = Error;

export default InputBlockCard;
