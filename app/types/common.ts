import { OptionAndItems, OptionItem } from "./option";
//import { Product } from "./product";
//import { Category } from "./category";

export type MessagePrompt = {
  messageType: 'success' | 'error' | 'warning' | 'info' | undefined; // why not just the word 'type'? Boils down to it's usage down in the component, such that {form.messageType} is more concise than just {form.type}
  message: string;  
};

export type FieldValidation = {
  field: string;
  message: string;
}

export type JSONResult<T> = 
  | { status: 'success'; data: T | T[] } // successfully saved data to database
  | { status: 'validationError'; fields: FieldValidation[]} // validation error
  | { status: 'failed'; prompt: MessagePrompt}; // database transaction failure

/** Group, used when component has Form and using Custom Hook Form */  
export type FormState = {
  id?: number;
  alertPrompt: MessagePrompt | null;
  isProcessing: boolean;  
  useForm: any;
  useController?: any;
  submissionUrl: string;
}

export type FormAction<T> =   
  | { type: 'set_field'; payload: {fieldName: keyof T, data: T[keyof T]} }
  | { type: 'set_fields'; payload: Partial<T> | T };
  
/** End Group */

export type ReducerAction<T> =   
  | { type: 'set_field'; payload: {fieldName: keyof T, data: T[keyof T]} }
  | { type: 'set_fields'; payload: Partial<T> | T };

/** Group, used when page has form (selectedItem) and list (items) */
export interface ContextType<T> {
  items: T[];  
  selectedItem: T | null;
  refreshCounter?: number;
}

export type CommonReducerAction<T> = 
| {
    type: 'set_item',
    payload: T | null,
  }
| { 
    type: 'set_items',
    payload: T[]
  }
| {
    type: 'increment_refresh_counter',
    payload: null
  }
| {
    type: 'set_any',
    payload: any
  }
/** End Group */

export type ToastContextType = {
  alert: MessagePrompt,
  delay?: number,
}

/** Context Consumers */
export type OptionContextType = ContextType<OptionAndItems>;
export interface OptionItemsContextType extends OptionContextType {
  selectedOptionItem: OptionItem,
  formToggle: boolean,
  deleteOption?: OptionAndItems,
}


/* relocated to own product 
export interface ProductContextType extends ContextType<Product> {
  categories: Category[];
}
*/