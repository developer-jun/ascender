import React, { ReactNode, HTMLAttributes, memo } from 'react';
import { cn } from '@/utils/helpers';

const FormButtons: React.FC<HTMLAttributes<HTMLElement>> = ({ className, children, ...restProps }) => {
  // const { state: {id, useForm: { reset }} } = useCustomForm();
  return (
    <div className={cn("mt-2 flex justify-end gap-1", className)} {...restProps}>
      {children}      
    </div>
  )
}

const MemoizedFormButtons = ( memo( FormButtons) )
export { MemoizedFormButtons as FormAction }
