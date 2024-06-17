"use client"
 
import * as z from "zod"
import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
//import { MessagePrompt } from "@/types/common"
import { useForm } from "react-hook-form"

import { User } from "@/types/userTypes"
//import { CustomField } from "@/components/form/custom-field"
//import usePostAPI from "@/hooks/usePostAPI"
import { Button, Button2 } from "@/components/button"
//import Link from "next/link"
import { CustomFormContext } from "@/components/custom-form/customFormContext"
import { CustomFormTypes } from '@/components/custom-form/custom-form-types';
import { FormFieldAttribute } from "@/components/custom-form/inputs-data-types"
import reducer from "@/reducers/commonReducer"
import FormContent from "@/components/custom-form/form"
import FormTitle from "@/components/custom-form/form-title"
import FormMessage from "@/components/custom-form/form-message"
import FormButtons from "@/components/custom-form/form-buttons"
import FormLoader from "@/components/custom-form/form-loader"
import FormField from "@/components/custom-form/form-field"


// Form Object attributes
const formObject: CustomFormTypes = {
  id: 0, //used for edit
  alertPrompt: null, // show message prompt (success | error)
  isProcessing: false, // notify form that API call is in progress
  useForm: null, // react-hook-form functionalities
  submissionUrl: '/api/user/register', // api url
}
// the form structures or schema
const formSchema: z.ZodType<FormData> = z.object({
  user_name: z.string().min(1, {
    message: "Name is required.",
  }),
  user_email: z.string().email({
    message: "Email is invalid",
  }),
  user_password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
  user_confirm_password: z.string(),
}).refine((data) => data.user_password === data.user_confirm_password, {
  message: "Passwords did not match!",
  path: ["user_confirm_password"],
});

const formFieldsInfo = {
  user_name: {
    label: 'Name',
    type: 'text',
    name: 'user_name',
    placeholder: 'Name',
  },    
  user_email: {
    label: 'Email',
    type: 'email',
    name: 'user_email',
    placeholder: 'Email',                
  },
  user_password: {
    label: 'Password',
    type: 'password',
    name: 'user_password',
    placeholder: 'Password',                
  },
  user_confirm_password: {
    label: 'Confirm Password',
    type: 'password',
    name: 'user_confirm_password',
    placeholder: 'Confirm Password',                
  }
}  
export default function RegistrationForm() {
  // <CUSTOM hook>
  const formControl: any = useForm<FormData>({ resolver: zodResolver(formSchema)}); // Apply the zodResolver
  // </CUSTOM hook>

  // <LOCAL VARIABLES>
  const id = 0;
  const {
    handleSubmit, reset, formState: { errors }, register, setValue, getValues, formState, setError, clearErrors
  } = formControl;
  formObject.useForm = { handleSubmit, reset, errors, register, setValue, getValues, formState, setError, clearErrors };
  const [ state, dispatch ] = useReducer(reducer<CustomFormTypes>, formObject);
  const contextValues = useMemo(() => ({ 
    state, 
    dispatch 
  }), [state]);

  // </LOCAL VARIABLES>
  
  

  // clean up function callback
  const handleSubmitResult = useCallback(() => {  
    console.log('handleSubmitResult callback');
    setTimeout(() => {
      // dispatch({ type: 'set_fields', payload: {alertPrompt: null} });
      // refreshed the parent Option Context, list of options needed to be re-fetched
      // optionDispatch({ type: 'set_fields', payload: { refreshCounter:  optionContext.refreshCounter + 1, optionContext: null } });
    }, 1000);      
  }, []);
  
  return (
    <CustomFormContext.Provider value={contextValues}>      
      <div className='margin-top w-full'>
        <FormContent<User> onSuccessCallback={handleSubmitResult}>
          <FormTitle className="font-bold text-xl text-center">User Registration</FormTitle>
          <FormMessage />

          <FormField key="user_name"
            inputData={formFieldsInfo.user_name as FormFieldAttribute<FormData>}
            label={<FormField.Label />}
            field={<FormField.Input />}
            error={<FormField.Error />}
          />

          <FormField key="user_email"
            inputData={formFieldsInfo.user_email as FormFieldAttribute<FormData>}
            label={<FormField.Label />}
            field={<FormField.Input />}
            error={<FormField.Error />}
          />

          <FormField key="user_password"
            inputData={formFieldsInfo.user_password as FormFieldAttribute<FormData>}
            label={<FormField.Label />}
            field={<FormField.Input />}
            error={<FormField.Error />}
          />

          <FormField key="user_confirm_password"
            inputData={formFieldsInfo.user_confirm_password as FormFieldAttribute<FormData>}
            label={<FormField.Label />}
            field={<FormField.Input />}
            error={<FormField.Error />}
          />
          
          <FormButtons className="w-full mt-3 justify-between">            
            <Button2 
              className='btn btn-accent'
              type="submit">{id ? 'Update' : 'Register'}</Button2>
            <Button2 className="btn-link"><a href="/user/login">Login</a></Button2>
          </FormButtons>              
          <FormLoader />          
        </FormContent> 
      </div>
      
    </CustomFormContext.Provider>
  );
}

/**
 * BASIC ANATOMY OF A CUSTOM FORM
 * 
 * CustomFormContext 
 *    - we used context to make the form info self contained entity
 *    - we defined a reducer to manage the state of the form
 *       - the state is defined in the formObject (which is the shared information about the form)
 *       - there's also the form field definitions (in the formFieldsInfo), which describes the form fields
 *       - we use react-hooks-form to manage the various form capabilities such as but not limited to: validations, errors, submit, reset, get values
 *   
 *  FormContent 
 *    - the wrapper of the form and the posting process is handled
 *    FormTitle - the title of the form
 *    FormMessage - the submit event result
 * 
 *    FormField - self contained form field which is comprised of the following
 *      FormField.Label - the label of the form field
 *      FormField.Input - the input of the form field
 *      FormField.Error - the error of the form field
 * 
 *    FormButtons - the action buttons of the form
 *    FormLoader - the loader of the form
 */

