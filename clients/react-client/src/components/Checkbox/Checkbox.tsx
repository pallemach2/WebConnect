import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./Checkbox.scss";

interface IProps {
  checked: boolean;
  onToggle: Function;
}

export default function Checkbox({ checked, onToggle }: IProps) {
  if (checked) {
    return (
      <div className="checkbox checked" onClick={() => onToggle()}>
        <FontAwesomeIcon icon={faXmark} className="icon" />
      </div>
    );
  }

  return <div className="checkbox" onClick={() => onToggle()}></div>;
}
