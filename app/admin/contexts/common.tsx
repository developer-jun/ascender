'use client';
import { useReducer, createContext, useContext, Dispatch } from "react";


import { ContextType,  } from "@/types/common";
import { reducer, ReducerAction } from "@/admin/reducers/common";

export const CommonContext = createContext<any | null>(null);
export const CommonDispatchContext = createContext<Dispatch<ReducerAction<unknown, unknown>> | null>(null);
export const Provider = ({ initialValue, children }: { initialValue: ContextType<unknown>, children: React.ReactNode }) => {  
  const [state, dispatch] = useReducer(reducer<typeof initialValue, ReducerAction<unknown, unknown>>, initialValue);

  return (
    <CommonContext.Provider value={state}>
      <CommonDispatchContext.Provider value={dispatch}>
        {children}
      </CommonDispatchContext.Provider>
    </CommonContext.Provider>
  )
}

export const usePageContext = () => {
  const context = useContext(CommonContext);
  if(!context) {
    throw new Error('useCategoryContext must be used within a CommonProvider');
  }
  return context;
}

export const usePageDispatch = () => {
  const context = useContext(CommonDispatchContext);
  if(!context) {
    throw new Error('useCategoryFormDispatch must be used within a CommonProvider');
  }
  return context;
} 