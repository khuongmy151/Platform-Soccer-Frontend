const PublicTeamCard = ({ team, onClick }) => {
  const getImage = (url) => {
    if (!url) return "https://via.placeholder.com/100";
    if (url.startsWith("blob:")) return "https://via.placeholder.com/100";
    if (url.startsWith("http")) return decodeURIComponent(url);
    return `https://backend.cupzone.fun/${url}`;
  };

  return (
    <div
      onClick={() => onClick(team.id)}
      className="bg-surface-white rounded-2xl p-5 md:p-6 text-center relative shadow-sm border border-gray-100 
                 transition-all duration-300 cursor-pointer group flex flex-col items-center h-full
                 hover:shadow-xl hover:border-brand-primary/20 hover:-translate-y-1.5"
    >
      {/* Team Logo  */}
      <div className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full bg-surface-card border-[6px] border-surface-bg overflow-hidden shadow-inner 
                      group-hover:border-brand-primary/10 transition-all duration-500 shrink-0">
        <img
          src={getImage(team.logo_url)}
          alt={team.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Team Name */}
      <h2 className="font-black text-body-md md:text-title-lg text-gray-900 font-display leading-tight line-clamp-2 
                     min-h-[2.5rem] flex items-center justify-center px-1 group-hover:text-brand-primary transition-colors">
        {team.name}
      </h2>

      {/* Country */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1 truncate w-full">
        {team.country}
      </p>

      {/* Player count */}
      <div className="mt-auto pt-4 w-full border-t border-gray-50 flex justify-center items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
          {team.total_players || 0} Players
        </p>
      </div>
    </div>
  );
};

export default PublicTeamCard;