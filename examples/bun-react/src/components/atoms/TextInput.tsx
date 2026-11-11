import type { CSSProperties, InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Shows the error style and sets aria-invalid. */
  invalid?: boolean;
}

/** Generic single-line text input. Native input attributes pass through. */
export function TextInput({ invalid = false, style, ...rest }: TextInputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      style={{
        ...baseStyle,
        ...(invalid ? invalidStyle : null),
        ...(rest.disabled ? disabledStyle : null),
        ...style,
      }}
      {...rest}
    />
  );
}

const baseStyle: CSSProperties = {
  padding: "8px 10px",
  border: "1px solid #c9c9c9",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box",
};

const invalidStyle: CSSProperties = { borderColor: "#c0392b" };
const disabledStyle: CSSProperties = { background: "#f2f2f2", cursor: "not-allowed" };
