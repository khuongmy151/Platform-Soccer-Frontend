import { useState, useEffect } from "react";
// Import lại bộ react-icons (Ionicons và HeroIcons)
import { 
  IoChevronDown, 
  IoChevronUp, 
  IoTrophySharp, 
  IoCalendarClearOutline,
  IoEllipse 
} from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";

import TeamDisplay from "../components/TeamDisplay";
import publicDashboard from "../services/publicDashboardService";

export default function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await publicDashboard.getAllTournaments();
        const data = response?.data || response;
        setTournaments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const handleToggle = async (tournamentId) => {
    if (expandedId === tournamentId) {
      setExpandedId(null);
      setMatches([]);
      return;
    }
    setExpandedId(tournamentId);
    setMatches([]);
    setLoadingMatches(true);
    try {
      const response = await publicDashboard.getMatchesByTournament(tournamentId);
      const result = response?.data || response;
      setMatches(Array.isArray(result?.matches) ? result.matches : []);
    } catch (err) {
      console.error("Fetch matches error:", err);
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  const renderStatusBadge = (status, isSmall = false) => {
    const s = status?.toUpperCase();
    const sizeClass = isSmall ? "text-label-sm px-1.5 py-0.5" : "text-label-sm px-2 py-0.5 uppercase font-bold";
    
    switch (s) {
      case "ONGOING":
        return (
          <span className={`flex items-center gap-1 bg-red-50 text-brand-primary rounded animate-pulse ${sizeClass}`}>
            <IoEllipse size={isSmall ? 6 : 8} /> LIVE
          </span>
        );
      case "COMPLETE":
        return (
          <span className={`bg-gray-100 text-gray-500 rounded ${sizeClass}`}>FINISHED</span>
        );
      default:
        return (
          <span className={`bg-blue-50 text-blue-600 rounded ${sizeClass}`}>UPCOMING</span>
        );
    }
  };

  const formatMatchDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: "TBD", time: "TBD" };
    const [datePart, timePart] = dateTimeStr.split(" ");
    const [y, m, d] = datePart.split("-");
    return { date: `${d}/${m}/${y}`, time: timePart?.substring(0, 5) };
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg text-title-lg font-bold text-gray-400 font-display">
      <HiOutlineRefresh className="animate-spin mr-2" size={24} /> LOADING...
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-bg font-body pb-16">
      <div className="bg-surface-white border-b border-gray-100 mb-8 pt-10 pb-6">
        <div className="max-w-[1000px] mx-auto px-6">
          <h1 className="text-headline-md font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter font-display">
            <IoTrophySharp className="text-brand-primary" size={28} />
            Tournament Lists
          </h1>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-6 space-y-4">
        {tournaments.map((t) => {
          const isOpen = expandedId === t.id;
          return (
            <div key={t.id} className="rounded-xl bg-surface-white shadow-sm overflow-hidden flex flex-col border border-gray-100 transition-all duration-300">
              
              {/* HEADER TOURNAMENT: Hiệu ứng Gradient mờ từ trái sang phải */}
              <div 
                onClick={() => handleToggle(t.id)} 
                className={`flex items-center justify-between p-5 cursor-pointer relative transition-all duration-300 ${
                  isOpen 
                    ? "bg-gradient-to-r from-red-50/60 to-surface-white" 
                    : "hover:bg-surface-card"
                }`}
              >
                {/* Vạch đỏ đậm sát mép trái khi mở rộng */}
                {isOpen && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary rounded-l-xl"></div>
                )}

                <div className="flex items-center gap-5 ml-2">
                  <div className="w-14 h-14 rounded-xl bg-surface-panel overflow-hidden flex items-center justify-center shadow border border-gray-800">
                    <img src={t.logo_url} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-title-lg font-bold leading-tight ${isOpen ? "text-gray-900" : "text-gray-700"}`}>
                        {t.name}
                      </span>
                      {renderStatusBadge(t.status, true)}
                    </div>
                    <span className="text-label-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <IoCalendarClearOutline size={12} className="mb-0.5" /> {t.start_date} • {t.format}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-sm font-bold transition-all ${
                  isOpen ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600"
                }`}>
                  DETAILS {isOpen ? <IoChevronUp size={16} className="text-brand-primary" /> : <IoChevronDown size={16} />}
                </div>
              </div>

              {/* DANH SÁCH TRẬN ĐẤU */}
              {isOpen && (
                <div className="flex flex-col border-t border-gray-100 bg-surface-white animate-in slide-in-from-top-1 duration-200">
                  {loadingMatches ? (
                    <div className="p-10 flex flex-col items-center justify-center gap-2 text-gray-400">
                      <HiOutlineRefresh className="animate-spin text-brand-primary" size={24} />
                      <span className="text-label-sm font-bold uppercase">Loading Matches...</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 py-3 bg-surface-card text-label-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                        <div className="text-center">Schedule / Status</div>
                        <div className="col-span-2 text-center -ml-20">Matchup</div>
                      </div>

                      {matches.length > 0 ? (
                        <div className="flex flex-col">
                          {matches.map((m) => {
                            const { date, time } = formatMatchDateTime(m.start_time);
                            return (
                              <div key={m.id} className="grid grid-cols-3 items-center py-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                                <div className="flex flex-col items-center gap-1 border-r border-gray-50">
                                  <span className="text-gray-400 font-bold text-label-sm tracking-tighter">{date}</span>
                                  <span className="text-brand-primary font-black text-headline-sm leading-none font-display italic">{time}</span>
                                  {renderStatusBadge(m.status)}
                                </div>

                                <div className="col-span-2 flex items-center justify-center gap-8 -ml-20">
                                  <TeamDisplay name={m.home_team} />
                                  <div className="flex flex-col items-center min-w-[70px]">
                                    <span className="text-gray-300 text-label-sm font-bold italic uppercase">vs</span>
                                    <span className="text-2xl font-black text-gray-800 font-display">
                                      {m.home_score} - {m.away_score}
                                    </span>
                                  </div>
                                  <TeamDisplay name={m.away_team} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-12 text-center text-gray-400 font-medium italic text-body-md">No matches currently scheduled.</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}