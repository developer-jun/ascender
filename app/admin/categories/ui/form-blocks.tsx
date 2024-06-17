import Loader from "@/components/blocks/loader";
import { useCategoryForm, useCategoryFormDispatch } from "../../contexts/categoryFormcontext";
import FormMessagePrompt from "./formMessagePrompt";
import { ReactNode } from 'react';


export const FormTitle = () => {
  const { id } = useCategoryForm();
  return (
    <h2 className="card-title">{ id ? 'Update' : 'New' } Category</h2>
  );
}

export const Message = () => {
  const { alertPrompt } = useCategoryForm();
  return (
    <>
      {alertPrompt && alertPrompt.messageType !== undefined 
        ? <FormMessagePrompt {...alertPrompt} /> :<></> }
    </>
  )
}

export const ParentCategory = () => {
  const { id, parent, dropdownOptions } = useCategoryForm();
  const dispatch = useCategoryFormDispatch();
  console.log('dropdownOptions:', dropdownOptions);
  const handleOnChange = (value: string | number, fieldName: string) => {    
    dispatch({ payload: {[fieldName]: value} });
  }

  return (
    <>
      <div className="field-row">
        <label className="label">
          <span className="label-text">Parent Category</span>
        </label>              
        <select value={parent} onChange={e => handleOnChange(parseInt(e.target.value), 'parent')}>                
          {dropdownOptions && dropdownOptions.map((option, index) => {
              if(option.id !== id) {
                return <option key={index} value={option.id}>{option.name}</option> 
              }
            }
          )}
        </select>
      </div>
    </>
  );
}

export const CategoryName = () => {
  const { name, hasSlugManuallyChanged, categoryUseForm: { register, formState: { errors } }} = useCategoryForm();
  const dispatch = useCategoryFormDispatch();

  const handleOnChange = (value, fieldName) => {
    let payload = {[fieldName]: value}
    if(!hasSlugManuallyChanged) {
      payload = {
        ...payload,
        slug: (typeof value === 'string' ? value.replace(/\s+/g, '-').toLowerCase() : value),
      }
    }
    dispatch({
      type: 'set_fields',      
      payload: payload     
    });
  }

  return (
    <>
      <div className="field-row">
        <label className="label">
          <span className="label-text">Category Name</span>
        </label>
        <input 
          type="text" 
          placeholder="category name"          
          value={name}
          {...register('name', {
            onChange: e=>handleOnChange(e.target.value, 'name')
          })}
          />
        {errors.name && <span className="text-sm text-rose-500">{errors.name.message}</span>}      
      </div>
    </>
  );
}

export const CategorySlug = () => {
  const { slug, name, hasSlugManuallyChanged, categoryUseForm: { register, formState: { errors } } } = useCategoryForm();
  const dispatch = useCategoryFormDispatch();
  const handleOnChange = (value, fieldName) => {
    let payload = {[fieldName]: value};
    if(!hasSlugManuallyChanged) {        
      const slug = value.replace(/\s+/g, '-').toLowerCase(); // generate the slug based on the category name
      payload = {
        [fieldName]: slug,
        ['hasSlugManuallyChanged']: true
      }    
    } else {      
      if(value.trim() === '') {
        payload = { 
          [fieldName]: name.replace(/\s+/g, '-').toLowerCase(), // slug is empty, default to what the category name has
          ['hasSlugManuallyChanged']: false
        }
      } else {
        payload = { [fieldName]: value  }
      }      
    }

    dispatch({
      type: 'set_fields',      
      payload: payload
    });
  }
  
  return (
    <>
      <div className="field-row">
        <label className="label">
          <span className="label-text">Category URL Slug</span>
        </label>
        <input 
          type="text" 
          placeholder="slug"          
          value={slug}
          {...register('slug', {
            onChange: (e)=>handleOnChange(e.target.value, 'slug')
          })} />
        {errors.slug && <span className="text-sm text-rose-500">{errors.slug.message}</span>}      
      </div>
    </>
  );
}

export const CategoryDescription = () => {
  const { description, categoryUseForm: { register, formState: { errors } } } = useCategoryForm();
  const { ref } = register('firstName');
  const dispatch = useCategoryFormDispatch();
  
  return (
    <>
      <div className="field-row">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea 
          placeholder="description"          
          value={description}
          {...register('description', {
            onChange: (e)=>dispatch({ type: 'set_field', payload: {fieldName: 'description', data: e.target.value} })
          })} 
          />
        {errors.description && <span className="text-sm text-rose-500">{errors.description.message}</span>}      
      </div>
    </>
  );
}

export const FormActions = () => {
  const { id } = useCategoryForm();
  const dispatch = useCategoryFormDispatch();

  const handleFormReset = () => {
    dispatch({
      type: 'reset_form'
    });
  }

  return (
    <>
      <div className="field-row text-left">
        <button
          className={`${!id?'hidden':'custom-btn'}`} 
          type="reset" 
          title="Clears the Form to allow new category entry"
          onClick={handleFormReset}>Reset</button>&nbsp;
        <button                 
              type="submit"
              className="custom-btn"
              >{id ? 'Update' : 'Create'}</button>

      </div>
    </>
  );
}

export const FormOverlay = () => {
  const { isProcessing } = useCategoryForm();
  return (
    <>
      {isProcessing && <div className="form-overlay">
        <Loader />
      </div>}
    </>
  );
}


export type Props = {
  children: ReactNode;
};

export function Form({ children }: Props) {
  const { id, useForm: { handleSubmit } } = useCategoryForm();
  const onSubmit = (values) => {
    console.log('FORM SUBMIT', values);
  }
  return  (
    <>
      <form className="text-left" onSubmit={handleSubmit(onSubmit)}>            
        <input type="hidden" value={id} /> 
        {children}
      </form>
    </>
  )
}