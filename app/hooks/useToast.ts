import { useToastDispatch } from "@/components/toast-provider";
import { MessagePrompt, ToastContextType } from "@/types/common";

const useToast = () => {
  const toastDispatch = useToastDispatch();

  type ShowToastType = {
    alert: MessagePrompt, 
    delay?: number
  }
  const showMessage = ({alert, delay = 3000}: ShowToastType) => {
    toastDispatch({ 
      type: 'add', 
      payload: {
        alert: alert,
        delay: delay
      } as ToastContextType
    });
  }

  return { showMessage };
}

export default useToast;