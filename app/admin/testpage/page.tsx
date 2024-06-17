'use client'

import { useToastDispatch, ToastContextType } from "@/components/toast-provider";
import { MessagePrompt } from "@/types/common";
import { useEffect } from "react";

const TestPage = () => {
  const dispatch = useToastDispatch();

  useEffect(() => {
    for(let i = 1; i <= 10; i++) {    
      let delay = i * (Math.floor(Math.random() * 10) * 1000);
      dispatch({ type: 'add', payload: {
        delay: delay,
        alert: {
          messageType: "success",
          message: "Test success message " + delay,
        } as MessagePrompt} as ToastContextType
      });
    }
  }, []);
  

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  )
}

export default TestPage;