'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Category, DropdownOption } from '@/types/category';
import { createDropdownOptions, createHierarchy } from "@/utils/category";
import { usePageContext, usePageDispatch } from "@/admin/contexts/productList";
import { SVG } from '@/components/svg';
import useMyPagination from '@/hooks/useMyPagination';
import Pagination from './pagination';
import useFetchAPI from '@/hooks/useFetchAPI';

//import useCategories from "../../hooks/useCategories";

//import useProductContext from '../hooks/useProductsContext';
//import { ACTIONS } from '../../reducers/productListReducer';

//import { usePagination } from '@/hooks/usePagination';



/*type ProductFormFiltersPropTypes = {
  dispatchAction: ({action, data, page}: {action : string, data: string | number | PageRange, page?: number | null}) => void; 
  pagination: Pagination;
  filters: ProductFilter;
  //categoryList: Category[];
}*/

//import {Paginate, PageRange, Pagination, ProductFilter, Sorting} from '@/types/product';
//import { createHierarchy, createDropdownOptions } from "@/app/admin/utils/categoryHelpers";

const ProductFormFilters = () => {
  // const { data: categories, loading: categoryLoading, error: categoryError } = useFetchAPI<Category>('/api/categories/');
  
  //const {categories} = useCategories(); // localized since it's only ever used in this component
  // all the forms controls here are manage by a single reducer state.
  // since all the controls are event driven, we can simply call a props function and pass the reducer state along with it.
  const pageDispatch = usePageDispatch();
  const productContext = usePageContext();  
  const { querybles, count } = productContext;  
  const { filters, pagination } = querybles;
  const { activePage, itemsPerPage } = pagination;
  const bulkActionRef = useRef<HTMLSelectElement>(null);
  // keep track of the selected category
  // remove
  const [ categoryFilter, setCategoryFilter ] = useState<string>(filters.category ? filters.category.toString() : '0');
  const handleOnGotoPage = useCallback((page: number) => {
    //if(page < 1) page = 1;
    //if(page > Math.ceil(total / itemsPerPage)) page = Math.ceil(total / itemsPerPage);

    /*pageDispatch({ 
      type: 'set_fields', 
      payload: {
        ...productContext,
        querybles: {
          ...querybles,
          pagination: {
            ...pagination,
            activePage: page
          }
        }        
      }
    })*/
    pageDispatch({ 
      type: 'set_field', 
      payload: {
        fieldName: 'querybles.pagination.activePage',
        data: page        
        }        
    })
  }, [pageDispatch, querybles, pagination, productContext]);

  const { totalPage, handleGotoPage } = useMyPagination({ 
    total: count,     
    parentCallback: handleOnGotoPage,
    activePage,
    itemsPerPage
  });
  // const pagination = usePagination({ total: count, page, onChange});
  // const paginate = usePagination({itemsPerPage: 5, totalItems: productModifiers.pagination.totals});
  //const searchRef = useRef(null);
  const categoryFilterRef = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null); 
 
  const handleOnFilter = (e) => {
    e.preventDefault();
    let category = categoryFilter ? categoryFilter : 0;    
    console.log('filter event: ',category);
    dispatchAction({action: 'filter', data: category});
    
  }

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(searchRef.current) {      
      pageDispatch({ 
        type: 'set_fields', 
        payload: {
          ...productContext,
          querybles: {
            ...querybles,
            pagination: {
              ...pagination,
              activePage: 1
            },
            filters: {
              ...filters,
              search: searchRef.current.value.trim()
            }
          }        
        }
      })
    }       
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {    
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter key pressed');
      pageDispatch({ 
        type: 'set_fields', 
        payload: {
          ...productContext,
          querybles: {
            ...querybles,
            pagination: {
              ...pagination,
              activePage: 1
            },
            filters: {
              ...filters,
              search: (searchRef.current) ? searchRef.current.value.trim() : ''
            }
          }        
        }
      })      
    }
  }

  const handleFilter = (e) => {
    e.preventDefault();
    let category = 0;
    if(categoryFilterRef.current)
      category = categoryFilterRef.current;
    
    // need to reset pagination
    pageDispatch({
      type: 'set_fields',
      payload: {
        ...productContext,
        querybles: {
          ...querybles,
          pagination: {
            ...pagination,
            activePage: 1
          },
          filters: {
            ...filters,
            category: category
          }
        }        
      }
    }); 
    console.log('filter event: ',category);
  }

  const handleBulkAction = (e) => {
    e.preventDefault();

    console.log("bulkActionRef: ", bulkActionRef.current.value);
    dispatchAction('bulk', bulkActionRef.current.value);
  }


  const handleOnSelect = useCallback((categoryId: number) => {
    categoryFilterRef.current = categoryId;
    console.log('cat ref:', categoryFilterRef.current);    
    // dispatchAction('filter', searchRef.current.value);
    pageDispatch({
      type: 'set_fields',
      payload: {
        ...productContext,
        querybles: {
          ...querybles,
          pagination: {
            ...pagination,
            activePage: 1
          },
          filters: {
            ...filters,
            category: categoryId
          }
        }        
      }
    });
  }, []);

  const handleOnSelectChange = (e) => {
    // STEPS TO DO WHEN CATEGORY IS SELECTED
    // 1. We should update the context state
    //   - from there, we could either filter the existing data cache or query the server using our category filter.
    setCategoryFilter(e.target.value);
    //categoryFilter.current = e.target.value;
    console.log('Category selected:', e.target.value);
    console.log('cat ref:', categoryFilter);
    dispatchAction('filter', searchRef.current.value);
  }

  return (
    <div className='flex justify-between'>
      <div className='align-baseline'>      
        <div className='flex mt-3'>
          <div className='inline-flex gap-x-1 divide-x divide-solid text-sm'>
            <a className='px-1' href='#'>All</a>
            <a className='px-1' href='#'>Published</a>
            <a className='px-1' href='#'>Drafted</a>
            <a className='px-1' href='#'>Trashed</a>
          </div>
        </div>
        <div className="flex gap-x-5 align-middle">            
          <Pagination 
            previous={<Pagination.Previous icon="chevron-left" className='' page={activePage - 1} onGotoPage={handleGotoPage} />}
            pages={''}
            next={<Pagination.Next icon="chevron-right" className='' page={activePage + 1} onGotoPage={handleGotoPage} />}>
              <Pager activePage={activePage} totalPage={totalPage}/>
          </Pagination>
          <div className="text-sm py-1">Total Record{count>1?'(s)':''} Found: {count}</div>
        </div>
      </div>
      <div className="product-header-groups">
        <div className="pagination-search">
          <div className="flex gap-x-2">          
            <div className="filters inline-flex">              
              <CategoryList onSelect={handleOnSelect} />
              <button className="inline-flex align-middle bg-black p-2 rounded-r-lg" onClick={handleFilter}>Filter</button>
            </div>
            {/*<div className="bulk-actions inline-flex">
              <select className='rounded-l-lg' ref={bulkActionRef}>
                <option value="">Bulk Actions</option>
                <option value="trash">Move to Trash</option>
                <option value="draft">Move to Draft</option>
              </select>
              <button className="inline-flex align-middle bg-black p-2 rounded-r-lg" onClick={handleBulkAction}>Apply</button>
            </div>*/}
            <div className="inline-flex align-middle justify-end search-control">
              <input type="text" placeholder="Search" className="align-middle px-2 py-1 rounded-l-lg w-40 search" onKeyDown={handleKeyDown} ref={searchRef} defaultValue={filters.search} />
              <button className='inline-flex align-middle bg-black p-2 rounded-r-lg' type='button' onClick={handleSearch}><SVG icon="search" /></button>
            </div>
          </div>                    
        </div>
      </div>      
    </div>
  )
}

const CategorySelect = ({onSelect}:{onSelect: (categoryId: number)=>void}) => {
  const { data: categories } = useFetchAPI<Category>('/api/categories/');
  
  const formattedCategories = useMemo(
    () => createHierarchy(categories as Category[])
  ,[categories]);

  const dropdownOptions: DropdownOption[] = useMemo(() => 
    createDropdownOptions(formattedCategories), 
    [formattedCategories]
  );
  
  const handleOnChange = (e) => {
    onSelect(parseInt(e.target.value));
  }

  return (
    <select className="rounded-l-lg" onChange={handleOnChange}>
      <option value="">All Categories</option>
      {dropdownOptions && dropdownOptions.map((option, index) => {
        if(option.value !== 1) {
          return <option key={index} value={option.value}>{option.label}</option> 
        }
      })}
    </select>
  )
}
export const CategoryList = memo(CategorySelect);


const Pager = memo(function Pager({activePage, totalPage}: {activePage: number, totalPage: number}) {
  return (
    <div>
      <strong>{activePage}</strong>/<span>{totalPage}</span>
    </div>
  )
});

export default ProductFormFilters;