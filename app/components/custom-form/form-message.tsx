import Alert from "@/components/alert";
import { useFormContext } from "./form-context";
import { MessagePrompt } from "@/types/common";

const FormMessage = ({defaultMessage}: {defaultMessage?: MessagePrompt}) => {
  const { state: { alertPrompt } } = useFormContext();
  let messagePrompt: MessagePrompt | null = (defaultMessage ? defaultMessage : alertPrompt);
  
  console.log('formAlert: ', alertPrompt);
  return (
    <>
      { (messagePrompt && messagePrompt.messageType !== undefined)
        ? <Alert alert={messagePrompt} iconSize="" /> 
        : null 
      }
    </>
  )
}

export default FormMessage;