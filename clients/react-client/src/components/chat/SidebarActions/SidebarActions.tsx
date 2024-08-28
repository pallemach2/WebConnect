// Package imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";

// Custom imports
import NewChatMenu from "../NewChatMenu/NewChatMenu";

// Styling
import "./SidebarActions.scss";

interface IProps {
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function SidebarActions({ setSearchTerm }: IProps) {
  // Open states of menus
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [newChatMenu, setNewChatMenu] = useState(false);

  // Close the menus if click on background
  const closeMenu = (e: any) => {
    if (e.target.classList.contains("sidebar-actions-menu-bg")) {
      setSettingsMenu(false);
      setNewChatMenu(false);
    }
  };

  return (
    <div className="sidebar-actions-container">
      <input
        type="text"
        placeholder="Suche"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="action" onClick={() => setNewChatMenu(true)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button className="action" onClick={() => setSettingsMenu(true)}>
        <FontAwesomeIcon icon={faGear} />
      </button>
      {(settingsMenu || newChatMenu) && (
        <div className="sidebar-actions-menu-bg" onClick={closeMenu}>
          {settingsMenu && <div></div>}
          {newChatMenu && <NewChatMenu close={() => setNewChatMenu(false)} />}
        </div>
      )}
    </div>
  );
}
