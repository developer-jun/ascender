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
  submissionUrl: '/api/categories', // api url
}

const formSchema: z.ZodType<FormData> = z.object({  
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  slug: z.string().min(2, {
    message: "Slug is invalid",
  }),
  description: z.string().min(2, {
    message: "Description is required",
  }),
  parent: z.any(),
})


const useCategoryForm = () => {
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
    if(fieldName === 'slug') {
      if(value === '') {
        const slug = formControl.getValues('name').replace(/\s+/g, '-').toLowerCase();
        //setIsProcessing(true);
        setTimeout(() => {
          formControl.setValue('slug', slug);
        }, 500);
        console.log('set slug', slug);
        slugHasChanged.current = false;
      } else {
        slugHasChanged.current = true;
      }
    } else if( fieldName === 'name') {
      if(!slugHasChanged.current) {
        const slug = formControl.getValues('name').replace(/\s+/g, '-').toLowerCase();
        formControl.setValue('slug', slug);
      }
    } else { }
  }, []);

  // memoizing the data here make sense, since these values will not change over time
  const formFieldsInfo = useMemo (() => ({
    id: {
      label: '',
      type: 'hidden',
      name: 'id',
      placeholder: '',
    },
    parent: {
      label: 'Parent Category',
      type: 'text',
      name: 'parent',
      placeholder: '',                  
      options: createDropdownOptions(hierarchedCategories), 
      value: 1,                 
    },
    name: {
      label: 'Category Name',
      type: 'text',
      name: 'name',
      placeholder: 'Category Name',
      callback: parentCallback,
    },
    slug: {
      label: 'Slug',
      type: 'text',
      name: 'slug',
      placeholder: 'Slug',
      callback: parentCallback,
    },
    description: {
      label: 'Description',
      type: 'text',
      name: 'description',
      placeholder: 'Description',                
    }
  }), [hierarchedCategories]);

  return { formFieldsInfo, formObject }
}
export default useCategoryForm;