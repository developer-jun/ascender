'use client';
/*
import { useReducer, createContext, useMemo, useContext, Dispatch } from "react";
import { Product, ProductsContextType } from "@/types/product";
// import { reducer as productListReducer, productListInit } from "@/app/admin/reducers/productListReducer";
import reducer from '@/admin/reducers/pageReducer';
import useProductContextShadow from "../hooks/useProductContextShadow";
import useUrlParams from "../hooks/useUrlParams";
import { ReducerAction } from "@/types/common";

const productListHub = (initState: ProductsContextType) => {
  const { getCurrentParams } = useUrlParams();
  const [contextState, dispatch] = useReducer(productListReducer, {defaultParams: initState, urlParams: getCurrentParams()}, productListInit);
  //const [contextState, dispatch] = useReducer(productListReducer, initState);
  console.log('[productContext] ', contextState); 
  //const paginate = usePaginate({itemsPerPage: 5, totalItems: contextState.productModifiers.pagination.totals});
  const shadowData = useProductContextShadow(contextState.items);
  return {
    contextState,
    dispatch,
    shadowData,
  };
};

const ProductsContext = createContext<ProductsContextType | null>(null);
const ProductsDispatchContext = createContext<Dispatch<ReducerAction<ProductsContextType>> | null>(null);


// export const ProductsContext = createContext<ReturnType<typeof productListHub> | null>(null);
export const Provider = ({ initialValue, children }: { 
    initialValue: ProductsContextType, 
    children: React.ReactNode 
  }) => {
    const [state, dispatch] = useReducer(reducer<ProductsContextType>, initialValue);
    // const contextValue = useMemo(() => productListHub(initialValue), []);
    return (
      <ProductsContext.Provider value={state}>
        <ProductsDispatchContext.Provider value={dispatch}>
          {children}
        </ProductsDispatchContext.Provider>
      </ProductsContext.Provider>
    )
}


const useProductContext = () => {
  const context = useContext(ProductsContext);
  if (context === null) throw new Error('useProductContext must be used within a Product Provider tag');

  return context;
}

export default useProductContext;
*/