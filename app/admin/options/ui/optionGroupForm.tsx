import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

//import { optionReducer } from '@/app/admin/reducers/optionReducer';
//import { getDefaultOptionState, addItemsToOption, updateOption } from '@/actions/optionActions';
//import { HIDE_OPTION_FORM, SHOW_OPTION_FORM, UPDATE_OPTION_FIELD, UPDATE_OPTIONS } from '@/constants/options';
//import { isEmpty } from '@/utils/helpers';
//import Alert from '@/components/blocks/alert';

//import reducer from "@/app/admin/reducers/commonReducer";
import { usePageContext, usePageDispatch } from '@/admin/contexts/option';
import { FormState, MessagePrompt, OptionItemsContextType, ToastContextType } from '@/types/common';

import { FormContext } from "@/components/custom-form/form-context";
import { Form } from "@/components/custom-form/form";

import { FormFieldAttribute } from "@/components/custom-form/inputs-data-types"
import { Button2 } from '@/components/button';
import { Option, OptionAndItems } from '@/types/option';
import { useToastDispatch } from "@/components/toast-provider";
import reducer from "@/reducers/customFormReducer";
import FormTitle from '@/components/custom-form/form-title';
import FormMessage from '@/components/custom-form/form-message';
import FormField from '@/components/custom-form/form-field';
import FormLoader from '@/components/custom-form/form-loader';
import usePostAPI from "@/hooks/usePostAPI"
import useOptionGroupForm from '../hooks/useOptionGroupForm';

const OptionGroupForm = () => {
  // <CUSTOM hook INITS>
  const { formFieldsInfo, formData } = useOptionGroupForm(); // Form Code Abstraction 
  const [ state, formDispatch ] = useReducer(reducer<FormState>, formData);
  const { useForm: { reset, clearErrors, setError }, alertPrompt } = formData;
  const contextValues = useMemo(() => ({ 
    state, 
    formDispatch 
  }), [state, formDispatch]);
  const { postResult, postRequest } = usePostAPI<Option>(formData.submissionUrl);
  const toastDispatch = useToastDispatch();


  const pageContext = usePageContext();
  const { selectedItem, refreshCounter } = pageContext;
  const pageDispatch = usePageDispatch();  
  
  

  // </LOCAL VARIABLES>

  // TRIGGERS when user selects an option from the list
  useEffect(() => {
    console.log('OPTION CONTEXT: ', selectedItem);
    if(selectedItem) {
      // clear any alert prompt messages if there's any
      if(alertPrompt) {
        formDispatch({ 
          type: 'set_field', 
          payload: {
            fieldName: 'alertPrompt', 
            data: null 
          } 
        });
      }

      reset({
        option_id: selectedItem?.option_id,
        option_name: selectedItem?.option_name,
        option_description: selectedItem?.option_description,
      });
    } else {
      console.log('selectedItem empty');
      reset({option_id: '', option_name: '', option_description: ''}); // reset form values
    }
    // dispatch({type: 'update_options', payload: localOption});
  }, [selectedItem]);

  // listen to form post results
  useEffect(() => {  
    if(postResult) {
      const { status } = postResult;              
      formDispatch({ 
        type: 'set_field', 
        payload: {
          fieldName: 'isProcessing',
          data: false
        } 
      });
      
      switch(status){
        case 'success':
          toastDispatch({ 
            type: 'add', 
            payload: {
              alert: { message: 'Successfully' + (selectedItem?.option_id ? ' updated' : ' created'), messageType: 'success' }
            } as ToastContextType
          });
          reset({option_id: '', option_name: '', option_description: ''}); // reset form values
          pageDispatch({ 
            type: 'set_fields', 
            payload: {
              selectedItem: null,
              refreshCounter: (refreshCounter ? refreshCounter : 0) + 1
            }
          });
        break;
        case 'failed':
          formDispatch({ 
            type: 'set_field', 
            payload: {
              fieldName: 'alertPrompt',
              data: postResult.prompt
            }
          });
        break;
        case "validationError":
          console.log(postResult.fields);
          // need to set the validation errors back to each field.
          if(postResult.fields.length) {
            clearErrors(['option_name', 'option_description']);
            postResult.fields.forEach(field => {
              console.log(field);
              setError(field.field, {type: 'custom', message: field.message});
            });
          }
          formDispatch({ 
            type: 'set_fields', 
            payload: {
              fieldName: 'alertPrompt',
              data: {
                message: 'Server Validation Error',
                messageType: 'error'
              } as MessagePrompt
            }
          });
        break;
      }      
    }
  },[postResult]);

  const handleFormReset = () => {
    pageDispatch({
      type: 'set_fields', 
      payload: {
        selectedItem: {} as Option,
      } as Partial<OptionItemsContextType> 
    });   
    reset();
  }
  
  const handleFormSubmit = useCallback((formValues: any) => { 
    console.log('FORM SUBMIT', formValues);
    formDispatch({ 
      type: 'set_field', 
      payload: {
        fieldName: 'isProcessing',
        data: true
      } 
    });
    let postData = formValues;
    if(selectedItem && selectedItem?.option_id) {
      postData.id = selectedItem?.option_id;
    }
    console.log('selectedItem: ', selectedItem);
    console.log('POSTING TO SERVER: ', postData);
    postRequest(postData); // let the custom hook do it's thing, listen for the response result on the useEffect  
  }, [selectedItem]);
  
  return (    
    <FormContext.Provider value={contextValues}>
      <div data-theme="nord" id="category-form" className="relative flex flex-col place-items-center custom-form p-5 rounded-md bg-gray-300 shadow-xl shadow-slate-950">
        <div className="p-3 w-full items-center text-center">
          <Form 
            onSuccessCallback={handleFormSubmit}           
            header={
              <Form.Header>
                <FormTitle className="font-bold text-xl text-center">Option Form</FormTitle>
                <FormMessage />
              </Form.Header>
            }
            fields={
              <Form.Fields>
                <FormField key="id"
                  inputData={formFieldsInfo.option_id as FormFieldAttribute<FormData>}
                  label={''}
                  field={<FormField.Input />}
                  error={''}
                />  

                <FormField key="option_name"
                  inputData={formFieldsInfo.option_name as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Input />}
                  error={<FormField.Error />}
                />

                <FormField key="option_description"
                  inputData={formFieldsInfo.option_description as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Textarea />}
                  error={<FormField.Error />}
                />
                <FormLoader />
              </Form.Fields>
            }
            footer={
              <Form.Footer className="mt-2 flex justify-end gap-1">
                <Button2 
                  className={`${!selectedItem?.option_id ? 'hidden' : 'btn-sm bg-slate-500 text-white hover:bg-cyan-900'}`} 
                  type="reset" 
                  title="Clears the Form to allow new category entry"
                  onClick={() => handleFormReset()}>Reset</Button2>
                <Button2 
                  className='btn-sm bg-cyan-950 text-white hover:bg-cyan-800'
                  type="submit">{selectedItem?.option_id ? 'Update' : 'Create'}</Button2>
              </Form.Footer>
            }
          />       
        </div>
      </div>

    </FormContext.Provider>
  )
}

export default OptionGroupForm;