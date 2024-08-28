// Package imports
import { ReactNode } from "react";

// Styling
import "./ButtonInput.scss";

interface IProps {
  onClick: () => void;
  type: "primary" | "secondary";
  label: string | ReactNode;
  loading?: boolean;
}

export default function ButtonInput({
  onClick,
  type,
  label,
  loading = false,
}: IProps) {
  // Only do action, if loading state is false
  const action = () => {
    if (!loading) onClick();
  };

  return (
    <button
      className={`button-input ${type}`}
      onClick={action}
      disabled={loading}
    >
      {loading ? <div className="loading-circle"></div> : label}
    </button>
  );
}
