import { HTMLAttributes, ReactNode } from "react";
import { useFormContext } from "./form-context";
import FormLoader from "@/components/custom-form/form-loader";
import { cn } from "@/utils/helpers";

type FormContentProps = {
  onSuccessCallback: (values: any) => void,
  header: ReactNode,
  fields: ReactNode,
  footer: ReactNode
}
const Form = ({onSuccessCallback, header, fields, footer}: FormContentProps) => {
  const { state: { useForm: { handleSubmit } } } = useFormContext();
  
  return (
    <form className="text-left" onSubmit={handleSubmit(onSuccessCallback)}>
      {header}
      {fields}
      {footer}
      <FormLoader />     
    </form>     
  );
}

const Header: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...restProps }) => {
  return (
    <div className={cn("form-header", className)} {...restProps}>
      {children}
    </div>
  )
}

const Fields: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...restProps }) => {
  return (
    <div className={cn("form-fields", className)} {...restProps}>
      {children}
    </div>
  )
}

const Footer: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...restProps }) => {
  return (
    <div className={cn("form-footer", className)} {...restProps}>
      {children}
    </div>
  )
}

//export default Form;

// memoize will cause the Header, Fields and Footer to not exists
//const MemoizedFormHeader = ( memo( Header) )
//const MemoizedFormFields = ( memo( Fields) )
//const MemoizedFormFooter = ( memo( Footer) )

Form.Header = Header;
Form.Fields = Fields;
Form.Footer = Footer;

// const MemoizedForm = ( memo( Form) )
export { 
  Form
  //MemoizedForm as Form, 
  /*MemoizedFormFields as FormFields, 
  MemoizedFormHeader as FormHeader,
  MemoizedFormFooter as FormFooter*/
}