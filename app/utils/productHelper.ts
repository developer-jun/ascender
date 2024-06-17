import { Pagination, ProductFilter, ProductsContextType, Querybles, SortFields, Sorting } from "@/types/product";
import { PRODUCT_SORTABLE_DEFAULT, PRODUCT_SORTABLE_FIELDS } from "./constants";

export const getProductsContextDefault = (): ProductsContextType => {
    return {
        selectedItem: null,
        selectedItems: [],
        items: [],
        //categories: [],
        count: 0,  
        querybles: {
          pagination: {
            totals: 0, // this is the total number of items
            itemsPerPage: 5, // active products per page
            pageCount: 0, // Math.ceil(totals/itemsPerPage) - can be removed and calculated when needed
            activePage: 1, // current active page position
          },
          filters: {
            search: '',
            category: 0,
            publicationType: '',
          },
          sorting: {
            field: 'id',
            direction: 'asc',
          },  
          //selectAll: false // for select all handle,
        },
        dialog: {
          isOpen: false,
          productId: 0
        }
    }
}

export const isProductSortableField = (field: string): field is SortFields => {   
    return PRODUCT_SORTABLE_FIELDS.includes(field as SortFields) 
}

export const buildQueryString = ({ pagination, filters, sorting }: Querybles ) => {
    let queryString = [];
    const { itemsPerPage, activePage } = pagination;
    const { search, category } = filters;
    const { field, direction } = sorting;  

    if(itemsPerPage) {
        queryString.push(`take=${itemsPerPage}`);
        if(activePage) {
        queryString.push(`skip=${itemsPerPage * (activePage - 1)}`);
        queryString.push(`activePage=${activePage}`);
        }
    }
    if(field && direction) {
        queryString.push(`sortBy=${field}`);
        queryString.push(`order=${direction}`);
    }
    if(search) {
        queryString.push(`search=${search}`);
    }
    if(category) {
        queryString.push(`category=${category}`);
    }

    return queryString.join('&');
} 

export const parseQueryString = (searchParams: { [key: string]: string | string[] | undefined }): Querybles  => {
  const defaultQuerybles = getProductsContextDefault();
  let sorting: Partial<Sorting> = {};
  let pagination: Partial<Pagination>;
  let filters: Partial<ProductFilter>;
  let querybles: Partial<Querybles>;

  if(searchParams) {
    console.log('searchParams: ', searchParams);
    if(searchParams.order) {
      sorting = { direction: searchParams.order };
    }
    if(searchParams.sortBy) {
      let sortBy = searchParams.sortBy.toString();        
      sorting = { ...sorting, field: isProductSortableField(sortBy) ? sortBy : PRODUCT_SORTABLE_DEFAULT};
    }
    if(searchParams.activePage && parseInt(searchParams.activePage.toString()) > 0) {
      pagination = { activePage: parseInt(searchParams.activePage.toString()) };
    }
    if(searchParams.take && parseInt(searchParams.take.toString()) > 0) {
      pagination = { ...pagination, itemsPerPage: parseInt(searchParams.take.toString()) };
    }
    if(searchParams.search && searchParams.search !== '') {
      filters = { search: searchParams.search };
    }
    if(searchParams.category && parseInt(searchParams.category.toString()) > 0) {
      filters = { ...filters, category: parseInt(searchParams.category.toString()) };
    }

    if(pagination) {
      querybles = {pagination: pagination}
    }
    if(sorting) {
      querybles = {
        ...querybles,
        sorting: sorting
      }
    }
    if(filters) {
      querybles = {
        ...querybles,
        filters: filters
      }
    }

    return {
      ...defaultQuerybles.querybles,
      ...querybles
    };
  }

  return defaultQuerybles.querybles;
} 
