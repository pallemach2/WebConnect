// Styling
import "./Avatar.scss";

export default function Avatar({ img }: { img: string | null }) {
  if (img !== null)
    return (
      <img className="avatar" src={"http://localhost:4000/avatar/" + img} />
    );
  return <div className="avatar"></div>;
}
