import useFetchAPI from "@/hooks/useFetchAPI";
import { Category, DropdownOption } from "@/types/category";
import { FormState } from "@/types/common";
import { createDropdownOptions, createHierarchy } from "@/utils/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { usePageContext } from "@/admin/contexts/product"
import * as z from "zod"

const formData: FormState = {
  id: 0, //used for edit
  alertPrompt: null, // show message prompt (success | error)
  isProcessing: false, // notify form that API call is in progress
  useForm: null, // react-hook-form functionalities
  submissionUrl: '/api/products', // api url
}

const formSchema: z.ZodType<FormData> = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  slug: z.string().transform((val, ctx) => {
    if (val === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Slug is Required",
      });

      return z.NEVER;
    }
    return val;
  }), // we use transform to combat autocomplete where form field is triggered thus assumed empty
  sku: z.string().min(1, {
    message: "SKU is required",
  }),
  summary: z.string().min(1, {
    message: "Summary is required",
  }),
  description: z.string().optional(),
  price: z.number().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional().transform((val, ctx) => {
    const parsed =  parseInt(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Not a valid Value",
      });

      return z.NEVER;
    }
    return parsed;
  }) // we simply transform the string to number which is to be expected when working with html values
});

const useProductForm = () => {
  const { selectedItem } = usePageContext();
  const { data: categories, loading, error } = useFetchAPI<Category>('/api/categories/');
  const slugHasChanged = useRef(false); 
  console.log('selectedItem: ', selectedItem);
  const formControl: any = useForm<FormData>({
    resolver: zodResolver(formSchema), // Apply the zodResolver
    defaultValues: {
      id: (selectedItem?.id ? selectedItem.id : 0),
      name: (selectedItem?.name ? selectedItem.name : ''),
      slug: (selectedItem?.slug ? selectedItem.slug : ''),
      sku: (selectedItem?.sku ? selectedItem.sku : ''),
      summary: (selectedItem?.summary ? selectedItem.summary : ''),
      description: (selectedItem?.description ? selectedItem.description : ''),
      imageUrl: (selectedItem?.imageUrl ? selectedItem.imageUrl : ''),
      price: (selectedItem?.price ? selectedItem.price : 0),
      category: (selectedItem?.categoryId ? `${selectedItem.categoryId}` : '0'), // conversion to string is required for the validation
    }
  });

  const { handleSubmit, reset, errors, register, setValue, getValues, formState, control, clearErrors, setError } = formControl;
  formData.useForm = { handleSubmit, reset, errors, register, setValue, getValues, formState, control, clearErrors, setError };
  
  // append id to url if in edit mode
  if(selectedItem && selectedItem.id && selectedItem.id > 0) {
    formData.submissionUrl += '/' + selectedItem.id;
  }
  
  const dropdownOptions: DropdownOption[] = useMemo(() => {
    if(!categories) return null;
    const formattedCategories = createHierarchy(categories);
    
    return createDropdownOptions(formattedCategories);
  }, [categories]);

  const parentCallback = useCallback((value: string, fieldName: string) => {
    switch(fieldName) {    
      case 'slug':
        if(value === '') {
          const slug = formControl.getValues('name').replace(/\s+/g, '-').toLowerCase();
          setTimeout(() => {
            formControl.setValue('slug', slug);
          }, 500);
          slugHasChanged.current = false;
        } else {
          slugHasChanged.current = true;
        }
      break;
      case 'name':
        if(!slugHasChanged.current) {
          const slug = formControl.getValues('name').replace(/\s+/g, '-').toLowerCase();
          formControl.setValue('slug', slug);
        }
      break;
      case 'imageUrl':
        formControl.setValue('imageUrl', value);
      break;
      default: {
        console.log('PARENT CALLED by: ', fieldName, ' with value: ', value);
      }
    }
  }, []);

  const formFieldsInfo = useMemo (() => ({
    id: {
      label: '',
      type: 'hidden',
      name: 'id',
      placeholder: '',
    },
    name: {
      label: 'Product Name',
      type: 'text',
      name: 'name',
      placeholder: 'Product  Name',
      callback: parentCallback,
    },    
    slug: {
      label: 'Slug',
      type: 'text',
      name: 'slug',
      placeholder: 'slug',
      callback: parentCallback
    },
    category: {
      label: 'Category',
      type: 'select',
      name: 'category',
      placeholder: 'Category',
      options: dropdownOptions,  
    },
    imageUrl: {
      label: 'Product Image',
      type: 'upload',
      name: 'imageUrl',
      placeholder: 'Product Image',
      callback: parentCallback
    },
    price: {
      label: 'Price',
      type: 'number',
      name: 'price',
      placeholder: 'price',    
      step: 0.01,            
    },
    sku: {
      label: 'SKU',
      type: 'text',
      name: 'sku',
      placeholder: 'sku',                
    },
    summary: {
      label: 'Summary',
      type: 'text',
      name: 'summary',
      placeholder: 'Summary',                
    },
    description: {
      label: 'Description',
      type: 'text',
      name: 'description',
      placeholder: 'Description',                
    }
  }), [dropdownOptions]);

  return { formFieldsInfo, parentCallback, formData, selectedItem };
}

export default useProductForm;