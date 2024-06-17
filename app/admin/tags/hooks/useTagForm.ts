import * as z from "zod"
import { useCallback, useMemo,  useRef } from "react";
import { useForm, useController } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormState } from '@/types/common';
import { FormFieldAttribute } from "@/components/custom-form/inputs-data-types"
import { usePageContext, usePageDispatch } from '@/admin/contexts/category'
import { createDropdownOptions } from "@/utils/category";


// Form Object attributes
const formObject: FormState = {
  alertPrompt: null, // show message prompt (success | error)
  isProcessing: false, // notify form that API call is in progress
  useForm: null, // react-hook-form functionalities
  useController: null,
  submissionUrl: '/api/tags', // api url
}

const formSchema: z.ZodType<FormData> = z.object({  
  name: z.string().min(5, {
    message: "Name is required.",
  }),  
  description: z.string().min(2, {
    message: "Description is required",
  })
})


const useTagForm = () => {
  // <CUSTOM hook INITS>
  const { hierarchedCategories } = usePageContext();  
  const formControl: any = useForm<FormData>({
    resolver: zodResolver(formSchema), // Apply the zodResolver    
  });
  
  // LOCAL VARIABLES
  const slugHasChanged = useRef(false);
  const { handleSubmit, reset, errors, register, setValue, getValues, formState, control } = formControl;
  formObject.useForm = { handleSubmit, reset, errors, register, setValue, getValues, formState, control };
  formObject.useController = useController;
  // state variables  

  const parentCallback = useCallback((value: string, fieldName: string) => {
    console.log('PARENT CALLED by: ', fieldName, ' with value: ', value);
    if(fieldName === 'name') {
      // call API to checked the uniqueness of the name
      if(value === '') {
        //const name = formControl.getValues('name').replace(/\s+/g, '-').toLowerCase();
        //setIsProcessing(true);
        setTimeout(() => {
          //formControl.setValue('slug', value);
        }, 500);
        console.log('name', value);
        //slugHasChanged.current = false;
      } else {
        //slugHasChanged.current = true;
      }
    } else { }
  }, []);

  // memoizing the data here make sense, since these values will not change over time
  const formFieldsInfo = useMemo (() => ({
    id: {
      label: '',
      type: 'hidden',
      name: 'tag_id',
      placeholder: '',
    },
    
    name: {
      label: 'Tag Name',
      type: 'text',
      name: 'name',
      placeholder: 'Tag Name',
      callback: parentCallback,
    },    
    description: {
      label: 'Description',
      type: 'text',
      name: 'description',
      placeholder: 'Description',                
    }
  }), []);

  return { formFieldsInfo, formObject }
}
export default useTagForm;