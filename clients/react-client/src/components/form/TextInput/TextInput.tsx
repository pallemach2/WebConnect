// Styling
import "./TextInput.scss";

interface IProps {
  label: string;
  subLabel?: string;
  type?: "password" | "text";
  customClass?: string;
  value: string;
  onChange: Function;
  required?: boolean;
}

export default function TextInput({
  label,
  subLabel = "",
  type = "text",
  value,
  onChange,
  customClass = "",
  required = false,
}: IProps) {
  return (
    <div className={"text-input-container " + customClass}>
      <label htmlFor={label.replace(" ", "-")}>
        {label}
        {subLabel !== "" && <span>{subLabel}</span>}
      </label>
      <input
        required={required}
        name={label.replace(" ", "-")}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
