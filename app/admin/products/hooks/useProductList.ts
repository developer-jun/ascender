import { useEffect, useMemo, useRef } from 'react';
import { Product, Querybles, SortFields, Sorting } from '@/types/product';
import { usePageContext, usePageDispatch } from '@/admin/contexts/productList';

import useFetchRequest from '@/hooks/useFetchRequest';
import useUrlParams from '@/hooks/useUrlParams';
import { buildQueryString } from '@/utils/productHelper';

const useProductsList = () => {
  const { data, count: resultCount, fetchRequest, fetchCounter } = useFetchRequest<Product, unknown>('/api/products');
  const pageContext = usePageContext();
  //const { items, selectedItem, count, selectedItems, querybles } = pageContext;
  const { updateUrl } = useUrlParams('/admin/products');
  const pageDispatch = usePageDispatch();
  const qStringRef = useRef('');
  
  const urlQueryString = useMemo(() => {
    return buildQueryString(pageContext.querybles)
  }, [pageContext]);

  useEffect(() => {    
    //let fetchUrl = buildQueryString(querybles);
    console.log(qStringRef.current,'===',urlQueryString);
    if(qStringRef.current !== urlQueryString) {
      
      if(qStringRef.current === '') {
        qStringRef.current = urlQueryString;
      } else {
        qStringRef.current = urlQueryString;
        console.log('FETCHING URL: ', urlQueryString);
        fetchRequest({fetchUrl: '?' + urlQueryString, method: 'GET', data:{}});
        updateUrl(urlQueryString);
      }
    }
  }, [urlQueryString]);

  // listen to changes to querybles, so that we can refresh the query
  // using querybles as the dependency seems to be not a good idea due to the fact that the whole context object changes on every reducer changes as well.
  /*useEffect(() => {    
    console.log('QUERYBLES has been modified')
    let fetchUrl = buildQueryString(pageContext.querybles);
    if(qStringRef.current !== fetchUrl) {
      console.log(qStringRef.current,'===',fetchUrl);
      if(qStringRef.current === '') {
        qStringRef.current = fetchUrl;
      } else {
        qStringRef.current = fetchUrl;
        console.log('FETCHING URL 2: ', fetchUrl);
        fetchRequest({fetchUrl: '?' + fetchUrl, method: 'GET', data:{}});
      }
    }
  }, [pageContext.querybles]);*/

  // listen to when API has return a result
  useEffect(()=> {
    // this should prevent triggering from the init
    if(fetchCounter > 0) {
      console.log('FETCHING RESULTS: ', data);
      if(data?.status === 'success') {
        pageDispatch({
          type: 'set_fields',
          payload: {
            ...pageContext,
            items: data.data as Product[],
            count: resultCount
          }
        });
      }
    }
  }, [data, resultCount, fetchCounter]);

  //+ memoed, no need to recreate every re-render unless user desired it via in response to an event.
  //const urlQueryString = useMemo(() => {
  //  return buildQueryString(querybles)
  //}, [querybles]);
  

  const updateProductsSelections = (products: Product[], isSelected:boolean = false)
    : Product[] => {
    const updatedProducts = products.map(
      product => ({
      ...product,
      isSelected: isSelected,
    }));
    console.log('updatedProducts:',updatedProducts);
    return updatedProducts;
  }
  return {
    updateProductsSelections
  }
}

export default useProductsList;