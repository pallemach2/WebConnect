// Styling
import "./CheckboxInput.scss";

interface IProps {
  label: string;
  value: boolean;
  onChange: Function;
}

export default function CheckboxInput({ label, value, onChange }: IProps) {
  return (
    <div className="checkbox-input-container" onClick={() => onChange(!value)}>
      <label htmlFor={label.replace(" ", "-")}>{label}</label>
      <input
        type="checkbox"
        name={label.replace(" ", "-")}
        onClick={() => onChange(!value)}
      />
      <div className={"checkbox " + (value && "checked")}>
        {value && <div className="checked-marker"></div>}
      </div>
    </div>
  );
}
