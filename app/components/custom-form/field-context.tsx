import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";
import { FormFieldData } from "./inputs-data-types";

const FieldContext = createContext<FormFieldData<FieldValues> | null>(null);
export const useFieldContext = () => {
  const context = useContext(FieldContext);

  if(!context) {
    throw new Error('useFieldContext must be used within a FieldContext.Provider');
  }
  
  return context;
}

export default FieldContext;