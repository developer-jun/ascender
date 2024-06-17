import React, { useEffect, useMemo, useReducer } from 'react'
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Option, OptionAndItems, StateProps } from '@/types/option';
import { optionReducer } from '@/app/admin/reducers/optionReducer';
import { getDefaultOptionState, addItemsToOption, updateOption } from '@/actions/optionActions';
import { HIDE_OPTION_FORM, SHOW_OPTION_FORM, UPDATE_OPTION_FIELD, UPDATE_OPTIONS } from '@/constants/options';
import { isEmpty } from '@/utils/helpers';
import Alert from '@/components/blocks/alert';
import useOptionContext from '../../hooks/useOptionContext';

import reducer from "@/app/admin/reducers/commonReducer";
import { CustomFormContext, CustomFormDispatchContext, CustomFormProvider } from '@/app/admin/contexts/customFormContext';
import { CustomFormTypes } from '@/app/admin/components/custom-form/custom-form-types';
import FormContent from '@/app/admin/components/custom-form/form-content';
import FormTitle from '@/app/admin/components/custom-form/form-title';
import FormMessage from '@/app/admin/components/custom-form/form-message';
import FormField from '@/app/admin/components/custom-form/form-field';
import { FormFieldData } from '../../components/custom-form/inputs-data-types';
import Button from '../../components/ui/button';



const formData: CustomFormTypes = {
  id: 0, //used for edit
  alertPrompt: null, // show message prompt (success | error)
  isProcessing: false, // notify form that API call is in progress
  useForm: null, // react-hook-form functionalities
}

const FormSchema: z.ZodType<FormData> = z.object({
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

const initialState: StateProps = {
  option: {
    option_id: 0, 
    option_name: '',
    option_description: '',
  },
  componentStatus: 'init',
  formControl: false, // show / hide the option main form
  form: {
    action: 'standby', // complete, standby, processing
    message: '',
    messageType: undefined,
  }
}

type OptionFormProps = {
  handle: string; // identifier of whose calling it from
  updateParentOfChanges(handle:string, action: string, optionData: OptionAndItems): void,
  formToggle: boolean,
  preSelected: OptionAndItems // There are two instances where this component is used, both adding new OptionGroup and updating existing Option hence it has preselection.
}
export default function OptionGroupForm({handle, updateParentOfChanges, formToggle, preSelected}: OptionFormProps) {
  const formControl: any = useForm<FormData>({
    resolver: zodResolver(FormSchema), // Apply the zodResolver
  });  
  const FieldsData = useMemo (() => ({
    name: {
      label: 'Option Name',
      type: 'text',
      name: 'name',
      placeholder: 'Option  Name',
      //callback: parentCallback,
    },    
    description: {
      label: 'Description',
      type: 'text',
      name: 'description',
      placeholder: 'Description',                
    }
  }), []);
  
  const { item, setOption } = useOptionContext();
  let action = option.option_id ? 'Update' : 'Create';

  // should trigger when user selects an option from the list component
  useEffect(() => {
    console.log('OptionGroupForm useEffect: ', item);
    let localOption = item;
    if(isEmpty(localOption)) {
      console.log('no localOption');
      localOption = {
        option_id: 0, 
        option_name: '',
        option_description: '',
      } as OptionAndItems;
    }
    dispatch({type: 'update_options', payload: localOption});
  }, [item]);

  const processOption = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();    
    
    let optionData: Option = (!isEmpty(preSelected))
      ? option
      : {
          option_name: option.option_name, 
          option_description: option.option_description
        }; // prisma has issue with inserting data while giving it an id of 0, must remove the default option_id attribute

    const createResult = await updateOption({dispatch, optionData})

    if(createResult)      
      updateParentOfChanges(handle, 'create', createResult as OptionAndItems);
    else
      console.error('Option action failed');
  }
  
  // two thing will happen:
  // 1. hide the form
  // 2. notify the parent of the action
  const cancelForm = (e) => {
    e.preventDefault();

    // dispatch({type: 'update_options, payload: {} as OptionAndItems});
    // updateParentOfChanges(handle, 'cancel', {} as OptionAndItems);
    setOption({} as OptionAndItems);
  }

  return (
    <CustomFormProvider initialValue={formData}>
      <div className='option-form-wrap margin-top'>
        <FormContent>
        {/*<form className={`option-form ${form.action}`}><input type="hidden" value={option.option_id} />*/}
          <FormTitle />
          {/*<h2 className="card-title">{ action } Option</h2>*/}
          <FormMessage alertPrompt={state.alertPrompt} />
          {/*{(form && form.action === 'complete')
            && <Alert messageType={form.messageType} message={form.message} />}*/}
          
          <FormField key="name"
            inputData={FieldsData.name as FormFieldData<FormData>}
            label={<FormField.Label />}
            field={<FormField.Input />}
            error={<FormField.Error />}
          />
          {/*<div className="form-fields">
            <div className="field-row">
              <label>Option Name</label>
              <input type="text" value={option.option_name} onChange={e=>dispatch({
                type: UPDATE_OPTION_FIELD, 
                fieldName: 'option_name', 
                payload: e.target.value
              })} />
            </div>*/}
          <FormField key="description"
            inputData={FieldsData.name as FormFieldData<FormData>}
            label={<FormField.Label />}
            field={<FormField.Input />}
            error={<FormField.Error />}
          />
            {/*</FormContent><div className="field-row">
              <label>Option Description</label>
              <textarea value={option.option_description} onChange={e=>dispatch({
                type: UPDATE_OPTION_FIELD, 
                fieldName: 'option_description', 
                payload: e.target.value
              })}></textarea>
            </div>
          </div>*/}
          <div className="text-left inline-flex gap-1">
            <Button 
              className={`${!formData.id?'hidden':'custom-btn'}`} 
              type="reset" 
              title="Clears the Form to allow new category entry"
              onClick={() => reset()}>Reset</Button>
            <Button 
              className='custom-btn'
              type="submit">{formData.id ? 'Update' : 'Create'}</Button>
          </div>            
          <FormField.Loader />

          {/*<div className="buttons">
            <button className="custom-btn" onClick={processOption}>{action} Option</button>
            &nbsp;&nbsp;&nbsp;<button onClick={cancelForm}>Cancel</button>
        </div>*/}
        {/*</form>*/}</div>
        </FormContent>
          {/*: (!isEditing() && <button onClick={(e) => {dispatch({type: SHOW_OPTION_FORM})}}>+ New Option</button>)*/}
        
      </div>
    </CustomFormProvider>
  )
}