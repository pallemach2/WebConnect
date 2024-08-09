// Styling
import "./TextInput.scss";

interface IProps {
  label: string;
  type?: "password" | "text";
  customClass?: string;
  value: string;
  onChange: Function;
  required?: boolean;
}

export default function TextInput({
  label,
  type = "text",
  value,
  onChange,
  customClass = "",
  required = false,
}: IProps) {
  return (
    <div className={"text-input-container " + customClass}>
      <label htmlFor={label.replace(" ", "-")}>{label}</label>
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
