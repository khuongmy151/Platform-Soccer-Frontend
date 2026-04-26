import { useNavigate } from "react-router-dom";

export default function TeamDisplay({ name, isHome, logoUrl, teamId, onClick }) {
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
      className={`flex items-center gap-2 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity ${
        isHome ? "flex-row-reverse text-right" : "flex-row text-left"
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white shadow-sm shrink-0 overflow-hidden">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-black text-[10px] tracking-tighter">
            {firstLetter}
          </span>
        )}
      </div>
      <span className="font-bold text-gray-800 text-[10px] md:text-[12px] truncate leading-tight uppercase tracking-tight">
        {name}
      </span>
    </div>
  );
}