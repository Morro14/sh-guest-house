import { Link } from "react-router";

export default function Fallback({
  message,
  link = undefined,
  linkText = undefined,
  onClick = undefined,
}) {
  return (
    <div className="flex flex-col justify-center items-center w-screen mt-10 text-text-main">
      <div className="text-gray-2 font-semibold text-lg">{message}</div>
      {link ? (
        <Link to={link} className="font-light underline">
          {linkText}
        </Link>
      ) : onClick ? (
        <div className="font-light underline cursor-pointer" onClick={onClick}>
          {linkText}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
