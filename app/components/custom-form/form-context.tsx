import { FormAction, FormState } from "@/types/common";
import { createContext, useContext } from "react";

type FormContextType = {
  state: FormState;
  formDispatch: React.Dispatch<FormAction<FormState>>;
};

export const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);

  if(!context) {
    throw new Error('useCategoryForm must be used within a CategoryFormProvider');
  }
  
  return context;
}
