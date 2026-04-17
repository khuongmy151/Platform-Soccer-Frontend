import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import matchService from '../services/matchService';
import { setMatches } from '../stores/features/matchSlice';
const Badge = ({ children, color, dot }) => {
  const colorMap = {
    gray: 'bg-gray-200 text-gray-500',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-400 text-white',
    red: 'bg-red-400 text-white',
  };
  return (
    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max ${colorMap[color]}`}>
      {dot && <div className={`w-1.5 h-1.5 rounded-full bg-${dot}-500 animate-pulse`} />}
      {children}
    </div>
  );
};

const MatchCard = ({ status, rawStatus, timeTopInfo, teamA, teamB, bottomArea, extraClasses = "" }) => {
  return (
    <div className={`bg-[var(--color-surface-white)] rounded-[2rem] p-6 lg:p-8 flex flex-col gap-4 font-[var(--font-body)] ${extraClasses}`} style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.03)' }}>
      {/* HEADER */}
      <div className="flex justify-between items-start">
        {status}
        <div className="text-right">
          {timeTopInfo}
        </div>
      </div>

      {/* TEAMS */}
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2">
          <div className="w-[70px] h-[70px] rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border-2 border-gray-100">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 className="font-black text-gray-800 text-sm tracking-wide text-center font-[var(--font-display)] mt-2">{teamA.name}</h3>
        </div>

        <div className="flex flex-col items-center">
          {rawStatus === 'FINISHED' || rawStatus === 'LIVE NOW' || teamA.score !== undefined ? (
            <div className="flex flex-col items-center">
              <span className="font-black text-4xl text-gray-900 tracking-widest font-[var(--font-display)]">{teamA.score ?? 0} <span className="text-gray-400 mx-1">-</span> {teamB.score ?? 0}</span>
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-2 ${rawStatus === 'FINISHED' ? 'text-green-600' : 'text-orange-500'}`}>{rawStatus === 'FINISHED' ? 'COMPLETED' : rawStatus === 'LIVE NOW' ? 'LIVE' : (teamA.statusLabel || "SCORE")}</span>
            </div>
          ) : (
            <span className="font-black text-3xl text-gray-200 font-[var(--font-display)]">VS</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-[70px] h-[70px] rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border-2 border-gray-100">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 className="font-black text-gray-800 text-sm tracking-wide text-center font-[var(--font-display)] mt-2">{teamB.name}</h3>
        </div>
      </div>

      {/* FOOTER AREA */}
      <div className="mt-4">
        {bottomArea}
      </div>
    </div>
  );
};

export default function MatchManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.matches?.items || []);

  const [mockMatches, setMockMatches] = useState([
    { id: 'mock1', status: 'SCHEDULED', date: 'OCT 24, 2024', time: '19:30 GMT', homeTeam: { name: 'TEAM ALPHA' }, awayTeam: { name: 'TEAM BRAVO' }, arena: 'WEMBLEY STADIUM, LONDON' },
    { id: 'mock2', status: 'LIVE NOW', date: '72\' MINS', time: 'Match Live', homeTeam: { name: 'TEAM CRIMSON', score: 3 }, awayTeam: { name: 'TEAM DELTA', score: 2 }, arena: 'SANTIAGO BERNABÉU' },
    { id: 'mock3', status: 'FINISHED', date: 'OCT 22, 2024', time: 'FT Score', homeTeam: { name: 'TEAM ECHO', score: 2, statusLabel: 'COMPLETED' }, awayTeam: { name: 'TEAM FOXTROT', score: 1 }, arena: 'OLD TRAFFORD, MANCHESTER' },
    { id: 'mock4', status: 'CANCELLED', date: 'OCT 26, 2024', time: 'N/A', homeTeam: { name: 'TEAM GOLF' }, awayTeam: { name: 'TEAM HOTEL' }, arena: 'CANCELLED', reason: 'Unfavorable weather conditions and pitch flooding. Re-scheduling pending.' }
  ]);

  // Gọi API [GET /matches] thông qua Service Architecture
  useEffect(() => {
    matchService.getAllMatches({
      url: '/matches',
      dispatch,
      func: setMatches
    });
  }, [dispatch]);

  const handleStartMatch = async (matchId) => {
    if (String(matchId).startsWith('mock')) {
      setMockMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'LIVE NOW' } : m));
      return;
    }
    try {
      await matchService.updateMatchStatus({
        url: `/matches/${matchId}/status`,
        data: { status: 'LIVE NOW' }
      });
      matchService.getAllMatches({ url: '/matches', dispatch, func: setMatches });
    } catch (err) {
      console.error(err);
    }
  }

  const handleCancelMatch = async (matchId) => {
    if (String(matchId).startsWith('mock')) {
      setMockMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'CANCELLED', reason: 'Hủy lịch thi đấu do sự cố bất khả kháng.' } : m));
      return;
    }
    try {
      await matchService.updateMatchStatus({
        url: `/matches/${matchId}/status`,
        data: { 
          status: 'CANCELLED',
          reason: 'Hủy lịch thi đấu do sự cố bất khả kháng.' 
        }
      });
      matchService.getAllMatches({ url: '/matches', dispatch, func: setMatches });
    } catch (err) {
      console.error(err);
    }
  }

  const displayMatches = matches.length > 0 ? [...matches].reverse() : mockMatches;

  return (
    <div className="flex flex-col h-full font-[var(--font-body)]">
      <div className="flex justify-between items-center mb-8 shrink-0">
         <h1 className="text-4xl md:text-5xl font-black text-[#2e2e2e] tracking-tight font-[var(--font-display)]">Match List</h1>
         <button onClick={() => navigate(`/match/create?tournamentId=${tournamentId || ''}`)} className="bg-[var(--color-brand-primary)] text-white px-6 py-3 rounded-xl text-xs font-black tracking-widest hover:opacity-90 transition-opacity shadow-md">
           + NEW MATCH
         </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
        
        {displayMatches.map((m) => {
          // Bóc tách ngày tháng từ chuỗi ISO startTime (nếu có, không thì dùng Mockup Data cũ m.date)
          let dateStr = m.date || "OCT 24";
          let timeStr = m.time || "19:30";
          
          if (m.startTime) {
            const startDate = new Date(m.startTime);
            if (!isNaN(startDate)) {
              dateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
              timeStr = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            }
          }

          // Lấy score
          const homeScore = m.score ? m.score.home : m.homeTeam?.score;
          const awayScore = m.score ? m.score.away : m.awayTeam?.score;

          return (
            <MatchCard
              key={m.id}
              rawStatus={m.status}
              status={<Badge color={m.status === 'LIVE NOW' ? 'orange' : m.status === 'FINISHED' ? 'green' : m.status === 'CANCELLED' ? 'red' : 'gray'} dot={m.status === 'LIVE NOW' ? 'red' : null}>{m.status}</Badge>}
              timeTopInfo={
                <>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{dateStr}</p>
                  <p className="text-lg font-black text-gray-800">{timeStr}</p>
                </>
              }
              teamA={{ ...m.homeTeam, name: m.homeTeam?.name || "TEAM A", score: homeScore }}
              teamB={{ ...m.awayTeam, name: m.awayTeam?.name || "TEAM B", score: awayScore }}
              bottomArea={
                <>
                   <div className="flex items-center gap-2 text-gray-400 text-xs mt-2 font-semibold mb-5 uppercase tracking-wide">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {m.venue?.name || m.arena || "STADIUM"}
                   </div>
                 {m.status === 'CANCELLED' && m.reason && (
                    <div className="mt-5 bg-orange-50/70 rounded-xl p-5 border border-orange-100">
                      <p className="text-[10px] font-black tracking-widest text-[var(--color-brand-primary)] uppercase mb-2">Reason for cancellation</p>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{m.reason}</p>
                    </div>
                 )}
                 {(!m.status || m.status === 'SCHEDULED') && (
                   <div className="flex gap-4 mt-2">
                     <button onClick={() => handleStartMatch(m.id)} className="flex-[2] py-3.5 rounded-xl text-white font-black text-xs tracking-widest uppercase bg-[linear-gradient(135deg,#ff4444,#ff8c00)] shadow-xl shadow-orange-500/30">START MATCH</button>
                     <button onClick={() => handleCancelMatch(m.id)} className="flex-1 py-3.5 rounded-xl border-[2.5px] border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] font-black text-xs tracking-widest uppercase hover:bg-red-50 transition-colors">CANCEL</button>
                   </div>
                 )}
                 {m.status === 'LIVE NOW' && (
                   <div className="mt-2">
                     <button onClick={() => navigate(`/match/${m.id}`)} className="w-full py-3.5 rounded-xl text-white font-black text-xs tracking-widest uppercase bg-[#2e2e2e] hover:bg-[#1a1a1a] transition-colors shadow-lg">VIEW MATCH DETAILS</button>
                   </div>
                 )}
                 {m.status === 'FINISHED' && (
                   <div className="flex gap-4 mt-2">
                     <button className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-black text-xs tracking-widest uppercase hover:bg-gray-200 transition-colors cursor-not-allowed opacity-70">MATCH STATS</button>
                     <button className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-black text-xs tracking-widest uppercase hover:bg-gray-200 transition-colors cursor-not-allowed opacity-70">HIGHLIGHTS</button>
                   </div>
                 )}
                </>
              }
            />
          );
        })}

      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-white flex items-center gap-2 px-8 py-3.5 rounded-full text-[var(--color-brand-dark)] font-black text-xs tracking-widest shadow-sm border border-gray-200 hover:shadow-md hover:bg-gray-50 transition-all active:scale-95">
          LOAD MORE MATCHES
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

    </div>
  );
}
