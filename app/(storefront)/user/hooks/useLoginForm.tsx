import { FormState } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { usePageContext } from "@/admin/contexts/common"
import * as z from "zod"

const formData: FormState = {
  id: 0, //used for edit
  alertPrompt: null, // show message prompt (success | error)
  isProcessing: false, // notify form that API call is in progress
  useForm: null, // react-hook-form functionalities
  submissionUrl: '/api/user/login', // api url
}

const formSchema: z.ZodType<FormData> = z.object({
  email: z.string().min(1, {
    message: "Email is required.",
  }),  
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const useLoginForm = () => {  
  const slugHasChanged = useRef(false); 
  
  const formControl: any = useForm<FormData>({
    resolver: zodResolver(formSchema), // Apply the zodResolver    
  });

  const { handleSubmit, reset, errors, register, setValue, getValues, formState, control, clearErrors, setError } = formControl;
  formData.useForm = { handleSubmit, reset, errors, register, setValue, getValues, formState, control, clearErrors, setError };
 
  const parentCallback = useCallback((value: string, fieldName: string) => {
    switch(fieldName) {    
      case 'email':
        
      break;
      case 'password':
        if(!slugHasChanged.current) {
          const slug = formControl.getValues('name').replace(/\s+/g, '-').toLowerCase();
          formControl.setValue('slug', slug);
        }
      break;      
      default: {
        console.log('PARENT CALLED by: ', fieldName, ' with value: ', value);
      }
    }
  }, []);

  const formFieldsInfo = useMemo (() => ({    
    email: {
      label: 'Email',
      type: 'email',
      name: 'email',
      placeholder: 'Email',
    },    
    password: {
      label: 'Password',
      type: 'password',
      name: 'password',
      placeholder: 'Password',
    },    
  }), []);

  return { formFieldsInfo, parentCallback, formData };
}

export default useLoginForm;