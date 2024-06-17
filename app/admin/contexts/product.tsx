'use client';
import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react";
import { ReducerAction, ContextType } from '@/types/common'
import { ProductContextType } from '@/types/product';
import reducer from '@/admin/reducers/pageReducer';

const PageContext = createContext<ProductContextType | null>(null);
const PageDispatchContext = createContext<Dispatch<ReducerAction<ProductContextType>> | null>(null);

export const Provider = ({
  children,
  initialValue,
}: {
  children: ReactNode;
  initialValue: ProductContextType;
}) => {
  const [state, dispatch] = useReducer(reducer<ProductContextType>, initialValue);
  console.log('default state: ', state);
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