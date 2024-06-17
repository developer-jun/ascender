'use client';

import { ContextType, CommonReducerAction, CommonActionType} from "@/types/common";
import {  } from '@/types/common';

// type ReducerEvents = 'set_category' | 'set_categories' | 'set_hierarched_categories' | 'increment_refresh_counter'; // this will give intellisense to those that use this type
export type ReducerAction<T, U> = 
  | {
      type: 'set_item',
      payload: T | null,
    }
  | { 
      type: 'set_items',
      payload: T[]
    }
  | {
      type: 'set_hierarched_categories',
      payload: U[]
    }
  | {
      type: 'increment_refresh_counter',
      payload: null
  }

export const reducer = <T, U>(state: T, action: CommonReducerAction<T, U>): T => {
  console.log('reducer action: ', action);
  switch (action.type) {
    case 'set_item':
      return { 
        ...state, 
        selectedItem: action.payload as Category | null      
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
    case 'set_items':
      return { 
        ...state, 
        items: action.payload as Category[]
      }    
    case 'set_hierarched_categories':
      return { 
        ...state, 
        hierarchedCategories: action.payload as CategoryHierarchy[]
      }
    case 'set_any_item':
      return { 
        ...state, 
        selectedItem: action.payload as Category | null      
      }
    default:
      throw new Error()
  }
}