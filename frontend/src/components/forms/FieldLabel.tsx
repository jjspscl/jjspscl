interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FieldLabel({ children, className, required = false, ...props }: FieldLabelProps) {
  return (
    <label {...props} className={`mb-2 block text-lg font-medium text-ink ${className ?? ""}`}>
      {children}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  );
}
