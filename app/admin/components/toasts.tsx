import { useToastContext, useToastDispatch } from "@/components/toast-provider";
import { useEffect, useState } from "react";
import { MessagePrompt } from "@/types/common";
import Alert from "@/components/alert";

const Toasts = () => {
  const toasts = useToastContext();
  const toastDispatch = useToastDispatch();

  return (
    <div className="toast-container toast toast-end">
      {toasts.map((toast, index) => (
        <Toast key={index} message={toast.alert} delay={toast.delay} onTimeout={() => toastDispatch({ type: 'remove', payload: index })} />
      ))}
    </div>
  );
};

const Toast = ({ message, delay = 3000, onTimeout }: { message: MessagePrompt, delay: number, onTimeout: () => void }) => {
  const [visibility, setVisibility] = useState(true);

  useEffect(() => {
    console.log('toast item: ', message, delay);     
    const timer = setTimeout(() => {
      onTimeout(); // remove from context
      setVisibility(false); // hide the message
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return visibility && <Alert alert={message} iconSize="" />;
}

export default Toasts;