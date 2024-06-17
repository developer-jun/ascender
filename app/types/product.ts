import { PRODUCT_SORTABLE_FIELDS } from "@/utils/constants";
import { Category } from "./category";
import { ContextType } from "./common";

export enum StockStatuses {
  INSTOCK = 'INSTOCK',
  OUTOFSTOCK = 'OUTOFSTOCK',
  ONBACKORDER = 'ONBACKORDER'
}

export interface Product {
  id?         : number;
  sku         : string;
  name        : string;
  slug        : string;
  summary     : string;
  description : string;
  price       : number;
  thumbUrl    : string;
  imageUrl    : string;
  inStock     : StockStatuses | string;
  published   : boolean;
  category?    : string;
  categoryId?  : number;
  productcategoryid?: number
  
  createdAt?   : string;
  updatedAt?   : string;
}

export interface ProductWithSelection extends Product {
  productcategory?: [] | null;
  isSelected?: boolean; 
}

export type SearchProductTypes = {
  pagination: Partial<Pagination> | Pagination, 
  filters: Partial<ProductFilter> | ProductFilter, 
  sorting: Partial<Sorting> | Sorting
}

export type Pagination = {
  totals: number;
  itemsPerPage: number;
  pageCount: number;
  activePage: number;
};

export type ProductFilter = {
  search: string;
  category: number;
  publicationType: string
}

type SortableTuple = typeof PRODUCT_SORTABLE_FIELDS;
export type SortFields = SortableTuple[number];
export type Sorting = {
  field: SortFields;
  direction: 'asc' | 'desc';
}

export type Querybles = {
  pagination: Pagination,
  filters: ProductFilter,
  sorting: Sorting,  
  //selectAll: boolean,
}

// Used by the List Page
export interface ProductsContextType extends ContextType<Product> {
  //items: T[];  
  //selectedItem: T | null;
  //refreshCounter?: number;
  
  count: number,
  selectedItems: number[],
  //categories: Category[],
  querybles: Querybles,  
  dialog: {
    isOpen: boolean;
    productId: number
  }
}
/*export interface ProductsContextType {  
  items: Product[],
  count: number,
  productQuerybles: ProductQuerybles,  
  dialog: {
    isOpen: boolean;
    productId: number
  }
}*/

// Used by the Form Page
export interface ProductContextType extends ContextType<Product> {
  categories: Category[],  // used by the form dropdown
}