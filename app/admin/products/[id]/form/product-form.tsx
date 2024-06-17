"use client"

import "./product-form.scss";
import "@uploadthing/react/styles.css";
import { useReducer, useMemo, useEffect, useCallback } from "react"
import { Product } from "@/types/product"
import { FormState } from "@/types/common"
import { ProductContextType } from "@/types/product";
import { FormContext } from "@/components/custom-form/form-context";
import { FormFieldAttribute } from "@/components/custom-form/inputs-data-types";
import { Button2 } from "@/components/button";
import { usePageContext, usePageDispatch } from "@/admin/contexts/product";
import { Form } from "@/components/custom-form/form";
import useToast from "@/hooks/useToast";
import usePostAPI from "@/hooks/usePostAPI";
import FormTitle from "@/components/custom-form/form-title";
import FormField from "@/components/custom-form/form-field";
import reducer from "@/reducers/customFormReducer";
import useProductForm from "../../hooks/useProductForm";
import FormMessage from "@/components/custom-form/form-message";

export default function ProductForm() {
  //const formRef = useRef<HTMLFormElement | null>(null); // needed to scroll the user back to the top of the form.
  
  // <LOCAL VARIABLES>  
  const { showMessage } = useToast();
  const { formFieldsInfo, formData } = useProductForm(); // Form Code Abstraction  
  const pageDispatch = usePageDispatch();
  const { selectedItem } = usePageContext();
  const [ state, formDispatch ] = useReducer(reducer<FormState>, formData);
  const contextValues = useMemo(() => ({ 
    state, 
    formDispatch 
  }), [state, formDispatch]); // formData
  const { postResult, postRequest } = usePostAPI<Product>(formData.submissionUrl);
  console.log('[ProductForm] selectedItem: ', selectedItem);
  useEffect(() => {
    
    if(postResult) {
      console.log('postResult: ', postResult);
      let results: Partial<FormState> = {
        isProcessing: false,
      }
      if(postResult.status === 'success') {
        results['alertPrompt'] = {
          message: 'Product successfully' + (postResult.data.id ? ' updated' : ' created'),
          messageType: 'success'          
        }
        showMessage({
          alert: {
            message: 'Successfully  created', 
            messageType: 'success' 
          }
        });        
        pageDispatch({ type:'set_field', payload: { fieldName: 'items', data: [] } });
      } else if(postResult.status === 'failed') {
        results['alertPrompt'] = postResult.prompt;
        showMessage({ alert: postResult.prompt });
      } else {
        console.log(postResult.fields);
        // need to set the validation errors back to each field.
        if(postResult.fields.length) {
          formData.useForm.clearErrors(['option_name', 'option_description']);
          postResult.fields.forEach(field => {
            console.log(field);
            formData.useForm.setError(field.field, {type: 'custom', message: field.message});
          });
        }

        results['alertPrompt'] = {
          message: 'Server Validation Error',
          messageType: 'error'
        };
        showMessage({ alert: results['alertPrompt'] });
      }
      
      const timer = setTimeout(() => {
        formDispatch({
          type: 'set_fields',
          payload: results
        });
        formData.useForm.reset();
        // for our urlImage, we need to set it to a specific value so that internally it knows the form has been resetted
        // it needs to reset it's internal state as well
        formData.useForm.setValue('imageUrl', 'reset');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [postResult]);

  // The advantage of having the server submit here is that, we directly format and passed the form data object as what it really is and not assumed a generic object.
  // the server is expecting a product type object hence we manually created the product object as the parameter.
  const handleFormSubmit = useCallback((values: any) => {
    formDispatch({
      type: 'set_field',
      payload: {fieldName: 'isProcessing', data: true}
    });
    console.log('handleFormSubmit: ', values);
    //return;
    postRequest({
      id: values?.id,
      name: values?.name,
      slug: values?.slug,
      sku: values?.sku,
      summary: values?.summary,
      description: values?.description,
      imageUrl: values?.imageUrl,
      thumbUrl: values?.imageUrl,
      price: parseFloat(values?.price),
      inStock: 'INSTOCK',
      published: true,
      category: values?.category
    });    
  }, []); 

  const handleFormReset = () => {
    pageDispatch({
      type: 'set_fields', 
      payload: {
        selectedItem: {} as Product,
      } as Partial<ProductContextType> 
    });   
    reset();
  }

  return (
    <FormContext.Provider value={contextValues}>
      <div data-theme="nord" id="category-form" className="relative flex flex-col place-items-center custom-form p-5 rounded-md bg-gray-300 shadow-xl shadow-slate-950">
        <div className="p-3 w-full items-center">
          <Form onSuccessCallback={handleFormSubmit}           
            header={
              <Form.Header>
                <FormTitle className="font-bold text-xl text-center">Product Form</FormTitle>
                <FormMessage />
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

                <FormField key="category"
                  inputData={formFieldsInfo.category as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Select />}
                  error={<FormField.Error />}
                />
                
                <FormField key="imageUrl"
                  inputData={formFieldsInfo.imageUrl as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.ImageUpload />}
                  error={<FormField.Error />}
                />

                <FormField key="price"
                  inputData={formFieldsInfo.price as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Input />}
                  error={<FormField.Error />}
                />

                <FormField key="sku"
                  inputData={formFieldsInfo.sku as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Input />}
                  error={<FormField.Error />}
                />

                <FormField key="summary"
                  inputData={formFieldsInfo.summary as FormFieldAttribute<FormData>}
                  label={<FormField.Label />}
                  field={<FormField.Textarea />}
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
              <Form.Footer className="text-right mt-3">
                <Button2 
                  className={`${!selectedItem?.id ? 'hidden' : 'btn-sm bg-slate-500 text-white hover:bg-cyan-900'}`} 
                  type="reset" 
                  title="Clears the Form to allow new category entry"
                  onClick={() => handleFormReset()}>Reset</Button2>
                <Button2 
                  className='btn-sm bg-cyan-950 text-white hover:bg-cyan-800'
                  type="submit">{selectedItem?.id ? 'Update' : 'Create'}</Button2>
              </Form.Footer>                        
            }
          />
        </div>
      </div>
    </FormContext.Provider>
  );
}