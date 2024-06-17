import React, { ReactNode, useCallback } from 'react'
import './product-table.scss';
import { SortFields, Sorting } from '@/types/product';
import { usePageContext, usePageDispatch } from '@/admin/contexts/productList';
import useProductsList from '../hooks/useProductList';
//import { usePageContext } from '@/admin/contexts/productList';

type ProductTableProps = {
  children: React.ReactNode;
  sorting: Sorting;  
  selectAll: boolean;
  checkAll: (userSelection: boolean)=>void;
}
export default function ProductTable({ children, sorting, selectAll, checkAll }: ProductTableProps) {
  const pageDispatch = usePageDispatch();
  const productContext = usePageContext();
  //const { setUrlParams, redirectTo } = useUrlParams();  
  const pageContext = usePageContext();
  const { querybles } = pageContext;
  const { pagination, filters, sorting: mySorting } = querybles;

  const handleOnSort = useCallback((column: SortFields)  => {
    const newSort: Sorting = {
      field: column,
      direction: (column === mySorting.field && mySorting.direction === 'asc') ? 'desc' : 'asc'
    }    
    //setUrlParams({direction: newSort.direction, sortBy: newSort.field}); // update querystring

    // when sorted, reset pagination to start at 1
    //sortProducts(newSort);
    console.log('current sorting: ', mySorting);
    // querybles.sorting = newSort;
    console.log('new sorting: ', newSort);
    pageDispatch({
      type: 'set_fields',
      payload: {
        ...productContext,
        querybles: {
          ...querybles,
          sorting: newSort,
          pagination: {
            ...pagination,
            activePage: 1 // reset to first page
          }
        }
      }
    });
  }, [mySorting, pagination, querybles, pageDispatch, productContext]);
  
  const getCssClass = useCallback((column: string = '') => {
    let className = 'sort-by';    
    if(column === sorting.field) {
      className += ' active '+ sorting.direction;
    }    
    if(column === 'name') {
      className += ' '+ column;
    }
    return className;
  }, [sorting]);

  //const handleOnSort = useCallback((column: string) => handleSort(column), []);

  return (              
    <table className="table sortable">
      <thead>
        <tr>
          <th>
            <input type="checkbox" onChange={e=>checkAll(!selectAll)} checked={selectAll} className="checkbox" />                  
          </th>
          <TableHeader name="name" cssClass={getCssClass('name')} onSort={handleOnSort}>Name</TableHeader>
          <TableHeader name="category" cssClass={getCssClass('category')} onSort={handleOnSort}>Category</TableHeader>
          <TableHeader name="price" cssClass={getCssClass('price')} onSort={handleOnSort}>Price</TableHeader>
          <TableHeader name="description" cssClass={getCssClass('description')} onSort={handleOnSort}>Description</TableHeader>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {children}                          
      </tbody>
    </table>    
  )
}

type TableHeaderCellProps = {
  name: string, 
  cssClass: string, 
  onSort: (name: string) => void, 
  children: React.ReactNode;
}
function TableHeader({ name, cssClass, onSort, children }: TableHeaderCellProps) {
  return <th><a className={cssClass} href="#" onClick={e=>onSort(name)}>{children}</a></th>;
}