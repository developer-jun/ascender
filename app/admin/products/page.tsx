import ProductContainer from "./ui/product-container";
import { Provider } from "@/admin/contexts/productList";
import { queryProductsRelationship, queryProductsCategory } from "@/lib/product";
import { Pagination, ProductsContextType, Sorting, SortFields, Querybles, Product } from "@/types/product";
import { PRODUCT_SORTABLE_DEFAULT } from "@/utils/constants";
import { getProductsContextDefault, isProductSortableField, parseQueryString } from "@/utils/productHelper";
//import useUrlParams from "../hooks/useUrlParams";

const initialvalue = getProductsContextDefault();
interface OrderBy {
  [key: string]: string;
}
async function getData(querybles: Querybles): Promise<any> {
  const { pagination, sorting, filters } = querybles;
  const { itemsPerPage, activePage } = pagination;
  const { field, direction } = sorting;
  const { search, category } = filters;
  // if sort is category, we must not include it below, we have a section for it below
  // we also need to retrieve all the data then the category will be attached to them before
  let sortByObject = { }
  if(field !== 'category') {
    sortByObject = { 
      orderBy: { [field]: direction } as OrderBy,
      take: itemsPerPage,
      skip: (activePage > 0) ? itemsPerPage * (activePage - 1) : 0,
    };
  } 
  let keywordWhere = null;
  if(search && search.trim() !== '') {
    keywordWhere = {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
  }

  let categoryWhere = null;
  if(category && category > 0) {
    categoryWhere = {
      productcategory: {
        some: {
          category_id: category
        }
      }
    }
  }

  let whereObjects = {
    ...sortByObject,
  };
  if(keywordWhere || categoryWhere) {
    whereObjects = {
      ...whereObjects,
      where: {
        ...keywordWhere,
        ...categoryWhere,
      }
    }
  }
  console.log('where: ', whereObjects);

  const results = await queryProductsRelationship(whereObjects, sorting);

  if(field === 'category' && results?.data) {
    // sort by category
    if(direction === 'desc') {
      results.data.sort((a, b) => b.category.localeCompare(a.category));
    } else {
      results.data.sort((a, b) => a.category.localeCompare(b.category));
    }    
    
    let skip = (activePage > 0) ? itemsPerPage * (activePage - 1) : 0;
    let skipTo = (skip) ? skip : itemsPerPage * ((activePage ? activePage:1) - 1);
    // then only take what we need
    const newResultData: Product[] = results.data.slice(skipTo, skipTo + itemsPerPage);
    
    return {data: newResultData, count: results.count};
  }
 
  return (results === null) ? { data: null, count: 0 } : results;
}


async function getData2(querybles: Querybles): Promise<any> {
  const { pagination, sorting, filters } = querybles;
  const { itemsPerPage, activePage } = pagination;
  const { field, direction } = sorting;
  const { search, category } = filters;
  // if sort is category, we must not include it below, we have a section for it below
  // we also need to retrieve all the data then the category will be attached to them before
  let sortByObject = { }
  if(field !== 'category') {
    sortByObject = { 
      orderBy: { [field]: direction } as OrderBy,
      take: itemsPerPage,
      skip: (activePage > 0) ? itemsPerPage * (activePage - 1) : 0,
    };
  } 
  let keywordWhere = null;
  if(search && search.trim() !== '') {
    keywordWhere = {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
  }

  let categoryWhere = null;
  if(category && category > 0) {
    categoryWhere = {
      productcategory: {
        some: {
          category_id: category
        }
      }
    }
  }

  let whereObjects = {
    ...sortByObject,
  };
  if(keywordWhere || categoryWhere) {
    whereObjects = {
      ...whereObjects,
      where: {
        ...keywordWhere,
        ...categoryWhere,
      }
    }
  }
  console.log('where: ', whereObjects);

  const results = await queryProductsCategory(pagination, sorting, filters);
  console.log('getData2: ', results);
  
 
  return (results === null) ? { data: null, count: 0 } : results;
}


export default async function ProductsPage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined }
}) {  
  const { pagination, sorting, filters } = initialvalue.querybles;
  //let newPagination: Pagination = pagination;
  //let newSorting: Sorting = sorting;
  
  console.log(searchParams);
  /*if(searchParams) {
    if(searchParams.direction && searchParams.direction === 'desc') {
      sorting.direction = 'desc';
    }
    if(searchParams.sortBy) {
      let sortBy = searchParams.sortBy.toString();        
      sorting.field = isProductSortableField(sortBy) ? sortBy : PRODUCT_SORTABLE_DEFAULT;
    }
    if(searchParams.page && parseInt(searchParams.page.toString()) > 0) {
      // initialvalue.querybles['pagination']['page'] = parseInt(searchParams.page);
      pagination.activePage = parseInt(searchParams.page.toString());
    }    
  } */ 

    
  const parsedQuerystring = parseQueryString(searchParams);
  console.log('parsedQuerystring: ', parsedQuerystring);
  //const { data, count } = await getData(parsedQuerystring);
  const { data, count } = await queryProductsCategory(pagination, sorting, filters);
  console.count('[PRODUCTS PAGE]');
  console.log('initialvalue: ', initialvalue);
  initialvalue.items = data;
  initialvalue.count = count;
  initialvalue.querybles['sorting'] = {
    ...sorting,
    ...parsedQuerystring.sorting
  };
  initialvalue.querybles['pagination'] = {
    ...pagination,
    ...parsedQuerystring.pagination
  };
  initialvalue.querybles['filters'] = {
    ...filters, 
    ...parsedQuerystring.filters
  }

  
  // use this opportunity to grab the url params and apply them to the initialvalue
  // initialvalue.productModifiers = integrateUrlParams({productModifiers: initialvalue.productModifiers, urlParams: getCurrentParams()});
  return (
    <Provider initialValue={initialvalue}>
      <section className="contents">
        <ProductContainer  />
      </section>
    </Provider>
  )
}
