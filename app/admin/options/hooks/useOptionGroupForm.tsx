import * as z from "zod"
import { useMemo } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormState } from '@/types/common';

// Our main data source used universally by most custom forms
// not the actual form data fields structure, but the supporting data to make the form work universally
const formData: FormState = {
  id: 0, //used for edit
  alertPrompt: null, // show message prompt (success | error)
  isProcessing: false, // notify form that API call is in progress
  useForm: null, // react-hook-form functionalities
  submissionUrl: '/api/options', // api url
}
// the actual form structures or schema
const formSchema: z.ZodType<FormData> = z.object({
  option_name: z.string().min(1, {
    message: "Name is required.",
  }),
  option_description: z.string().min(2, {
    message: "Description is required",
  }),
  parent: z.any(),
})

const useOptionGroupForm = () => {
  // <CUSTOM hook INITS>
const formControl: any = useForm<FormData>({
  resolver: zodResolver(formSchema), // Apply the zodResolver
});
// </CUSTOM hook INITS>

// <LOCAL VARIABLES>
const { handleSubmit, reset, errors, register, setValue, getValues, formState, clearErrors, setError } = formControl;
formData.useForm = { handleSubmit, reset, errors, register, setValue, getValues, formState, clearErrors, setError };
//const id = optionContext.selectedOption?.option_id;
const formFieldsInfo = useMemo (() => ({
  option_id: {
    label: '',
    type: 'hidden',
    name: 'id',
    placeholder: '',
  },
  option_name: {
    label: 'Option Name',
    type: 'text',
    name: 'option_name',
    placeholder: 'Option  Name',
    //callback: parentCallback,
  },    
  option_description: {
    label: 'Description',
    type: 'text',
    name: 'option_description',
    placeholder: 'Description',                
  }
}), []);  

  return { formData, formFieldsInfo};
}

export default useOptionGroupForm;