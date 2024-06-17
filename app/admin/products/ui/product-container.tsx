"use client";

import { useCallback, memo, useRef, useEffect, useState } from 'react';
// import { usePageContext } from "@/admin/contexts/productList";
//import { ACTIONS } from "../../reducers/productListReducer";
//import { PageRange, ProductWithSelection, ProductSorting, SortFields } from '@/types/product';
//import useProductsManager from "@/app/admin/hooks/useProductsManager";
import ProductTable from "./product-table";
import ProductFormFilters from './product-form-filters';
//import ProductItem from '@/components/admin/product/product-item';
//import "./product-list.scss";
//import useUrlParams from '@/hooks/useUrlParams';

import { usePageContext, usePageDispatch } from '@/admin/contexts/productList';
import { Product, SortFields, Sorting } from '@/types/product';
import ProductItem from './product-item';
import ProductModal from './product-modal';

import useProductsList from '../hooks/useProductList';
import Pagination from './pagination';
import useMyPagination from '@/hooks/useMyPagination';
//import useFetchAPI from '@/hooks/useFetchAPI';
//import { Category } from '@/types/category';
//import ProductDetails from './product-details';
//import FormDialog from '@/components/formDialog';


// This is our main component entry, so expect the component to be large and had lots of responsibilities
// we do have an accompanying custom hook which abstracts important logics: [useListProducts]
export default function ProductContainer() {
  //const { data, count: totalProducts, loading, error } = useFetchAPI<Product>('/api/products/');
  // removed from context and create a component for the category dropdown then move code to there. 
  //const { data: categoryList, loading: categoryLoading, error: categoryError } = useFetchAPI<Category>('/api/categories/');
  const pageDispatch = usePageDispatch();
  //const { setUrlParams, redirectTo } = useUrlParams();  
  const pageContext = usePageContext();
  const { items, selectedItem, count, selectedItems, querybles } = pageContext;
  const { pagination, filters, sorting } = querybles;
  const { activePage } = pagination;
  const productsList = useProductsList();  

  // const { items, selectedItem, count, selectedItems, querybles } = usePageContext();
  // used here to add or update querystrings based on user filter or pagination
  // this is our main custom hook which abstracts most the logics, exposing only variables and functions that we need
  //const { contextDispatch: dispatch, productModifiers, products, searchProducts, paginateTo, sortProducts, setUrlParams } = useProductsManager();
  //const { pagination, filters, sorting, selectAll } = productModifiers;
  
  //const sorting: Sorting = { field: 'name', direction: 'asc' };
  const [ selectAll, setSelectAll ] = useState(false);
  
  /*useEffect(() => {
    if(categoryList && categoryList.length > 0) {
        pageDispatch({ type: 'set_field', payload: { fieldName: 'categories', data: categoryList } });
    }
  }, [categoryList]);  */

  useEffect(() => {
    console.log('PAGECONTEXT UPDATED, ', pageContext);
  }, [pageContext]);

  const handleOnGotoPage = useCallback((page: number) => {
    //if(page < 1) page = 1;
    //if(page > Math.ceil(total / itemsPerPage)) page = Math.ceil(total / itemsPerPage);

    pageDispatch({ 
      type: 'set_field', 
      payload: {
        fieldName: 'querybles.pagination.activePage',
        data: page        
        }        
    })
  }, [pageDispatch, querybles, pagination, pageContext]);

  const { totalPage, handleGotoPage } = useMyPagination({ 
    total: count,     
    parentCallback: handleOnGotoPage,
    activePage: pagination.activePage,
    itemsPerPage: pagination.itemsPerPage,
  });

  useEffect(() => {
    console.log('selectedItems: ', selectedItems);
  }, [selectedItems]);
  // EVENT HANDLERS
  /*
  const handleOnCheckAll = useCallback((userSelection: boolean) => {
    dispatch({
      type: ACTIONS.UPDATE_PRODUCT_SELECTIONS,
      payload: {
        userSelection: userSelection,
        selectAll: userSelection,
      }
    });
  }, []);

  type handlerActionsProps = {
    action: string,
    data: string | number | boolean | undefined | PageRange,
    page?: number
  }  
  // Child Components Specific Actions
  const handlerActions = useCallback(({action, data, page}: handlerActionsProps) => {    
    console.log('Actions Handler: ', data);
    switch(action) {
      case "search":
        // when searching, currentPage should be reset for both querystring and on the state
        setUrlParams({currentPage: '', search: data});
        dispatch({
          type: ACTIONS.SEARCH_ACTION, 
          payload: {
            isSearching: true,
            filters: { search: data},
            pagination: { currentPage: 1  }, 
            sorting: sorting
          }
        });
      break;
      case 'paginate':
        paginateTo({ toPage: page?page:1, pageRange: data as PageRange });
      break;
      case 'filter':
        console.log('SELECTED CATEGORY: ', data);
        //clearParams();
        let categoryData = 0;
        if(data) {
          categoryData = parseInt(data.toString());
        }
        setUrlParams({category: data});
        searchProducts(
          {pagination: { currentPage: 1  }, filters: { category: categoryData}, sorting: {}},
        );
      break;
      default:
        // do nothing for now  
    }
    return false;
  }, []); 

  const handleSort = (column: SortFields)  => {
    const newSort: ProductSorting = {
      field: column,
      direction: 'asc'
    }
    
    // check if sort column is the same as the current, we will simply flip the direction
    if(column === sorting.field && sorting.direction === 'asc') {
      newSort.direction = 'desc';
    }

    setUrlParams({direction: newSort.direction, sortBy: newSort.field});

    // when sorted, reset pagination to start at 1
    sortProducts(newSort);
  }

  // declared here instead of inside product-item component to avoid re-creating the function for each item.
  // we also use useCallback since our caller is from another component.
  const handleOnDelete = useCallback((id: number) => {
    dispatch({
      type: ACTIONS.UPDATE_MODAL_STATE,
      payload: {
        dialog: { 
          productId: id, 
          isOpen: true 
        }
      }
    }); 
  }, []);  
  
  */
  const handleOnDelete = useCallback((item: Product) => {
    console.log('selected item: ', item);
    pageDispatch({
      type: 'set_field',
      payload: {
        fieldName: 'selectedItem',
        data: item
      }
    }); 
  }, [pageDispatch]);

  // action handler from a child components (ProductItem)
  const handleOnEdit = (id: number) => {    
    // redirect to form with the id
    redirectTo(`/admin/products/${id}/form/`);
  }

  const handleOnSort = useCallback((column: SortFields)  => {
    const newSort: Sorting = {
      field: column,
      direction: (column === sorting.field && sorting.direction === 'asc') ? 'desc' : 'asc'
    }    
    //setUrlParams({direction: newSort.direction, sortBy: newSort.field}); // update querystring

    // when sorted, reset pagination to start at 1
    //sortProducts(newSort);
    console.log('current sorting: ', sorting);
    querybles.sorting = newSort;
    console.log('new sorting: ', newSort);
    pageDispatch({
      type: 'set_fields',
      payload: {
        querybles: {
          ...querybles,
          sorting: newSort
        }
      }
    });
  }, []);

  const handleOnCheckAll = useCallback((userSelection: boolean) => {
    console.log('SELECT ALL: ', selectAll);
    let newSelectedItems: number[] = [];
    if(userSelection) {
      newSelectedItems = items.reduce((accumulator, item, index) => {
        accumulator[index] = item.id;
        return accumulator
      }, []);
    } 
    pageDispatch({
      type: 'set_field',
      payload: {
        fieldName: 'selectedItems',
        data: newSelectedItems
      }
    });

    setSelectAll(userSelection);
  }, [selectAll, selectedItems, items, pageDispatch]);
  
  const handleOnCheck = useCallback((id: number) => {
    let newSelectedItems = [];
    if((selectedItems.indexOf(id) !== -1)) {      
      newSelectedItems = selectedItems.filter((item) => item !== id); // found
    } else {      
      newSelectedItems = [...selectedItems, id]; // not found
    }    
    pageDispatch({
      type: 'set_field',
      payload: {
        fieldName: 'selectedItems',
        data: newSelectedItems
      }
    });
  }, [selectedItems, pageDispatch]);

  return (
    <>
      <h1>
        Products <a className="btn btn-sm ml-5 self-center" href="/admin/products/0/form"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> Add New</a>
      </h1>      
      <div className="flex flex-row w-full">               
        <div className='product-list w-full'>
          {/*<div style={{textAlign: "right"}}>Total Products: {count}</div>*/}
          <ProductFormFilters />
          
          <ProductTable sorting={sorting} selectAll={selectAll} checkAll={handleOnCheckAll}>   
            {(items && items.length)
              ? items.map((product: Product) => (
                  <ProductItem 
                    key={product.id} 
                    product={product} 
                    isSelected={(selectedItems.indexOf(product.id) !== -1)}
                    onCheck={handleOnCheck} 
                    onEdit={handleOnEdit}
                    onDelete={handleOnDelete}
                  />
                ))
              : <tr className='product-item' key='no-product'>
                  <td className='!text-center' colSpan={6}>No Products Found</td>
                </tr>
            }
          </ProductTable>
          <Pagination 
            previous={<Pagination.Previous icon="chevron-left" className='join-item btn btn-sm' page={activePage - 1} onGotoPage={handleGotoPage} />}
            pages={<Pagination.Pages totalPage={totalPage} className='join-item btn btn-sm' activePage={activePage} onGotoPage={handleGotoPage} />}
            next={<Pagination.Next icon="chevron-right" className='join-item btn btn-sm' page={activePage + 1} onGotoPage={handleGotoPage} />}>
              <></>
          </Pagination>
        </div>        
      </div>      
      {(selectedItem && selectedItem !== null)
        ? <ProductModal />        
        : null
      }
    </>
  )
}
