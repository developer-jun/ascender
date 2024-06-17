'use client';
import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react";
import { ReducerAction, ContextType } from '@/types/common'
import reducer from '@/admin/reducers/pageReducer';
import { ProductsContextType } from "@/types/product";

const PageContext = createContext<ProductsContextType | null>(null);
const PageDispatchContext = createContext<Dispatch<ReducerAction<ProductsContextType>> | null>(null);

export const Provider = ({
  children,
  initialValue,
}: {
  children: ReactNode;
  initialValue: ProductsContextType;
}) => {
  const [state, dispatch] = useReducer(reducer<ProductsContextType>, initialValue);

  return (
    <PageContext.Provider value={state}>
      <PageDispatchContext.Provider value={dispatch}>
        {children}
      </PageDispatchContext.Provider>
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);

  if(!context) {
    throw new Error('useProductFormContext must be used within a ProductFormContext');
  }
  
  return context;
}

export const usePageDispatch = () => {
  const context = useContext(PageDispatchContext);

  if(!context) {
    throw new Error('useProductFormDispatch must be used within a ProductFormDispatchContext');
  }

  return context;
}

//export default OptionContext;