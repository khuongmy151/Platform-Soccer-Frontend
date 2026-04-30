import { useNavigate } from "react-router-dom";

export default function TeamDisplay({
  name,
  isHome,
  logoUrl,
  teamId,
  onClick,
  mobileVertical,
}) {
  const navigate = useNavigate();
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (teamId) {
      navigate(`/public/teams/${teamId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex min-w-0 cursor-pointer transition-opacity hover:opacity-80 
        ${
          mobileVertical
            ? "flex-col gap-1 flex-1 text-center items-center"
            : `flex-1 items-center gap-2 ${isHome ? "flex-row-reverse text-right" : "flex-row text-left"}`
        }`}
    >
      <div
        className={`shrink-0 overflow-hidden border border-gray-100 shadow-sm 
        ${mobileVertical ? "w-10 h-10 rounded-md" : "w-8 h-8 rounded-full"}`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-[10px]">
            {firstLetter}
          </div>
        )}
      </div>

      {/* Tên đội */}
      <span
        className={`font-black text-gray-900 uppercase px-1 break-words w-full
        ${mobileVertical ? "text-[8px] leading-[1.1]" : "text-[10px] md:text-[12px]"}
      `}
      >
        {name}
      </span>
    </div>
  );
}
