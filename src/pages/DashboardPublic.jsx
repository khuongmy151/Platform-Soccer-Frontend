import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IoChevronDown,
  IoChevronUp,
  IoTrophySharp,
  IoCalendarClearOutline,
  IoEllipse,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";
import PublicTeamCard from "../components/PublicTeamCard";
import TeamDisplay from "../components/TeamDisplay";
import publicDashboard from "../services/publicDashboardService";

import { setTournaments } from "../stores/features/tournamentSlice";
import DateSelector from "../components/DateSelector";
import TeamSection from "../components/TeamSection";

export default function Dashboard() {
  const dispatch = useDispatch();
  const tournaments = useSelector((state) => state.tournaments.items);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);
  // State lưu ngày được chọn để lọc (null = hiển thị tất cả)
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        await publicDashboard.getAllTournaments({
          url: "/public/tournament",
          dispatch,
          func: setTournaments,
        });
        setLoading(true);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [dispatch]);

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
      const response =
        await publicDashboard.getMatchesByTournament(tournamentId);
      const result = response?.data;
      setMatches(Array.isArray(result?.matches) ? result.matches : []);
    } catch (err) {
      console.error("Fetch matches error:", err);
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Hàm xử lý khi DateSelector áp dụng ngày
  const handleDateApply = (dateStr) => {
    setFilterDate(dateStr);
  };

  // Lọc tournaments dựa trên filterDate
  const filteredTournaments = (() => {
    if (!filterDate) return tournaments;
    const selected = new Date(filterDate);
    return tournaments.filter((tournament) => {
      if (!tournament.start_date) return false;
      const start = new Date(tournament.start_date);
      // Nếu có end_date thì dùng, không thì coi như giải chỉ diễn ra trong 1 ngày
      const end = tournament.end_date ? new Date(tournament.end_date) : start;
      return selected >= start && selected <= end;
    });
  })();

  const renderStatusBadge = (status, isSmall = false) => {
    const s = status?.toUpperCase();
    const sizeClass = isSmall
      ? "text-[10px] px-1.5 py-0.5"
      : "text-label-sm px-2 py-0.5 uppercase font-bold";
    if (s === "ONGOING")
      return (
        <span
          className={`flex items-center gap-1 bg-red-50 text-brand-primary rounded animate-pulse ${sizeClass}`}
        >
          <IoEllipse size={isSmall ? 6 : 8} /> LIVE
        </span>
      );
    if (s === "COMPLETE")
      return (
        <span className={`bg-gray-100 text-gray-500 rounded ${sizeClass}`}>
          FINISHED
        </span>
      );
    if (s === "UPCOMING")
      return (
        <span className={`bg-blue-50 text-blue-600 rounded ${sizeClass}`}>
          UPCOMING
        </span>
      );
    return null;
  };

  const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: "TBD", time: "TBD" };
    const dt = new Date(dateTimeStr.replace(" ", "T")); // Đảm bảo format ISO để JS hiểu

    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    const y = dt.getFullYear();
    const time =
      dt.getHours().toString().padStart(2, "0") +
      ":" +
      dt.getMinutes().toString().padStart(2, "0");

    return { date: `${m}/${d}/${y}`, time };
  };

  const formatMatchDateTime = (dateTimeStr) => {
    return parseDateTime(dateTimeStr);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg text-title-lg font-bold text-gray-400 font-display italic tracking-tighter uppercase">
        <HiOutlineRefresh className="animate-spin mr-2" size={24} /> LOADING...
      </div>
    );

  return (
    <div className="min-h-screen font-body pb-16">
      <main className="px-4 md:px-6">
        {/* Date Selector */}
        <DateSelector onApply={handleDateApply} />

        {/* Header */}
        <div className="bg-surface-white border-b border-gray-100 mb-4 pb-2 md:pt-0">
          <div className="px-6">
            <h1 className="text-headline-sm md:text-headline-md font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter font-display leading-none">
              <IoTrophySharp
                className="text-brand-primary shrink-0"
                size={36}
              />
              Tournament Lists
            </h1>
          </div>
        </div>

        {/* Show error when the page cannot fetch tournament api */}
        {error && (
          <div className="w-full max-w-md mx-auto my-8">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center backdrop-blur-sm">
              <div className="rounded-full bg-red-100 p-3">
                <IoAlertCircleOutline
                  className="text-brand-primary"
                  size={28}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-headline-sm font-black text-gray-800 font-display uppercase tracking-tighter">
                  Something Went Wrong
                </h3>
                <p className="text-body-md text-gray-600 max-w-xs">
                  Error fetching tournaments. Please wait refresh the page or
                  for a few minutes before loading this page again.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 inline-flex items-center gap-2 bg-surface-white border border-red-200 text-brand-primary hover:bg-red-50 text-[10px] font-bold px-5 py-2.5 rounded-lg transition-colors uppercase tracking-widest shadow-sm"
              >
                <HiOutlineRefresh size={14} />
                Refresh Page
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredTournaments.length === 0 && filterDate ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              {/* Vòng tròn icon */}
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 shadow-sm">
                <IoCalendarClearOutline
                  className="text-brand-primary"
                  size={32}
                />
              </div>

              {/* Tiêu đề thông báo */}
              <h3 className="text-headline-sm font-black text-gray-800 mb-2 font-display uppercase tracking-tighter">
                No Tournaments Found
              </h3>

              {/* Mô tả chi tiết */}
              <p className="text-body-md text-gray-500 max-w-md">
                There are no tournaments scheduled for{" "}
                <span className="font-semibold text-gray-700">
                  {new Date(filterDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                . Try selecting a different date or clear the filter.
              </p>

              {/* Nút hành động */}
              <button
                onClick={() => setFilterDate(null)}
                className="mt-6 bg-brand-primary hover:bg-brand-dark text-white text-[10px] font-bold px-6 py-2.5 rounded-lg transition-colors uppercase tracking-widest shadow-sm"
              >
                Show All Tournaments
              </button>
            </div>
          ) : (
            filteredTournaments.map((tournament) => {
              const isOpen = expandedId === tournament.id;
              return (
                <div
                  key={tournament.id}
                  className="rounded-xl bg-surface-white shadow-sm overflow-hidden flex flex-col border border-gray-100 transition-all duration-300"
                >
                  <div
                    onClick={() => handleToggle(tournament.id)}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 cursor-pointer relative transition-all duration-300 gap-4 ${
                      isOpen
                        ? "bg-gradient-to-r from-red-50/40 to-surface-white"
                        : "hover:bg-surface-card"
                    }`}
                  >
                    {isOpen && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-l-xl"></div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-panel flex items-center justify-center border border-gray-800 shadow-sm overflow-hidden shrink-0">
                        <img
                          src={tournament.logo_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-title-sm md:text-title-lg font-bold text-gray-800">
                            {tournament.name}
                          </span>
                          {renderStatusBadge(tournament.status, true)}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 flex-wrap">
                          <IoCalendarClearOutline size={12} />{" "}
                          {parseDateTime(tournament.start_date).date}
                          {tournament.end_date && (
                            <> - {parseDateTime(tournament.end_date).date}</>
                          )}
                          {" • "}
                          {tournament.format}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${
                        isOpen
                          ? "bg-gray-200 text-gray-900"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      DETAILS{" "}
                      {isOpen ? (
                        <IoChevronUp size={14} className="text-brand-primary" />
                      ) : (
                        <IoChevronDown size={14} />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="flex flex-col border-t border-gray-100 bg-surface-white animate-in slide-in-from-top-1 duration-200">
                      {loadingMatches ? (
                        <div className="p-10 flex flex-col items-center justify-center gap-2 text-gray-400">
                          <HiOutlineRefresh
                            className="animate-spin text-brand-primary"
                            size={24}
                          />
                          <span className="text-label-sm font-bold uppercase tracking-widest">
                            Loading Matches...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="hidden md:grid grid-cols-3 py-3 bg-surface-card text-label-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                            <div className="text-center">Schedule</div>
                            <div className="col-span-2 text-center">
                              Matchup
                            </div>
                          </div>

                          {matches.length > 0 ? (
                            <div className="flex flex-col">
                              {matches.map((match) => {
                                const { date, time } = formatMatchDateTime(
                                  match.start_time,
                                );
                                return (
                                  <div
                                    key={match.id}
                                    className="flex flex-col md:grid md:grid-cols-3 items-center py-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors gap-4 md:gap-0"
                                  >
                                    <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-1 md:border-r border-gray-50 w-full md:w-auto px-4">
                                      <div className="flex flex-col items-center">
                                        <span className="text-gray-400 font-bold text-label-sm tracking-tighter">
                                          {date}
                                        </span>
                                        <span className="text-brand-primary font-black text-headline-sm leading-none font-display italic">
                                          {time}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium mt-1 uppercase">
                                          {match.stadium}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="md:col-span-2 flex items-center justify-center gap-4 sm:gap-8 px-2 w-full">
                                      <TeamDisplay
                                        name={match.home_team?.name}
                                        isHome={true}
                                        logoUrl={match.home_team?.logo}
                                        teamId={match.home_team?.id}
                                      />
                                      <div className="flex flex-col items-center min-w-[60px] md:min-w-[70px]">
                                        <span className="text-gray-300 text-[10px] font-bold italic uppercase">
                                          vs
                                        </span>
                                        <span className="text-xl md:text-2xl font-black text-gray-800 font-display">
                                          {match.home_score} -{" "}
                                          {match.away_score}
                                        </span>
                                      </div>
                                      <TeamDisplay
                                        name={match.away_team?.name}
                                        isHome={false}
                                        logoUrl={match.away_team?.logo}
                                        teamId={match.away_team?.id}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-12 text-center text-gray-400 font-medium italic text-body-md">
                              No matches scheduled.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <TeamSection />
        </div>
      </main>
    </div>
  );
}
