
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input component props interface
 * Extends HTML input element attributes
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input UI component
 * 
 * A styled input component that follows the design system.
 * Accepts all standard HTML input attributes.
 * 
 * @param {InputProps} props - Component props including className, type, etc.
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref
 * @returns {JSX.Element} The input element
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
