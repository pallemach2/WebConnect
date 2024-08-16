import "./MessageContextMenu.scss";

export default function MessageContextMenu({ close }: { close: Function }) {
  return (
    <div
      className="message-context-menu"
      onClick={(e) => {
        console.log(e);
        // close();
      }}
    >
      <div className="message-context-menu-box">MessageContextMenu</div>
    </div>
  );
}
