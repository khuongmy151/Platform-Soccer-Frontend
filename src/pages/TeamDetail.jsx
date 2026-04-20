import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import { players as mockPlayers } from "../mock_data";
import { MdGroup } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const TeamDetail = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const playersList = mockPlayers;

  useEffect(() => {
    teamService.getTeamById({ url: `/teams/${teamId}`, setData: setTeam });
  }, [teamId]);

  return (
    <div className="min-h-screen bg-surface-bg font-body">
      {/* --- HEADER SECTION --- */}
      <div className="bg-surface-white border-b border-header-line">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-surface-nav font-display font-bold uppercase tracking-widest text-label-lg hover:opacity-70 transition-all"
          >
            <FaArrowLeft size={14} /> BACK
          </button>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 pb-12 pt-4 flex items-center gap-8">
          {/* Team Logo */}
          <div className="w-24 h-24 bg-surface-nav rounded-xl flex items-center justify-center p-3 shadow-md">
            <img
              src={team?.logo_url}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Team Info */}
          <div className="flex-1">
            <h1 className="text-display-sm font-display font-extrabold uppercase text-surface-nav leading-tight">
              {team?.name || "STRIKE VANGUARD"}
            </h1>
            <p className="mt-2 text-nav-muted text-body-md max-w-2xl">
              {team?.description ||
                "Premier offensive division specializing in high-velocity counter-attacks and tactical precision."}
            </p>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-brand-primary text-surface-white font-bold rounded-full uppercase text-label-sm">
                {playersList.length} Members
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 font-bold rounded-full uppercase text-label-sm">
                Active Season
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* --- PLAYERS SECTION --- */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <MdGroup className="text-brand-primary" size={24} />
          <h2 className="text-headline-sm font-display font-bold text-surface-nav uppercase tracking-tight">
            Player
          </h2>
        </div>
        {/* Grid 5 cột  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {playersList.map((player) => (
            <Link to={`members/${player.id}`}>
              <div
                key={player.id}
                className="bg-surface-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 border-l-4 border-transparent hover:border-brand-primary cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-bg shrink-0">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text-label-sm)] font-black text-[var(--color-surface-nav)] truncate uppercase">
                    {player.name}
                  </p>
                  <p className="text-brand-primary font-bold uppercase text-label-sm">
                    {player.position}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
