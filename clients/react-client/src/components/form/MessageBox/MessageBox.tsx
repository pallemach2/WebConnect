// Styling
import "./MessageBox.scss";

interface IProps {
  type: "error" | "success" | "warning";
  message: string;
}

export default function MessageBox({ type, message }: IProps) {
  let title = "Nachricht";
  let className = "success";

  if (type === "error") {
    title = "Fehler";
    className = "error";
  }

  if (type === "warning") {
    title = "Hinweis";
    className = "warning";
  }

  // Return empty box when no message was given
  if (message === "") return <></>;

  return (
    <div className={`message-box-container ${className}`}>
      <p className="title">{title}</p>
      <div className="message">
        <p>{message}</p>
      </div>
    </div>
  );
}
