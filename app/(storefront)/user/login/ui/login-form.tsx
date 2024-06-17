'use client';

import { useEffect, useMemo, useReducer } from "react"
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { FormState } from "@/types/common"
import { FormContext } from "@/components/custom-form/form-context";
import { Form } from "@/components/custom-form/form";
import { FormFieldAttribute } from "@/components/custom-form/inputs-data-types";
import { Button2 } from "@/components/button";

import useLoginForm from "@/(storefront)/user/hooks/useLoginForm";
import reducer from "@/reducers/customFormReducer";
import FormTitle from "@/components/custom-form/form-title";
import FormField from "@/components/custom-form/form-field";
import FormMessage from "@/components/custom-form/form-message";

export default function LoginForm() { 
  const { formFieldsInfo, formData } = useLoginForm(); // Form Code Abstraction 
  const [ state, formDispatch ] = useReducer(reducer<FormState>, formData);
  const contextValues = useMemo(() => ({ 
    state, 
    formDispatch 
  }), [state, formDispatch]);
  
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  
  useEffect(() => {
    if(errorMessage) {
      formDispatch({ type: 'set_fields', payload: {
        ...state,
        isProcessing: false,
        alertPrompt: {
          messageType: 'error', 
          message: errorMessage
        }} 
      });
    }
  }, [errorMessage]);
  
  const handleFormSubmit = (values: any) => {
    formDispatch({ 
      type: 'set_field', 
      payload: {
        fieldName: 'isProcessing',
        data: true 
      }
    });
    dispatch(values)
  }

  return (
    <FormContext.Provider value={contextValues}>
      <div data-theme="nord" id="category-form" className="relative flex flex-col place-items-center custom-form p-5 rounded-md bg-gray-300 shadow-xl shadow-slate-950">
        <div className="p-3 w-full items-center">
            <Form onSuccessCallback={handleFormSubmit}           
              header={
                <Form.Header>
                  <FormTitle className="font-bold text-xl text-center">Login Form</FormTitle>
                  <FormMessage />
                </Form.Header>
              }
              fields={
                <Form.Fields>
                  <FormField key="email"
                    inputData={formFieldsInfo.email as FormFieldAttribute<FormData>}
                    label={<FormField.Label />}
                    field={<FormField.Input />}
                    error={<FormField.Error />}
                  />
                  <FormField key="password"
                    inputData={formFieldsInfo.password as FormFieldAttribute<FormData>}
                    label={<FormField.Label />}
                    field={<FormField.Input />}
                    error={<FormField.Error />}
                  />
                </Form.Fields>
              }
              footer={
                <Form.Footer className="text-right mt-3 flex justify-between">
                  <Button2 
                    className='btn-sm bg-cyan-950 text-white hover:bg-cyan-800' 
                    type="submit" 
                    title="Login"
                    >Login</Button2>
                  <Button2 
                    className='none'
                    type="submit"
                    ><a href="/user/register">Sign Up</a></Button2>
                </Form.Footer>                        
              }
            />
        </div>
      </div>
    </FormContext.Provider>   
  );
}