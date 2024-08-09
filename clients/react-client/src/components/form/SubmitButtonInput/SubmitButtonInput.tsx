// Styling
import "./SubmitButtonInput.scss";

interface IProps {
  type: "primary" | "secondary";
  label: string;
  loading?: boolean;
}

export default function SubmitButtonInput({
  type,
  label,
  loading = false,
}: IProps) {
  return (
    <button
      type="submit"
      className={`submit-button-input ${type}`}
      disabled={loading}
    >
      {loading ? <div className="loading-circle"></div> : label}
    </button>
  );
}
