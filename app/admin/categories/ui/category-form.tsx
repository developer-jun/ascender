"use client"

import { FormContext } from '@/components/custom-form/form-context';
import { FormFieldAttribute } from "@/components/custom-form/inputs-data-types"
import { Button2 } from "@/components/button";
import { Form } from "@/components/custom-form/form";
import { useEffect, useMemo, useReducer, useState } from 'react';
import { FormState, MessagePrompt, ToastContextType } from '@/types/common';
import { usePageContext, usePageDispatch } from '@/admin/contexts/category'
import reducer from '@/reducers/customFormReducer';
import FormMessage from "@/components/custom-form/form-message";
import FormTitle from "@/components/custom-form/form-title";
import FormField from "@/components/custom-form/form-field"
import useCategoryForm from "../hooks/useCategoryForm"
import usePostAPI from '@/hooks/usePostAPI';
import { useToastDispatch } from '@/components/toast-provider';
import PageLoader from '@/components/page-loader';
import { SVG } from '@/components/svg';

const spinnerClassName = 'animate-spin mr-2 w-4 h-4';

const CategoryForm = () => {
  const pageDispatch = usePageDispatch();
  const toastDispatch = useToastDispatch();
  const { selectedItem } = usePageContext();  
  const { formFieldsInfo, formObject } = useCategoryForm();
  const [ state, formDispatch ] = useReducer(reducer<FormState>, formObject);
  const contextValues = useMemo(() => ({ 
    state, 
    formDispatch 
  }), [state, formDispatch]);
  const { useForm: { reset } } = formObject; 
  const { postRequest, postResult, loading } = usePostAPI(formObject.submissionUrl);
  const [ prompt, setPrompt ] = useState<MessagePrompt | null>(null);
  

  useEffect(() => {
    if(selectedItem) {      
      reset({
        id: selectedItem?.id,
        parent: selectedItem?.parent,
        name: selectedItem?.name,
        slug: selectedItem?.slug,
        description: selectedItem?.description,
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    if(postResult) {      
      let resultPrompt: MessagePrompt | null = null;
      if(postResult.status === 'success') {
        resultPrompt = {
          messageType: 'success', 
          message: 'Category created successfully'
        };
      } else if(postResult.status === 'failed') {
        resultPrompt = {
          messageType: 'error', 
          message: postResult.prompt.message
        };
      }
      toastDispatch({ type: 'add', payload: {
        id: Math.floor(Math.random() * 100),
        alert: resultPrompt
      } as ToastContextType});

      setPrompt(resultPrompt);

      const timer = setTimeout(() => {
        // use this to refresh the category list
        pageDispatch({ 
          type: 'set_field',  
          payload: {
            fieldName: 'refreshCounter',
            data: null
          } 
        });

      }, 3000);

      return () => clearTimeout(timer);
    }    
  }, [postResult, pageDispatch, toastDispatch]);

  const formReset = () => {
    pageDispatch({ 
      type: 'set_field', 
      payload: {
        fieldName: 'selectedItem',
        data: null
      } 
    });
    reset();
  }

  const handleSubmitResult = (values) => {  
    console.log('handleSubmitResult', values);
    postRequest(values);
    setTimeout(() => {     
      reset(); 
      //formDispatch({ type: 'set_fields', payload: {alertPrompt: null} });
      pageDispatch({ 
        type: 'set_field', 
        payload: {
          fieldName: 'selectedItem',
          data: null
        } 
      });
    }, 1000);      
  }

  return (    
    <FormContext.Provider value={contextValues}>
      <div data-theme="nord" id="category-form" className="relative flex flex-col place-items-center custom-form p-5 rounded-md bg-gray-300 shadow-xl shadow-slate-950">
        <div className="mt-3 p-3 w-full items-center text-center">
          {loading ? <PageLoader /> : null}
          <Form onSuccessCallback={handleSubmitResult}           
            header={
              <Form.Header>
                <FormTitle className="font-bold text-xl text-center">Category Form</FormTitle>
                <FormMessage defaultMessage={prompt?prompt:undefined} />
              </Form.Header>
            }
            fields={
              <Form.Fields>
                <FormField key="id"
                  inputData={formFieldsInfo.id as FormFieldAttribute<FormData>}
                  label={''}
                  field={<FormField.Input />}
                  error={''}
                />          
                <FormField key="parent"
                  inputData={formFieldsInfo.parent as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Select className="select select-bordered " />}
                  error={<FormField.Error />}
                />
                <FormField key="name"
                  inputData={formFieldsInfo.name as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Input />}
                  error={<FormField.Error />}
                />
                <FormField key="slug"
                  inputData={formFieldsInfo.slug as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Input />}
                  error={<FormField.Error />}
                />
                <FormField key="description"
                  inputData={formFieldsInfo.description as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Textarea />}
                  error={<FormField.Error />}
                />
              </Form.Fields>
            }
            footer={
              <Form.Footer className="text-left mt-2 inline-flex gap-1">
                <Button2 
                  className={`${!selectedItem?.id ? 'hidden' : 'custom-btn btn-sm bg-cyan-950 text-white hover:bg-cyan-900'}`} 
                  type="reset" 
                  title="Clears the Form to allow new category entry"
                  onClick={() => formReset()}>Reset</Button2>
                <Button2 
                  className='custom-btn btn-sm bg-cyan-950 text-white hover:bg-cyan-800'
                  type="submit">{loading?<SVG icon='spinner' className='animate-spin mr-2 w-4 h-4' />:''}{selectedItem?.id ? 'Update' : 'Create'}</Button2>
              </Form.Footer>
            }
          />          
        </div>
      </div>
    </FormContext.Provider>    
  );
}

export default CategoryForm;