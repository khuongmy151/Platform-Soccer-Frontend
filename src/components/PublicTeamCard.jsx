const PublicTeamCard = ({ team, onClick }) => {
  return (
    <div
      onClick={() => onClick(team.id)}
      className="bg-surface-white rounded-2xl p-4 md:p-6 text-center relative shadow-sm border border-gray-100 
                 transition-all duration-300 cursor-pointer group flex flex-col items-center h-full
                 hover:shadow-xl hover:border-brand-primary/20 hover:-translate-y-1.5"
    >
      {/* Team Logo */}
      <div
        className="w-14 h-14 md:w-20 md:h-20 mb-4 rounded-full bg-surface-card border-[6px] border-surface-bg overflow-hidden shadow-inner 
                     group-hover:border-brand-primary/10 transition-all duration-500 shrink-0"
      >
        <img
          src={
            team?.logo_url ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQNa7zM9iIdR5Dlgzj7b4OJy8sGmsvG2WtcA&s"
          }
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={`${team.name} logo`}
        />
      </div>

      {/* Team Name */}
      <h2
        className="w-full max-w-[120px] md:max-w-[150px] font-black text-body-md md:text-title-lg text-gray-900 font-display leading-tight 
              truncate block text-center px-1 group-hover:text-brand-primary transition-colors mx-auto"
      >
        {team.name}
      </h2>

      {/* Country */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1 truncate w-full">
        {team.country}
      </p>

      {/* Player count */}
      <div className="mt-auto pt-3 md:pt-4 w-full border-t border-gray-50 flex justify-center items-center gap-2 md:pb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
          {team.total_players || 0} Players
        </p>
      </div>
    </div>
  );
};

export default PublicTeamCard;