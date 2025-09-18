
import React from "react";

const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-base",
      lg: "h-13 px-5 text-lg",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            className={(
              "w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              iconLeft ? "pl-10" : "",
              iconRight ? "pr-10" : "",
              error ? "border-red-500 focus:ring-red-500" : "",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {iconRight}
            </span>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
