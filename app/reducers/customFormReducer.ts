import { FormState, FormAction } from '@/types/common';

export default function reducer<T>(
  state: FormState,
  action: FormAction<T>
): FormState {
  console.log('common reducer: ', state, action);
  switch (action.type) {
    case 'set_field':
      const { fieldName, data } = action.payload;
      return { 
        ...state, 
        [fieldName]: data // the generic part of our reducer. 
      };
    case 'set_fields':
      // expect payload to be an object
      return {
        ...state,
        ...action.payload        
      };
    default:
      throw new Error("Unhandled action type");
  }
}
