import { ReducerAction } from '@/types/common';

export default function reducer<T>(
  state: T,
  action: ReducerAction<T>
): T {
  const { type, payload } = action;
  console.log('page reducer: ',  type, payload);
  switch (type) {
    case 'set_field':
      const { fieldName, data } = payload;
      if(fieldName.toString().includes('.')) {
        const fieldNames = fieldName.toString().split('.');        
        let updatedState = { ...state };
        let currentLevel = updatedState; // topmost
        let myState: Partial<T> = {...state};
        for (const level of fieldNames.slice(0, -1)) {
          if (currentLevel[level] === undefined) {
            // Handle invalid field name (optional)
            console.log(`Invalid field name: ${fieldName}`);
            return state; // Return the original state
          }
          currentLevel = currentLevel[level];
          myState = {
            ...myState,
            ...currentLevel[level]
          }
          console.log('mystate: ', myState);
        }

        const targetField = fieldNames[fieldNames.length - 1];
        // finally, set the data        
        currentLevel[targetField] = data;      
        console.log({...state})
        console.log({...updatedState})
        return {
          ...state,
          ...myState
        }
      } else {
        return {
          ...state,
          [fieldName]: data       
        };
      }      
    case 'set_fields':
      return {
        ...state,
        ...payload       
      };      
    default:
      return state;
  }
}
