'use client';
import { useReducer, createContext, useContext, Dispatch } from "react";
import { CategoryContextType } from "@/types/category";
import reducer from '@/admin/reducers/pageReducer';
import { ReducerAction } from "@/types/common";

export const categoryData: CategoryContextType  = {    
  items: [],
  selectedItem: null,
  refreshCounter: 0,
  hierarchedCategories: [],
}

export const CategoryContext = createContext<CategoryContextType>(categoryData);
export const CategoryDispatchContext = createContext<Dispatch<ReducerAction<CategoryContextType>> | null>(null);

export const Provider = ({ initialValue, children }: { initialValue: CategoryContextType, children: React.ReactNode }) => {  
  const [state, dispatch] = useReducer(reducer<CategoryContextType>, initialValue);

  return (
    <CategoryContext.Provider value={state}>
      <CategoryDispatchContext.Provider value={dispatch}>
        {children}
      </CategoryDispatchContext.Provider>
    </CategoryContext.Provider>
  )
}

export const usePageContext = () => {
  const context = useContext(CategoryContext);
  if(!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
}

export const usePageDispatch = () => {
  const context = useContext(CategoryDispatchContext);
  if(!context) {
    throw new Error('useCategoryFormDispatch must be used within a CategoryProvider');
  }
  return context;
} 