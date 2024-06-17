'use client';
import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react";
import { ReducerAction, ContextType, OptionContextType, OptionItemsContextType } from '@/types/common'
import { OptionAndItems, OptionItem } from "@/types/option";
import reducer from '@/admin/reducers/pageReducer';
import { generateContext, generateDispatchContext } from "./myContexts";

export const optionData: OptionItemsContextType = {
  items: [], // list of options
  selectedItem: null, // option to be edited
  refreshCounter: 0,
  selectedOptionItem: {} as OptionItem, // edit Items of an Option
  formToggle: false, 
  deleteOption: undefined // selected option to be deleted, displayed in the delete modal for confirmation
}

const OptionContext = createContext<OptionContextType>(optionData);
const OptionDispatchContext = createContext<Dispatch<ReducerAction<OptionContextType>> | null>(null);

// const PageContext = createContext<ProductContextType | null>(null);
//const OptionDispatchContext = createContext<Dispatch<ReducerAction<OptionContextType>> | null>(null);

export const Provider = ({
  children,
  initialValue,
}: {
  children: ReactNode;
  initialValue: OptionContextType;
}) => {
  const [state, dispatch] = useReducer(reducer<OptionContextType>, initialValue);

  return (
    <OptionContext.Provider value={state}>
      <OptionDispatchContext.Provider value={dispatch}>
        {children}
      </OptionDispatchContext.Provider>
    </OptionContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(OptionContext);

  if(!context) {
    throw new Error('useOptionContext must be used within a OptionContext');
  }
  
  return context;
}

export const usePageDispatch = () => {
  const context = useContext(OptionDispatchContext);

  if(!context) {
    throw new Error('OptionDispatchContext must be used within a OptionDispatchContextProvider');
  }

  return context;
}

//export default OptionContext;