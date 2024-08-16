// Package imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

// Styling
import "./SidebarActions.scss";

export default function SidebarActions() {
  return (
    <div className="sidebar-actions-container">
      <div className="action"></div>
      <div className="action"></div>
      <div className="action"></div>
      <div className="action"></div>
      <div className="action">
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </div>
    </div>
  );
}
