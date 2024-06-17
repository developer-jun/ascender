// import { useCategoryForm } from "@/app/admin/contexts/categoryFormcontext";
import Alert from "@/components/ui/alert";
import { MessagePrompt } from "@/types/common";

type FormMessageProps = {
  alertPrompt: MessagePrompt
}
const FormMessage = ({ alertPrompt }: FormMessageProps) => {
  // const { alertPrompt } = useCustomForm();
  console.log('alertPrompt: ', alertPrompt);
  return (
    <>
      {alertPrompt && alertPrompt.messageType !== undefined 
        ? <Alert {...alertPrompt} /> :<></> }
    </>
  )
}

export default FormMessage;