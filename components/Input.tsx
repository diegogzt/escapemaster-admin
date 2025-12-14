import React, { InputHTMLAttributes } from "react";
import { cn } from "../utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, ...props }, ref) => (
    <div className="mb-6">
      {label && (
        <label className="block mb-2 font-semibold text-gray-800">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border-2 rounded-lg text-base transition-colors bg-white text-gray-900 placeholder:text-gray-400",
          error ? "border-red-500" : "border-beige focus:border-primary",
          props.disabled && "bg-light cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
      {helpText && <span className="text-dark text-sm mt-1">{helpText}</span>}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
