import { ReactNode, memo } from "react";
import { useFormContext } from "./form-context";

type FormContentProps = {
  title: ReactNode,
  messages: ReactNode,
  children: ReactNode,
  onSuccessCallback: (values: any) => void,
}
const Form = ({title, messages, children, onSuccessCallback}: FormContentProps) => {
  const { state: { useForm: {handleSubmit} } } = useFormContext();
  
  return (
    <>
      <form className="text-left" onSubmit={handleSubmit(onSuccessCallback)}>
        {title}
        {messages}
        {children}
      </form>
    </>
  );
}

//export default Form;

const MemoizedForm = ( memo( Form) )
export { MemoizedForm as Form }