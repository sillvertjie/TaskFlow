interface AuthInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
      />
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
