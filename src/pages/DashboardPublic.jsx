import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoChevronDown,
  IoChevronUp,
  IoTrophySharp,
  IoCalendarClearOutline,
  IoEllipse,
  IoEllipse,
} from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";

import TeamDisplay from "../components/TeamDisplay";
import publicDashboard from "../services/publicDashboardService";


function DateSelector() {
  const scrollRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 1. Generate dates 
  const currentYear = new Date().getFullYear();
  const daysInYear = [];
  const dateCursor = new Date(currentYear, 0, 1);
  while (dateCursor.getFullYear() === currentYear) {
    daysInYear.push({
      dayName: dateCursor
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(),
      dayNumber: dateCursor.getDate().toString(),
      monthName: dateCursor
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase(),
      fullDateString: dateCursor.toDateString(),
      isToday: dateCursor.toDateString() === new Date().toDateString(),
    });
    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  // 2. Auto-scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const todayElement = scrollRef.current.querySelector(".is-today");
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: "auto", inline: "center" });
      }
    }
  }, []);

  // 3. Mouse Drag Logic (to simulate mobile swiping on desktop)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full bg-surface-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 select-none">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto py-1 cursor-grab active:cursor-grabbing transition-all ${isDragging ? "scale-[0.99]" : ""}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch", // Enables native momentum scroll on mobile
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {daysInYear.map((item) => {
          const isActive = selectedDate === item.fullDateString;

          return (
            <button
              key={item.fullDateString}
              onClick={() => setSelectedDate(item.fullDateString)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-18 h-22 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(150deg,#d31027_0%,#ff9482_100%)] text-white shadow-md scale-105 z-10 is-today"
                  : "bg-surface-card text-gray-400 hover:bg-gray-100"
              }`}
            >
              <span
                className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? "text-white/90" : "text-gray-500"}`}
              >
                {item.monthName}
              </span>
              <span className="text-xl font-black font-display leading-none mb-1">
                {item.dayNumber}
              </span>
              <span
                className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                  isActive ? "bg-white/20 text-white" : "text-gray-500/60"
                }`}
              >
                {item.dayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Season Selector */}
      <div className="flex flex-col items-start lg:items-end gap-1 w-full lg:w-auto">
        <label className="text-[9px] font-black text-brand-primary uppercase tracking-widest lg:mr-2">
          Select Season
        </label>
        <div className="relative w-full sm:w-48">
          <select className="appearance-none w-full bg-surface-bg border-none text-gray-700 py-2 px-4 rounded-lg font-bold text-[11px] focus:outline-none">
            <option>
              Season {currentYear}/{currentYear + 1}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const navigate = useNavigate();
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

  const formatMatchDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: "TBD", time: "TBD" };
    const [datePart, timePart] = dateTimeStr.split(" ");
    const [y, m, d] = datePart.split("-");
    return { date: `${d}/${m}/${y}`, time: timePart?.substring(0, 5) };
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg text-title-lg font-bold text-gray-400 font-display italic tracking-tighter uppercase">
        <HiOutlineRefresh className="animate-spin mr-2" size={24} /> LOADING...
      </div>
    );

  return (
    <div className="min-h-screen bg-surface-bg font-body pb-16">
      {/* Scrollbar Removal Hack (since index.css is untouched) */}
      <style>{`body::-webkit-scrollbar { display: none; }`}</style>

      {/* Header */}
      <div className="bg-surface-white border-b border-gray-100 mb-6 pt-10 pb-7">
        <div className="max-w-[1000px] mx-auto px-6">
          <h1 className="text-headline-sm md:text-headline-md font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter font-display leading-none">
            <IoTrophySharp className="text-brand-primary shrink-0" size={36} />
            Tournament Lists
          </h1>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-4 md:px-6">
        <DateSelector />

        <div className="space-y-4">
          {tournaments.map((tournament) => {
            const isOpen = expandedId === tournament.id;
            return (
              <div
                key={tournament.id}
                className="rounded-xl bg-surface-white shadow-sm overflow-hidden flex flex-col border border-gray-100 transition-all duration-300"
              >
                <div
                  onClick={() => handleToggle(tournament.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 cursor-pointer relative transition-all duration-300 gap-4 ${isOpen ? "bg-gradient-to-r from-red-50/40 to-surface-white" : "hover:bg-surface-card"}`}
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
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <IoCalendarClearOutline size={12} />{" "}
                        {tournament.start_date} • {tournament.format}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all ${isOpen ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600"}`}
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
                        {/* Headers exactly like the picture */}
                        <div className="hidden md:grid grid-cols-3 py-3 bg-surface-card text-label-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                          <div className="text-center">Schedule / Status</div>
                          <div className="col-span-2 text-center">Matchup</div>
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(
                                          `/teams/${match.home_team_id}`,
                                        );
                                      }}
                                    />
                                    <div className="flex flex-col items-center min-w-[60px] md:min-w-[70px]">
                                      <span className="text-gray-300 text-[10px] font-bold italic uppercase">
                                        vs
                                      </span>
                                      <span className="text-xl md:text-2xl font-black text-gray-800 font-display">
                                        {match.home_score} - {match.away_score}
                                      </span>
                                    </div>
                                    <TeamDisplay
                                      name={match.away_team?.name}
                                      isHome={false}
                                      logoUrl={match.away_team?.logo}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(
                                          `/teams/${match.away_team_id}`,
                                        );
                                      }}
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
          })}
        </div>
      </main>
    </div>
  );
}

