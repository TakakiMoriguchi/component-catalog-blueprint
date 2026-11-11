import { useId } from "react";
import { TextInput, type TextInputProps } from "@/components/atoms/TextInput";

export interface FormFieldProps extends Omit<TextInputProps, "id" | "invalid"> {
  label: string;
  /** Helper text shown under the input. Hidden while an error is shown. */
  hint?: string;
  /** Error message. Marks the input invalid. */
  error?: string;
}

/** Label + text input + hint or error, wired together for accessibility. */
export function FormField({ label, hint, error, ...inputProps }: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600 }}>
        {label}
      </label>
      <TextInput
        id={id}
        invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <span id={messageId} style={{ fontSize: 12, color: error ? "#c0392b" : "#666" }}>
          {message}
        </span>
      )}
    </div>
  );
}
