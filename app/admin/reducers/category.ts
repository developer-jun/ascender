'use client';

import { CategoryContextType, Category, CategoryHierarchy} from "@/types/category";

// type ReducerEvents = 'set_category' | 'set_categories' | 'set_hierarched_categories' | 'increment_refresh_counter'; // this will give intellisense to those that use this type
export type CategoryReducerAction = 
  | {
      type: 'set_category',
      payload: Category | null,
    }
  | { 
      type: 'set_categories',
      payload: Category[]
    }
  | {
      type: 'set_hierarched_categories',
      payload: CategoryHierarchy[]
    }
  | {
      type: 'increment_refresh_counter',
      payload: null
  }

export const reducer = (state: CategoryContextType, action: CategoryReducerAction): CategoryContextType => {
  console.log('reducer action: ', action);
  switch (action.type) {
    case 'set_category':
      return { 
        ...state, 
        selectedCategory: action.payload as Category | null      
      }
    case 'increment_refresh_counter':
      let refreshCounter = 0;
      if(state.refreshCounter) {
        refreshCounter = state.refreshCounter;
      }
      return { 
        ...state, 
        refreshCounter: refreshCounter + 1      
      }
    case 'set_categories':
      return { 
        ...state, 
        categories: action.payload as Category[]
      }    
    case 'set_hierarched_categories':
      return { 
        ...state, 
        hierarchedCategories: action.payload as CategoryHierarchy[]
      }    
    default:
      throw new Error()
  }
}