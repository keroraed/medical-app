import { cn } from "@/lib/utils";

export default function FormField({
  label,
  error,
  children,
  className,
  required,
  htmlFor,
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium leading-none"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
