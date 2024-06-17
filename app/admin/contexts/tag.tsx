'use client';
import { useReducer, createContext, useContext, Dispatch } from "react";
import reducer from '@/admin/reducers/pageReducer';
import { ContextType, ReducerAction } from "@/types/common";
import { Tag } from "@/types/tag";

export const tagData: ContextType<Tag>  = {    
  items: [],
  selectedItem: null,
  refreshCounter: 0,
}

export const TagContext = createContext<ContextType<Tag>>(tagData);
export const TagDispatchContext = createContext<Dispatch<ReducerAction<ContextType<Tag>>> | null>(null);

export const Provider = ({ initialValue, children }: { initialValue: ContextType<Tag>, children: React.ReactNode }) => {  
  const [state, dispatch] = useReducer(reducer<ContextType<Tag>>, initialValue);

  return (
    <TagContext.Provider value={state}>
      <TagDispatchContext.Provider value={dispatch}>
        {children}
      </TagDispatchContext.Provider>
    </TagContext.Provider>
  )
}

export const usePageContext = () => {
  const context = useContext(TagContext);
  if(!context) {
    throw new Error('useTagContext must be used within a TagProvider');
  }
  return context;
}

export const usePageDispatch = () => {
  const context = useContext(TagDispatchContext);
  if(!context) {
    throw new Error('useTagFormDispatch must be used within a TagProvider');
  }
  return context;
} 