import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

interface FormFieldProps {
  label?: string
  htmlFor?: string
  error?: string
  hint?: string
  success?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  success,
  required,
  children,
  className,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined
  const hintId = hint ? `${htmlFor}-hint` : undefined
  const successId = success ? `${htmlFor}-success` : undefined

  // Pass describedby to children
  const describedBy = [hintId, errorId, successId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm sm:text-base font-light text-alira-primary/90"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Clone children and add describedBy */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            "aria-describedby": describedBy,
            "aria-invalid": error ? "true" : undefined,
            "aria-required": required ? "true" : undefined,
          })
        }
        return child
      })}

      {hint && !error && !success && (
        <p
          id={hintId}
          className="text-sm text-alira-primary/60 flex items-start gap-1.5"
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{hint}</span>
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-400 font-medium flex items-start gap-1.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {success && !error && (
        <p
          id={successId}
          className="text-sm text-emerald-400 font-medium flex items-start gap-1.5"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{success}</span>
        </p>
      )}
    </div>
  )
}

