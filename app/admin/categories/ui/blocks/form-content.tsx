import { useCustomForm, useCustomFormDispatch } from "@/app/admin/contexts/customFormContext";
import usePostAPI from "@/hooks/usePostAPI"
import { Category } from "@/types/category";
import { useEffect } from "react";

type FormContent = {
  children: React.ReactNode,
  onSuccessCallback: () => void
}
const FormContent = ({children, onSuccessCallback}: FormContent) => {
  const { id, useForm: {handleSubmit, reset} } = useCustomForm();
  const dispatch = useCustomFormDispatch();
  const { postResult: data, loading, postRequest } = usePostAPI<Category>('/api/categories/');
  
  useEffect(() => {
    if(data) {
      setTimeout(() => {
      
        console.log('data: ', data);
        dispatch({ type: 'set_fields', payload: {isProcessing: false} });
        switch(data.status){
          case 'success':
          // success
          dispatch({ type: 'set_fields', payload: {alertPrompt: {message: 'Category successfully' + (id ? ' updated' : ' created'), messageType: 'success'} } });
          reset();
          onSuccessCallback();
          break;
          case 'failed':
          case "validationError":
            dispatch({ type: 'set_fields', payload: {alertPrompt: {message: data.message.message, messageType: 'error'} } });
          break;
        }
      }, 100);
    }
  },[data])

  const onSubmit = (values) => {
    console.log('FORM SUBMIT', values);
    dispatch({ type: 'set_fields', payload: {isProcessing: true} });
    postRequest(values, id);
    //setTimeout(() => {  
    //  dispatch({ type: 'set_fields', payload: {isProcessing: false} });
    //  dispatch({ type: 'set_fields', payload: {alertPrompt: {message: 'Category successfully' + (id ? ' updated' : ' created'), messageType: 'success'} } });
    //}, 5000);
  }
  
  return (
    <>
      <form className="text-left" onSubmit={handleSubmit(onSubmit)}>
        { id ? <input type="hidden" value={id} /> : null } 
        {children}
      </form>
    </>
  );
}

export default FormContent;