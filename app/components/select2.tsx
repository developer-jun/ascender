import { cn } from "@/utils/helpers";
import { HTMLAttributes } from "react"

const Select2: React.FC<HTMLAttributes<HTMLSelectElement>> = ({ className, children, ...restProps }) => {
  return (
    <select
        className={cn("select select-bordered w-full", className)}
        {...restProps}
      >
      {children}
    </select>
  )
}

export default Select2;