// Package import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
        {value && <FontAwesomeIcon icon={faXmark} className="icon" />}
      </div>
    </div>
  );
}
