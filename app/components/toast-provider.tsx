'use client'

import { MessagePrompt, ToastContextType } from "@/types/common";
import { Dispatch, createContext, useContext, useReducer } from "react";

type ToastReducerAction = | {
  type: 'add',
  payload: ToastContextType
} | {
  type: 'remove',
  payload: number
}
const reducer = (state: ToastContextType[], action: ToastReducerAction) => {
  switch(action.type) {
    case 'add':
      return [
        ...state,
        action.payload
      ]
    case 'remove':
      if(state && state.length > 0) {
        return state.filter((_, index) => index !== action.payload);  
      }      
    default:
      return state;
  }
}

export const ToastContext = createContext<ToastContextType[] | null>(null);
export const ToastDispatchContext = createContext<Dispatch<ToastReducerAction> | null>(null);

const initialToasts = [
  // { id: 1, alert: { messageType: 'success', message: 'Successfully Created'} },  
];

type ToastProviderType = {
  children: React.ReactNode
}
const ToastProvider = ({children}: ToastProviderType) => {
  const [ toasts, dispatch ] = useReducer(reducer, []);
  console.log('toast provider: ', toasts);
  
  return (
    <ToastContext.Provider value={toasts}>
      <ToastDispatchContext.Provider value={dispatch}>
        {children}
      </ToastDispatchContext.Provider>
    </ToastContext.Provider>
  )
}

export default ToastProvider;

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if(!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  console.log('toast context: ', context);
  return context;
}

export const useToastDispatch = () => {
  const context = useContext(ToastDispatchContext);
  if(!context) {
    throw new Error('useToastDispatch must be used within a ToastDispatchProvider');
  }

  return context;
}