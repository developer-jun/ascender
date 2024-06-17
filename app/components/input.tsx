import * as React from "react"
import { cn } from "@/utils/helpers"
import { constants } from "buffer"

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <input 
        type={type} 
        className="input input-bordered w-full" 
        ref={ref}
        {...props} />      
    </label>
  )
});

export const InputFieldFull = () => {

  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">What is your name?</span>
      </div>
      <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      <div className="label">
        <span className="label-text-alt">Bottom Left label</span>
      </div>
    </label>
  )
}