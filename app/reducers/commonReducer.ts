import { CommonReducerAction } from '@/types/common';

export default function reducer<T, U>(
  state: T,
  action: CommonReducerAction<U>
): T {
  console.log('common reducer: ', action);
  switch (action.type) {
    case 'set_item':
      return { 
        ...state, 
        item: action.payload.data // single Object
      };
    case 'set_items':
      return {
        ...state,
        items: action.payload.data // array
        //...action.payload        
      };
    case 'increment_refresh_counter':
      return {
        ...state,
        refreshCounter: state.refreshCounter + 1
      }
    case 'set_any':
      return {
        ...state,
        ...action.payload        
      };
    case 'set_any_item':
      return {
        ...state,
        [action.payload.fieldName]: action.payload.data       
      };
    default:
      throw new Error("Unhandled action type");
  }
}
