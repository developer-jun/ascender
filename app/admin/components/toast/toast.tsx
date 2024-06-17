'use client'

import Alert from "@/components/alert";
import { MessagePrompt } from "@/types/common";
import { useEffect, useState } from "react";

const Toast = ({ message, delay = 3000, onTimeout }: { message: MessagePrompt, delay: number, onTimeout: () => void }) => {
  const [visibility, setVisibility] = useState(true);
  //const [toastList, setToastList] = useState<ToastContextType[] | null>(null);

  useEffect(() => {
    console.log('toast item: ', message);     
    const timer = setTimeout(() => {
      onTimeout();
      setVisibility(false);      
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return visibility && <Alert alert={message} iconSize="" />;
}

export default Toast;